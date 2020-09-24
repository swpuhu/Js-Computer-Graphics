export class PrimitiveTriangle {
    /**
     * 
     * @param {number[]} points 
     */
    constructor (...points) {
        this.points = points;
    }

    [Symbol.iterator]() {
        let index = 0;
        const that = this;
        return {
            next () {
                if (index > 5) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                const ret = [that.points[index], that.points[index + 1]];
                index += 2;
                return {
                    value: ret,
                    done: false
                }
            }
        }
    }
}
