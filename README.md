#Moreii-express

 - 基础配置      /core/configure.js
 - app开关     /core/applist.js
 - 数据库设置     /core/cinfig.js

##页面访问与ajax请求

ajax请求需在末尾追加**?ajax=true**,程序依靠**req.query.ajax==='true'**来区分请求类型。

跳转方法：引入config.js后使用**config.resError(req,res,descriptionForJson,redirectUrl);**