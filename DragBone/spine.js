import { ImgCutter } from "./ImgCutter.js";
import { Matrix3 } from "../MVP/mat3.js";
import { Vec2 } from "../util/Vec.js";
import { AtlasParser } from "./Parser/AtlasParser.js";
function testCutter() {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "./test/L4_laoshu.png";
    let imgData = null;
    img.onload = () => {
        const imgCutter = new ImgCutter(img);
        const data = imgCutter.getBuffer(351, 317, 115, 78);
        ctx.putImageData(data, 0, 0);
    };
}

function arrayPlus(...arr) {
    let length = arr[0].length;
    let sumArr = [];
    for (let i = 0; i < length; i++) {
        let sum = 0;
        for (let j = 0; j < arr.length; j++) {
            sum += arr[j][i];
        }
        sumArr.push(sum);
    }
    return sumArr;
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            resolve(img);
        };
    });
}

function insideTriangle(x, y, v) {
    const [p1, p2, p3] = v;
    const v1 = new Vec2(p2[0] - p1[0], p2[1] - p1[1]);
    const v2 = new Vec2(p3[0] - p2[0], p3[1] - p2[1]);
    const v3 = new Vec2(p1[0] - p3[0], p1[1] - p3[1]);
    const pv1 = new Vec2(x - p1[0], y - p1[1]);
    const pv2 = new Vec2(x - p2[0], y - p2[1]);
    const pv3 = new Vec2(x - p3[0], y - p3[1]);
    const c1 = v1.cross(pv1);
    const c2 = v2.cross(pv2);
    const c3 = v3.cross(pv3);
    return (
        (c1 > 0 && c2 > 0 && c3 > 0) ||
        (c1 < 0 && c2 < 0 && c3 < 0) ||
        c1 * c2 * c3 === 0
    );
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number[][]} v
 */
function computeBaryCentric2D(x, y, v) {
    const c1 =
        (x * (v[1][1] - v[2][1]) +
            (v[2][0] - v[1][0]) * y +
            v[1][0] * v[2][1] -
            v[2][0] * v[1][1]) /
        (v[0][0] * (v[1][1] - v[2][1]) +
            (v[2][0] - v[1][0]) * v[0][1] +
            v[1][0] * v[2][1] -
            v[2][0] * v[1][1]);
    const c2 =
        (x * (v[2][1] - v[0][1]) +
            (v[0][0] - v[2][0]) * y +
            v[2][0] * v[0][1] -
            v[0][0] * v[2][1]) /
        (v[1][0] * (v[2][1] - v[0][1]) +
            (v[0][0] - v[2][0]) * v[1][1] +
            v[2][0] * v[0][1] -
            v[0][0] * v[2][1]);
    const c3 =
        (x * (v[0][1] - v[1][1]) +
            (v[1][0] - v[0][0]) * y +
            v[0][0] * v[1][1] -
            v[1][0] * v[0][1]) /
        (v[2][0] * (v[0][1] - v[1][1]) +
            (v[1][0] - v[0][0]) * v[2][1] +
            v[0][0] * v[1][1] -
            v[1][0] * v[0][1]);
    return [c1, c2, c3];
}

class Spine {
    constructor(json) {
        this.json = json;
        this.initBones = json.bones;
        this.preProcessBones();
    }

    preProcessBones() {
        this.initBones.forEach((item) => {
            const rotate = item.rotation || 0;
            const tx = item.x || 0;
            const ty = item.y || 0;
            const sx = item.scaleX || 1;
            const sy = item.scaleY || 1;
            item.matrix = new Matrix3()
                .createTranslateMat3(tx, ty)
                .multiple(new Matrix3().createRotateMat3(rotate))
                .multiple(new Matrix3().createScaleMat3(sx, sy));
        });

        this.initBones.forEach((item) => {
            item.worldMatrix = this.recursiveMatrix(item);
            item.matrixInv = item.worldMatrix.copy().inverse();
        });
    }

    recursiveMatrix(bone) {
        const parent = this.initBones.find((item) => item.name === bone.parent);
        if (parent) {
            if (parent.worldMatrix) {
                return parent.worldMatrix.multiple(bone.matrix);
            } else {
                const parentMatrix = this.recursiveMatrix(parent);
                return parentMatrix.copy().multiple(bone.matrix);
            }
        } else {
            return bone.matrix;
        }
    }
}

