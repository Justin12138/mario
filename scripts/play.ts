
enum keycode {
    KeyA = 0,
    KeyD,
    Space
}

class Player {
    canvas_w: number = 600
    canvas_h: number = 300
    canvas: CanvasRenderingContext2D
    mario: mario //马里奥对象
    mario_w: number = 100
    mario_h: number = this.mario_w * 1.3 //主角的大小
    mario_way: number = 0
    mario_status: number = 0
    x: number = this.canvas_w / 2
    y: number = this.canvas_h - this.mario_h //初始坐标
    mvspeed: number = 0
    maxspeed: number = 8
    accl: number = 0.2
    turn:boolean = false
    constructor(ele: string, img: string) {
        const canvas = document.getElementById(ele) as HTMLCanvasElement
        canvas.width = this.canvas_w
        canvas.height = this.canvas_h
        this.canvas = canvas.getContext("2d") as CanvasRenderingContext2D
        this.mario = new mario()
    }
    start() {
        let _this = this
        let keydown: Array<number> = []
        document.onkeydown = function (e) {
            let key: string = (e as KeyboardEvent).code
            switch (key) {
                case keycode[0]:
                    if (keydown.indexOf(keycode.KeyA) == -1) {
                        keydown.unshift(keycode.KeyA)
                        // if(_this.turn){
                        //     // _this.mario.turn()
                        //     _this.turn = false
                        // }
                    }
                    break
                case keycode[1]:
                    if (keydown.indexOf(keycode.KeyD) == -1) {
                        keydown.unshift(keycode.KeyD)
                        // if(!_this.turn){
                        //     // _this.mario.turn()
                        //     _this.turn = true
                        // }
                    }
                    break
                case keycode[2]:
                    // keydown.add(keycode.Space)
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
                    // keydown.add(keycode.Space)
                    break
            }
        }
        let count = 0
        setInterval(() => {

            if (keydown.length) {
                if(this.mario_status == 0){
                    this.mario.run()
                    this.mario_status = 1
                }
                if(keydown[0] != this.mario_way){
                    // if(this.turn != Boolean(keydown[0])){   
                    //     this.mario.turn()
                    //     this.turn = !this.turn
                    // }
                    if(this.mvspeed - this.accl * 2 > 0){   //当刹车时给予两倍的减速度
                        this.mario_status = 0
                        this.mvspeed -= this.accl * 2
                    }else{                                  /* 当惯性消失后再改变方向 */
                        this.mario_way = keydown[0]
                        _this.mario.turn()
                    }
                }
            } else {
                this.mario_status = 0
            }
            //如在行进中给予加速度
            if (this.mario_status) {
                if (this.mvspeed < this.maxspeed) {
                    this.mvspeed += this.accl
                }else{
                    this.mvspeed = this.maxspeed
                }
            } else if(this.mvspeed){
                if(this.mvspeed - this.accl > 0){
                    this.mvspeed -= this.accl
                } else {
                    this.mvspeed = 0
                    if(keydown.length == 0){
                        this.mario.stand()
                    }
                }
            }
            //根据惯性的方向设置x
            if (this.mario_way == 0) {
                this.x >= this.mvspeed ? this.x -= this.mvspeed : this.x = 0
            } else {
                this.x < this.canvas_w ? this.x += this.mvspeed : this.x = this.canvas_w
            }



            this.update(count++)
            count %= 60
        }, 1000 / 60)
        this.mario.stand()
    }
    update(count: number) {
        //马里奥对象
        this.canvas.clearRect(0, 0, this.canvas_w, this.canvas_h)
        this.canvas.drawImage(this.mario.object, this.x, this.y, this.mario_w, this.mario_h)
    }
}

interface _animition {
    fps: number,
    pos: Array<Array<number>>
}

class mario {
    w: number = 230
    h: number = this.w * 1.3
    img: HTMLImageElement
    canvas: CanvasRenderingContext2D
    object: HTMLCanvasElement
    turned:boolean = false
    animitions = {
        stand: {
            fps: 20,
            pos: [
                [0, 65],
                [230, 65]
            ]
        },
        run:{
            fps:12,
            pos:[
                [720,65],
                [980,65],
            ]
        }
    }
    status:number = 0
    inter: any
    constructor() {
        const ele = document.createElement("canvas")
        ele.width = this.w
        ele.height = this.h
        // const ele = document.getElementById("canvas") as HTMLCanvasElement
        this.object = ele
        this.canvas = ele.getContext("2d") as CanvasRenderingContext2D
        this.img = document.getElementById("mario") as HTMLImageElement
        this.animition(this.animitions.stand)



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
    turn(){
        this.canvas.translate(this.w,0)
        this.canvas.scale(-1,1)
    }
    stand() {
        if(this.status == 0) return
        this.animition(this.animitions.stand)
        this.status = 0
    }
    run(){
        if(this.status == 1) return
        this.animition(this.animitions.run)
        this.status = 1
    }
    animition(animi: _animition) {
        console.log(animi)
        clearInterval(this.inter)
        const _this = this
        let count: number = 0
        function runthis(){
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