const fs = require('fs');
const arguments = process.argv.splice(2);
console.log('证书参数：', arguments);

if(arguments.length < 0) {
    console.error('wrong domain parameter');
    return;
}

let Client = require('@alicloud/cloudapi');

let client = new Client({
    accessKeyId: process.env.Ali_Key,
    accessKeySecret: process.env.Ali_Secret,
    endpoint: 'https://apigateway.cn-beijing.aliyuncs.com'
});

let apiGroup = [
{
    Domain: 'xxxx.com',
    Action: 'SetDomainCertificate',
    GroupId: 'xxxx',
    DomainName: 'api.xxxx.com',
    CertificateName: 'wzapi-lets',
    status: true
}
]

const getNowFormatDate = () => {
    const date = new Date();
    const seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

// api网关
const setDomain = async (params) => {
    await client.setDomain(params);
}

(async () => {
    let dir = arguments[0];
    for(let group of apiGroup) {
        if(!group.status) {
            continue;
        }
        try {
            let domain = group.Domain;
            let certFile = dir + domain + '/fullchain.cer';
            let keyFile = dir + domain + `/${domain}.key`;
        
            let cert = fs.readFileSync(certFile).toString();
            let key = fs.readFileSync(keyFile).toString();
    
            group.CertificateBody = cert;
            group.CertificatePrivateKey = key;
            group.CertificateName = group.CertificateName + '-' + getNowFormatDate();

            delete group.Domain;
            delete group.status;
        
            console.log(cert);
            console.log(key);
            
            await setDomain(group);
        }
        catch(err) {
            console.error(err);
            continue;
        }
    }
})()
