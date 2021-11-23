const Mock = require('mockjs')

const Random = Mock.Random

let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}
Mock.mock('/captcha', 'get', () => {
    Result.data = {
        token: Random.string(32),
        captchaImg: Random.dataImage('120x40', 'p7n5w')
    }

    return Result
})

Mock.mock('/login', 'post', () => {
    // Result.code = 400
    // Result.msg = "验证码错误"
    return Result
})

Mock.mock('/sys/userInfo', 'get', () => {
    Result.data = {
        id: '1',
        username: 'text',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
    return Result
})

Mock.mock('/logout', 'post', () => {

    return Result
})

Mock.mock('/sys/menu/nav', 'get', () => {

    let nav = [{
            name: 'SysMange',
            title: '系统管理',
            icon: 'el-icon-s-operation',
            component: '',
            path: '',
            children: [{
                    name: 'SysUser',
                    title: '用户管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/users',
                    component: 'sys/User',
                    children: []
                },
                {
                    name: 'SysRole',
                    title: '角色管理',
                    icon: 'el-icon-rank',
                    path: '/sys/role',
                    component: 'sys/Role',
                    children: []
                },
                {
                    name: 'SysMenu',
                    title: '菜单管理',
                    icon: 'el-icon-menu',
                    path: '/sys/menus',
                    component: 'sys/Menu',
                    children: []
                }
            ]
        },
        {
            name: 'SysTools',
            title: '系统工具',
            icon: 'el-icon-s-tools',
            path: '',
            component: '',
            children: [{
                name: 'SysDict',
                title: '数字字典',
                icon: 'el-icon-s-order',
                path: '/svs/dicts',
                component: '',
                children: []
            }]
        },
    ]
    let authoritys = []
    Result.data = {
        nav: nav,
        authoritys: authoritys
    }

    return Result
})

Mock.mock(RegExp('/sys/menu/info/*'), 'get', () => {

    Result.data = {
        parentId: 1,
        name: '王小虎555',
        perms: '2016-05-01',
        icon: '图标',
        path: '上海市普陀区金沙江路 1519 弄',
        component: '小包子',
        orderNun: 1111,
        status: 1,
        type: 1
    }

    return Result
})

Mock.mock('/sys/menu/list', 'get', () => {

    let menus = [{
            id: 1,
            name: '系统管理',
            perms: '2016-05-01',
            icon: '图标',
            path: '上海市普陀区金沙江路 1519 弄',
            component: '小包子',
            status: 1,
            orderNun: 11111,
            type: 1
        },
        {
            id: 3,
            name: '用户管理',
            perms: '2016-05-01',
            icon: '图标',
            path: '上海市普陀区金沙江路 1519 弄',
            component: '小包子',
            status: 1,
            orderNun: 11111,
            type: 1,
            children: [{
                    id: 31,
                    name: '添加用户',
                    perms: '2016-05-01',
                    icon: '图标',
                    path: '上海市普陀区金沙江路 1519 弄',
                    component: '小包子',
                    status: 1,
                    orderNun: 11111,
                    type: 1
                },
                {
                    id: 32,
                    name: '修改用户',
                    perms: '2016-05-01',
                    icon: '图标',
                    path: '上海市普陀区金沙江路 1519 弄',
                    component: '小包子',
                    status: 1,
                    orderNun: 11111,
                    type: 1
                }
            ]
        },
        {
            id: 4,
            name: '角色管理',
            perms: '2016-05-01',
            icon: '图标',
            path: '上海市普陀区金沙江路 1519 弄',
            component: '小包子',
            status: 1,
            orderNun: 11111,
            type: 1
        }
    ]
    Result.data = menus
    return Result
})

Mock.mock(RegExp('/sys/menu/*'), 'post', () => {

    return Result
})

Mock.mock(RegExp('/sys/role/list*'), 'get', () => {

    Result.data = {
        records: [{
                id: 3,
                created: "2021-01-16T13:29:03",
                updated: "2021-01-16T13:29:03",
                status: 1,
                name: "普通用户",
                code: "ormal",
                remark: "只有基本查看功能",
                menuIds: []
            },
            {
                id: 6,
                created: "2021-01-16T13:29:03",
                updated: "2021-01-16T13:29:03",
                status: 1,
                name: "超级管理员",
                code: "admin",
                remark: "系统默认最高权限，不可编辑和任意修改",
                menuIds: []
            }
        ],
        total: 2,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1
    }
    return Result
})

Mock.mock(RegExp('/sys/role/info/*'), 'get', () => {
    Result.data = {
        id: 6,
        name: '普通用户',
        code: 'nonmal',
        remark: '只有基本查看功能',
        status: 1,
        menuIds: [3]
    }

    return Result
})


Mock.mock(RegExp('/sys/role/*'), 'post', () => {

    return Result
})



// user list
Mock.mock(RegExp('/sys/user/list*'), 'get', () => {
    Result.data = {
        records: [{
                id: 1,
                avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                userName: "小包子",
                roles: [{
                        roleName: "超级管理员"
                    },
                    {
                        roleName: "无敌超级管理员"
                    }
                ],
                email: "1624831819@qq.com",
                phone: "13029476691",
                status: 1,
                creationTime: "2021-11-23T16:43",
            },
            {
                id: 2,
                avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                userName: "小包子",
                roles: [{
                        roleName: "超级管理员"
                    },
                    {
                        roleName: "无敌超级管理员"
                    }
                ],
                email: "1624831819@qq.com",
                phone: "13029476691",
                status: 1,
                creationTime: "2021-11-23T16:43",
            }
        ],
        total: 2,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1
    }
    return Result
})

Mock.mock(RegExp('/sys/user/'), 'post', () => {

    return Result
})

Mock.mock(RegExp('/sys/user/info/*'), 'get', () => {
    Result.data = {
        id: 1,
        avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        userName: "小包子",
        roles: [{
                roleName: "超级管理员"
            },
            {
                roleName: "无敌超级管理员"
            }
        ],
        roleIds: [3, 6],
        email: "1624831819@qq.com",
        phone: "13029476691",
        status: 1,
        creationTime: "2021-11-23T16:43",
    }
    return Result
})