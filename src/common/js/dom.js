export const addClass = (el, className) => {
    if (hasClass(el, className)) {
        return;
    }
    el.className += ` ${className}`;
};

export const hasClass = (el, className) => {
    let reg = new RegExp(`(^|\\s)${className}($|\\s)`);
    return reg.test(el.className);
};

export const removeClass = (el, className) => {
    el.className = el.className.replace(new RegExp(`(^|\\s)${className}($|\\s)`, 'g'), '');
};


export const scrollTo = (el, end) => {
    let elTop = el.offsetTop;
};

export const addEventListenerWithoutDefault = (el, type, listener, options) => {
    return el.addEventListener(type, listener, {
        ...options,
        passive: false,
    });
};


export const setImageSize = (picUrl, param) => {
    if (typeof param === 'undefined') {
        return picUrl.replace(/param=\d+y\d+/, '');
    }
    return picUrl.replace(/param=\d+y\d+/, `param=${param}`);
};