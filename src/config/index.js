/**
 * 项目配置信息
 * @type {{}}
 */

const isDev = () => {
    return window.location.host.indexOf("guoanfamily.com") === -1;
};

let def = {
    IMAGE_PATH: "https://img.guoanfamily.com/",
};

let dev = {
    INTERFACE: "http://172.16.4.12:8084/agenthouseCutomer/",
};

let prod = {
    INTERFACE: "https://www.guoanfamily.com/agenthouseCutomer/",
};

let config = isDev() ? dev : prod;
config = Object.assign(def, config);
export { config }
