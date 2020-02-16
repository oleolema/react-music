import axios from 'axios';
import {RESP_CODE} from "./config";


// const ajax = axios.create({
//     baseURL: 'http://localhost:8080',
// });

const tempHost = `http://${window.location.hostname}:8080`;
console.info(tempHost);
const ajax = axios.create({
    // baseURL: 'http://192.168.43.82:8080',
    baseURL: tempHost,
});


ajax.interceptors.response.use((resp) => {

    if (resp.data.code === RESP_CODE.SUCCESS) {
        return resp.data;
    } else if (resp.data.code === RESP_CODE.ERROR) {
        console.error(`请求失败：`, resp);
        return Promise.reject(resp.data);
    } else {
        throw new Error('未匹配的状态码');
    }


});

export const getRecommend = () => {
    return ajax.get('/qqmusic/recommend');
};

export const getSingers = () => {
    return ajax.get('/qqmusic/singers');
};

