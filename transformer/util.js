export function getMatrix(tx, ty, sx, sy, rotate) {
    const cos = Math.cos((rotate * Math.PI) / 180);
    const sin = Math.sin((rotate * Math.PI) / 180);
    const a = cos * sx;
    const b = sin * sy;
    const c = -sin * sx;
    const d = cos * sy;
    return [a, b, c, d, tx, ty];
}

export function getMatrix2(tx, ty, sx, sy, rotate) {
    const cos = Math.cos((rotate * Math.PI) / 180);
    const sin = Math.sin((rotate * Math.PI) / 180);
    const a = cos * sx;
    const b = sin * sx;
    const c = -sin * sy;
    const d = cos * sy;
    return [a, b, c, d, tx, ty];
}

export function getScaleRotate(matrix) {
    // 先旋转再缩放，反解
    let angle = Math.atan2(matrix[1], matrix[3]);
    let sx = Math.hypot(matrix[0], matrix[2]);
    let sy = Math.hypot(matrix[1], matrix[3]);
    const tx = matrix[4];
    const ty = matrix[5];
    const validSx = Math.sqrt(matrix[0] ** 2 + matrix[2] ** 2);
    if (Math.abs(validSx - Math.abs(sx)) > 1e-8) {
        // 先缩放再旋转，反解
        angle = Math.atan2(matrix[1], matrix[0]);
        sx = Math.hypot(matrix[0], matrix[1]);
        sy = Math.hypot(matrix[2], matrix[3]);
    }
    return [(angle * 180) / Math.PI, sx, sy, tx, ty];
}

export function multiple(m1, m2, size) {
    let res = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let sum = 0;
            for (let k = 0; k < size; k++) {
                sum += this.matrix[y * size + k] * m2.matrix[k * size + x];
            }
            res.push(sum);
        }
    }
    return res;
}

export function multiVec(matrix, v) {
    const res = [];
    const size = v.length;
    for (let y = 0; y < size; y++) {
        let sum = 0;
        for (let x = 0; x < size; x++) {
            sum += matrix[y * size + x] * v[x];
        }
        res.push(sum);
    }
    return res;
}

export function computeMatrixByPos(targetPos, sourcePos) {
    const targetWidth = Math.hypot(
        targetPos[0][0] - targetPos[1][0],
        targetPos[0][1] - targetPos[1][1]
    );
    const targetHeight = Math.hypot(
        targetPos[0][0] - targetPos[3][0],
        targetPos[0][1] - targetPos[3][1]
    );
    const width = Math.hypot(
        sourcePos[0][0] - sourcePos[1][0],
        sourcePos[0][1] - sourcePos[1][1]
    );
    const height = Math.hypot(
        sourcePos[0][0] - sourcePos[3][0],
        sourcePos[0][1] - sourcePos[3][1]
    );
    const rotate = Math.atan2(
        targetPos[1][1] - targetPos[0][1],
        targetPos[1][0] - targetPos[0][0]
    );
    const sx = targetWidth / width;
    const sy = targetHeight / height;
    const x_ = targetPos[0][0];
    const y_ = targetPos[0][1];
    const x = sourcePos[0][0];
    const y = sourcePos[0][1];
    const tx = x_ - Math.cos(rotate) * sx * x + Math.sin(rotate) * sy * y;
    const ty = y_ - Math.sin(rotate) * sx * x - Math.cos(rotate) * sy * y;

    return [
        getMatrix2(tx, ty, sx, sy, (rotate * 180) / Math.PI),
        [tx, ty, sx, sy, (rotate * 180) / Math.PI],
    ];
}
