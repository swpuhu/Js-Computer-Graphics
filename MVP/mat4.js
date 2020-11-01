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
     * @param {Matrix} m1
     * @param {Matrix} m2
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
        return new Matrix(this.size, res);
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
        const newMatrix = new Matrix(this.size);
        newMatrix.matrix = [...this.matrix];
        return newMatrix;
    }

    createRotateMatrix(rotate, axis) {
        let cos = Math.cos((rotate * Math.PI) / 180);
        let sin = Math.sin((rotate * Math.PI) / 180);
        let ret;
        switch (axis) {
            case "x":
                ret = new Float32Array([
                    1.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    cos,
                    -sin,
                    0.0,
                    0.0,
                    sin,
                    cos,
                    0.0,
                    0,
                    0,
                    0,
                    1,
                ]);
                break;
            case "y":
                ret = new Float32Array([
                    cos,
                    0.0,
                    -sin,
                    0.0,
                    0.0,
                    1.0,
                    0.0,
                    0.0,
                    sin,
                    0.0,
                    cos,
                    0.0,
                    0,
                    0,
                    0,
                    1,
                ]);
                break;
            default:
                ret = new Float32Array([
                    cos,
                    -sin,
                    0.0,
                    0.0,
                    sin,
                    cos,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    1.0,
                    0.0,
                    0,
                    0,
                    0,
                    1,
                ]);
        }
        this.matrix = ret;
        return this;
    }

    createScaleMatrix(sx, sy, sz) {
        this.matrix = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
        return this;
    }

    createRotateMatrix3(rotate, axis) {
        let cos = Math.cos((rotate * Math.PI) / 180);
        let sin = Math.sin((rotate * Math.PI) / 180);
        let ret;
        switch (axis) {
            case "x":
                ret = new Float32Array([
                    1.0,
                    0.0,
                    0.0,
                    0.0,
                    cos,
                    -sin,
                    0.0,
                    sin,
                    cos,
                ]);
                break;
            case "y":
                ret = new Float32Array([
                    cos,
                    0.0,
                    -sin,
                    0.0,
                    1.0,
                    0.0,
                    sin,
                    0.0,
                    cos,
                ]);
                break;
            default:
                ret = new Float32Array([
                    cos,
                    -sin,
                    0.0,
                    sin,
                    cos,
                    0.0,
                    0.0,
                    0.0,
                    1.0,
                ]);
        }
        this.matrix = ret;
        return this;
    }

    createScaleMatrix3(sx, sy, sz) {
        this.matrix = [sx, 0, 0, 0, sy, 0, 0, 0, sz];
        return this;
    }

    createTranslateMatrix(tx, ty, tz) {
        this.matrix = [1, 0, 0, tx, 0, 1, 0, ty, 0, 0, 1, tz, 0, 0, 0, 1];
        return this;
    }

    createPerspectiveMatrix(near, far, Ox = 0, Oy = 0) {
        this.matrix = [
            near,
            0,
            Ox,
            -near * Ox,
            0,
            near,
            Oy,
            -near * Oy,
            0,
            0,
            near + far,
            -near * far,
            0,
            0,
            1,
            0,
        ];
        return this;
    }

    createOrthographMatrix(l, r, t, b, n, f) {
        this.matrix = [
            2 / (r - l),
            0,
            0,
            (l + r) / (l - r),
            0,
            2 / (t - b),
            0,
            (t + b) / (b - t),
            0,
            0,
            2 / (f - n),
            (n + f) / (n - f),
            0,
            0,
            0,
            1,
        ];
        return this;
    }

    createViewScaleMatrix(l, r, t, b, n, f) {
        this.matrix = [
            (r - l) / 2,
            0,
            0,
            (l + r) / 2,
            0,
            (t - b) / 2,
            0,
            (t + b) / 2,
            0,
            0,
            (f - n) / 2,
            (n + f) / 2,
            0,
            0,
            0,
            1,
        ];
        return this;
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
}

function normalize(v) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // 确定不会除以 0
    if (length > 0.00001) {
        return [v[0] / length, v[1] / length, v[2] / length];
    } else {
        return [0, 0, 0];
    }
}

function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

function subtractVectors(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function lookAt(cameraPosition, target, up) {
    var zAxis = normalize(subtractVectors(target, cameraPosition));
    var xAxis = normalize(cross(up, zAxis));
    var yAxis = normalize(cross(zAxis, xAxis));

    return [
        xAxis[0],
        xAxis[1],
        xAxis[2],
        cameraPosition[0],
        yAxis[0],
        yAxis[1],
        yAxis[2],
        cameraPosition[1],
        zAxis[0],
        zAxis[1],
        zAxis[2],
        cameraPosition[2],
        0,
        0,
        0,
        1,
    ];
}

export function inverse(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0 = m22 * m33;
    var tmp_1 = m32 * m23;
    var tmp_2 = m12 * m33;
    var tmp_3 = m32 * m13;
    var tmp_4 = m12 * m23;
    var tmp_5 = m22 * m13;
    var tmp_6 = m02 * m33;
    var tmp_7 = m32 * m03;
    var tmp_8 = m02 * m23;
    var tmp_9 = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 =
        tmp_0 * m11 +
        tmp_3 * m21 +
        tmp_4 * m31 -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 =
        tmp_1 * m01 +
        tmp_6 * m21 +
        tmp_9 * m31 -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 =
        tmp_2 * m01 +
        tmp_7 * m11 +
        tmp_10 * m31 -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 =
        tmp_5 * m01 +
        tmp_8 * m11 +
        tmp_11 * m21 -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
        d * t0,
        d * t1,
        d * t2,
        d * t3,
        d *
            (tmp_1 * m10 +
                tmp_2 * m20 +
                tmp_5 * m30 -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
        d *
            (tmp_0 * m00 +
                tmp_7 * m20 +
                tmp_8 * m30 -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
        d *
            (tmp_3 * m00 +
                tmp_6 * m10 +
                tmp_11 * m30 -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
        d *
            (tmp_4 * m00 +
                tmp_9 * m10 +
                tmp_10 * m20 -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
        d *
            (tmp_12 * m13 +
                tmp_15 * m23 +
                tmp_16 * m33 -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
        d *
            (tmp_13 * m03 +
                tmp_18 * m23 +
                tmp_21 * m33 -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
        d *
            (tmp_14 * m03 +
                tmp_19 * m13 +
                tmp_22 * m33 -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
        d *
            (tmp_17 * m03 +
                tmp_20 * m13 +
                tmp_23 * m23 -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
        d *
            (tmp_14 * m22 +
                tmp_17 * m32 +
                tmp_13 * m12 -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
        d *
            (tmp_20 * m32 +
                tmp_12 * m02 +
                tmp_19 * m22 -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
        d *
            (tmp_18 * m12 +
                tmp_23 * m32 +
                tmp_15 * m02 -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
        d *
            (tmp_22 * m22 +
                tmp_16 * m02 +
                tmp_21 * m12 -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ];
}

function getMat3Determinate(m) {
    return (
        m[0] * (m[4] * m[8] - m[5] * m[7]) -
        m[1] * (m[3] * m[8] - m[5] * m[6]) +
        m[2] * (m[3] * m[7] - m[4] * m[6])
    );
}

export function inverse3(m) {
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

    const det = getMat3Determinate(aStart);
    return aStart.map((item) => item / det);
}
