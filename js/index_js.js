var oPlayOrPause = document.getElementById("playOrPause");
var oVideo = document.getElementById("video");
var oTime = document.getElementById("time");
var oSpans = document.querySelectorAll("#time span");
var oFullScreen = document.getElementById("fullScreen");
var oControl = document.getElementById("control");
var oInner = document.getElementById("inner");
var oProgress = document.getElementById("progress");
var oDrag = document.getElementById("drag");
var oWrap = document.getElementById("wrap");
var oCir = document.getElementById("cir");
var oVolume = document.getElementById("volume");
var oSound = document.getElementById("sound");

var oRate  = document.querySelector("#rate span");

var oRate_checks = document.getElementById("rate_check");
var oRate_checkBtns = document.querySelectorAll("#rate #rate_check button");

var oPlaylist = document.getElementById("playlist");


var oVideo_file = document.getElementById("video_file");

var oProgress = document.querySelector("#progress");

var time1= null ;
video.controls=false;//禁止原生控制条

function changeTime(time) {
    var h = Math.floor(time / 3600);
    var m = Math.floor( time % 3600 / 60);
    var s = Math.floor(time % 60);
    return (h<10 ? "0" + h : h) + ":" + (m<10 ? "0" + m : m) + ":" + (s<10 ? "0" + s : s);
}

var currenttime = 0;
oVideo.oncanplay = function () {
    oSpans[1].innerHTML = changeTime(oVideo.duration);
}

//点击播放按钮播放，暂停
oPlayOrPause.onclick = function () {
    if(oVideo.paused){//
        oPlayOrPause.style.backgroundImage = "url(./img/pause.png)";
        // oVideo.playbackRate = 5;
        oVideo.play();
        move();

    }else{
        oPlayOrPause.style.backgroundImage = "url(./img/play.png)";
        oVideo.pause();
        clearInterval(time1);

    }
}
oVideo.onclick = function () {
    if(oVideo.paused){//
        oPlayOrPause.style.backgroundImage = "url(./img/pause.png)";
        // oVideo.playbackRate = 5;
        oVideo.play();
        move();

    }else{
        oPlayOrPause.style.backgroundImage = "url(./img/play.png)";
        oVideo.pause();
        clearInterval(time1);

    }
}
//enter space 控制播放暂停
document.onkeydown = function (ev) {
    if(ev.keyCode == 32 || ev.keyCode ==13 ){
        ev.preventDefault();
        ev.stopPropagation();
        if(oVideo.paused){
            oPlayOrPause.style.backgroundImage = "url(./img/pause.png)";
            oVideo.play();
            move();

        }else{
            oPlayOrPause.style.backgroundImage = "url(./img/play.png)";
            oVideo.pause();

        }
    }
}

var oProgress_width =  getComputedStyle(oProgress, null).width;

function move(){
    time1 = setInterval(function () {
        oSpans[0].innerHTML = changeTime(oVideo.currentTime);
        oDrag.style.left = oInner.style.width = oVideo.currentTime/ oVideo.duration * oProgress.clientWidth + "px";

        if(oInner.style.width === oProgress_width){
            oDrag.style.display = "none";
        }else {
            oDrag.style.display = "block";
        }

    },20);
}
//绑定滑块事件
oDrag.onmousedown =function (ev) {
    var ev =ev || window.event;
    ev.preventDefault();
    oVideo.pause();
    clearInterval(time1);
    oPlayOrPause.style.backgroundImage = "url(./img/play.png)";
    var point_left = ev.offsetX;
    // console.log(oVideo.currentTime);

    document.onmousemove = function (ev) {
        var ev =ev || window.event;
        ev.preventDefault();
        //鼠标点击时候滑块距离progress最左边的距离
        var dragtoleft = ev.clientX - point_left - oProgress.getBoundingClientRect().left;
        // var dragtoleft = ev.clientX - point_left - oProgress.offsetLeft - oWrap.offsetLeft;
        if(dragtoleft <= 0){
            dragtoleft = 0;
        }else if(dragtoleft >= oProgress.clientWidth - oDrag.clientWidth){
            dragtoleft = oProgress.clientWidth - oDrag.clientWidth;
        }

        oInner.style.width = oDrag.style.left = dragtoleft + 'px';
        currenttime = dragtoleft/(oProgress.clientWidth - oDrag.clientWidth)*oVideo.duration;

        oSpans[0].innerHTML = changeTime(currenttime);


    }
    document.onmouseup =function () {
        oVideo.play();
        oVideo.currentTime = currenttime;
        // console.log("currenttime"+currenttime);

        move();
        document.onmousemove = document.onmouseup =  null;

        oPlayOrPause.style.backgroundImage = "url(./img/pause.png)";
    }

}

