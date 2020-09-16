export class Matrix {
    /**
     * 
     * @param {number} size
     * @param {number[]} matrix 
     */
    constructor(size = 4, matrix) {
        this.size = size;
        if (matrix) {
            if (size ** 2 !== matrix.length) {
                throw new Error("error size.");
            }
            this.matrix = matrix;
        } else {
            this.matrix = new Array(this.size ** 2).fill(0);
            this.identity();
        }

    }

    identity() {
        let count = 0;
        for (let i = 0; i < this.size; i++) {
            this.matrix[i * this.size + count] = 1;
            count++;
        }
        return this;
    }


    transpose() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < y; x++) {
                [this.matrix[y * this.size + x], this.matrix[x * this.size + y]] = [this.matrix[x * this.size + y], this.matrix[y * this.size + x]];
            }
        }
        return this;
    }

    /**
     * 
     * @param {Matrix} m1 
     * @param {Matrix} m2 
     */
    multiple(m2) {
        if (this.size !== m2.size) {
            throw new Error('matrix\'s size must be same!');
        }
        let res = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let sum = 0;
                for (let k = 0; k < this.size; k++) {
                    sum += this.matrix[y * this.size + k] * m2.matrix[k * this.size + x];
                }
                res.push(sum);
            }
        }
        return new Matrix(this.size, res);
    }

    /**
     * 
     * @param {number[]} v 
     */
    multiVec(v) {
        if (v.length !== this.size) {
            throw new Error('vector\'s dimension must be same with matrix!, this matrix dimension is ' + this.size);
        }
        const res = [];
        for (let y = 0; y < this.size; y++) {
            let sum = 0;
            for (let x = 0; x < this.size; x++) {
                sum += this.matrix[y * this.size + x] * v[x];
            }
            res.push(sum);
        }
        return res;
    }

    createRotateMatrix(rotate, axis) {
        let cos = Math.cos(rotate * Math.PI / 180);
        let sin = Math.sin(rotate * Math.PI / 180);
        let ret;
        switch (axis) {
            case 'x':
                ret = new Float32Array([
                    1.0, 0.0, 0.0, 0.0,
                    0.0, cos, -sin, 0.0,
                    0.0, sin, cos, 0.0,
                    0, 0, 0, 1
                ]);
                break;
            case 'y':
                ret = new Float32Array([
                    cos, 0.0, -sin, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    sin, 0.0, cos, 0.0,
                    0, 0, 0, 1
                ]);
                break;
            default:
                ret = new Float32Array([
                    cos, -sin, 0.0, 0.0,
                    sin, cos, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0, 0, 0, 1
                ]);
        }
        this.matrix = ret;
        return this;
    }

    createScaleMatrix(sx, sy, sz) {
        this.matrix = [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];
        return this;
    }

    createTranslateMatrix(tx, ty, tz) {
        this.matrix = [
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        ];
        return this;
    }


    createPerspectiveMatrix(near, far) {
        this.matrix = [
            near, 0, 0, 0,
            0, near, 0, 0,
            0, 0, near + far, -near * far,
            0, 0, 1, 0
        ];
        return this;
    }

    createOrthographMatrix(width, height, depth) {
        this.matrix = [
            2 / width, 0, 0, -1,
            0, 2 / height, 0, -1,
            0, 0, 2 / depth, -1,
            0, 0, 0, 1,
        ]
        return this;
    }

    createViewScaleMatrix (width, height, depth) {
        this.matrix = [
            width / 2, 0, 0, width / 2,
            0, height / 2, 0, height / 2,
            0, 0, depth / 2, depth / 2,
            0, 0, 0, 1
        ]
        return this;
    }
}