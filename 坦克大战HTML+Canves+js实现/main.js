//用0,1,2,3,4分别表示上、右、下、左,此处的0位向上
var myTank=new MyTank(30,30,0,"blue","yellow");
var myBullets=new Array();
var canfire=0;
var isHit=0;
var enemyTanks=new Array();
for (var i = 0; i <9; i++) {
    var enemyTank=new OtherTank(Math.round(Math.random()*600),Math.round(Math.random()*600),Math.round(Math.random()*3),"red","white");
    enemyTanks.push(enemyTank);
    //启动这个敌人的坦克
    var timer3=window.setInterval("enemyTanks["+i+"].run()",30);
    enemyTanks[i].timer=timer3;
}
var enemyBullets=new Array();
var bombs=new Array();
var walls=new Array();
var tempMap =eval("map"+Math.round(Math.random()*10));
for(var i=0;i<tempMap.length;i++){
    for(var j=0;j<tempMap[i].length;j++){
        if(tempMap[i][j]==1){
            var wall0=new Wall(j*30,i*30);
            walls.push(wall0);
        }
    }
}

//封装一个获取绘图环境的函数
var canvas=document.getElementById("floor");//得到画布
var ctx=canvas.getContext("2d");//得到上下文，相当于画笔

//设置一个间歇调用的函数，每隔10ms更新一下战场
window.setInterval(function(){
    canfire++;
    isHitWall();
    isenemycango();
    isHitOtherTank();
    isHitMyTank();
    ctx.clearRect(0,0,600,600);//更新之前先清除画布
    if(myTank.islive)
        drawTank(myTank);//清除完之后重新造坦克
    for (var i =0; i<myBullets.length; i++) {
        if(myBullets[i]!=null&&myBullets[i].islive)
            drawBullet(myBullets[i]);
    }
    for (var i = 0; i <enemyTanks.length; i++) {
        if(enemyTanks[i]!=null&&enemyTanks[i].islive)
            drawTank(enemyTanks[i]);
    }
    for (var i =0; i<enemyBullets.length; i++) {
        if(enemyBullets[i]!=null&&enemyBullets[i].islive)
            drawBullet(enemyBullets[i]);
    }
    for(var i=0;i<bombs.length;i++){
        if(bombs[i]!=null&&bombs[i].islive)
            drawBomb(bombs[i]);
        // else
        //      bombs.splice(i,1);
    }
    for(var i=0;i<walls.length;i++){
        if(walls[i]!=null&&walls[i].islive)
            drawWall(walls[i]);
        // else
        //      wall.splice(i,1);
    }
},10);

//接受用户的键盘输入
function  getCommand(){
    var code=event.keyCode;//通过event.KeyCode来判断键盘的ASCII值
    switch (code){
        case 32://空格
            if(canfire>50){//连续子弹的间隔
                myTank.fire();
                canfire=0;
            }
            break;
        case 37:
        case 65://左键
            myTank.moveLeft();
            break;
        case 38:
        case 87://上键
            myTank.moveUp();
            break;
        case 39:
        case 68://右键
            myTank.moveRight();
            break;
        case 40:
        case 83://下键
            myTank.moveDown();
            break;
    }
}

