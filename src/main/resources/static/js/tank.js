var ownBullets = new Array(),
	otherBullets = new Array();

function Tank(args) {
	this.x = args.x;
	this.y = args.y;
	this.w = 20;
	this.h = 20;
	this.id = args.id;
	this.name = args.name;
	this.speed = 2;
	this.isLive = args.isLive;
	this.direct = 'up';
}

function Tank1(args) {
	this.tank = Tank;
	this.tank(args);
	this.color = args.color;

	this.moveUp = function() {
		this.direct = 'up';
		if (this.y > 0) this.y -= this.speed;
	};

	this.moveDown = function() {
		this.direct = 'down';
		if (this.y + this.h < 500) this.y += this.speed;
	}

	this.moveLeft = function() {
		this.direct = 'left';
		if (this.x > 0) this.x -= this.speed;
	}

	this.moveRight = function() {
		this.direct = 'right';
		if (this.x + this.w < 1000) this.x += this.speed;
	}

	this.shot = function() {
		var bullet = null;
		switch(this.direct) {
			case 'up':
				bullet = new BulletOwn(this.x+8, this.y-3, this.direct);
				break;
			case 'down':
				bullet = new BulletOwn(this.x+8, this.y+23, this.direct);
				break;
			case 'right':
				bullet = new BulletOwn(this.x+20, this.y+8, this.direct);
				break;
			case 'left':
				bullet = new BulletOwn(this.x-3, this.y+8, this.direct);
				break;
		}
		ownBullets.push(bullet);

		sendCmd("bullet", {x:bullet.x, y:bullet.y, direct:bullet.direct});

		var timer = window.setInterval('ownBullets['+(ownBullets.length-1)+'].run()', 100);
		ownBullets[ownBullets.length-1].timer = timer;
	}
}

function Bullet(x, y, direct) {
	this.x = x;
	this.y = y;
	this.w = 3;
	this.h = 3;
	this.speed = 10;
	this.color = 'white';
	this.timer = null;
	this.isLive = true;
	this.direct = direct;
}

function BulletOwn(x, y, direct) {
	this.bullet = Bullet;
	this.bullet(x, y, direct);

	this.run = function() {

		if (this.x <=0 || this.x >= 1000 || this.y <=0 || this.y >= 500) {
			this.isLive = false;
		}

		switch(this.direct) {
			case 'up':
				this.y -= this.speed;
				break;
			case 'down':
				this.y += this.speed;
				break;
			case 'right':
				this.x += this.speed;
				break;
			case 'left':
				this.x -= this.speed;
				break;
		}

		for (var i in other) {
			if (other[i].isLive && collide(this, other[i])) {
				this.isLive = false;
				other[i].isLive = false;

				var p = document.createElement('p');
				p.innerHTML = '你击杀了'+other[i].name;
				notice.appendChild(p);

				sendCmd("shot", {myId:myId, myName:myName, otherId:other[i].id, otherName:other[i].name});
				break;
			}
		}
	}
}

function BulletOther(x, y, direct) {
	this.bullet = Bullet;
	this.bullet(x, y, direct);

	if (this.x <=0 || this.x >= 1000 || this.y <=0 || this.y >= 500) {
		this.isLive = false;
	}

	this.run = function() {
		switch(this.direct) {
			case 'up':
				this.y -= this.speed;
				break;
			case 'down':
				this.y += this.speed;
				break;
			case 'right':
				this.x += this.speed;
				break;
			case 'left':
				this.x -= this.speed;
				break;
		}

		var all = other;
		all[myId] = own;
		for (var i in all) {
			if (all[i].isLive && collide(this, all[i])) {
				this.isLive = false;
			}
		}
	}
}

function collide(obj1, obj2) {
	var mw = (obj1.w + obj2.w) / 2;
	var mh = (obj1.h + obj2.h) / 2;
	if (Math.abs(obj1.x + obj1.w/2 - obj2.x - obj2.w/2) < mw
		&& Math.abs(obj1.y + obj1.h/2 - obj2.y - obj2.h/2) < mh) {
		return true;
	}
	return false;
}