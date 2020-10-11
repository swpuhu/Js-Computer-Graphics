export class Triangle {
    constructor () {
        this.v = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.color = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.texCoord = [[0, 0], [0, 0], [0, 0]];
        this.normal = [];
    }

    /**
     * @description set i-th vertex coordinates
     * @param {number} ind i-th vertex
     * @param {number[]} ver coordinate
     */
    setVertex(ind, ver) {
        this.v[ind] = ver;
    }

    /**
     * @description set i-th vertex normal vector
     * @param {number} ind i-th vertex
     * @param {number[]} n normal vector
     */
    setNormal(ind, n) {
        this.n[ind] = n;
    }

    /**
     * @description set i-th vertex color
     * @param {number} ind i-th vertex
     * @param {number} r red
     * @param {number} g green
     * @param {number} b blue
     */
    setColor (ind, r, g, b) {
        if (
        (r < 0 || r > 255) ||
        (g < 0 || g > 255) ||
        (b < 0 || b > 255)) {
            throw new Error('ERROR! Invalid color values.');
        }
        this.color[ind] = [r / 255, g / 255, b / 255];
    }

    getColor () {
        return this.color[0].map(item => item * 255);
    }

    /**
     * 
     * @param {number} ind i-th vertex
     * @param {number} s texture x-coordinate
     * @param {number} t texture y-coordinate
     */
    setTexCoord(ind, s, t) {
        this.texCoord[ind] = [s, t];
    }

    toVector4() {
        const res = [];
        for (let i = 0; i < this.v.length; i++) {
            res.push(...v[i], 1);
        }
        return res;
    }
}