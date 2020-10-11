import {Vec2} from '../util.js'

const width = 640;
const height = 360;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.translate(width / 2, canvas.height / 2);
ctx.scale(1, -1);
ctx.lineCap = 'round';

/**
 * 
 * @param {number[][]} points 
 * @param {CanvasRenderingContext2D} context 
 * @param {Object}
 */
function draw (points, context, {
    strokeStyle = 'black',
    fillStyle = null,
    close = false,
} = {}) {
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(...points[0]);

    for (let i = 1; i < points.length; i++) {
        context.lineTo(...points[i]);
    }

    if (close) context.closePath();
    if (fillStyle) {
        context.fillStyle = fillStyle;
        context.fill();
    }

    context.stroke();
}

function fromPolar (r, theta) {
    return [r * Math.cos(theta), r * Math.sin(theta)];
}

export function parametric (xFunc, yFunc, rFunc) {
    return function (start, end, seg = 100, ...args) {
        const points = [];
        for (let i = 0; i <= seg; i++) {
            const p = i / seg;
            const t = start + (end - start) * p;
            const x = xFunc(t, ...args);
            const y = yFunc(t, ...args);
            if (rFunc) {
                points.push(rFunc(x, y));
            } else {
                points.push([x, y]);
            }
        }
        return {
            draw: draw.bind(null, points),
            points
        }
    }
}

const helical = parametric(
    (t, l) => l * t * Math.cos(t),
    (t, l) => l * t * Math.sin(t)
)

const quadricBezier = parametric(
    (t, [{x: x0}, {x: x1}, {x: x2}]) => (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2,
    (t, [{y: y0}, {y: y1}, {y: y2}]) => (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t ** 2 * y2,
);

export const cubicBezier = parametric(
    (t, [{x: x0}, {x: x1}, {x: x2}, {x: x3}]) => (1 - t) ** 3 * x0 + 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x3,
    (t, [{y: y0}, {y: y1}, {y: y2}, {y: y3}]) => (1 - t) ** 3 * y0 + 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3
)

const square = parametric(
    (t) => t,
    (t) => 0.01 * t ** 2
)

const rose = parametric(
    (t, a, k) => a * Math.cos(k * t),
    t => t,
    fromPolar
);

function drawQuadircBezier () {
    const p0 = new Vec2(0, 0);
    const p1 = new Vec2(100, 0);
    p1.rotate(0.75);
    const p2 = new Vec2(200, 0);
    const count = 30;
    for (let i = 0; i < count; i++) {
        p1.rotate(2 / count * Math.PI);
        p2.rotate(2 / count * Math.PI);
        quadricBezier(0, 1, 100, [
            p0,
            p1,
            p2
        ]).draw(ctx);
    }
}



function drawCubicBezier () {
    const p0 = new Vec2(0, 0);
    const p1 = new Vec2(100, 0);
    p1.rotate(0.75);
    const p2 = new Vec2(150, 0);
    p2.rotate(-0.75);
    const p3 = new Vec2(200, 0);
    const count = 30;
    for (let i = 0; i < count; i++) {
        p1.rotate(2 / count * Math.PI);
        p2.rotate(2 / count * Math.PI);
        p3.rotate(2 / count * Math.PI);
        cubicBezier(0, 1, 100, [
            p0,
            p1,
            p2,
            p3
        ]).draw(ctx);
    }
}

// drawCubicBezier();

// square(-100, 100, 100).draw(ctx);

// rose(0, Math.PI, 50, 200, 5).draw(ctx);