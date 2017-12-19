/**
 * 项目配置信息
 * @type {{}}
 */

const isDev = () => {
    return window.location.host.indexOf("guoanfamily.com") === -1;
};

let def = {
    IMAGE_PATH: "https://img.guoanfamily.com/",
    WECHAT: "//www.guoanfamily.com/openweixin/",
};

let dev = {
    INTERFACE: "http://172.16.43.24:8021/newyear/",
};

let prod = {
    INTERFACE: "https://www.guoanfamily.com/newyear/",
};

let config = isDev() ? dev : prod;
config = Object.assign(def, config);
export { config }
