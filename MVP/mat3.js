export class Matrix3 {
    /**
     *
     * @param {number} size
     * @param {number[]} matrix
     */
    constructor(matrix) {
        this.size = 3;
        if (matrix) {
            if (this.size ** 2 !== matrix.length) {
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
                [
                    this.matrix[y * this.size + x],
                    this.matrix[x * this.size + y],
                ] = [
                    this.matrix[x * this.size + y],
                    this.matrix[y * this.size + x],
                ];
            }
        }
        return this;
    }

    /**
     *
     * @param {Matrix3} m1
     * @param {Matrix3} m2
     */
    multiple(m2) {
        if (this.size !== m2.size) {
            throw new Error("matrix's size must be same!");
        }
        let res = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let sum = 0;
                for (let k = 0; k < this.size; k++) {
                    sum +=
                        this.matrix[y * this.size + k] *
                        m2.matrix[k * this.size + x];
                }
                res.push(sum);
            }
        }
        return new Matrix3(res);
    }

    /**
     *
     * @param {number[]} v
     */
    multiVec(v) {
        if (v.length !== this.size) {
            throw new Error(
                "vector's dimension must be same with matrix!, this matrix dimension is " +
                    this.size
            );
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

    copy() {
        const newMatrix = new Matrix3();
        newMatrix.matrix = [...this.matrix];
        return newMatrix;
    }

    createMat3(tx, ty, sx, sy, rotate) {
        const cos = Math.cos((rotate * Math.PI) / 180);
        const sin = Math.sin((rotate * Math.PI) / 180);
        const a = cos * sx;
        const b = sin * sx;
        const c = -sin * sy;
        const d = cos * sy;
        this.matrix = [a, c, tx, b, d, ty, 0, 0, 1];
        return this;
    }

    createRotateMat3(rotate) {
        const cos = Math.cos((rotate * Math.PI) / 180);
        const sin = Math.sin((rotate * Math.PI) / 180);
        this.matrix = [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
        return this;
    }

    createTranslateMat3(tx, ty) {
        this.matrix = [1, 0, tx, 0, 1, ty, 0, 0, 1];
        return this;
    }

    createScaleMat3(sx, sy) {
        this.matrix = [sx, 0, 0, 0, sy, 0, 0, 0, 1];
        return this;
    }

    _getMat3Determinate(m) {
        return (
            m[0] * (m[4] * m[8] - m[5] * m[7]) -
            m[1] * (m[3] * m[8] - m[5] * m[6]) +
            m[2] * (m[3] * m[7] - m[4] * m[6])
        );
    }

    inverse() {
        const m = this.matrix;
        const a = m[0 * 3 + 0];
        const b = m[0 * 3 + 1];
        const c = m[0 * 3 + 2];
        const d = m[1 * 3 + 0];
        const e = m[1 * 3 + 1];
        const f = m[1 * 3 + 2];
        const g = m[2 * 3 + 0];
        const h = m[2 * 3 + 1];
        const i = m[2 * 3 + 2];

        const aStart = [
            e * i - f * h,
            c * h - b * i,
            b * f - c * e,
            f * g - d * i,
            a * i - c * g,
            c * d - a * f,
            d * h - e * g,
            b * g - a * h,
            a * e - b * d,
        ];

        const det = this._getMat3Determinate(aStart);
        this.matrix = aStart.map((item) => item / det);
        return this;
    }
}
