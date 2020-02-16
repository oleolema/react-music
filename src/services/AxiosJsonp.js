import jsonp from 'jsonp';

export default (url, data) => new Promise((resolve, reject) => {
    url += (url.includes('?') ? '&' : '?') + parseParam(data);
    jsonp(url, {
        param: 'callback',
    }, (err, resp) => {
        if (!err) {
            resolve(resp);
        } else {
            reject(err);
        }
    });
});

function parseParam(data) {
    let url = '';
    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            let value = data[i] !== undefined ? data[i] : '';
            url += `&${i}=${value}`;
        }
    }
    return url ? url.substring(1) : '';
}