//坦克类
function Tank(x,y,direc,coller1,coller2){
    this.x=x;
    this.y=y;
    this.direc=direc;
    this.coller1=coller1;
    this.coller2=coller2;
    this.speed=2;
    this.islive=true;
    this.iscango=true;
}
//我的坦克类
function MyTank(x,y,direc,coller1,coller2){
    //对象冒充实现继承类
    this.tank=Tank;
    this.tank(x,y,direc,coller1,coller2);
    //向上移动
    this.moveUp=function(){
        if(this.y<=0 || !this.iscango) this.y-=0;//不能出边界
        else this.y-=this.speed;
        this.direc=0
    }
    //向右移动
    this.moveRight=function(){
        if (this.x+25>=600 || !this.iscango) this.x+=0;//不能出边界
        else this.x+=this.speed;
        this.direc=1;
    }
    //向下移动
    this.moveDown=function(){
        if (this.y+25>=600 || !this.iscango) this.y+=0;//不能出边界
        else this.y+=this.speed;
        this.direc=2;
    }
    //向左移动
    this.moveLeft=function(){
        if (this.x<=0 || !this.iscango) this.x-=0;//不能出边界
        else this.x-=this.speed;
        this.direc=3;
    }
    //开火
    this.fire=function(){
        if(this.islive){
            switch(this.direc){
                case 0:
                myBullet=new Bullet(this.x+9,this.y,this.direc,this.coller2);
                break;
                case 1:
                myBullet=new Bullet(this.x+30,this.y+9,this.direc,this.coller2);
                break;
                case 2:
                myBullet=new Bullet(this.x+9,this.y+30,this.direc,this.coller2);
                break;
                case 3: //右
                myBullet=new Bullet(this.x,this.y+9,this.direc,this.coller2);
                break;
            }
            myBullets.push(myBullet);
            //每20毫秒调用一次run();所有子弹共享一个定时器.
            var timer1=window.setInterval("myBullets["+(myBullets.length-1)+"].run()",20);
            //把这个timer赋给这个子弹(js对象是引用传递!)
            myBullets[myBullets.length-1].timer=timer1;
        }
    }
}
//敌方坦克类
function OtherTank(x,y,direc,coller1,coller2){
    //对象冒充实现继承类
    this.tank=Tank;
    this.tank(x,y,direc,coller1,coller2);
    this.timer=null;
    this.count=0;

    this.run=function (){
        this.count++;
        //判断敌人的坦克当前方向
        switch(this.direc){
            case 0://上
                if(this.iscango){
                    this.y-=this.speed;
                }
                break;
            case 1://右
                if(this.iscango){
                    this.x+=this.speed;
                }
                break;
            case 2://下
                if(this.iscango){
                    this.y+=this.speed;
                }
                break;
            case 3://左
                if(this.iscango){
                    this.x-=this.speed;
                }
                break;
        }
        //改变方向,走75毫秒，再改变方向
        if(this.count%150==0||!this.iscango){
            this.direc=Math.round(Math.random()*3);//随机生成 0,1,2,3
            this.iscango=true;
        }
        //走50毫秒则增加新的一颗子弹
        if(this.count%100==0&&this.islive){
            //增子弹,这是需要考虑当前这个敌人坦克的方向，在增加子弹
            switch(this.direc){
                case 0://上
                enemyBullet=new Bullet(this.x+9,this.y,this.direc,this.coller2);
                break;
                case 1://右
                enemyBullet=new Bullet(this.x+30,this.y+9,this.direc,this.coller2);
                break;
                case 2://下
                enemyBullet=new Bullet(this.x+9,this.y+30,this.direc,this.coller2);
                break;
                case 3: //左
                enemyBullet=new Bullet(this.x,this.y+9,this.direc,this.coller2);
                break;
            }
            //把子弹添加到敌人子弹数组中
            enemyBullets.push(enemyBullet);
            //启动新子弹run
            var timer2=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",20);
            enemyBullets[enemyBullets.length-1].timer=timer2;
        }
    }
}

