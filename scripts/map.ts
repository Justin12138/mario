/* 负责渲染地图和返回坐标信息 */
export class round {
    bg_width: number
    bg_height: number
    block: number/* 块大小 */
    data: Map<number, Array<Array<number>>> = new Map() /*地图信息*/
    canvas: CanvasRenderingContext2D
    element: HTMLCanvasElement
    image: HTMLImageElement
    readly: boolean = false
    blocks: Map<number, Array<number>> = new Map() /* 方块信息 */
    constructor(width: number) {
        this.bg_width = width
        this.bg_height = width / 16 * 9
        this.element = document.createElement("canvas")
        this.element.width = width
        this.element.height = this.bg_height
        this.element.style.border = "1px solid black"
        this.canvas = this.element.getContext("2d") as CanvasRenderingContext2D
        this.block = width / 40
        //写入测试的地图数据
        let index = 0
        while (index < 100) {
            this.data.set(index++, [[0, 1, 1], [21, 23, 1]])
        }

        this.data.set(10,[[],[]])
        this.data.set(11,[[],[]])
        this.data.set(12,[[],[]])
        this.data.set(13,[[],[]])
        this.data.set(14,[[],[]])
        this.image = document.getElementById("block") as HTMLImageElement;
        // document.body.appendChild(this.image)
        // document.body.appendChild(this.element)

        /* 加载地图 */
        let _this = this
        function load() {
            _this.blocks.set(0, [100, 100])
            _this.blocks.set(1, [0, 0])
            _this.bg_width = _this.data.size * _this.block
            let pos = [
                [100,100],
                [0,0],
            ]
            for(let i =0; i < _this.data.size; ++i){
                let bb = _this.data.get(i)
                if(!bb) continue;
                bb.forEach(function(dw){
                    for(let j = dw[0];j < dw[1];j++){
                        _this.canvas.drawImage(_this.image,
                            pos[dw[2]][0],
                            pos[dw[2]][1],
                            100,100,
                            i * _this.block,
                            j * _this.block,
                            _this.block,_this.block)
                    }
                })
            }
            /* for(let block of _this.data){
                _this.canvas.drawImage(_this.image,)
            } */
            _this.readly = true
        }
        load()
    }
    hasblock(xleft: number, xright: number, ybootom: number): boolean {
        xleft = Math.floor(xleft / this.block)
        xright = Math.floor(xright / this.block)
        ybootom = Math.ceil(ybootom / this.block)
        console.log(xleft,xright)
        while (xleft <= xright) {
            if (this.yis(this.data.get(xleft++), ybootom) > 0) { /* 通过方块的id判断是否可以踩 */
                return true
            }
        }
        return false
    }
    private yis(List: Array<Array<number>> | undefined, y: number): number { /* 根据坐标返回Y轴id */
        if (!List) return 0
        for (let item of List) {
            if (item[0] < y && y < item[1]) {
                return item[2]
            } else if (y < item[0]) {
                return 0
            }
        }
        return 0
    }
    update(maripX: number) {

    }
}
