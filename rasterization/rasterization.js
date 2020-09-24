import { Vec2 } from '../util/Vec.js';
import { PrimitiveTriangle } from '../util/Triangle.js';
import { Input } from '../MVP/UICreator.js';
const width = 640;
const height = 360;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#cf390a';

const convertCoordinate = (l, r, t, b, nl, nr, nt, nb) => {
    return function (points) {
        for (let i = 0; i < points.length; i += 2) {
            const x = points[i];
            const y = points[i + 1];
            const nx = (2 * x / (r - l) + (l + r) / (l - r)) * (nr - nl) / 2 + (nl + nr) / 2;
            const ny = (2 * y / (t - b) + (b + t) / (b - t)) * (nt - nb) / 2 + (nt + nb) / 2;
            points[i] = nx;
            points[i + 1] = ny;
        }
    }
}

let pixelWidth = 5;
let pixelHeight = 5;

let onePixelSize = [pixelWidth, pixelHeight];
let w = width / onePixelSize[0];
let h = height / onePixelSize[1];
let convert = convertCoordinate(-1, 1, 1, -1, 0, w, 0, h);
let msaaNum = 1;

let trianglePoints = [
    -0.5, 0.5,
    -0.2, -0.9,
    0.8, -0.2
]

convert(trianglePoints);
let triangle = new PrimitiveTriangle(...trianglePoints);

function parseFillStyle(style, weight) {
    if (style.length === 7) {
        style += Math.floor(weight * 255).toString(16);
        return style;
    } else if (style.length === 9) {
        style = style.slice(0, 7) + Math.floor(weight * 255).toString(16);
        return style;
    }
    let r = '';
    let g = '';
    let b = '';
    let alpha = '';
    let commaCount = 0;
    if (/rgb/.test(style)) {
        for (let i = 0; i < style.length; i++) {
            if (style[i] === ',') {
                commaCount++;
            }
            if (/\d/.test(style[i]) || style[i] === '.') {
                if (commaCount === 0) {
                    r += style[i];
                } else if (commaCount === 1) {
                    g += style[i];
                } else if (commaCount === 2) {
                    b += style[i];
                }
            }
        }
    }
    return `rgba(${r}, ${g}, ${b}, ${weight})`
}

function fillPixel(x, y, weight = 1) {
    let fillStyle = parseFillStyle(ctx.fillStyle, weight);

    if (ctx.fillStyle !== fillStyle) {
        ctx.fillStyle = fillStyle;
    }
    ctx.fillRect(x * onePixelSize[0], y * onePixelSize[1], onePixelSize[0], onePixelSize[1]);
}


/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {PrimitiveTriangle} triangle 
 */
function isInTriangle(x, y, triangle) {
    const [p1, p2, p3] = triangle;
    const v1 = new Vec2(p2[0] - p1[0], p2[1] - p1[1]);
    const v2 = new Vec2(p3[0] - p2[0], p3[1] - p2[1]);
    const v3 = new Vec2(p1[0] - p3[0], p1[1] - p3[1]);
    const pv1 = new Vec2(x - p1[0], y - p1[1]);
    const pv2 = new Vec2(x - p2[0], y - p2[1]);
    const pv3 = new Vec2(x - p3[0], y - p3[1]);
    const c1 = v1.cross(pv1);
    const c2 = v2.cross(pv2);
    const c3 = v3.cross(pv3);
    return (c1 >= 0 && c2 >= 0 && c3 >= 0) || (c1 <= 0 && c2 <= 0 && c3 <= 0);
}


function msaa(x, y, sampleNumX, sampleNumY) {
    const sampleWidth = 1 / sampleNumX;
    const sampleHeight = 1 / sampleNumY;
    let res = 0;;
    for (let _y = 0; _y < sampleNumY; _y++) {
        for (let _x = 0; _x < sampleNumX; _x++) {
            const __x = x + _x * sampleWidth + sampleWidth / 2;
            const __y = y + _y * sampleHeight + sampleHeight / 2;
            if (isInTriangle(__x, __y, triangle)) {
                res += 1;
            }
        }
    }
    res /= sampleNumX * sampleNumY;
    return res;
}

function rasterization() {
    ctx.clearRect(0, 0, width, height);
    onePixelSize = [pixelWidth, pixelHeight];
    w = width / onePixelSize[0];
    h = height / onePixelSize[1];
    convert = convertCoordinate(-1, 1, 1, -1, 0, w, 0, h);
    trianglePoints = [
        -0.5, 0.5,
        -0.2, -0.9,
        0.8, -0.2
    ]
    
    convert(trianglePoints);
    triangle = new PrimitiveTriangle(...trianglePoints);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const weight = msaa(x, y, msaaNum, msaaNum);
            if (weight > 0) {
                fillPixel(x, y, weight);
            }
        }
    }
}


rasterization(trianglePoints);

const pixelSizeInput = new Input({
    label: '像素大小',
    value: pixelWidth
});


pixelSizeInput.on('change', (value) => {
    pixelWidth = pixelHeight = value;
    value && rasterization();
});

pixelSizeInput.mountTo(document.body);


const msaaInput = new Input({
    label: 'MSAA采样大小',
    value: msaaNum
});


msaaInput.on('change', (value) => {
    msaaNum = value;
    value && rasterization();
});

msaaInput.mountTo(document.body);