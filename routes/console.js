/**
 * Created by boooo on 14-8-2.
 */
var express = require('express'),
    router = express.Router(),
    config = require('../core/config'),
    userSchema = require('../core/schema/user'),
    noticeSchema = require('../core/schema/notice'),
    siteSchema = require('../core/schema/site'),
    os = require('os'),
    crypto = require('crypto');
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii Console';
    this.jsfile = data.jsfile ||'console_console.js';
    this.cssfile = data.cssfile || 'console.css';
    this.siteUrl = config.siteUrl;
    this.data = data.data || {};
    this.nav = config.nav;
    this.app = 'console';
    this.apps = config.app;
    this.consoleNav = [
        {
            name:'基本信息',
            path:''
        },
        {
            name:'更新缓存',
            path:'cache'
        },
        {
            name:'全局导航',
            path:'nav'
        },
        {
            name:'关于',
            path:'about'
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
    this.pretty = true;
};
/**
 * 验证登陆 & 权限
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            req.login = true;
            userSchema.getUserInfo({
                name:req.cookies.name,
                mail:req.cookies.mail
            },function(err,userData){
                if(err===null && userData!==null){
                    req.permission = userData.permission;
                }else{
                    req.permission = false;
                }
                next();
            });
        }else{
            req.login = false;
            req.permission = false;
            next();
        }
    });
});

/**
 * 已登陆用户功能
 * */
var isLogin = function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            if(req.query.ajax === 'true'){
                res.json({
                    err:true,
                    des:'请登陆啊亲>_<'
                });
            }else{
                res.redirect('/user/login');
            }
        }
    });
}
/**
 * edit
 * api
 * */

var isEditor = function(req,res,next){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            if(userData.permission.console.edit){
                next();
            }else{
                config.resError(req,res,'权限不足。');
            }
        }else{
            config.resError(req,res,'数据错误。');
        }
    });
}
router.use(isLogin);
router.use(isEditor);
/*
* 基本信息设置页面
* */
router.get('/console', function(req, res) {
    var data = new renderData({
        title:'站点基本信息设置',
        consoleNavActive:''
    });
    siteSchema.getLatestInfo(function(err,siteData){
        if(err===null && siteData!==null){
            data.siteData = siteData;
            res.render('console/index',data);
        }else{
            res.redirect(config.siteUrl+'500');
        }
    });
});
/*
* 缓存刷新页面
* */
router.get('/console/cache', function(req, res) {
    var data = new renderData({
        title:'更新缓存',
        consoleNavActive:'cache'
    });
    siteSchema.refreshSiteConfigure(function(err,queryData){
        data.refreshCacheErr = err;
        res.render('console/cache',data);
    });
});
/*
* 修改站点信息api
* */
router.post('/api/modifySiteInfo',function(req,res){
    var siteData = req.body.data;
    for(var item in siteData.app){
        siteData.app[item].state = Number(siteData.app[item].state);
    }
    if(siteData!==undefined && typeof siteData === 'object'){
        siteSchema.update(siteData,function(err,savedData){
            if(err===null){
                res.json({
                    err:false,
                    des:'保存成功。'
                });
            }else{
                res.json({
                    err:true,
                    des:'数据错误。'
                });
            }
        });
    }
});
/*
* 关于页面
* */
router.get('/console/about', function(req, res) {
    var data = new renderData({
        title:'关于站点',
        consoleNavActive:'about',
        data:{
            cpus:os.cpus(),
            osType:os.type(),
            platform:os.platform(),
            arch:os.arch(),
            version:config.version
        }

    });
    res.render('console/about',data);
});
/*
* 导航设置页面
* */
router.get('/console/nav', function(req, res) {
    var data = new renderData({
        title:'关于站点',
        consoleNavActive:'nav',
        data:{
            logo:config.logo
        }
    });
    res.render('console/nav',data);
});
router.post('/api/updateNav',function(req,res){
    var navArray = req.body.navArray;
    if(navArray.constructor.toString().match('Array')!==null){
        siteSchema.updateNav(navArray,function(err,savedData){
            if(err===null){
                siteSchema.refreshSiteConfigure(function(err1){
                    if(err1===null){
                        res.json({
                            err:false,
                            des:'导航更新成功。'
                        });
                    }else{
                        res.json({
                            err:true,
                            des:'缓存刷新错误。'
                        });
                    }
                });
            }else{
                res.json({
                    err:true,
                    des:'数据错误。'
                });
            }
        });
    }else{
        res.json({
            err:true,
            des:'数据格式错误。'
        });
    }
});
module.exports = router;