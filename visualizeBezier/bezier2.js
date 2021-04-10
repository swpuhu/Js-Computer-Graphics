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
const p4 = new Vec2(400, 20);
const radius = 3;
const colors = ["#888888", "#ff6600", "#66ff00", "#0066ff"];


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

    const getLength = (t = 1) => {
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
function drawBezier(p1, p2, p3, p4) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    ctx.stroke();
}

drawBezier(p1, p2, p3, p4);

const b = new BezierCurve(p1, p2, p3, p4);
const scan = 25;
function drawUnEqualPoint() {
    

    ctx.beginPath();
    ctx.fillStyle = "#ff6600";
    for (let i = 0; i <= scan; i++) {
        let progress = i / scan;
        const p = b.bezierCurve(progress);
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
    }

    ctx.fill();
}

function BezierReParams() {
    const length = b.getLength(1);
    ctx.beginPath();
    ctx.fillStyle = "#0066ff";
    for (let i = 0; i <= scan; i++) {
        const s = i * length / scan;
        const np = b.getParamTByS(s);
        const p = b.bezierCurve(np);
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
    }
    ctx.fill();
}


BezierReParams();
// drawUnEqualPoint();