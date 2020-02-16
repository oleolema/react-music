import axios from "axios";
import {RESP_CODE} from "./config";
import encode from "../common/js/encode";

console.info(encode({a: 1}));

// const tempHost = `http://${window.location.hostname}`;

const tempHost = `http://www.oleolema.cn`

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


const postNeteaseMusic = (url, data) => {
    console.info(data);
    return ajax.post('/neteasemusic/global', {
        url: `https://music.163.com/${url}`,
        encode: encode(data),
    });
};


export const postMusic = id => {
    return postNeteaseMusic("weapi/song/enhance/player/url/v1", {
        ids: `[${id}]`,
        encodeType: "aac",
        level: "standard",
    });
};

export const postLyric = id => {
    return postNeteaseMusic("weapi/song/lyric", {
        id: `${id}`,
        lv: -1,
        tv: -1,
    });
};

export const postHotArtist = id => {
    return postNeteaseMusic("weapi/artist/top", {
        offset: 0,
        total: true,
        limit: 60,
    });
};

export const postHotSearch = () => {
    return postNeteaseMusic("weapi/search/hot", {
        type: '1111',
    });
};

export const postSearchSuggest = (word) => {
    return postNeteaseMusic("weapi/search/suggest/web", {
        s: word,
        limit: 8
    });
};

export const postSearch = (word, offset = 0,limit = 30) => {
    return postNeteaseMusic("weapi/cloudsearch/get/web", {
        hlpretag: `<span class="s-fc7">`,
        hlposttag: `</span>`,
        s: word,
        type: 1,
        offset: offset,
        total: true,
        limit: limit,
    });
};

export const getDiscoverImage = () => {
    return ajax.post("/neteasemusic/discover/image");
};

export const getDiscoverPlaylist = () => {
    return ajax.post("/neteasemusic/discover/playlist");
};

export const getArtistDetail = (id) => {
    return ajax.post("/neteasemusic/artistDetail", {
        id: id,
    });
};

export const getPlayList = (id) => {
    return ajax.post("/neteasemusic/playList", {
        id: id,
    });
};

export const getTopList = () => {
    return ajax.post("/neteasemusic/topList");
};