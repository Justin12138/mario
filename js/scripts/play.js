"use strict";
var keycode;
(function (keycode) {
    keycode[keycode["KeyA"] = 0] = "KeyA";
    keycode[keycode["KeyD"] = 1] = "KeyD";
    keycode[keycode["Space"] = 2] = "Space";
})(keycode || (keycode = {}));
class Player {
    constructor(ele, img) {
        this.canvas_w = 600;
        this.canvas_h = 300;
        this.mario_w = 100;
        this.mario_h = this.mario_w * 1.3; //主角的大小
        this.mario_way = 0;
        this.mario_status = 0;
        this.x = this.canvas_w / 2;
        this.y = this.canvas_h - this.mario_h; //初始坐标
        this.mvspeed = 0;
        this.maxspeed = 8;
        this.accl = 0.2;
        this.turn = false;
        const canvas = document.getElementById(ele);
        canvas.width = this.canvas_w;
        canvas.height = this.canvas_h;
        this.canvas = canvas.getContext("2d");
        this.mario = new mario();
    }
    start() {
        let _this = this;
        let keydown = [];
        document.onkeydown = function (e) {
            let key = e.code;
            switch (key) {
                case keycode[0]:
                    if (keydown.indexOf(keycode.KeyA) == -1) {
                        keydown.unshift(keycode.KeyA);
                        if (_this.turn) {
                            // _this.mario.turn()
                            _this.turn = false;
                        }
                    }
                    break;
                case keycode[1]:
                    if (keydown.indexOf(keycode.KeyD) == -1) {
                        keydown.unshift(keycode.KeyD);
                        if (!_this.turn) {
                            // _this.mario.turn()
                            _this.turn = true;
                        }
                    }
                    break;
                case keycode[2]:
                    // keydown.add(keycode.Space)
                    break;
            }
        };
        document.onkeyup = function (e) {
            let key = e.code;
            switch (key) {
                case keycode[0]:
                    keydown.splice(keydown.indexOf(keycode.KeyA), 1);
                    break;
                case keycode[1]:
                    keydown.splice(keydown.indexOf(keycode.KeyD), 1);
                    break;
                case keycode[2]:
                    // keydown.add(keycode.Space)
                    break;
            }
        };
        let count = 0;
        setInterval(() => {
            if (keydown.length) {
                if (this.mario_status == 0) {
                    this.mario.run();
                    this.mario_status = 1;
                }
                if (keydown[0] != this.mario_way) {
                    if (this.turn != Boolean(keydown[0])) {
                        this.mario.turn();
                        this.turn = !this.turn;
                    }
                    if (this.mvspeed - this.accl > 0) {
                        this.mario_status = 0;
                        this.mvspeed -= this.accl;
                    }
                    else {
                        this.mario_way = keydown[0];
                        _this.mario.turn();
                    }
                }
            }
            else {
                this.mario_status = 0;
            }
            if (this.mario_status) {
                if (this.mvspeed < this.maxspeed) {
                    this.mvspeed += this.accl;
                }
                else {
                    this.mvspeed = this.maxspeed;
                }
            }
            else if (this.mvspeed) {
                if (this.mvspeed - this.accl > 0) {
                    this.mvspeed -= this.accl;
                }
                else {
                    this.mvspeed = 0;
                    if (keydown.length == 0) {
                        this.mario.stand();
                    }
                }
            }
            if (this.mario_way == 0) {
                this.x >= this.mvspeed ? this.x -= this.mvspeed : this.x = 0;
            }
            else {
                this.x < this.canvas_w ? this.x += this.mvspeed : this.x = this.canvas_w;
            }
            this.update(count++);
            count %= 60;
        }, 1000 / 60);
        this.mario.stand();
    }
    update(count) {
        let animi = this.mario.animitions.stand;
        let animifps = Math.ceil(count / animi.fps) % animi.pos.length;
        //马里奥对象
        this.canvas.clearRect(0, 0, this.canvas_w, this.canvas_h);
        this.canvas.drawImage(this.mario.object, this.x, this.y, this.mario_w, this.mario_h);
    }
}
class mario {
    constructor() {
        this.w = 230;
        this.h = this.w * 1.3;
        this.turned = false;
        this.animitions = {
            stand: {
                fps: 20,
                pos: [
                    [0, 65],
                    [230, 65]
                ]
            },
            run: {
                fps: 12,
                pos: [
                    [720, 65],
                    [980, 65],
                ]
            }
        };
        this.status = 0;
        const ele = document.createElement("canvas");
        ele.width = this.w;
        ele.height = this.h;
        // const ele = document.getElementById("canvas") as HTMLCanvasElement
        this.object = ele;
        this.canvas = ele.getContext("2d");
        this.img = document.getElementById("mario");
        this.animition(this.animitions.stand);
        // document.body.appendChild(ele)
        // //testanimi
        // let ele2 = document.createElement("canvas")
        // document.body.appendChild(ele2)
        // ele2.width = 115
        // ele2.height = 115 * 1.3 * 5
        // let can = ele2.getContext("2d") as CanvasRenderingContext2D
        // let pos = this.animitions.run.pos
        // for(let i = 0; i < pos.length;++i){
        //     can.drawImage(this.img,pos[i][0],pos[i][1],this.w,this.h,0,i * 115 * 1.3,115,115 * 1.3)
        // }   
    }
    turn() {
        this.canvas.translate(this.w, 0);
        this.canvas.scale(-1, 1);
    }
    stand() {
        if (this.status == 0)
            return;
        this.animition(this.animitions.stand);
        this.status = 0;
    }
    run() {
        if (this.status == 1)
            return;
        this.animition(this.animitions.run);
        this.status = 1;
    }
    animition(animi) {
        console.log(animi);
        clearInterval(this.inter);
        const _this = this;
        let count = 0;
        function runthis() {
            _this.canvas.clearRect(0, 0, 300, 300);
            _this.canvas.drawImage(_this.img, animi.pos[count % animi.pos.length][0], animi.pos[count % animi.pos.length][1], _this.w, _this.h, 0, 0, _this.w, _this.h);
            count++;
            count %= animi.fps;
        }
        runthis();
        this.inter = setInterval(runthis, 1000 / 60 * animi.fps);
    }
}
