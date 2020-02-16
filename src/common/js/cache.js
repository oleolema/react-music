import storage from "good-storage";

const SEARCH_KEY = '__SEARCH__';
const SEARCH_MAX_LENGTH = 15;

//把val插入到arr首位，并删除掉compare匹配的元素，若数组长度超过maxLen，则删除最后一个元素
function insertArray(arr, val, compare, maxLen) {
    //删除compare匹配的元素
    const fIndex = arr.findIndex(compare);
    fIndex !== -1 && arr.splice(fIndex, 1);
    //插入val
    arr.splice(0, 0, val);
    //若超过长度则删除掉最后一个元素
    if (arr.length > maxLen) {
        arr.splice(-1, 1);
    }
}

//把compare匹配的元素从arr中删除
function deleteArray(arr, compare) {
    const fIndex = arr.findIndex(compare);
    if (fIndex > -1) {
        arr.splice(fIndex, 1);
    }
}

export const saveSearch = query => {
    const arr = storage.get(SEARCH_KEY, []);
    insertArray(arr, query, item => item === query, SEARCH_MAX_LENGTH);
    storage.set(SEARCH_KEY, arr);
    return arr;
};

export const getSearch = () => {
    return storage.get(SEARCH_KEY, []);
};

export const deleteSearch = query => {
    const arr = storage.get(SEARCH_KEY, []);
    deleteArray(arr, item => item === query);
    storage.set(SEARCH_KEY, arr);
    return arr;
};

export const clearSearch = () => {
    storage.remove(SEARCH_KEY);
    return [];
};
