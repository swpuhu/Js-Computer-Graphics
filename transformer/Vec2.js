export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     *
     * @param {Vec2} v
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    /**
     *
     * @param {Vec2} v
     */
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    scalarMulti(v) {
        return new Vec2(this.x * v, this.y * v);
    }

    /**
     *
     * @param {Vec2} v
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     *
     * @param {Vec2} v
     */
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    normalize() {
        const length = Math.hypot(this.x, this.y);
        this.x /= length;
        this.y /= length;
        return this;
    }

    rotate(degree) {
        const radian = (degree * Math.PI) / 180;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }
}
