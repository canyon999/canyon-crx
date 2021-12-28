function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

const getPageCov = function () {
    return new Promise((resolve, reject) => {
        sendMessageToContentScript({type: 'getCov', payload: {}}, function (response) {
            resolve(response)
        });
    })
}

getPageCov().then(res=>{
    console.log(res)
    document.getElementById('dsn').innerText = res.canyon.dsn
    document.getElementById('repoId').innerText = res.canyon.repoId
    document.getElementById('commitSha').innerText = res.canyon.commitSha
    document.getElementById('coverage').innerText = (Object.keys(res.coverage).length + '个文件')

    document.getElementById('btn').onclick = function () {
        document.getElementById('result').innerText = '上报中'
        const {dsn,commitSha,reporter,repoId,codeHouseId,instrumentCwd} = res.canyon
        const coverage = res.coverage
        fetch(dsn,{
            method:'POST',
            headers:{
                'content-type': 'application/json',
                Authorization: reporter
            },
            body:JSON.stringify({
                "repoId": repoId,
                "commitSha": commitSha,
                instrumentCwd,
                codeHouseId,
                // "commitSha": commitSha,
                "coverage": coverage
            })
        }).then(res=>{
            return res.json()
        }).then(res=>{
            document.getElementById('result').innerText = JSON.stringify(res)
        }).catch(err=>{
            document.getElementById('result').innerText = JSON.stringify(err)
        })
    }
})