//画坦克
function drawTank(tank){
    //考虑方向
    switch (tank.direc){
        case 0://上
        case 2://下
            //画出自己的坦克
            ctx.fillStyle=tank.coller1;//给定矩形的颜色
            ctx.fillRect(tank.x,tank.y,5,25);//画出左边的矩形
            ctx.fillRect(tank.x+15,tank.y,5,25);//画出右侧的矩形
            //画出中间的矩形（中间的矩形宽高为10*20，为了让中间的矩形和两侧的矩形之间有空隙，将左右两边都空出一个像素，所以x轴的位置向右移动了一个像素，左边就空出1px,宽度减少了2px,这样右边就又空出了1px）
            ctx.fillRect(tank.x+6,tank.y+5,8,20);
            ctx.fillStyle=tank.coller2;//圆的填充颜色
            ctx.arc(tank.x+10,tank.y+15,4,0,360);//画出坦克的盖（30+10=30+5+1+8/2）（30+15=30+5+20/2）
            ctx.fill();//填充圆
            //画出炮筒的线条
            ctx.beginPath();
            ctx.moveTo(tank.x+10,tank.y+15);//线条的起始位置为圆心的位置
            //上
            if(tank.direc==0){
                ctx.lineTo(tank.x+10,tank.y);//线条的结束位置
            }//下
            else if(tank.direc==2){
                ctx.lineTo(tank.x+10,tank.y+30);
            }
            ctx.strokeStyle=tank.coller2;
            ctx.lineWidth=4;//设置线条的宽度（炮管粗细）
            ctx.closePath();
            ctx.stroke();
        break;
        case 1://右
        case 3://左
            //画出自己的坦克
            ctx.fillStyle=tank.coller1;//给定矩形的颜色
            ctx.fillRect(tank.x,tank.y,25,5);//画出左边的矩形
            ctx.fillRect(tank.x,tank.y+15,25,5);//画出右侧的矩形
            //画出中间的矩形（中间的矩形宽高为10*20，为了让中间的矩形和两侧的矩形之间有空隙，将左右两边都空出一个像素，所以x轴的位置向右移动了一个像素，左边就空出1px,宽度减少了2px,这样右边就又空出了1px）
            ctx.fillRect(tank.x+5,tank.y+6,20,8);
            ctx.fillStyle=tank.coller2;//圆的填充颜色
            ctx.arc(tank.x+15,tank.y+10,4,0,360);//画出坦克的盖（30+10=30+5+1+8/2）（30+15=30+5+20/2）
            ctx.fill();//填充圆
            //画出炮筒的线条
            ctx.beginPath();
            ctx.moveTo(tank.x+15,tank.y+10);
            //向右
            if(tank.direc==1){
                ctx.lineTo(tank.x+30,tank.y+10);
            }//向左
            else if(tank.direc==3){ 
                ctx.lineTo(tank.x,tank.y+10);
            }
            ctx.strokeStyle=tank.coller2;
            ctx.lineWidth=4;//设置线条的宽度（炮管粗细）
            ctx.closePath();
            ctx.stroke();
        break;
    }
}

//子弹类
function Bullet(x,y,direc,coller2){
    this.x=x;
    this.y=y;
    this.direc=direc;
    this.coller2=coller2;
    this.speed=3;
    this.timer=null;
    this.islive=true;
    this.run=function(){
        if(this.x<0||this.x>600||this.y<0||this.y>600||this.islive==false){
            window.clearInterval(this.timer);
            this.islive=false;
        }else{
            switch (this.direc){
                case 0://上
                    this.y-=this.speed;
                break;
                case 2://下
                    this.y+=this.speed;
                break;
                case 1://右
                    this.x+=this.speed;
                break;
                case 3://左
                    this.x-=this.speed;
                break;
            }
        }
        //document.getElementById("aa").innerText="子弹x="+this.x+" 子弹y="+this.y;//测试
    }
}

//画子弹
function drawBullet(bullet){
    ctx.fillStyle=bullet.coller2;//给定矩形的颜色
    ctx.fillRect(bullet.x,bullet.y,5,5);
}

//定义一个爆炸
function Bomb(x,y){
    this.x=x;
    this.y=y;
    this.islive=true; //爆炸是否活的，默认true;
    this.blood=90;
    this.bloodDown=function(){
        if(this.blood>0){
            this.blood--;
        }else{
            this.islive=false;
        }
    }
}

//画出爆炸
function drawBomb(bomb){
    bomb.bloodDown();
    if(bomb.islive){
        if(bomb.blood>60){  //显示最大炸弹图
            // ctx.fillStyle="#CC9966";//给定矩形的颜色
            // ctx.fillRect(bomb.x,bomb.y,30,30);
            var img1=document.getElementById("img1");
            ctx.drawImage(img1,bomb.x,bomb.y,30,30);
            // var img1=new Image();
            // img1.src="bomb_1.gif";
            // img1.onload=function(){
            //     alert("1");
            //     cxt.drawImage(img1,0,0);
            // }
        }else if(bomb.blood>30){
            var img2=document.getElementById("img2");
            ctx.drawImage(img2,bomb.x,bomb.y,30,30);
        }else if(bomb.blood>0){
            var img3=document.getElementById("img3");
            ctx.drawImage(img3,bomb.x,bomb.y,30,30);
        }
    }
}

//定义一个墙
function Wall(x,y){
    this.x=x;
    this.y=y;
    this.islive=true;
}
//画出墙
function drawWall(waall1){
    if(waall1.islive){
        ctx.fillStyle="#999999";//给定矩形的颜色
        ctx.fillRect(waall1.x,waall1.y,30,30);
    }
}

