import {round} from "./map";
enum keycode {
    KeyA = 0,
    KeyD,
    Space,
    KeyS,
    KeyW
}

enum action {
    stand,
    run,
    stop,
    jump,
    down
}

class Player {
    canvas_w: number = 1600
    canvas_h: number = 900
    canvas: CanvasRenderingContext2D
    Scenes:round = new round(this.canvas_w)
    ScenesElement:HTMLCanvasElement = this.Scenes.element
    animition: mario = new mario() //马里奥动画对象
    mario_w: number = 70
    mario_h: number = this.mario_w * 1.3 //主角的大小
    mario_way: number = 0 /* 方向 */
    mario_status: number = 0 /* 当前动作 */
    x: number = this.canvas_w / 2
    y: number = this.canvas_h - this.mario_h //初始坐标
    mvspeed: number = 0
    maxspeed: number = 8
    accl: number = 0.2
    D_maxspeed: number = this.maxspeed * 2
    D_accl: number = this.accl * 2
    turn: boolean = false
    jumpHeight: number = this.mario_h * 3
    jumpspeed: number = 0
    jumpmaxspeed: number = 12
    jumpaccl: number = 0.4
    constructor(ele: string) {
        const canvas = document.getElementById(ele) as HTMLCanvasElement
        canvas.width = this.canvas_w
        canvas.height = this.canvas_h
        this.canvas = canvas.getContext("2d") as CanvasRenderingContext2D
    }
    start() {
        var keydown: Array<number> = []
        this.animition.status = action.stand
        {
            let _this = this
            document.onkeydown = function (e) { /*监听键盘*/
                let key: string = (e as KeyboardEvent).code
                switch (key) {
                    case keycode[0]:
                        if (!keydown.includes(keycode.KeyA)) {
                            keydown.unshift(keycode.KeyA)
                        }
                        break
                    case keycode[1]:
                        if (!keydown.includes(keycode.KeyD)) {
                            keydown.unshift(keycode.KeyD)
                        }
                        break
                    case keycode[2]:
                        _this.jump()
                        return false
                        break
                    case keycode[3]:
                        if (_this.mario_status != action.jump) {
                            _this.mario_status = action.down
                        }
                        break
                    case keycode[4]:
                        _this.maxspeed = _this.D_maxspeed
                        _this.accl = _this.D_accl
                        break
                }
            }
            document.onkeyup = function (e) {
                let key: string = (e as KeyboardEvent).code
                switch (key) {
                    case keycode[0]:
                        keydown.splice(keydown.indexOf(keycode.KeyA), 1)
                        break
                    case keycode[1]:
                        keydown.splice(keydown.indexOf(keycode.KeyD), 1)
                        break
                    case keycode[2]:
                        _this.mario_status = 0
                        break
                    case keycode[3]:
                        if (_this.mario_status != action.jump) {
                            _this.mario_status = action.stand
                        }
                        break
                    case keycode[4]:
                        _this.maxspeed = _this.D_maxspeed / 2
                        _this.accl = _this.D_accl / 2
                        break
                }
                return false
            }
        }
        // let count:number = 0
        setInterval(() => {
            if (keydown.length && this.mario_status != 4) {
                if (this.mario_status == 0) {
                    this.animition.status = action.run
                    this.mario_status = 1
                }
                if (keydown[0] != this.mario_way) {
                    if (this.mvspeed - this.accl * 2 > 0) {   //当刹车时给予两倍的减速度
                        this.mvspeed -= this.accl * 2
                        if (this.mario_status != action.jump) {
                            this.mario_status = action.stop;
                            if (this.animition.animistatus != action.stop) {     //给予刹车动画
                                this.animition.status = action.stop
                            }
                        }
                    } else {                                  /* 当惯性消失后再改变方向 */
                        this.mario_way = keydown[0]
                        this.animition.turn()
                        if (this.mario_status == action.stop) {
                            this.mario_status = action.stand
                        }
                    }
                } else {
                    if (this.mvspeed < this.maxspeed) {
                        this.mvspeed += this.accl
                    } else {
                        this.mvspeed = this.maxspeed
                    }
                }
            } else {
                if (this.mvspeed - this.accl > 0) {
                    this.mvspeed -= this.accl
                } else {
                    this.mvspeed = 0
                    if (keydown.length == 0 && this.mario_status == action.stand) {
                        this.animition.status = action.stand
                    }
                }
                if (this.mario_status == action.run) {
                    this.mario_status = action.stand
                }
            }
            if (this.mario_status == action.down && this.animition.animistatus != action.down) {
                this.animition.status = action.down
            }
            //根据惯性的方向设置x
            if (this.mario_way == 0) {
                this.x >= this.mvspeed ? this.x -= this.mvspeed : this.x = 0
            } else {
                this.x < this.canvas_w ? this.x += this.mvspeed : this.x = this.canvas_w
            }
            if (!this.Scenes.hasblock(this.x,this.x + this.mario_w,this.y +this.mario_h) && (this.mario_status != action.jump)) {
                this.y += 8
                if(this.y >= this.canvas_h) {
                    this.y = 200
                    // alert("game over");
                }
            }

            this.update()
        }, 1000 / 60)
        this.animition.status = action.stand
    }
    jump() {
        if (this.mario_status == action.jump) return
        this.mario_status = action.jump
        this.animition.status = action.jump
        this.jumpspeed = this.jumpmaxspeed / 2
        let maxHeight = this.y - this.jumpHeight;
        let jumpstatus = 0

        var inter = setInterval(() => {
            if(this.mario_status != action.jump && jumpstatus == 0){
                jumpstatus = 1
                this.jumpspeed = 0
                this.mario_status = action.jump
                this.animition.status = action.stop
            }
            if (this.jumpspeed > 0) {
                this.jumpspeed + this.jumpaccl < this.jumpmaxspeed ? this.jumpspeed += this.jumpaccl : this.jumpspeed = this.jumpmaxspeed;
            } else {
                this.jumpspeed += this.jumpaccl;
            }
            if (jumpstatus == 0) {
                if (this.y >= maxHeight - this.jumpspeed) {
                    this.y -= this.jumpspeed
                } else {
                    jumpstatus = 1
                    this.jumpspeed = this.jumpmaxspeed / 2
                    this.animition.status = action.stop
                }
            } else {
                if (!this.Scenes.hasblock(this.x,this.x + this.mario_w,this.y +this.mario_h)) {
                    this.y += this.jumpspeed
                    if(this.y >= this.canvas_h) {
                        alert("game over");
                        this.y = this.canvas_h - this.mario_h
                    }
                } else {
                    jumpstatus = 0
                    this.jumpspeed = 0
                    this.mario_status = action.stand
                    this.animition.status = action.stand
                    // this.y = this.canvas_h - this.mario_h;
                    clearInterval(inter)
                }
            }
        }, 1000 / 60)

    }
    update(count?: number) {
        //马里奥对象
        this.canvas.clearRect(0, 0, this.canvas_w, this.canvas_h)
        this.canvas.drawImage(this.ScenesElement,0,0,this.canvas_w,this.canvas_h,0,0,this.canvas_w,this.canvas_h)
        this.canvas.drawImage(this.animition.object, this.x, this.y, this.mario_w, this.mario_h)
    }
}

