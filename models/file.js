/**
 * Created by zhimeng on 2017-8-23.
 */
 var fs = require("fs");

//这个函数的callback中含有两个参数，一个是err，一个是存放所有文件夹名字的array
exports.getAllAlbums = function(callback){
    fs.readdir("./uploads",function(err,files){
        if(err){
            callback("没有找到uploads文件夹",null);
            return;
        }
        var allAlbums = [];
        //迭代器
        (function iterator(i){
            if(i == files.length){
               callback(null,allAlbums);
                return;
            }
            fs.stat("./uploads/" + files[i],function(err,stats){
                if (err) {
                    callback("找不到文件" +files[i],null);
                }else if(stats.isDirectory()){
                    allAlbums.push(files[i]);
                }
                iterator(i+1);
            });
        })(0);

    });
};
//通过文件名得到所有图片
exports.getAllImagesByAlbumName = function(albumName,callback){
    fs.readdir("./uploads/" + albumName,function(err,files){
        if(err){
            callback("没有找到"+albumName+"文件夹",null);
            return;
        }

        var allimages = [];
        //迭代器
        (function iterator(i){
            if(i == files.length){
                callback(null,allimages);
                return;
            }
            fs.stat("./uploads/"+albumName+"/"+files[i],function(err,stats){
                if (err) {
                    callback("找不到图片" +files[i],null);
                    return;
                }else if(stats.isFile()){
                    allimages.push(files[i]);
                }
                iterator(i+1);
            });
        })(0);
    });
};

