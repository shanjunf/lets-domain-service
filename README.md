### lets-domain-service
```
Let's Encrypt免费SSL证书自动生成、自动部署阿里云api gateway， function
```

#### 执行CI
```
cnpm install -g @serverless-devs/s

s config add --AccountID $AccountID --AccessKeyID $AccessKeyID --AccessKeySecret $AccessKeySecret

cnpm install --production
./deploy

```