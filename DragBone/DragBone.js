import { Matrix3 } from "../MVP/mat3.js";

export class DragBone {
    /**
     *
     * @param {number[]} vertex
     * @param {Matrix3[]} posBones
     * @param {number[]} boneNdx
     */
    constructor(vertex, posBones, boneNdx) {
        this.vertex = vertex;
        this.posBones = posBones;
        this.boneNdx = boneNdx;
        this.bindPosInv = [];

        this.bindPos();
    }

    bindPos() {
        this.bindPosInv = this.posBones.map((item) => item.copy());
        this.bindPosInv.forEach((item) => item.inverse());
    }
}

window.Matrix3 = Matrix3;
