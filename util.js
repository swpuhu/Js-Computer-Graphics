export class Vec2 {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    copy () {
        return new Vec2(this.x, this.y);
    }

    /**
     * 
     * @param {Vec2} v 
     */
    addSelf (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    rotateSelf(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const {x, y} = this;
        this.x = x * c + y * -s;
        this.y = x * s + y * c;
        return this;
    }

    rotate(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const {x, y} = this;
        return new Vec2(x * c + y * -s, x * s + y * c);
    }

    scaleSelf(length) {
        this.x *= length;
        this.y *= length;
        return this;
    }

    scale(length) {
        return new Vec2(this.x * length, this.y * length);
    }

    normalizeSelf () {
        const length = Math.hypot(this.x, this.y);
        this.x /= length;
        this.y /= length;
        return this;
    }

    normalize() {
        const length = Math.hypot(this.x, this.y);
        return new Vec2(this.x / length, this.y / length);    
    }

    /**
     * 
     * @param {Vec2} vec 
     */
    dot (vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    /**
     * 
     * @param {Vec2} vec 
     */
    cross (vec) {
        return this.x * vec.y - vec.x * this.y;
    }

    get dir () {
        return Math.atan2(this.y, this.x);
    }


    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}