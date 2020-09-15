import {Vec2} from './Vec2.js'

export class Transformer {
    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor (element) {
        this.element = element;
        this.rotateDegree = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.init();
    }

    createElement () {
        this.root = document.createElement('div');
        this.ctrlL = document.createElement('div');
        this.ctrlR = document.createElement('div');
        this.ctrlT = document.createElement('div');
        this.ctrlB = document.createElement('div');
        this.rotate = document.createElement('div');
        this.ctrlL.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;left: 0; top: 50%; transform: translate(-50%, -50%)`;
        this.ctrlR.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;right: 0; top: 50%; transform: translate(50%, -50%)`;
        this.ctrlT.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;left: 50%; top: 0; transform: translate(-50%, -50%)`;
        this.ctrlB.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;left: 50%; bottom: 0; transform: translate(-50%, 50%)`;
        this.rotate.style.cssText = `position: absolute; background: #0f6; width: 10px; height: 10px; border-radius: 50%; left: 50%; top: 25%; transform: translate(-50%, 0)`;
        this.root.style.width = '100%';
        this.root.style.height = '100%';
        this.ctrlL.style.top = '50%';
        this.ctrlL.style.left = 0;
        this.root.appendChild(this.ctrlL);
        this.root.appendChild(this.ctrlR);
        this.root.appendChild(this.ctrlT);
        this.root.appendChild(this.ctrlB);
        this.root.appendChild(this.rotate);
        this.element.style.transform = 'translate(0, 0) rotate(0) scale(1, 1)';
        this.element.appendChild(this.root);
    }

    init () {
        this.createElement();
        this.addMoveEvent(this.root);
        this.addRotateEvent(this.rotate, this.element);
    }

    addMoveEvent (ele) {
        ele.onmousedown = (e) => {
            const initX = this.element.offsetLeft;
            const initY = this.element.offsetTop;
            document.onmousemove = (ev) => {
                // 求得鼠标移动得向量
                const vec = new Vec2(ev.clientX - e.clientX, ev.clientY - e.clientY);
                this.element.style.left = initX + vec.x + 'px';
                this.element.style.top = initY + vec.y + 'px';
            }
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} ele
     * @param {HTMLElement} 
     */
    addRotateEvent (ele, target) {
        ele.onmousedown = (e) => {
            e.stopPropagation();
            const rotate = this.rotateDegree;
            const center = new Vec2(
                target.offsetLeft + target.offsetWidth / 2, 
                target.offsetTop + target.offsetHeight / 2, 
            )
            const vec = new Vec2(e.clientX, e.clientY).sub(center).normalize();
            document.onmousemove = (ev) => {
                const moveV = new Vec2(ev.clientX, ev.clientY).sub(center).normalize();
                const cos = vec.dot(moveV);
                let theta =  Math.acos(cos) * 180 / Math.PI;
                const cross = moveV.cross(vec);
                if (cross > 0) {
                    theta = 360 - theta;
                }
                theta = Math.floor(theta);
                this.rotateDegree = (rotate + theta) % 360;
                target.style.transform = `rotate(${this.rotateDegree}deg)`;

            }
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }

}