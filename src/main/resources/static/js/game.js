var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
    notice = document.getElementById('notice');

var myInfo = {
	x: Math.random()*1000, //坐标，并应后台生产
	y: Math.random()*500,
	id: myId,
	name: myName,
	color: myColor,
	isLive: true
};
var own = new Tank1(myInfo);
setTimeout('sendCmd("create", myInfo)', 3000);

var other = {};
function worker(res) {
	var resData = null;
    if (res[0]) {
		for (var i in res) {
            resData = JSON.parse(res[i]).data;
			if (resData.id !== myId && !resData[resData.id])
			    other[resData.id] = new Tank1(resData);
		}
	} else {
        resData = res.data;
		if (res.cmd === "move"){
			var otherDataObj = other[resData.id];
			otherDataObj.x = resData.x;
			otherDataObj.y = resData.y;
			otherDataObj.isLive = resData.isLive;
			otherDataObj.direct = resData.direct;
		} else if (res.cmd === "bullet"){
            resData = res.data;
            var bullet = new BulletOther(resData.x, resData.y, resData.direct);
            otherBullets.push(bullet);
            var timer = window.setInterval('otherBullets['+(otherBullets.length-1)+'].run()', 100);
            otherBullets[otherBullets.length-1].timer = timer;
		} else {
			var p = document.createElement('p');
            resData = res.data;
            if (resData.otherId === myId) {
                own.isLive = false;
				p.innerHTML = resData.otherName+'击杀了你';
            } else {
            	other[resData.otherId].isLive = false;
				p.innerHTML = resData.myName+'击杀了'+resData.otherName;
            }
			notice.appendChild(p);
        }
	}
}

function drawTank(tank) {
	if (tank.isLive) {
		ctx.fillStyle = tank.color;
		ctx.fillRect(tank.x, tank.y, tank.w, tank.h);
		ctx.fillStyle = 'white';
		switch(tank.direct) {
			case 'up':
				ctx.fillRect(tank.x+5, tank.y, 10, 10);
				break;
			case 'down':
				ctx.fillRect(tank.x+5, tank.y+10, 10, 10);
				break;
			case 'left':
				ctx.fillRect(tank.x, tank.y+5, 10, 10);
				break;
			case 'right':
				ctx.fillRect(tank.x+10, tank.y+5, 10, 10);
				break;
		}
	} else {
		ctx.fillStyle = 'white';
		ctx.fillRect(tank.x, tank.y, tank.w, tank.h);
	}
}

function drawOwnBullet() {
	for (var i in ownBullets) {
		if (ownBullets[i].isLive) {
			ctx.fillStyle = ownBullets[i].color;
			ctx.fillRect(ownBullets[i].x, ownBullets[i].y, 3, 3);
		} else {
			window.clearInterval(ownBullets[i].timer);
			delete ownBullets[i];
		}
	}
}

function drawOtherBullet() {
    for (var i in otherBullets) {
        if (otherBullets[i].isLive) {
            ctx.fillStyle = otherBullets[i].color;
            ctx.fillRect(otherBullets[i].x, otherBullets[i].y, 3, 3);
        } else {
			window.clearInterval(otherBullets[i].timer);
            delete otherBullets[i];
        }
    }
}

function flush() {
	ctx.clearRect(0,0,1000,500);
	drawTank(own);
	for (var key in other) {
		drawTank(other[key]);
	}
	drawOwnBullet();
	drawOtherBullet();
}
setInterval(flush, 50);

window.onkeydown = function(event) {
	if (own.isLive) {
		var code = event.keyCode;
		switch(code) {
			case 87:
				own.moveUp();
				break;
			case 68:
				own.moveRight();
				break;
			case 83:
				own.moveDown();
				break;
			case 65:
				own.moveLeft();
				break;
			case 74:
				own.shot();
				break;
		}
		if ([65, 68, 83, 87].indexOf(code) > -1) {
		    var obj = {
		        id: own.id,
		        x: own.x,
                y: own.y,
                isLive: own.isLive,
                direct: own.direct
            }
			sendCmd("move", obj);
		}
	} else {
		alert('你已阵亡');
	}
}