//编写一个函数，专门用于判断坦克是否可以前进
function isenemycango(){
    for(var i=0;i<enemyTanks.length;i++){
        if(enemyTanks[i].islive){
            switch(enemyTanks[i].direc){
                case 0: //敌人坦克向上
                    if(!(enemyTanks[i].x>=0&&enemyTanks[i].x+20<=600&&enemyTanks[i].y>=0&&enemyTanks[i].y+25<=600)){
                        enemyTanks[i].iscango=false;
                        enemyTanks[i].y++;
                    }
                    if (myTank.direc==0||myTank.direc==2) {
                        if(myTank.x+20>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+20&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+25){
                            myTank.iscango=false;
                            myTank.y++;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x+20>=myTank.x&&enemyTanks[i].x<=myTank.x+20&&enemyTanks[i].y>=myTank.y&&enemyTanks[i].y<=myTank.y+25){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].y++;
                        }
                    }else{
                        if(myTank.x+25>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+20&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+25){
                            myTank.iscango=false;
                            myTank.y++;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x+20>=myTank.x&&enemyTanks[i].x<=myTank.x+25&&enemyTanks[i].y>=myTank.y&&enemyTanks[i].y<=myTank.y+20){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].y++;
                        }
                    }
                break;
                case 2://敌人坦克向下
                    if(!(enemyTanks[i].x>=0&&enemyTanks[i].x+20<=600&&enemyTanks[i].y>=0&&enemyTanks[i].y+25<=600)){
                        enemyTanks[i].iscango=false;
                        enemyTanks[i].y--;
                    }
                    if (myTank.direc==0||myTank.direc==2) {
                        if(myTank.x+20>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+20&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+25){
                            myTank.iscango=false;
                            myTank.y--;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x+20>=myTank.x&&enemyTanks[i].x<=myTank.x+20&&enemyTanks[i].y+25>=myTank.y&&enemyTanks[i].y+25<=myTank.y+25){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].y--;
                        }
                    }else{
                        if(myTank.x+25>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+20&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+25){
                            myTank.iscango=false;
                            myTank.y--;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x+20>=myTank.x&&enemyTanks[i].x<=myTank.x+25&&enemyTanks[i].y+25>=myTank.y&&enemyTanks[i].y+25<=myTank.y+20){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].y--;
                        }
                    }
                break;
                case 1: //敌人坦克向右
                    if(!(enemyTanks[i].x>=0&&enemyTanks[i].x+25<=600&&enemyTanks[i].y>=0&&enemyTanks[i].y+20<=600)){
                        enemyTanks[i].iscango=false;
                        enemyTanks[i].x--;
                    }
                    if (myTank.direc==0||myTank.direc==2) {
                        if(myTank.x+20>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+25&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+20){
                            myTank.iscango=false;
                            myTank.x--;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x+25>=myTank.x&&enemyTanks[i].x<=myTank.x+20&&enemyTanks[i].y+20>=myTank.y&&enemyTanks[i].y<=myTank.y+25){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].x--;
                        }
                    }else{ 
                        if(myTank.x+25>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+25&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+20){
                            myTank.iscango=false;
                            myTank.x--;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x+25>=myTank.x&&enemyTanks[i].x<=myTank.x+25&&enemyTanks[i].y+20>=myTank.y&&enemyTanks[i].y<=myTank.y+20){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].x--;
                        }
                    }
                break;
                case 3://敌人坦克向左
                    if(!(enemyTanks[i].x>=0&&enemyTanks[i].x+25<=600&&enemyTanks[i].y>=0&&enemyTanks[i].y+20<=600)){
                        enemyTanks[i].iscango=false;
                        enemyTanks[i].x++;
                    }
                    if (myTank.direc==0||myTank.direc==2) {
                        if(myTank.x+20>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+25&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+20){
                            myTank.iscango=false;
                            myTank.x++;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x>=myTank.x&&enemyTanks[i].x<=myTank.x+20&&enemyTanks[i].y+20>=myTank.y&&enemyTanks[i].y<=myTank.y+25){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].x++;
                        }
                    }else{ 
                        if(myTank.x+25>=enemyTanks[i].x&&myTank.x<enemyTanks[i].x+25&&myTank.y>=enemyTanks[i].y&&myTank.y<=enemyTanks[i].y+20){
                            myTank.iscango=false;
                            myTank.x++;
                        }else{
                            myTank.iscango=true;
                        }
                        if(enemyTanks[i].x>=myTank.x&&enemyTanks[i].x<=myTank.x+25&&enemyTanks[i].y+20>=myTank.y&&enemyTanks[i].y<=myTank.y+20){
                            enemyTanks[i].iscango=false;
                            enemyTanks[i].x++;
                        }
                    }
                break;
            }
            for(var j=0;j<enemyTanks.length;j++){
                if(enemyTanks[j].islive&&i!=j){ 
                    switch(enemyTanks[i].direc){
                        case 0://敌人坦克向上
                            if (enemyTanks[j].direc==0||enemyTanks[j].direc==2) {
                                if(enemyTanks[i].x+20>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+20&&enemyTanks[i].y>=enemyTanks[j].y&&enemyTanks[i].y<=enemyTanks[j].y+25){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].y++;
                                }
                            }else{
                                if(enemyTanks[i].x+20>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+25&&enemyTanks[i].y>=enemyTanks[j].y&&enemyTanks[i].y<=enemyTanks[j].y+20){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].y++;
                                }
                            }
                        break;
                        case 2://敌人坦克向下
                            if (enemyTanks[j].direc==0||enemyTanks[j].direc==2) {
                                if(enemyTanks[i].x+20>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+20&&enemyTanks[i].y+25>=enemyTanks[j].y&&enemyTanks[i].y+25<=enemyTanks[j].y+25){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].y--;
                                }
                            }else{
                                if(enemyTanks[i].x+20>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+25&&enemyTanks[i].y+25>=enemyTanks[j].y&&enemyTanks[i].y+25<=enemyTanks[j].y+20){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].y--;
                                }
                            }
                        break;
                        case 1://敌人坦克向右
                            if (enemyTanks[j].direc==0||enemyTanks[j].direc==2) {
                                if(enemyTanks[i].x+25>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+20&&enemyTanks[i].y+20>=enemyTanks[j].y&&enemyTanks[i].y<=enemyTanks[j].y+25){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].x--;
                                }
                            }else{ 
                                if(enemyTanks[i].x+25>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+25&&enemyTanks[i].y+20>=enemyTanks[j].y&&enemyTanks[i].y<=enemyTanks[j].y+20){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].x--;
                                }
                            }
                        break;
                        case 3://敌人坦克向左
                            if (enemyTanks[j].direc==0||enemyTanks[j].direc==2) {
                                if(enemyTanks[i].x>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+20&&enemyTanks[i].y+20>=enemyTanks[j].y&&enemyTanks[i].y<=enemyTanks[j].y+25){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].x++;
                                }
                            }else{ 
                                if(enemyTanks[i].x>=enemyTanks[j].x&&enemyTanks[i].x<=enemyTanks[j].x+25&&enemyTanks[i].y+20>=enemyTanks[j].y&&enemyTanks[i].y<=enemyTanks[j].y+20){
                                    enemyTanks[i].iscango=false;
                                    enemyTanks[i].x++;
                                }
                            }
                        break;
                    }
                }
            }
            for(var j=0;j<walls.length;j++){
                if(walls[j].islive){ 
                    switch(enemyTanks[i].direc){
                        case 0://敌人坦克向上
                            if(enemyTanks[i].x+20>=walls[j].x&&enemyTanks[i].x<=walls[j].x+30&&enemyTanks[i].y>=walls[j].y&&enemyTanks[i].y<=walls[j].y+30){
                                enemyTanks[i].iscango=false;
                                enemyTanks[i].y++;
                            }
                        break;
                        case 2://敌人坦克向下
                            if(enemyTanks[i].x+20>=walls[j].x&&enemyTanks[i].x<=walls[j].x+30&&enemyTanks[i].y+25>=walls[j].y&&enemyTanks[i].y+25<=walls[j].y+30){
                                enemyTanks[i].iscango=false;
                                enemyTanks[i].y--;
                            }
                        break;
                        case 1://敌人坦克向右
                            if(enemyTanks[i].x+25>=walls[j].x&&enemyTanks[i].x<=walls[j].x+30&&enemyTanks[i].y+20>=walls[j].y&&enemyTanks[i].y<=walls[j].y+30){
                                enemyTanks[i].iscango=false;
                                enemyTanks[i].x--;
                            }
                        break;
                        case 3://敌人坦克向左
                            if(enemyTanks[i].x>=walls[j].x&&enemyTanks[i].x<=walls[j].x+30&&enemyTanks[i].y+20>=walls[j].y&&enemyTanks[i].y<=walls[j].y+30){
                                enemyTanks[i].iscango=false;
                                enemyTanks[i].x++;
                            }
                        break;
                    }
                }
            }
        }
    }
    for(var j=0;j<walls.length;j++){
        if(walls[j].islive){ 
            switch(myTank.direc){
                case 0://敌人坦克向上
                    if(myTank.x+20>=walls[j].x&&myTank.x<=walls[j].x+30&&myTank.y>=walls[j].y&&myTank.y<=walls[j].y+30){
                        myTank.iscango=false;
                        myTank.y++;
                    }
                break;
                case 2://敌人坦克向下
                    if(myTank.x+20>=walls[j].x&&myTank.x<=walls[j].x+30&&myTank.y+25>=walls[j].y&&myTank.y+25<=walls[j].y+30){
                        myTank.iscango=false;
                        myTank.y--;
                    }
                break;
                case 1://敌人坦克向右
                    if(myTank.x+25>=walls[j].x&&myTank.x<=walls[j].x+30&&myTank.y+20>=walls[j].y&&myTank.y<=walls[j].y+30){
                        myTank.iscango=false;
                        myTank.x--;
                    }
                break;
                case 3://敌人坦克向左
                    if(myTank.x>=walls[j].x&&myTank.x<=walls[j].x+30&&myTank.y+20>=walls[j].y&&myTank.y<=walls[j].y+30){
                        myTank.iscango=false;
                        myTank.x++;
                    }
                break;
            }
        }
    }
}

