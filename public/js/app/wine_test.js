/**
 * Created by boooo on 14-8-21.
 */
var cache = {
    score:0,
    imageElement:{}
};
var itemSize= 120;
//window.onload=function(){itemWidth= document.getElementsByTagName('canvas')[0].offsetWidth/3}
Cut(function(root, container) {
    Cut.Mouse(root, container, true);
    root.viewbox(360, 720);


    //绘制酒瓶
    var last = null,
        clickCount = 0;
    root.on("viewport", function(width, height) {
        itemWidth=width/3;
    });

    var row = Cut.column(0.5).pin({'alignX':0.5,'alignY':1}).appendTo(root);
    var addLabItem = function(){
        var line = Cut.row(0.5).appendTo(row);
        for (var i = 0; i < Math.floor(Math.random()*3+1); i++) {
            Cut.image("beer:test").pin({
                scaleMode:'in',
                scaleWidth:itemSize,
                scaleHeight:itemSize
            }).appendTo(line).on(
                Cut.Mouse.CLICK, function(ev, point) {
                    if (this != last) {
                        last = this;
                        if(!cache.canvasHeight){
                            cache.canvasHeight = document.getElementsByTagName('canvas')[0].height;
                        }
                        if(this.parent().pin('offsetY')+itemSize>=row.pin('height')){
                            clickCount++;
                            cache.score++;
                            this.setImage('beerok:test').pin({
                                scaleMode:'in',
                                scaleWidth:itemSize,
                                scaleHeight:itemSize
                            });
                            scoreString.setValue("Score:"+cache.score);
                            row.tween(duration = 100, delay = 0).clear().pin({
                                pivotY:-itemSize*clickCount
                            }).then(function(){
                                addLabItem();
                            });
                        }

                        /*this.tween(duration = 100, delay = 0).clear()
                            .pin({
                                scaleX : Cut.Math.random(0.3, 0.4),
                                scaleY : Cut.Math.random(0.3, 0.4)
                            })
                            .then(function(){
                                clickCount++;
                                cache.score++;
                                this.setImage('beerok:test').pin({
                                    scaleMode:'in',
                                    scaleWidth:itemSize,
                                    scaleHeight:itemSize
                                });
                                scoreString.setValue("Score:"+cache.score);
                                row.tween(duration = 100, delay = 0).clear().pin({
                                    offsetY:-itemSize*clickCount
                                })
                                addLabItem();
                            });*/
                    }

                    return true;
                });
        }
    }
    for (var i = 0; i < 1; i++) {
        addLabItem();
    }
    //绘制分数
    var scorerow = Cut.row().pin({
        offset : 1,
        align : -0.5,
        handle : 0,
        offsetX:250,
        offsetY:380,
        height:500
    }).appendTo(root);
    var scoreString =  Cut.string('base:d_').appendTo(scorerow);
    scoreString.pin({
        offsetX:0,
        offsetY:0,
        height:50
    });
    scoreString.setValue("Score:"+cache.score);

});

/*texture*/
var PPU = 64;
Cut.addTexture(texture = {
    name : 'beer',
    imagePath : '/img/wine/lab.png',
    imageRatio : 1,
    cutouts : [
        { // list of cutoutDefs or cutouts
            name : 'test',
            x : 0,
            y : 0,
            width : 305,
            height : 305,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        }
    ]
});
Cut.addTexture(texture = {
    name : 'beerok',
    imagePath : '/img/wine/labok.png',
    imageRatio : 1,
    cutouts : [
        { // list of cutoutDefs or cutouts
            name : 'test',
            x : 0,
            y : 0,
            width : 144,
            height : 144,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        }
    ]
});
Cut.addTexture({
    name : "base",
    factory : function(name) {
        if (name.substring(0, 2) === "d_") {
            var d = name.substr(2, 1);
            return Cut.Out.drawing("d_" + d, 12, 24, 10, function(ctx, ratio) {
                ctx.scale(ratio, ratio);
                ctx.font = "bold 24px Arial";
                ctx.fillStyle = "#000";
                ctx.measureText && this.cropX(ctx.measureText(d).width + 0.4);
                ctx.textBaseline = "top";
                ctx.fillText(d, 0, 0);
            });
        }
    }
});