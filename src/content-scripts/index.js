const executeJS = function () {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.className = 'content_scripts';
    script.src = chrome.runtime.getURL('interceptor.js');
    const parent = document.head || document.documentElement;
    parent.appendChild(script);
};
executeJS();






// 获取覆盖率方法
function getCov() {
    // console.log(`cs发送getCov`)
    window.postMessage({
        type: 'getCov',
        payload: {}
    }, "*");
}

// 覆盖率罐子
let covBox = null
// 监听giveCov，获取到覆盖率做处理
window.addEventListener('message', (e) => {
    const data = e.data;
    if (data.type === 'giveCov') {
        // console.log(data.payload)
        covBox = data.payload
    }
});

// 异步获取covBox
async function doSomethingWith(request) {
    const getKey = function () {
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve(covBox)
            },0)
        })
    }
    const key = await getKey();
    return key;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.type === 'getCov'){
        getCov()
        doSomethingWith(request).then(sendResponse);
        return true;
    } else {
        sendResponse()
    }
});