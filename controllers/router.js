/**
 * Created by zhimeng on 2017-8-23.
 */
var file = require("../models/file.js");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var sd = require('silly-datetime');

//首页
exports.showIndex = function(req,res,next){
    //这就是node的编程思想，就是所有的东西，大都是异步的，所以内层函数，不是return回来，
    //而是调用高层函数提供的回调函数，把数据当做回调函数的参数来使用。
    file.getAllAlbums(function(err,allAlbums){
        if(err){
            next();//交给下面的中间件
            return;
        }
        res.render("index",{
            "albums":allAlbums
        });
    })

};
//相册页
exports.showAlbum = function(req,res,next){
    //遍历相册所有图片
    var albumName = req.params.albumName;
    //具体业务交给models去做
    file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
        if(err){
            next();
            return;
        }
        res.render("album",{
            "albumName":albumName,
            "images":imagesArray
        });
    });

};

//显示上传
exports.showUp = function(req,res){
    file.getAllAlbums(function(err,albums){
        res.render("up",{
            "albums":albums
        });
    });

};
//上传表单
exports.doPost = function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../tempup");
    form.parse(req, function(err, fields, files,next) {
        //改名
        if(err){
            next();//这个中间件不受理这个请求了，要往下走
            return;
        };
        //var size = parseInt(files.tupian.size);
        ////console.log(size);
        //if(size>6000){
        //    res.send("图片尺寸应小于6M");
        //    //删除图片
        //    fs.unlink(files.tupian.path);
        //    return;
        //}
        var tt =sd.format(new Date(), 'YYYYMMDDHHmmss');
        var ran = parseInt(Math.random()*89999+10000);
        var extname = path.extname(files.tupian.name);

        var oldpath =files.tupian.path ;
        var newpath =path.normalize(__dirname + "/../uploads/"+fields.folderName +"/"+tt+ran+extname);
        fs.rename(oldpath,newpath,function(err){
            if(err){
                res.send("改名失败");
                return;
            }
            file.getAllAlbums(function(err,albums){
                res.render("index",{
                    "albums":albums
                });
            });
        });
    });
};

//显示新建文件夹页面
exports.showFolder= function(req,res){
    file.getAllAlbums(function(err,albums){
        res.render("mkFolder",{
            "albums":albums
        });

    });
};
//得到文件名
exports.getFolder = function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        var folderName =fields.folderName;
        var folderPath = path.normalize(__dirname+"/../"+"./uploads/"+folderName);
        fs.mkdir(folderPath, function(err){
            if(err){
                res.send("新建文件失败");
                return;
            }
            file.getAllAlbums(function(err,albums){
                res.render("index",{
                    "albums":albums
                });
            });
        });
    });
};


