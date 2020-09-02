import {Vec2} from './util.js'

const width = 640;
const height = 360;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.translate(width / 2, canvas.height);
ctx.scale(1, -1);
ctx.lineCap = 'round';

/**
 * 
 * @param {CanvasRenderingContext2D} context canvas2D上下文
 * @param {Vec2} v0 起始向量
 * @param {number} length 当前树枝的长度
 * @param {number} thickness 树枝的粗细
 * @param {number} dir 当前树枝的夹角
 * @param {number} bias 随机偏向因子，让树枝具有一定的随机性
 */
function drawBranch (context, v0, length, thickness, dir, bias) {
    const v = new Vec2(1, 0).rotate(dir).scale(length);
    const v1 = v0.copy().add(v);

    context.lineWidth = thickness;
    context.beginPath();
    context.moveTo(v0.x, v0.y);
    context.lineTo(v1.x, v1.y);
    context.stroke();


    if (thickness > 2) {
        const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5);
        drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
        const right = Math.PI / 4 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
        drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
    }
    if(thickness < 5 && Math.random() < 0.3) {
        context.save();
        context.strokeStyle = '#c72c35';
        const th = Math.random() * 6 + 3;
        context.lineWidth = th;
        context.beginPath();
        context.moveTo(v1.x, v1.y);
        context.lineTo(v1.x, v1.y - 2);
        context.stroke();
        context.restore();
      }
}

drawBranch(ctx, new Vec2(0, 0), 50, 10, Math.PI / 2, 3);