//绑定全屏事件
var flag = true;
oFullScreen.onclick = function () {
    if (flag){
        var docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
        flag = !flag;

        var wW=document.documentElement.clientWidth;
        // var wW=screen.width;
        var wH=screen.height;

        oVideo.style.width=wW + "px";
        // oVideo.style.height=(wH-oControl.offsetHeight) + "px";
        oVideo.style.height=wH - oControl.offsetHeight + "px";
        oControl.style.width = wW + "px";
        // oControl.style.top= -oControl.clientHeight + "px";

    } else{
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.oRequestFullscreen){
            document.oCancelFullScreen();
        }else if (document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }
        flag = !flag;

        oVideo.style.width=800 + "px";
        oVideo.style.height=400 + "px";
        oControl.style.width = 800 + "px";
    }

}


//esc 按键响应,
document.addEventListener("keydown",function (ev) {
    if(ev.keyCode === 27){
        ev.preventDefault();
        ev.stopPropagation();
        oVideo.style.width=800 + "px";
        oVideo.style.height=400 + "px";
        oControl.style.width = 800 + "px";

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.oRequestFullscreen){
            document.oCancelFullScreen();
        }else if (document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }

        // window.event.keyCode=0;
        // window.ev.returnValue = false;
    }


},false);


//绑定静音事件
/*
oSound.onclick = function (ev) {
    var ev =ev || window.event;
    ev.preventDefault();
    ev.stopPropagation();
    // console.log("oSound:"+ev.currentTarget);
    if(!oVideo.muted){
        oVideo.muted = true;
        oSound.style.backgroundImage = "url(./img/muted.png)";
    }else{
        oVideo.muted = false;
        oSound.style.backgroundImage = "url(./img/sound.png)"
    }

}
*/

oSound.addEventListener("click",function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if(!oVideo.muted){
        oVideo.muted = true;
        oSound.style.backgroundImage = "url(./img/muted.png)";
    }else{
        oVideo.muted = false;
        oSound.style.backgroundImage = "url(./img/sound.png)"
    }
},false);

//绑定声音调节事件


/*
oCir.onmousedown = function (ev) {
    var ev =ev || window.event;
    ev.preventDefault();
    ev.stopPropagation();
    var pointtotop = ev.offsetY;

    document.onmousemove = function (ev) {
        var ev =ev || window.event;
        ev.preventDefault();
        ev.stopPropagation();


        // var point_top = ev.clientY - pointtotop + oVolume.offsetTop - oWrap.offsetTop ;
        // var point_top = ev.clientY - pointtotop - oVolume.offsetTop - oWrap.offsetTop -195;

        // console.log("point_top:"+point_top+"ev.pageY: "+ev.pageY+"  oVolume.offsetTop:"+oVolume.offsetTop);
        // console.log(ev.clientY+" "+point_top+" "+oVolume.offsetTop);
        // console.log("111point_top:"+point_top);
        // console.log(ev.pageY - pointtotop + oVolume.offsetTop - oWrap.offsetTop);
        // console.log(100 - oCir.offsetTop);
        // console.log("ev.clientY"+ev.clientY);
        // console.log(oVideo.getBoundingClientRect().height);
        // console.log(oControl.getBoundingClientRect().top);
        //
        // console.log(oVolume.getBoundingClientRect().top);
        // console.log(oSound.getBoundingClientRect().top);
        // console.log(oCir.getBoundingClientRect().top);

        console.log(ev.clientY - pointtotop -oVolume.getBoundingClientRect().top);

        var point_top = ev.clientY - pointtotop -oVolume.getBoundingClientRect().top;
        if(point_top <=0 ){
            point_top = 0;
        }else if(point_top >=oVolume.clientHeight - oCir.clientHeight ){
            point_top = oVolume.clientHeight - oCir.clientHeight;
        }


        oCir.style.top = point_top + 'px';

        var scaleNum = oCir.clientHeight/(oVolume.clientHeight - oCir.clientHeight);
        // console.log(oCir.offsetTop * scaleNum);
        var volumnNum = 1 - (scaleNum * point_top/10);
        // console.log(" volumnNum :"+ volumnNum);
        oVideo.volume = volumnNum;
        if(volumnNum ==0){
            oVideo.muted = true;
            oSound.style.backgroundImage = "url(./img/muted.png)";
        }else if(volumnNum >0){
            oVideo.muted = false;
            oSound.style.backgroundImage = "url(./img/sound.png)"
        }

    }
    document.onmouseup = function () {
         document.onmousemove = document.onmouseup = null;
    }
}
*/

