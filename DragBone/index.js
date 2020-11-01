import { Matrix3 } from "../MVP/mat3.js";
import { DragBone } from "./DragBone.js";

const width = 500;
const height = 500;
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

const unitSize = 30;

const vertices = [
    0,
    1, // 0
    0,
    -1, // 1
    2,
    1, // 2
    2,
    -1, // 3
    4,
    1, // 4
    4,
    -1, // 5
    6,
    1, // 6
    6,
    -1, // 7
    8,
    1, // 8
    8,
    -1, // 9
].map((item) => {
    return (item *= unitSize);
});

const indices = [
    0,
    1,
    0,
    2,
    1,
    3,
    2,
    3, //
    2,
    4,
    3,
    5,
    4,
    5,
    4,
    6,
    5,
    7, //
    6,
    7,
    6,
    8,
    7,
    9,
    8,
    9,
];

const boneNdx = [
    0,
    0,
    0,
    0, // 0
    0,
    0,
    0,
    0, // 1
    0,
    1,
    0,
    0, // 2
    0,
    1,
    0,
    0, // 3
    1,
    0,
    0,
    0, // 4
    1,
    0,
    0,
    0, // 5
    1,
    2,
    0,
    0, // 6
    1,
    2,
    0,
    0, // 7
    2,
    0,
    0,
    0, // 8
    2,
    0,
    0,
    0, // 9
];
const weight = [
    1,
    0,
    0,
    0, // 0
    1,
    0,
    0,
    0, // 1
    0.5,
    0.5,
    0,
    0, // 2
    0.5,
    0.5,
    0,
    0, // 3
    1,
    0,
    0,
    0, // 4
    1,
    0,
    0,
    0, // 5
    0.5,
    0.5,
    0,
    0, // 6
    0.5,
    0.5,
    0,
    0, // 7
    1,
    0,
    0,
    0, // 8
    1,
    0,
    0,
    0, // 9
];

let angle = 0;
let bones = computeBones(0);

const dragBone = new DragBone(vertices, bones, []);

function computeBones(angle) {
    const bone1 = new Matrix3().createRotateMat3(angle);

    const bone2 = new Matrix3()
        .createRotateMat3(angle)
        .multiple(new Matrix3().createTranslateMat3(unitSize * 4, 0));

    const bone3 = new Matrix3()
        .createRotateMat3(angle)
        .multiple(new Matrix3().createTranslateMat3(unitSize * 4, 0));
    return [
        bone1.copy(),
        bone2.copy().multiple(bone1),
        bone3.copy().multiple(bone2).multiple(bone1),
    ];
}

function verticesApplyBones(vertices, dragBone, bones, bonesNdx, weight) {
    const newVertices = [];
    const newBones = bones.map((item, index) => {
        return item.multiple(dragBone.bindPosInv[index]);
    });
    for (let i = 0; i < boneNdx.length; i += 4) {
        const bone1 = newBones[bonesNdx[i + 0]];
        const bone2 = newBones[bonesNdx[i + 1]];
        const bone3 = newBones[bonesNdx[i + 2]];
        const bone4 = newBones[bonesNdx[i + 3]];

        const weight1 = weight[i + 0];
        const weight2 = weight[i + 1];
        const weight3 = weight[i + 2];
        const weight4 = weight[i + 3];

        const index = i / 4;
        const vertex = [vertices[index * 2], vertices[index * 2 + 1], 1];
        const v1 = bone1.multiVec(vertex).map((item) => {
            return (item *= weight1);
        });

        const v2 = bone2.multiVec(vertex).map((item) => {
            return (item *= weight2);
        });

        const v3 = bone3.multiVec(vertex).map((item) => {
            return (item *= weight3);
        });

        const v4 = bone4.multiVec(vertex).map((item) => {
            return (item *= weight4);
        });

        const arr = arrayPlus(v1, v2, v3, v4);
        newVertices.push(arr[0], arr[1]);
    }
    return newVertices;
}

function drawBones(bones) {
    const origin = [0, 0, 1];
    const newPoints = [];
    ctx.strokeStyle = "#f60";
    bones.forEach((item) => {
        const newPoint = item.multiVec(origin);
        newPoints.push(newPoint);
    });

    ctx.beginPath();
    ctx.moveTo(newPoints[0][0], newPoints[0][1]);
    for (let i = 1; i < newPoints.length; i++) {
        ctx.lineTo(newPoints[i][0], newPoints[i][1]);
    }
    ctx.stroke();
}

function drawVerties(vertices, indices, bones) {
    ctx.strokeStyle = "#06f";
    const newVertices = verticesApplyBones(
        vertices,
        dragBone,
        bones,
        boneNdx,
        weight
    );
    for (let i = 0; i < indices.length - 1; i += 2) {
        ctx.beginPath();
        const currIndex = indices[i];
        const nextIndex = indices[i + 1];
        ctx.moveTo(newVertices[currIndex * 2], newVertices[currIndex * 2 + 1]);
        ctx.lineTo(newVertices[nextIndex * 2], newVertices[nextIndex * 2 + 1]);
        ctx.stroke();
    }
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

ctx.translate(width / 2, height / 2);

function animate() {
    angle += 0.01;
    const newAngle = 45 * Math.sin(angle);
    bones = computeBones(newAngle);
    ctx.clearRect(-width / 2, -height / 2, width, height);
    drawVerties(vertices, indices, bones);
    drawBones(bones);

    requestAnimationFrame(animate);
}
animate();
