var express = require('express');
var router = require("./controllers");

var app = express();

//设置模板引擎
app.set("view engine","ejs");

//静态页面,加上static，静态文件都要从这里走,但是之前静态文件中的图片路径等要重新改写
//所以还是不要加static了
app.use(express.static("./public"));
app.use(express.static("./uploads"));
//
//首页
app.get("/",router.showIndex);
// 地址栏输入cat/，为什么图片加载不出，因为路径不对,此时图片路径是localhost:3000/01.jpg
//如何解决，再添加一个静态文件
app.get("/:albumName",router.showAlbum);
app.get("/up",router.showUp);
app.post("/up",router.doPost);

app.get("/mkFolder",router.showFolder);
app.post("/mkFolder",router.getFolder);




//最后什么都找不到，返回404页面
app.use(function(req,res){
    res.render("err");
});

app.listen(3000);


