import {Matrix} from '../MVP/mat4.js';
import {Triangle} from './Triangle.js';
import {Vec2} from '../util/Vec.js';
export const Enum_Buffers = {
    colorBuffer: 1,
    depthBuffer: 2
}

export const PrimitiveType = {
    TRIANGLE: Symbol('Triangle')
}

export class Rasterizer {
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor (ctx) {
        this._width = ctx.canvas.width;
        this._height = ctx.canvas.height;
        this._nextId = 0;
        this._posBuf = {};
        this._indBuf = {};
        this._colBuf = {};
        this._model = new Matrix(4);
        this._view = new Matrix(4);
        this._projection = new Matrix(4);
        this._frameBuf = new Array(700 * 700);
        for (let i = 0; i < this._frameBuf.length; i++) {
            this._frameBuf[i] = [0, 0, 0];
        }
        this._depthBuf = [];
    }

    getNextId () {
        return this._nextId++;
    }

    /**
     * 
     * @param {number[][]} positions 
     */
    loadPositions (positions) {
        const id = this.getNextId();
        this._posBuf[id] = positions;
        return id;
    }

    /**
     * 
     * @param {number[][]} indices 
     */
    loadIndices(indices) {
        const id = this.getNextId();
        this._indBuf[id] = indices;
        return id;
    }

    /**
     * 
     * @param {number[][]} colors 
     */
    loadColors(colors) {
        const id = this.getNextId();
        this._colBuf[id] = colors;
        return id;
    }

    /**
     * 
     * @param {number[]} v 
     * @param {number} w 
     */
    toVec4(v, w = 1) {
        return [...v, w];
    }   

    insideTriangle(x, y, v) {
        const [p1, p2, p3] = v;
        const v1 = new Vec2(p2[0] - p1[0], p2[1] - p1[1]);
        const v2 = new Vec2(p3[0] - p2[0], p3[1] - p2[1]);
        const v3 = new Vec2(p1[0] - p3[0], p1[1] - p3[1]);
        const pv1 = new Vec2(x - p1[0], y - p1[1]);
        const pv2 = new Vec2(x - p2[0], y - p2[1]);
        const pv3 = new Vec2(x - p3[0], y - p3[1]);
        const c1 = v1.cross(pv1);
        const c2 = v2.cross(pv2);
        const c3 = v3.cross(pv3);
        return (c1 >= 0 && c2 >= 0 && c3 >= 0) || (c1 <= 0 && c2 <= 0 && c3 <= 0);

    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number[][]} v 
     */
    computeBaryCentric2D(x, y, v) {

    }

    /**
     * 
     * @param {number} posBuffer 
     * @param {number} indBuffer 
     * @param {number} colBuffer 
     * @param {keyof PrimitiveType} type 
     */
    draw (posBuffer, indBuffer, colBuffer, type) {
        const buf = this._posBuf[posBuffer];
        const ind = this._indBuf[indBuffer];
        const col = this._colBuf[colBuffer];

        const f1 = (50 - 0.1) / 2.0;
        const f2 = (50 + 0.1) / 2.0;
        const mvp = this._projection.multiple(this._view).multiple(this._model);

        for (let index of ind) {
            const t = new Triangle();
            const v = [
                mvp.multiVec([...buf[index[0]], 1]),
                mvp.multiVec([...buf[index[1]], 1]),
                mvp.multiVec([...buf[index[2]], 1]),
            ];

            for (let vec of v) {
                for (let i = 0; i < vec.length; i++) {
                    vec[i] /= vec[3];
                }
            }

            for (let vert of v) {
                vert[0] = 0.5 * this._width * (vert[0] + 1.);
                vert[1] = 0.5 * this._height * (vert[1] + 1.);
                vert[2] = vert[2] * f1 + f2;
            }

            t.setVertex(0, v[0]);
            t.setVertex(1, v[1]);
            t.setVertex(2, v[2]);

            t.setColor(0, col[0][0], col[0][1], col[0][2]);
            t.setColor(0, col[1][0], col[1][1], col[1][2]);
            t.setColor(0, col[2][0], col[2][1], col[2][2]);

            this._rasterizeTriangle(t);
        }
    }


    /**
     * @param {Matrix} m
     */
    setModel (m) {
        this._model = m;
    }


    /**
     * 
     * @param {Matrix} v 
     */
    setView (v) {
        this._view = v;
    }


    /**
     * 
     * @param {Matrix} p
     */
    setProjection (p) {
        this._projection = p;
    }

    /**
     * 
     * @param {number[]} point 
     * @param {number[]} color 
     */
    setPixel(point, color) {
        let ind = (this._height - 1 - point[1]) * this._width + point[0];
        this._frameBuf[ind] = color;
    }

    clear (buff) {
        if (buff & Enum_Buffers.colorBuffer === Enum_Buffers.colorBuffer) {
            for (let i = 0; i < this._frameBuf.length; i++) {
                this._frameBuf[i] = [0, 0, 0];
            }
        }
        if (buff & Enum_Buffers.depthBuffer === Enum_Buffers.depthBuffer) {
            this._depthBuf.fill(Infinity);
        }
    }

    getFramebuffer() {
        let res = new ImageData(this._width, this._height);
        for (let i = 0; i < this._frameBuf.length; i++) {
            const data = this._frameBuf[i];
            res.data[i * 4] = data[0];
            res.data[i * 4 + 1] = data[1];
            res.data[i * 4 + 2] = data[2];
            res.data[i * 4 + 3] = 255;
        }
        return res;
    }



    /**
     * 
     * @param {number[]} begin 
     * @param {number[]} end 
     */
    _drawLine (begin, end) {

    }

    /**
     * 
     * @param {Triangle} t 
     */
    _rasterizeTriangle(t) {
        const p1 = t.v[0];
        const p2 = t.v[1];
        const p3 = t.v[2];

        let xMin, xMax, yMin, yMax;
        xMin = xMax = p1[0];
        yMin = yMax = p1[1];

        for (let i = 0; i < 3; i++) {
            if (t.v[i][0] < xMin) {
                xMin = t.v[i][0];
            }

            if (t.v[i][0] > xMax) {
                xMax = t.v[i][0];
            }

            if (t.v[i][1] < yMin) {
                yMin = t.v[i][1];
            }

            if (t.v[i][1] > yMax) {
                yMax = t.v[i][1];
            }
        }

        xMin = Math.floor(xMin);
        xMax = Math.floor(xMax);
        yMin = Math.floor(yMin);
        yMax = Math.floor(yMax);

        for (let y = yMin; y <= yMax; y++) {
            for (let x = xMin; x <= xMax; x++) {
                if (this.insideTriangle(x, y, t.v)) {
                    const color = t.getColor();
                    this.setPixel([x, y, 1], color);
                }
            }
        }
    }
}