interface _animition {
    fps: number,
    pos: Array<Array<number>>,
    name?: string
}

class mario {
    w: number = 230
    h: number = this.w * 1.3
    img: HTMLImageElement
    canvas: CanvasRenderingContext2D
    object: HTMLCanvasElement
    animitions: Array<_animition> = [
        {
            name: "stand",
            fps: 20,
            pos: [
                [0, 65],
                [230, 65]
            ]
        },
        {
            name: "run",
            fps: 12,
            pos: [
                [720, 65],
                [980, 65],
            ]
        },
        {
            name: "stop",
            fps: 60,
            pos: [
                [1527, 65]
            ]
        },
        {
            name: "jump",
            fps: 30,
            pos: [
                [1255, 65]
            ]
        },
        {
            name: "down",
            fps: 60,
            pos: [
                [1427, 1085]
            ]
        }
    ]
    animistatus: action = -1
    inter: any
    lock: boolean = false
    constructor() {
        const ele = document.createElement("canvas")
        ele.width = this.w
        ele.height = this.h
        // const ele = document.getElementById("canvas") as HTMLCanvasElement
        this.object = ele
        this.canvas = ele.getContext("2d") as CanvasRenderingContext2D
        this.img = document.getElementById("mario") as HTMLImageElement
        this.status = 0
        // document.body.appendChild(ele)
        /* 测试动画方块 */
        //testanimi
        // let ele2 = document.createElement("canvas")
        // document.body.appendChild(ele2)
        // ele2.style.outline = "1px solid black"
        // ele2.width = 115
        // ele2.height = ele2.width * 1.3 * 5
        // let can = ele2.getContext("2d") as CanvasRenderingContext2D
        // let pos = this.animitions[action.down].pos
        // can.moveTo(ele2.width / 2, 0)
        // can.lineTo(ele2.width / 2, ele2.height)
        // can.closePath();
        // can.stroke();
        // for (let i = 0; i < pos.length; ++i) {
        //     can.drawImage(this.img, pos[i][0], pos[i][1], this.w, this.h, 0, i * ele2.width * 1.3, ele2.width, ele2.width * 1.3)
        //     can.moveTo(0, (i + 1) * ele2.width * 1.3)
        //     can.lineTo(ele2.width, (i + 1) * ele2.width * 1.3)
        //     can.closePath();
        //     can.stroke();
        // }
    }
    turn() {
        this.canvas.translate(this.w, 0)
        this.canvas.scale(-1, 1)
    }
    public get status(): action {
        return this.animistatus
    }
    public set status(v: action) {
        if (v === this.animistatus || this.lock) return
        this.animistatus = v;
        this.animition(this.animitions[v])
    }
    animition(animi: _animition) {
        clearInterval(this.inter)
        const _this = this
        let count: number = 0
        function runthis() {
            _this.canvas.clearRect(0, 0, 300, 300)
            _this.canvas.drawImage(_this.img, animi.pos[count % animi.pos.length][0], animi.pos[count % animi.pos.length][1], _this.w, _this.h,
                0, 0, _this.w, _this.h)
            count++
            count %= animi.fps
        }
        runthis()
        this.inter = setInterval(runthis, 1000 / 60 * animi.fps)
    }
}

