<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="searchForm.userName" placeholder="用户名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getUserList">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item>
                 <el-popconfirm
                    title="确定要批量删除吗？" @confirm="delHandle(null)"
                >
                    <el-button type="danger" slot="reference" :disabled="searchForm.delBtStatus">批量删除</el-button>
                </el-popconfirm>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            border
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            
            <el-table-column
                prop="avatar"
                label="头像"
                width="60">
                <template slot-scope="scope">
                    <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
                </template>
                
            </el-table-column>
            <el-table-column
                prop="userName"
                label="用户名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="roleName"
                label="角色名称"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag size="medium" type="info" v-for="item in scope.row.roles">{{item.roleName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.status === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="creationTime"
                label="创建时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop=""
            label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="roleHandle(scope.row.id)">分配角色</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" @click="repassHandle(scope.row.id, scope.row.userName)">重置密码</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <template>
                        <el-popconfirm
                        title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)"
                        >
                            <el-button type="text" slot="reference" >删除</el-button>
                            </el-popconfirm>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :current-page="current"
            :page-size="size"
            :total="total">
        </el-pagination>

        <!-- 新增对话框 -->
        <el-dialog
            title="新增用户"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose">
            <el-form :model="editFrom" :rules="editFromRules" ref="editFrom" label-width="100px" class="demo-editFrom">
                <el-form-item label="用户名" prop="userName" label-width="100px">
                    <el-input v-model="editFrom.userName" autocomplete="off"></el-input>
                    <el-alert
                        title="初始密码为888888"
                        :closable=false
                        type="info"
                        style="height: 25px; width: 200px"
                    ></el-alert>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" label-width="100px">
                    <el-input v-model="editFrom.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" label-width="100px">
                    <el-input v-model="editFrom.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status" label-width="100px">
                    <el-radio-group v-model="editFrom.status">
                    <el-radio :label=0>禁用</el-radio>
                    <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('editFrom')">立即创建</el-button>
                    <el-button @click="resetForm('editFrom')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

         <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="roleDialogVisible"
            width="600px">
            <el-form :model="roleForm">
                <el-tree
                    :data="roleTreeData"
                    show-checkbox
                    ref="roleTree"
                    :default-expand-all=true
                    node-key="id"
                    :check-strictly=true
                    :props="defaultProps"
                   
                >
                </el-tree>
            </el-form>
             <span slot="footer" class="dialog-footer">
                    <el-button @click="roleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitRoleFormHandle('roleForm')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            return {
                total: 0,
                size: 10,
                current: 1,
                dialogVisible: false,
                editFrom: {
                    userName: '',
                    email: '',
                    phone: '',
                    status: 1
                },
                searchForm: {
                    delBtStatus: true,
                    
                },
                editFromRules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入唯一编码', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                tableData: [],
                multipleSelection: [],

                roleDialogVisible: false,
                roleForm: {

                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleTreeData: []
            }
        },
        created() {
            this.getUserList()
            this.$axios.get("/sys/role/list").then(res => {
                this.roleTreeData =res.data.data.records
            })
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/user/' + (this.editFrom.id ? 'update' : 'save'), this.editFrom).
                        then (res => {
                            this.$message({
                                showClose: true,
                                message: '恭喜你，操作成功！',
                                type: 'success',
                                onclose:() => {
                                    this.getRoleList()
                                }
                            });
                            this.resetForm('editFrom')
                        }); 
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editHandle(id) {
                this.$axios.get('/sys/user/info/' + id).then(res => {
                    this.editFrom = res.data.data
                    this.dialogVisible = true
                })
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.searchForm.delBtStatus = val === 0
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getRoleList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getRoleList()
            },
            // 清空表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editFrom = {}
                this.dialogVisible = false
            },
            handleClose() {
                this.resetForm('editFrom')
            },
            // 删除
            delHandle(id) {

                var ids = []
                if (id) {
                    ids.push(id) 
                } else {
                    this.multipleSelection.forEach(row => {
                        ids.push(row.id)
                    })
                }
                console.log(ids);
                this.$axios.post("/sys/user/delete/" + ids).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功！',
                        type: 'success',
                        onclose:() => {
                            this.getMenuTree()
                        }
                    });
                })
            },
            getUserList() {
                 this.$axios.get("/sys/user/list", {
                     params: {
                         userName: this.searchForm.userName,
                         current: this.current,
                         size: this.size
                     }
                 }).then(res => {
                    this.tableData = res.data.data.records
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                })   
            },

            roleHandle(id) {
                console.log(id);
                this.roleDialogVisible = true
                this.$axios.get("/sys/user/info/" + id).then(res => {
                    this.$refs.roleTree.setCheckedKeys(res.data.data.roleIds);
                    this.roleForm = res.data.data
                })
            },
            submitRoleFormHandle(formName) {
                var userIds = this.$refs.roleTree.getCheckedKeys()
                console.log(userIds);
                this.$axios.post('/sys/user/role', this.roleForm.id, userIds).then(res => {
                     this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功！',
                        type: 'success',
                        onclose:() => {
                            this.getRoleTree()
                        }
                    });
                    this.roleDialogVisible = false
                })
                
            },
            repassHandle(id, userName) {
                this.$confirm('将重置用户【' + userName + '】的密码，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/sys/user/repass', id).then(res=>{
                        this.$message({
                            showClose: true,
                            message: '恭喜你，操作成功',
                            type: 'success',
                            onClose: () => {

                            }
                        })
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .el-pagination {
        float: right;
        margin-top: 20px;
    }
   
</style>