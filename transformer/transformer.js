import { Vec2 } from "./Vec2.js";
import {
    computeMatrixByPos,
    getMatrix2,
    getScaleRotate,
    multiVec,
} from "./util.js";
export class Transformer {
    /**
     *
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.rotateDegree = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.tx = 0;
        this.ty = 0;
        this.matrix = [1, 0, 0, 1, 0, 0];
        this.init();
    }

    createElement() {
        this.root = document.createElement("div");
        this.ctrlL = document.createElement("div");
        this.ctrlR = document.createElement("div");
        this.ctrlT = document.createElement("div");
        this.ctrlB = document.createElement("div");
        this.ctrlLT = document.createElement("div");
        this.ctrlRT = document.createElement("div");
        this.ctrlLB = document.createElement("div");
        this.ctrlRB = document.createElement("div");
        this.rotate = document.createElement("div");
        this.root.style.cssText = "position: absolute";
        this.ctrlL.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;left: 0; top: 50%; transform: translate(-50%, -50%)`;
        this.ctrlR.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;right: 0; top: 50%; transform: translate(50%, -50%)`;
        this.ctrlT.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;left: 50%; top: 0; transform: translate(-50%, -50%)`;
        this.ctrlB.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px;left: 50%; bottom: 0; transform: translate(-50%, 50%)`;
        this.rotate.style.cssText = `position: absolute; background: #0f6; width: 10px; height: 10px; border-radius: 50%; left: 50%; top: -25px; transform: translate(-50%, 0)`;
        this.ctrlLT.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px; left: 0; top: 0; transform: translate(-50%, -50%)`;
        this.ctrlRT.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px; right: 0; top: 0; transform: translate(50%, -50%)`;
        this.ctrlLB.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px; left: 0; bottom: 0; transform: translate(-50%, 50%)`;
        this.ctrlRB.style.cssText = `position: absolute; background: #f60; width: 10px; height: 10px; right: 0; bottom: 0; transform: translate(50%, 50%)`;
        this.root.style.width = this.element.offsetWidth + "px";
        this.root.style.height = this.element.offsetHeight + "px";
        this.root.appendChild(this.ctrlL);
        this.root.appendChild(this.ctrlR);
        this.root.appendChild(this.ctrlT);
        this.root.appendChild(this.ctrlB);
        this.root.appendChild(this.ctrlLT);
        this.root.appendChild(this.ctrlRT);
        this.root.appendChild(this.ctrlLB);
        this.root.appendChild(this.ctrlRB);
        this.root.appendChild(this.rotate);
        this.root.style.transform = "translate(0, 0) rotate(0) scale(1, 1)";
        this.element.parentElement.appendChild(this.root);
    }

    init() {
        this.createElement();
        this.position = this.getPosition(this.element);
        this.addEvent();
    }

    /**
     *
     * @param {HTMLElement} element
     */
    getPosition(element) {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        return [
            [-width / 2, -height / 2],
            [width / 2, -height / 2],
            [width / 2, height / 2],
            [-width / 2, height / 2],
        ];
    }

    setMatrix(matrix) {
        if (!matrix) {
            throw new Error("invalid matrix");
        }
        let params;
        [this.matrix, params] = matrix;
        this.element.style.transform = `matrix(${this.matrix.join(",")})`;
        const sx = params[2];
        const sy = params[3];
        this.root.style.width = this.width * sx + "px";
        this.root.style.height = this.height * sy + "px";
        const correctX = (this.width * (sx - 1)) / 2;
        const correntY = (this.height * (sy - 1)) / 2;
        this.root.style.transform = `translate(${params[0] - correctX}px, ${
            params[1] - correntY
        }px) rotate(${params[4]}deg)`;
    }

    addEvent() {
        this.addMoveEvent(this.root);
        this.addRotateEvent(this.rotate, this.element);
        this.addScaleEvent(this.ctrlL, this.element, (currentPos, vecH) => {
            currentPos[0][0] += vecH.x;
            currentPos[3][0] += vecH.x;
            currentPos[0][1] += vecH.y;
            currentPos[3][1] += vecH.y;
            return computeMatrixByPos(currentPos, this.position);
        });
        this.addScaleEvent(this.ctrlR, this.element, (currentPos, vecH) => {
            currentPos[1][0] += vecH.x;
            currentPos[1][1] += vecH.y;

            currentPos[2][0] += vecH.x;
            currentPos[2][1] += vecH.y;
            return computeMatrixByPos(currentPos, this.position);
        });
        this.addScaleEvent(
            this.ctrlT,
            this.element,
            (currentPos, vecH, vecV) => {
                currentPos[0][0] += vecV.x;
                currentPos[0][1] += vecV.y;
                currentPos[1][0] += vecV.x;
                currentPos[1][1] += vecV.y;
                return computeMatrixByPos(currentPos, this.position);
            }
        );
        this.addScaleEvent(
            this.ctrlB,
            this.element,
            (currentPos, vecH, vecV) => {
                currentPos[2][0] += vecV.x;
                currentPos[2][1] += vecV.y;
                currentPos[3][0] += vecV.x;
                currentPos[3][1] += vecV.y;
                return computeMatrixByPos(currentPos, this.position);
            }
        );
        this.addScaleEvent(
            this.ctrlLT,
            this.element,
            (currentPos, vecH, vecV) => {
                currentPos[0][0] += vecH.x + vecV.x;
                currentPos[0][1] += vecH.y + vecV.y;
                currentPos[1][0] += vecV.x;
                currentPos[1][1] += vecV.y;
                currentPos[3][0] += vecH.x;
                currentPos[3][1] += vecH.y;
                return computeMatrixByPos(currentPos, this.position);
            }
        );
        this.addScaleEvent(
            this.ctrlRT,
            this.element,
            (currentPos, vecH, vecV) => {
                currentPos[1][0] += vecH.x + vecV.x;
                currentPos[1][1] += vecH.y + vecV.y;
                currentPos[0][0] += vecV.x;
                currentPos[0][1] += vecV.y;
                currentPos[2][0] += vecH.x;
                currentPos[2][1] += vecH.y;
                return computeMatrixByPos(currentPos, this.position);
            }
        );
        this.addScaleEvent(
            this.ctrlLB,
            this.element,
            (currentPos, vecH, vecV) => {
                currentPos[3][0] += vecH.x + vecV.x;
                currentPos[3][1] += vecH.y + vecV.y;
                currentPos[2][0] += vecV.x;
                currentPos[2][1] += vecV.y;
                currentPos[0][0] += vecH.x;
                currentPos[0][1] += vecH.y;
                return computeMatrixByPos(currentPos, this.position);
            }
        );
        this.addScaleEvent(
            this.ctrlRB,
            this.element,
            (currentPos, vecH, vecV) => {
                currentPos[2][0] += vecH.x + vecV.x;
                currentPos[2][1] += vecH.y + vecV.y;
                currentPos[3][0] += vecV.x;
                currentPos[3][1] += vecV.y;
                currentPos[1][0] += vecH.x;
                currentPos[1][1] += vecH.y;
                return computeMatrixByPos(currentPos, this.position);
            }
        );
    }

