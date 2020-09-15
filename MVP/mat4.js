
class Matrix {
    /**
     * 
     * @param {number} size
     * @param {number[]} matrix 
     */
    constructor(size, matrix) {
        if (size ** 2 !== matrix.length) {
            throw new Error("error size.");
        }
        this.size = size;
        this.matrix = matrix;
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
}

const arr1 = [];
const arr2 = [];
for (let i = 0; i < 16; i++) {
    arr1.push(i);
    arr2.push(i);
}

const m = new Matrix(3, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
const vector = [1, 2, 3];

m.multiVec(vector);
console.log(m);