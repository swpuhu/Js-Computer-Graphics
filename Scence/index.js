import { Matrix } from "../MVP/mat4.js";
import { Sun, Node, Earth, Moon } from "./Node.js";

const solarOrbit = new Node();
const earthOrbit = new Node();
const moonOrbit = new Node();

const sun = new Sun(50);
const earth = new Earth(30);
const moon = new Moon(15);

earth.setParent(earthOrbit);
moon.setParent(moonOrbit);
moonOrbit.setParent(earthOrbit);
earthOrbit.setParent(solarOrbit);
sun.setParent(solarOrbit);
const solar2EarthDistance = 200;
const earth2MoonDistance = 50;

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
earthOrbit.draw = function (ctx) {
    ctx.transform(
        this.worldMatrix.matrix[0],
        this.worldMatrix.matrix[3],
        this.worldMatrix.matrix[1],
        this.worldMatrix.matrix[4],
        this.worldMatrix.matrix[2],
        this.worldMatrix.matrix[5]
    );
    ctx.beginPath();
    ctx.strokeStyle = "#06f";
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.resetTransform();
};

// solarOrbit.addChildlren(sun, earthOrbit);
// earthOrbit.addChildlren(earth, moonOrbit);
// moonOrbit.addChildlren(moon);

const width = 800;
const height = 800;

solarOrbit.localMatrix = new Matrix(3).createMat3(
    width / 2,
    height / 2,
    1,
    1,
    0
);
solarOrbit.draw = function (ctx) {
    ctx.transform(
        this.worldMatrix.matrix[0],
        this.worldMatrix.matrix[3],
        this.worldMatrix.matrix[1],
        this.worldMatrix.matrix[4],
        this.worldMatrix.matrix[2],
        this.worldMatrix.matrix[5]
    );
    ctx.beginPath();
    ctx.strokeStyle = "#f60";
    ctx.arc(0, 0, 200, 0, Math.PI * 2);
    ctx.stroke();
    ctx.resetTransform();
};

sun.localMatrix = new Matrix(3).createMat3(0, 0, 2, 2, 30);

const translateMat = new Matrix(3).createTranslateMat3(solar2EarthDistance, 0);
const scaleMat = new Matrix(3).createScaleMat3(1, 1);
const rotateMat = new Matrix(3).createRotateMat3(0);

earthOrbit.localMatrix = rotateMat.multiple(translateMat).multiple(scaleMat);

const moonOrbitTranslateMat = new Matrix(3).createTranslateMat3(
    earth2MoonDistance,
    0
);
const moonOrbitScaleMat = new Matrix(3).createScaleMat3(1, 1);
const moonOrbitRotateMat = new Matrix(3).createRotateMat3(0);

moonOrbit.localMatrix = moonOrbitRotateMat
    .multiple(moonOrbitTranslateMat)
    .multiple(moonOrbitScaleMat);

solarOrbit.updateMatrix();

/**
 *
 * @param {Node} node
 */
function draw(node) {
    node.draw && node.draw(ctx);
    node.children.forEach((item) => {
        draw(item);
    });
}

let earthOrbitRotate = 0;
let earthRotate = 0;
let moonOrbitRotate = 0;
let moonRotate = 0;
let solarRotate = 0;
function animate() {
    solarRotate += 0.5;
    earthRotate += 2;
    earthOrbitRotate += 1;
    moonOrbitRotate += 2;
    moonRotate += 5;
    sun.localMatrix = new Matrix(3).createMat3(0, 0, 1, 1, solarRotate);
    const rotateMat = new Matrix(3).createRotateMat3(earthOrbitRotate);
    earthOrbit.localMatrix = rotateMat
        .multiple(translateMat)
        .multiple(scaleMat);
    earth.localMatrix = new Matrix(3).createMat3(0, 0, 1.2, 1.2, earthRotate);

    const moonOrbitRotateMat = new Matrix(3).createRotateMat3(moonOrbitRotate);

    moonOrbit.localMatrix = moonOrbitRotateMat
        .multiple(moonOrbitTranslateMat)
        .multiple(moonOrbitScaleMat);
    moon.localMatrix = new Matrix(3).createMat3(0, 0, 1, 1, moonRotate);

    solarOrbit.updateMatrix();
    ctx.clearRect(0, 0, width, height);
    draw(solarOrbit);
    requestAnimationFrame(animate);
}

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

animate();
// draw(solarOrbit);
