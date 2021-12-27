const executeJS = function (code, shouldRemove) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.className = 'content_scripts';
    script.appendChild(document.createTextNode(code));
    const parent = document.head || document.documentElement;
    parent.appendChild(script);

    if (shouldRemove) {
        parent.removeChild(script);
    }
};

// 注入的page的js脚本
interceptAJAXRequests = function (namespace) {
    console.log('注入的page的js脚本')
};

// 启动
// 找到标志位，把从bg拿到的rules替换掉
const setup = function () {
    executeJS(
        `(${interceptAJAXRequests.toString().replace("'complex_flag_bits'",JSON.stringify(sendMessageresponse))})('sendMessageresponse')`
    );
};
setup()