//编写一个函数，专门用于判断我的子弹，是否击中了某个敌人坦克
function isHitOtherTank(){
    //遍历每颗子弹
    for(var i=0;i<myBullets.length;i++){
        if(myBullets[i].islive){ //子弹是活的，才去判断
            //让这颗子弹去和遍历每个敌人坦克判断
            for(var j=0;j<enemyTanks.length;j++){
                if(enemyTanks[j].islive){//敌方是活的，才去判断
                    //根据当时敌人坦克的方向来决定(看看这颗子弹，是否进入坦克所在矩形)
                    switch(enemyTanks[j].direc){
                        case 0: //敌人坦克向上
                        case 2://敌人坦克向下
                            if(myBullets[i].x>=enemyTanks[j].x&&myBullets[i].x<=enemyTanks[j].x+20
                                &&myBullets[i].y>=enemyTanks[j].y&&myBullets[i].y<=enemyTanks[j].y+25){
                                isHit++;
                                if (isHit==50)alert("666，你过关了！F5刷新地图");
                                // document.getElementById("aa").innerText=isHit;//计分
                                //把坦克islive 设为false ,表示死亡
                                enemyTanks[j].islive=false;
                                myBullets[i].islive=false;
                                //创建一爆炸
                                var bomb1=new Bomb(enemyTanks[j].x,enemyTanks[j].y);
                                //然后把该炸弹放入到bombs数组中
                                bombs.push(bomb1);
                                var enemyTank=new OtherTank(Math.round(Math.random()*600),Math.round(Math.random()*600),0,"red","white");
                                enemyTanks.push(enemyTank);
                                //启动这个敌人的坦克
                                var timer3=window.setInterval("enemyTanks["+(enemyTanks.length-1)+"].run()",30);
                                enemyTanks[(enemyTanks.length-1)].timer=timer3;
                            }
                        break;
                        case 1: //敌人坦克向右
                        case 3://敌人坦克向左
                            if(myBullets[i].x>=enemyTanks[j].x&&myBullets[i].x<=enemyTanks[j].x+25
                                &&myBullets[i].y>=enemyTanks[j].y&&myBullets[i].y<=enemyTanks[j].y+20){
                                isHit++;
                                if (isHit==50)alert("666，你过关了！F5刷新地图");
                                // document.getElementById("aa").innerText=isHit;//计分
                                //把坦克islive 设为false ,表示死亡
                                enemyTanks[j].islive=false;
                                myBullets[i].islive=false;
                                //创建一爆炸
                                var bomb1=new Bomb(enemyTanks[j].x,enemyTanks[j].y);
                                //然后把该炸弹放入到bombs数组中
                                bombs.push(bomb1);
                                var enemyTank=new OtherTank(Math.round(Math.random()*600),Math.round(Math.random()*600),0,"red","white");
                                enemyTanks.push(enemyTank);
                                //启动这个敌人的坦克
                                var timer3=window.setInterval("enemyTanks["+(enemyTanks.length-1)+"].run()",30);
                                enemyTanks[(enemyTanks.length-1)].timer=timer3;
                            }
                        break;
                    }
                }  
            }
        }
    }
}

