const axios = require('axios')
import * as bootstrap from 'bootstrap'
console.log(axios,bootstrap)

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


if (localStorage.getItem('formData')) {


} else {
    localStorage.setItem('formData', JSON.stringify({
        projectName: 'projectName',
        projectId: 999,
        dsn: 'http://xxx.xxx/api/v1/coverage/client',
        commitSha: 'commitSha',
        reporter: 'reporter'
    }))
}
let formData = JSON.parse(localStorage.getItem('formData'))
console.log(formData, 'formData')

const formDataEnum = {
    projectName: '',
    projectId: 0,
    dsn: '',
    commitSha: '',
    reporter: ''
}

for (const formDataKey in formDataEnum) {
    $(`#${formDataKey}`).val(formData[formDataKey])


    //绑定商品名称联想
    $(`#${formDataKey}`).bind('input propertychange', function (val) {
        formData[formDataKey] = $(`#${formDataKey}`).val()
        localStorage.setItem('formData', JSON.stringify(formData))
    });
}


$('#submitForm').click(function (val) {
    getPageCov().then(cov => {
        console.log(cov,'cov')
        console.log(formData)
        const {dsn,commitSha,reporter,projectName,projectId} = formData
        fetch(dsn,{
            method:'POST',
            headers:{
                'content-type': 'application/json',
                token: reporter
            },
            body:JSON.stringify({
                "projectId": projectId,
                "projectName": projectName,
                "commitSha": commitSha,
                "coverage": cov
            })
        }).then(res=>{
            return res.json()
        }).then(res=>{
            $('#submitFormRes').html(JSON.stringify(res))
        }).catch(err=>{
            $('#submitFormRes').html(JSON.stringify(err))
        })
    })
})
