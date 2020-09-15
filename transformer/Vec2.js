export class Vec2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * 
     * @param {Vec2} v 
     */
    add (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    /**
     * 
     * @param {Vec2} v 
     */
    sub (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
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
    cross (v) {
        return this.x * v.y - this.y * v.x;
    }

    normalize () {
        const length = Math.hypot(this.x, this.y);
        this.x /= length;
        this.y /= length;
        return this;
    }

}