//同理编写一个函数，专门用于判断我是否被击中
function isHitMyTank(){
    //遍历每颗子弹
    for(var i=0;i<enemyBullets.length;i++){
        if(enemyBullets[i].islive&&myTank.islive){ //子弹是活的，才去判断
            //根据当时坦克的方向来决定(看看这颗子弹，是否进入坦克所在矩形)
            switch(myTank.direc){
                case 0: //坦克向上
                case 2://坦克向下
                    if(enemyBullets[i].x>=myTank.x&&enemyBullets[i].x<=myTank.x+20
                        &&enemyBullets[i].y>=myTank.y&&enemyBullets[i].y<=myTank.y+25){
                        //把坦克islive 设为false ,表示死亡
                        alert("233，你已死亡！F5刷新地图");
                        myTank.islive=false;
                        enemyBullets[i].islive=false;
                        //创建一爆炸
                        var bomb2=new Bomb(myTank.x,myTank.y);
                        //然后把该炸弹放入到bombs数组中
                        bombs.push(bomb2);
                    }
                break;
                case 1: //敌人坦克向右
                case 3://敌人坦克向左
                    if(enemyBullets[i].x>=myTank.x&&enemyBullets[i].x<=myTank.x+25
                        &&enemyBullets[i].y>=myTank.y&&enemyBullets[i].y<=myTank.y+20){
                        //把坦克islive 设为false ,表示死亡
                        alert("233，你已死亡！F5刷新地图");
                        myTank.islive=false;
                        enemyBullets[i].islive=false;
                        //创建一爆炸
                        var bomb2=new Bomb(myTank.x,myTank.y);
                        //然后把该炸弹放入到bombs数组中
                        bombs.push(bomb2);
                    }
                break;
            }
        }
    }
}

