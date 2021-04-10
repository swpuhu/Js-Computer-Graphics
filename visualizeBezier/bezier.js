import { Vec2 } from "../util.js";
const width = 500;
const height = 500;
const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const p1 = new Vec2(400, 100);
const p2 = new Vec2(300, 400);
const p3 = new Vec2(100, 100);
const p4 = new Vec2(500, 200);
const radius = 5;
const colors = ["#888888", "#ff6600", "#66ff00", "#0066ff"];

/**
 * @param {number} progress
 * @param  {...Vec2} points
 */
function drawBezier(progress, ...points) {
    const q = [...points];
    let level = 0;
    while (q.length) {
        let length = q.length;
        ctx.beginPath();
        ctx.fillStyle = colors[level];
        ctx.strokeStyle = colors[level];
        let temp = [];
        while (length > 0) {
            const p = q.shift();
            const nextP = q[0];
            ctx.moveTo(p.x + radius, p.y);
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            if (p && nextP) {
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(nextP.x, nextP.y);
                temp.push(p.scale(1 - progress).add(nextP.scale(progress)));
            }
            length--;
        }
        ctx.fill();
        ctx.stroke();
        ++level;
        if (temp.length === 1) {
            ctx.beginPath();
            ctx.fillStyle = colors[level];
            ctx.strokeStyle = colors[level];
            const p = temp.shift();
            ctx.moveTo(p.x + radius, p.y);
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            return [p.x, p.y];
        } else {
            q.push(...temp);
        }
    }
}

/**
 *
 * @param  {...number[]} points
 */
