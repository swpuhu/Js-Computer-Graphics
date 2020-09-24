export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    [Symbol.iterator] () {
        const that = this;
        let index = 0;
        return {
            next () {
                if (index === 0) {
                    ++index;
                    return {
                        value: that.x,
                        done: false
                    }
                } else if (index === 1) {
                    ++index;
                    return {
                        value: that.y,
                        done: false
                    }
                }
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    }

    /**
     * 
     * @param {Vec2} v 
     */
    add (v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    /**
     * 
     * @param {Vec2} v 
     */
    sub (v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    /**
     * 
     * @param {Vec2} v 
     */
    cross (v) {
        return this.x * v.y - v.x * this.y;
    }

    /**
     * 
     * @param {Vec2} v 
     */
    dot (v) {
        return this.x * v.x + this.y * v.y;
    }

}
