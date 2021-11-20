<template>
  <div>
      <h2>你好！{{userInfo.username}}</h2>
      <el-row>
          <el-col :span="10" :offset="7">
                <el-form :model="passForm" :rules="rules" ref="passForm" label-width="100px" class="demo-ruleFrom">
                    <el-form-item label="旧密码" prop="currentPass">
                        <el-input type="password" v-model="passForm.currentPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="passForm.currentPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass" >
                    <el-input type="password" v-model="passForm.currentPass" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
                        <el-button @click="resetForm('passForm')">重置</el-button>
                    </el-form-item>
                </el-form>     
          </el-col>
      </el-row>
  </div>

    
</template>

<script>
export default {
    name:'UserCenter',
    data() {
        var validataPass=(rule,value,callback)=>{
            if(value===''){
                callback(new Error('请再次输入密码'))
            }else if(value!==this.passForm.password){
                callback(new Error('两次密码输入不一致'))
            }else{
                callback()
            }
        }
        return {
            userInfo:{

            },
            passForm:{
                password:'',
                checkPass:'',
                currentPass:''  
            },
            rules:{
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度为6到12个字符', trigger: 'blur' }
                ],
                 checkPass: [
                    { required: true, validator:validataPass, trigger: 'blur' },
                ],
                 currentPass: [
                    { required: true, message: '请输入当前密码', trigger: 'blur' },
                ],
            }
        }
    },
    created(){
     this.getUserInfor()
   },
    methods:{
        getUserInfor(){
       this.$axios.get("/sys/userInfo").then(res=>{
         this.userInfo=res.data.data
       })
     },
     submitFom(formName){
         this.$refs[formName].validata((valid)=>{
             if(valid){
                 const _this=this
                 this.$axios.post('/sys/user/updataPass',this.passForm).then(res=>{
                     _this.$alert(res.data.msg,'提示',{
                         comfirmButtonText:'确定',
                         callback:action=>{
                             this.$refs[formName].resetFields();
                         }
                     })
                 })
             }else{
                 console.log('error submit!!');
                 return false
             }
         })
     },
     resetForm(formName){
         this.$refs[formName].resetFields()
     }
    },
    
}
</script>

<style scoped>
    .el-input__inner{
        width:80% ;  
        
    }
</style>