function drawFootPrint(...points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.strokeStyle = "#ff0000";
    for (let i = 1; i < points.length; i++) {
        const p = points[i];
        ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
}

/**
 *
 * @param  {...number[]} points
 */
function getFootPrintLength(...points) {
    let sum = 0;
    for (let i = 1; i < points.length; i++) {
        let length = Math.sqrt(
            (points[i][0] - points[i - 1][0]) ** 2 +
                (points[i][1] - points[i - 1][1]) ** 2
        );
        sum += length;
    }
    console.log(sum);
    return sum;
}

let progress = 0.0;
let rafId = -1;
let footprint = [];
function mainLoop() {
    rafId = requestAnimationFrame(mainLoop);
    if (progress >= 1) {
        getFootPrintLength(...footprint);
        cancelAnimationFrame(rafId);

        ctx.beginPath();
        ctx.fillStyle = '#ff0000'
        const q1 = b.bezierCurve(pp1);
        const q2 = b.bezierCurve(pp2);
        const q3 = b.bezierCurve(pp3);
        const q4 = b.bezierCurve(pp4);

        ctx.moveTo(q1.x, q1.y);
        ctx.arc(q1.x, q1.y, radius, 0, 2 * Math.PI);
        ctx.moveTo(q2.x, q2.y);
        ctx.arc(q2.x, q2.y, radius, 0, 2 * Math.PI);
        ctx.moveTo(q3.x, q3.y);
        ctx.arc(q3.x, q3.y, radius, 0, 2 * Math.PI);
        ctx.moveTo(q4.x, q4.y);
        ctx.arc(q4.x, q4.y, radius, 0, 2 * Math.PI);

        ctx.fill();


        return;
    }
    ctx.clearRect(0, 0, width, height);
    const p = drawBezier(progress, p1, p2, p3, p4);
    const pp = b.bezierCurve(progress);
    footprint.push([pp.x, pp.y]);
    drawFootPrint(...footprint);
    progress += 0.003;
}

function drawBezierLine() {
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    ctx.stroke();
}
drawBezierLine();

/**
 *
 * @param {Vec2} p0
 * @param {Vec2} p1
 * @param {Vec2} p2
 * @param {Vec2} p3
 */
function QuadraticCurve(p0, p1, p2, p3) {
    const A = p1.sub(p0);
    const B = p2.sub(p1).sub(A);
    const C = B.dot(B);
    const D = A.dot(B) * 3;
    this.p4 = p3;

    const curve = t => {
        return p0
            .scale((1 - t) ** 2)
            .add(p1.scale(2 * (1 - t) * t))
            .add(p2.scale(t ** 2));
    };

    const bezierCurve = t => {
        return p0
            .scale((1 - t) ** 3)
            .add(p1.scale(3 * (1 - t) ** 2 * t))
            .add(p2.scale(3 * (1 - t) * t ** 2))
            .add(p3.scale(t ** 3));
    };
    const derivate = t => {
        return A.add(B.scale(t)).scale(2);
    };

    const QFunc = (t, E, F) => C * t ** 3 + D * t ** 2 + E * t + F;
    const QFuncDerivate = (t, E, F) => 3 * C * t ** 2 + 2 * D * t + E;

    const getProgressByEquation = M => {
        const MP = p0.sub(M);
        const E = A.dot(A) * 2 + B.dot(MP);
        const F = MP.dot(A);
        let t = 0;
        let count = 0;
        let x1 = QFunc(t, E, F);
        let x2 = QFunc(x1, E, F);
        while (Math.abs(x2 - x1) > 1e-2) {
            if (count++ > 1000) {
                break;
            }
            x1 = x2;
            x2 = x2 - QFunc(x2, E, F) / QFuncDerivate(x2, E, F);
        }
        return x2;
    };

    const getProgressByIteration = M => {
        let minIndex = 0;
        let scans = 25;
        for (let min = Infinity, i = scans + 1; i--; ) {
            let d2 = squaredDistance(M, bezierCurve(i / scans));
            if (d2 < min) {
                min = d2;
                minIndex = i;
            }
        }
        let t0 = Math.max((minIndex - 1) / scans, 0);
        let t1 = Math.min((minIndex + 1) / scans, 1);
        let d2ForT = t => squaredDistance(M, bezierCurve(t));
        return localMinimum(t0, t1, d2ForT, 1e-4);
    };

    const localMinimum = (minX, maxX, f, epsilon) => {
        if (epsilon === undefined) epsilon = 1e-5;
        let m = minX,
            n = maxX,
            k;
        while (n - m > epsilon) {
            k = (n + m) / 2;
            if (f(k - epsilon) < f(k + epsilon)) {
                n = k;
            } else {
                m = k;
            }
        }
        return k;
    };

    return {
        curve,
        derivate,
        getProgressByEquation,
        getProgressByIteration: getProgressByIteration,
        bezierCurve
    };
}

function caculus(top, bottom, fn) {
    const weightTable = [
        [0.5688888888888889, 0],
        [0.4786286704993665, -0.5384693101056831],
        [0.4786286704993665, 0.5384693101056831],
        [0.2369268850561891, -0.906179845938664],
        [0.2369268850561891, 0.906179845938664]
    ];

    let sum = 0;
    for (let i = 0; i < weightTable.length; i++) {
        sum +=
            weightTable[i][0] *
            fn(((top - bottom) / 2) * weightTable[i][1] + (top + bottom) / 2);
    }
    return ((top - bottom) / 2) * sum;
}

/**
 *
 * @param {Vec2} p0
 * @param {Vec2} p1
 * @param {Vec2} p2
 * @param {Vec2} p3
 */
function BezierCurve(p0, p1, p2, p3) {
    const bezierCurve = t => {
        return p0
            .scale((1 - t) ** 3)
            .add(p1.scale(3 * (1 - t) ** 2 * t))
            .add(p2.scale(3 * (1 - t) * t ** 2))
            .add(p3.scale(t ** 3));
    };

    const derivate = t => {
        return p0
            .scale(-3 * (1 - t) ** 2)
            .add(p1.scale(3 * (3 * t ** 2 - 4 * t + 1)))
            .add(p2.scale(3 * (-3 * t ** 2 + 2 * t)))
            .add(p3.scale(3 * t ** 2));
    };

    const getLength = t => {
        const fn = x => {
            return derivate(x).mag();
        };
        return caculus(t, 0, fn);
    };

    const getParamTByS = s => {
        let a = s / getLength(1);
        let b = a - (getLength(a) - s) / derivate(a).mag();
        while (getLength(b) - getLength(a) > 1e-2) {
            a = b;
            b = b - (getLength(b) - s) / derivate(b).mag();
        }
        return b;
    };

    return {
        bezierCurve,
        derivate,
        getLength,
        getParamTByS: getParamTByS
    };
}

function profileFunc(fn, name) {
    return function(...args) {
        console.time(name);
        const result = fn(...args);
        console.timeEnd(name);
        return result;
    };
}

/**
 *
 * @param {Vec2} p
 * @param {Vec2} q
 */
function squaredDistance(p, q) {
    return p.sub(q).mag();
}

const q = new QuadraticCurve(p1, p2, p3, p4);
const b = new BezierCurve(p1, p2, p3, p4);
const length = b.getLength(1);
console.log(length);
const [pp1, pp2, pp3, pp4] = [
    b.getParamTByS(94),
    b.getParamTByS(94 * 2),
    b.getParamTByS(94 * 3),
    b.getParamTByS(94 * 4)
];

console.log(pp1, pp2, pp3, pp4);
// const d = q.curve(0.5);
// console.log(d);

canvas.onmousemove = function(e) {
    const x = e.offsetX,
        y = e.offsetY;
    const p = q.getProgressByIteration(new Vec2(x, y));
    ctx.clearRect(0, 0, width, height);
    drawBezierLine();
    ctx.beginPath();
    ctx.fillStyle = "black";
    const point = q.bezierCurve(p);
    ctx.moveTo(point.x + radius, point.y + radius);
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    let r = point.sub(new Vec2(x, y)).mag();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 128, 0, 0.5)";
    ctx.fill();
};

mainLoop();
