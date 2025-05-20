import axios from "axios";
import { ElMessage } from 'element-plus';

axios.defaults.baseURL = "durilxfh.backend.2t27ng4k.lnti7x5h.com";

const request = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
})

request.interceptors.response.use(response => {
    if (response.data.statusCode === 200){
        console.log(response)
        let msg = response.data.message
        if (msg === "登录成功" || msg === "上传成功" || msg === "审批成功" || msg === "更新成功"){
            ElMessage.success(response.data.message)
        }
        return response;
    }
    // } else {
    //     ElMessage.error(response.data.message)
    //     console.log(response)
    //     return Promise.reject(response)
    // }
},error => {
    console.log(error)
    return Promise.reject(error)
})

export default request;