    addMoveEvent(ele) {
        ele.onmousedown = (e) => {
            const initX = this.tx;
            const initY = this.ty;
            const prevMatrix = [...this.matrix];
            document.onmousemove = (ev) => {
                // 求得鼠标移动得向量
                const vec = new Vec2(
                    ev.clientX - e.clientX,
                    ev.clientY - e.clientY
                );
                const currentPos = this.computePos(prevMatrix);
                for (let k of currentPos) {
                    k[0] += vec.x;
                    k[1] += vec.y;
                }
                const matrix = computeMatrixByPos(currentPos, this.position);
                this.setMatrix(matrix);
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    /**
     *
     * @param {HTMLElement} ele
     * @param {HTMLElement}
     */
    addRotateEvent(ele, target) {
        ele.onmousedown = (e) => {
            e.stopPropagation();
            const rotate = this.rotateDegree;
            const prevMatrix = [...this.matrix];
            const newPos = this.computePos(prevMatrix);
            const center = new Vec2(
                (newPos[0][0] + newPos[2][0]) / 2 +
                    (this.position[1][0] - this.position[0][0]) / 2,
                (newPos[0][1] + newPos[2][1]) / 2 +
                    (this.position[3][1] - this.position[0][1]) / 2
            );
            const [rotateDegree, sx, sy, tx, ty] = getScaleRotate(prevMatrix);
            const vec = new Vec2(e.clientX, e.clientY).sub(center).normalize();
            document.onmousemove = (ev) => {
                const moveV = new Vec2(ev.clientX, ev.clientY)
                    .sub(center)
                    .normalize();
                const cos = vec.dot(moveV);
                let theta = (Math.acos(cos) * 180) / Math.PI;
                const cross = moveV.cross(vec);
                if (cross > 0) {
                    theta = 360 - theta;
                }
                theta = Math.floor(theta);
                this.rotateDegree = (rotate + theta) % 360;

                const newMatrix = getMatrix2(tx, ty, sx, sy, this.rotateDegree);
                this.setMatrix([
                    newMatrix,
                    [tx, ty, sx, sy, this.rotateDegree],
                ]);
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    /**
     *
     * @param {HTMLElement} ele
     * @param {HTMLElement} target
     * @param {Function} callback
     */
    addScaleEvent(ele, target, callback) {
        ele.onmousedown = (e) => {
            e.stopPropagation();
            const directVector = new Vec2(1, 0)
                .rotate(this.rotateDegree)
                .normalize();
            const matrix = [...this.matrix];
            document.onmousemove = (ev) => {
                const vec = new Vec2(
                    ev.clientX - e.clientX,
                    ev.clientY - e.clientY
                );

                const directionVecH = new Vec2(1, 0)
                    .rotate(this.rotateDegree)
                    .normalize();
                const directionVecV = new Vec2(0, 1)
                    .rotate(this.rotateDegree)
                    .normalize();
                let vecH = directionVecH.scalarMulti(directionVecH.dot(vec));
                let vecV = directionVecV.scalarMulti(directionVecH.cross(vec));
                const currentPos = this.computePos(matrix);
                const h = Math.hypot(
                    currentPos[0][0] - currentPos[1][0],
                    currentPos[0][1] - currentPos[1][1]
                );
                const v = Math.hypot(
                    currentPos[0][0] - currentPos[3][0],
                    currentPos[0][1] - currentPos[3][1]
                );
                const newMatrix = callback(currentPos, vecH, vecV);
                this.setMatrix(newMatrix);
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    computePos(matrix) {
        const _matrix = [
            matrix[0],
            matrix[2],
            matrix[4],
            matrix[1],
            matrix[3],
            matrix[5],
            0,
            0,
            1,
        ];
        const obj = [];

        for (let k of this.position) {
            const res = multiVec(_matrix, [k[0], k[1], 1]);
            obj.push([res[0], res[1]]);
        }
        return obj;
    }
}