function testSpine() {
    function drawBones(bones) {
        const origin = [0, 0, 1];
        const newPoints = [];
        ctx.strokeStyle = "#f60";
        bones.forEach((item) => {
            const newPoint = item.worldMatrix.multiVec(origin);
            newPoints.push(newPoint);
        });

        // ctx.beginPath();
        // ctx.moveTo(newPoints[0][0], newPoints[0][1]);
        for (let i = 0; i < newPoints.length; i++) {
            // ctx.lineTo(newPoints[i][0], newPoints[i][1]);
            ctx.fillRect(newPoints[i][0], newPoints[i][1], 10, 10);
        }
        // ctx.stroke();
    }

    function drawSkin(skin, texture) {
        const vertices = [];
        const uvs = [];
        const frameBuffer = new ImageData(500, 500);
        for (let i = 0; i < skin.triangles.length; i++) {
            const index = skin.triangles[i];
            const xPos = Math.floor(skin.vertices[index * 2]);
            const yPos = Math.floor(skin.vertices[index * 2 + 1]);
            const u = Math.floor(skin.uvs[index * 2]);
            const v = Math.floor(skin.uvs[index * 2 + 1]);
            uvs.push(u, v);
            vertices.push(xPos, yPos);
        }

        ctx.beginPath();
        for (let i = 0; i < vertices.length; i += 6) {
            let minX, maxX, maxY, minY;
            maxX = minX = vertices[i];
            maxY = minY = vertices[i + 1];
            const point1 = [vertices[i + 0], vertices[i + 1]];
            const point2 = [vertices[i + 2], vertices[i + 3]];
            const point3 = [vertices[i + 4], vertices[i + 5]];

            const uv1 = [uvs[i + 0], uvs[i + 1]];
            const uv2 = [uvs[i + 2], uvs[i + 3]];
            const uv3 = [uvs[i + 4], uvs[i + 5]];

            for (let j = 0; j < 6; j += 2) {
                if (vertices[i + j] < minX) {
                    minX = vertices[i + j];
                } else if (vertices[i + j] >= maxX) {
                    maxX = vertices[i + j];
                }

                if (vertices[i + j + 1] < minY) {
                    minY = vertices[i + j + 1];
                } else if (vertices[i + j + 1] >= maxY) {
                    maxY = vertices[i + j + 1];
                }
            }
            console.log(minX, maxX, minY, maxY);
            for (let y = minY; y < maxY; y++) {
                for (let x = minX; x < maxX; x++) {
                    if (insideTriangle(x, y, [point1, point2, point3])) {
                        // frameBuffer.data[y * 500 * 4 + x * 4] = 255;
                        // frameBuffer.data[y * 500 * 4 + x * 4 + 1] = 0;
                        // frameBuffer.data[y * 500 * 4 + x * 4 + 2] = 255;
                        // frameBuffer.data[y * 500 * 4 + x * 4 + 3] = 255;
                        const [alpha, beta, gamma] = computeBaryCentric2D(
                            x,
                            y,
                            [point1, point2, point3]
                        );
                        const uv = arrayPlus(
                            uv1.map((item) => (item *= alpha)),
                            uv2.map((item) => (item *= beta)),
                            uv3.map((item) => (item *= gamma))
                        );
                        const u = Math.floor(texture.width * uv[0]);
                        const v = Math.floor(texture.height * uv[1]);
                        const color = [
                            texture.data[v * 500 * 4 + u * 4],
                            texture.data[v * 500 * 4 + u * 4 + 1],
                            texture.data[v * 500 * 4 + u * 4 + 2],
                            texture.data[v * 500 * 4 + u * 4 + 3],
                        ];
                        frameBuffer.data[y * 500 * 4 + x * 4] = color[0];
                        frameBuffer.data[y * 500 * 4 + x * 4 + 1] = color[1];
                        frameBuffer.data[y * 500 * 4 + x * 4 + 2] = color[2];
                        frameBuffer.data[y * 500 * 4 + x * 4 + 3] = color[3];
                        // const color = texture.data[v * texture.width * 4 + u]
                    }
                }
            }

            ctx.moveTo(...point1);
            ctx.lineTo(...point2);
            ctx.lineTo(...point3);
            ctx.lineTo(...point1);
        }
        ctx.putImageData(texture, 0, 0);
        // ctx.putImageData(frameBuffer, 0, 0);
        ctx.stroke();
    }

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // ctx.translate(250, 250);
    // ctx.scale(0.5, 0.5);
    Promise.all([
        fetch("./test/L4_laoshu.json"),
        fetch("./test/L4_laoshu.atlas"),
        loadImage("./test/L4_laoshu.png"),
    ])
        .then(([res, atlas, img]) => {
            return Promise.all([res.json(), atlas.text(), img]);
        })
        .then(([json, atlas, img]) => {
            const spine = new Spine(json);
            const imgCutter = new ImgCutter(img);
            const parser = new AtlasParser(atlas);
            let size = [...parser.data.duzi.size];
            if (parser.data.duzi.rotate) {
                [size[0], size[1]] = [size[1], size[0]];
            }
            const texture = imgCutter.getBuffer(
                ...parser.data.duzi.xy,
                ...size
            );
            drawBones(spine.initBones);
            drawSkin(spine.json.skins.default.duzi.duzi, texture);
        });
}

testSpine();
