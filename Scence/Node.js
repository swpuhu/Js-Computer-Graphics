import { Matrix } from "../MVP/mat4.js";
import { Vec2 } from "../transformer/Vec2.js";
export class Node {
    constructor() {
        this.children = [];
        this.parent = null;
        this.worldMatrix = new Matrix(3);
        this.localMatrix = new Matrix(3);
    }

    setParent(parent) {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
        }
        this.parent = parent;
        parent.addChildlren(this);
    }

    /**
     *
     * @param {Matrix} parentMatrix
     */
    updateMatrix(parentMatrix) {
        if (parentMatrix) {
            this.worldMatrix = parentMatrix.multiple(this.localMatrix);
        } else {
            this.worldMatrix = this.localMatrix.copy();
        }
        const worldMatrix = this.worldMatrix;
        this.children.forEach((child) => {
            child.updateMatrix(worldMatrix);
        });
    }

    addChildlren(...children) {
        this.children.push(...children);
    }
}

export class Sun extends Node {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        let start = [-this.radius / 2, -this.radius / 2, 1];
        ctx.transform(
            this.worldMatrix.matrix[0],
            this.worldMatrix.matrix[3],
            this.worldMatrix.matrix[1],
            this.worldMatrix.matrix[4],
            this.worldMatrix.matrix[2],
            this.worldMatrix.matrix[5]
        );
        ctx.fillStyle = "#f60";
        ctx.fillRect(start[0], start[1], this.radius, this.radius);
        ctx.resetTransform();
    }
}

export class Earth extends Node {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        let start = [-this.radius / 2, -this.radius / 2, 1];
        ctx.transform(
            this.worldMatrix.matrix[0],
            this.worldMatrix.matrix[3],
            this.worldMatrix.matrix[1],
            this.worldMatrix.matrix[4],
            this.worldMatrix.matrix[2],
            this.worldMatrix.matrix[5]
        );
        ctx.fillStyle = "#06f";
        ctx.fillRect(start[0], start[1], this.radius, this.radius);
        ctx.resetTransform();
    }
}

export class Moon extends Node {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        let start = [-this.radius / 2, -this.radius / 2, 1];
        ctx.transform(
            this.worldMatrix.matrix[0],
            this.worldMatrix.matrix[3],
            this.worldMatrix.matrix[1],
            this.worldMatrix.matrix[4],
            this.worldMatrix.matrix[2],
            this.worldMatrix.matrix[5]
        );
        ctx.fillStyle = "#0f6";
        ctx.fillRect(start[0], start[1], this.radius, this.radius);
        ctx.resetTransform();
    }
}
