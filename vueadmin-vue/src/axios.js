import axios from "axios";
import router from "./router";
import Element from "element-ui";


// axios.defaults.baseURL = "http://localhost:8081"

const request = axios.create({
        timeout: 5000,
        headers: {
            'Content-Type': "application/json; charset=utf-8"
        }
    })
    /**
     * 拦截所有前台发出的请求
     * 比如登录、获取验证码发出的请求等等。
     * 也就是说当你发送请求的时候首先会被这个方法拦截，
     */
request.interceptors.request.use(config => {
    console.log("拦截请求的方法");
    config.headers['Authorization'] = localStorage.getItem('token')
    console.log(localStorage.getItem('token'));
    return config
})

request.interceptors.response.use(response => {
        let res = response.data
        if (res.code === 200) {
            return response
        } else {
            Element.Message.error(!res.msg ? '系统异常' : res.msg)
            return Promise.reject(response.data.msg)
        }
    },
    error => {
        console.log(error);
        if (error.response.data) {
            error.message = error.response.data.msg
        }

        if (error.response.status === 401) {
            router.push('/login')
        }

        Element.Message.error(error.message, { duration: 3000 })

        return Promise.reject(error)


    })

export default request