oCir.onclick =function(ev){
    ev.preventDefault();
    ev.stopPropagation();
}
oVolume.onclick =function(ev){
    ev.preventDefault();
    ev.stopPropagation();
}


oCir.addEventListener("mousedown",function (ev) {

    var pointtotop = ev.offsetY;

    document.onmousemove = function (ev) {
        var ev =ev || window.event;
        ev.preventDefault();
        ev.stopPropagation();

        var point_top = ev.clientY - pointtotop - oVolume.getBoundingClientRect().top;
        if(point_top <=0 ){
            point_top = 0;
        }else if(point_top >=oVolume.clientHeight - oCir.clientHeight ){
            point_top = oVolume.clientHeight - oCir.clientHeight-1;
        }
        oCir.style.top = point_top + 'px';
        // console.log(point_top);
        var scaleNum = oCir.clientHeight/(oVolume.clientHeight - oCir.clientHeight);

        var volumnNum = 1 - (scaleNum * point_top/10);
        console.log(" volumnNum :"+ volumnNum.toFixed(2));
        oVideo.volume = volumnNum.toFixed(2);
        if(volumnNum ==0){
            oVideo.muted = true;
            oSound.style.backgroundImage = "url(./img/muted.png)";
        }else if(volumnNum >0){
            oVideo.muted = false;
            oSound.style.backgroundImage = "url(./img/sound.png)"
        }

    }
    document.onmouseup = function () {
        oVolume.onmousemove = document.onmousemove = document.onmouseup = null;
    }
    
},false);

oRate.addEventListener("mouseenter" , function () {
    oRate_checks.style.visibility = "visible";
},false);
oRate.onmouseleave = function(){
    // oRate_checks.style.display = "none";
    oRate_checks.style.visibility = "hidden";

}
oRate_checks.onmouseenter = function(){
    oRate_checks.style.visibility = "visible";
}
oRate_checks.onmouseleave = function(){
    oRate_checks.style.visibility = "hidden";
}


oRate_checkBtns.forEach(function (item,index) {
    // oRate_checkBtn3[index].index = index;
    // console.log(item);

    item.onclick = function () {
        for (var i = 0; i < oRate_checkBtns.length; i++) {
            oRate_checkBtns[i].className = "mouseEnter";
        }
        item.className = "mouseEnter button_show";

        oVideo.playbackRate = this.innerHTML.split("x")[0];
    }

})

oPlaylist.onclick = function () {
    oVideo_file.click();
}

//视频文件读去函数
function imports() {
    var videofile = oVideo_file.files[0];
    var url = URL.createObjectURL(videofile);

    // console.log(videofile+" " +url);
    oVideo.src = url;
}


//双击控制全屏
var flag_dblclick = true;
oVideo.ondblclick = function () {
    if (flag_dblclick){
        var docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
        flag_dblclick = !flag_dblclick;

        var wW=document.documentElement.clientWidth;
        // var wW=screen.width;
        var wH=screen.height;

        oVideo.style.width=wW + "px";
        // oVideo.style.height=(wH-oControl.offsetHeight) + "px";
        oVideo.style.height=wH - oControl.offsetHeight + "px";
        oControl.style.width = wW + "px";
        // oControl.style.top= -oControl.clientHeight + "px";

    } else{
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.oRequestFullscreen){
            document.oCancelFullScreen();
        }else if (document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }
        flag_dblclick = !flag_dblclick;

        oVideo.style.width=800 + "px";
        oVideo.style.height=400 + "px";
        oControl.style.width = 800 + "px";
    }

}

//点击滚动条，跳转播放位置

oProgress.addEventListener("mousedown",function (ev) {
    oVideo.pause();
    clearInterval(time1);
    var ev = ev || window.event;
    var progress_toleft = (ev.clientX - oProgress.getBoundingClientRect().left).toFixed(2);
    console.log((ev.clientX - oProgress.getBoundingClientRect().left).toFixed(2));
    oInner.style.width = oDrag.style.left = progress_toleft+ 'px';

    currenttime = progress_toleft/(oProgress.clientWidth - oDrag.clientWidth) * oVideo.duration;

    oSpans[0].innerHTML = changeTime(currenttime);

    document.onmouseup =function () {
        oVideo.play();
        oVideo.currentTime = currenttime;
        // console.log("currenttime"+currenttime);

        move();
        document.onmousemove = document.onmouseup =  null;

        // oPlayOrPause.style.backgroundImage = "url(./img/pause.png)";
    }

},false);