//同理编写一个函数，专门用于判断墙是否被击中
function isHitWall(){
    //遍历每颗子弹
    for(var i=0;i<walls.length;i++){
        if(walls[i].islive){ //子弹是活的，才去判断
            //根据当时坦克的方向来决定(看看这颗子弹，是否进入坦克所在矩形)
            for(var j=0;j<enemyBullets.length;j++){
                if(enemyBullets[j].islive){//敌方是活的，才去判断
                    if(enemyBullets[j].x>=walls[i].x&&enemyBullets[j].x<=walls[i].x+30
                        &&enemyBullets[j].y>=walls[i].y&&enemyBullets[j].y<=walls[i].y+30){
                        //把坦克islive 设为false ,表示死亡
                        walls[i].islive=false;
                        enemyBullets[j].islive=false;
                        //创建一爆炸
                        var bomb2=new Bomb(walls[i].x,walls[i].y);
                        //然后把该炸弹放入到bombs数组中
                        bombs.push(bomb2);
                    }
                }
            }
            for(var j=0;j<myBullets.length;j++){
                if(myBullets[j].islive){//敌方是活的，才去判断
                    if(myBullets[j].x>=walls[i].x&&myBullets[j].x<=walls[i].x+30
                        &&myBullets[j].y>=walls[i].y&&myBullets[j].y<=walls[i].y+30){
                        //把坦克islive 设为false ,表示死亡
                        walls[i].islive=false;
                        myBullets[j].islive=false;
                        //创建一爆炸
                        var bomb2=new Bomb(walls[i].x,walls[i].y);
                        //然后把该炸弹放入到bombs数组中
                        bombs.push(bomb2);
                    }
                }
            }
        }
    }
}