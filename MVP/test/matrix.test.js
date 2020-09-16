const Matrix = require('../mat4');
const Vec2 = require('../../transformer/Vec2');

const expect = require('chai').expect;
const threshold = 2 * Number.EPSILON;
describe('矩阵类Matrix测试', function () {

    it ('初始化测试-2x2单位矩阵', function () {
        const m2 = new Matrix(2);
        expect(m2.matrix).to.deep.equal([1, 0, 0, 1]);
    });

    it ('初始化测试-3x3单位矩阵', function () {
        const m2 = new Matrix(3);
        expect(m2.matrix).to.deep.equal([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    });

    it ('初始化测试-4x4单位矩阵', function () {
        const m2 = new Matrix(4);
        expect(m2.matrix).to.deep.equal([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    });



    it ('初始化测试-给定矩阵', function () {
        const m = new Matrix(3, [
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        ]);
        expect(m.size).to.be.equal(3);
        expect(m.matrix).to.deep.equal([
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        ])
    });

    it ('初始化测试-错误矩阵测试', function (done) {
        try {
            const m = new Matrix(3, [
                1, 2, 3,
                4, 5, 6,
                7, 8
            ]);
        } catch (e) {
            done();
        }
    })

    it ('转置测试', function () {
        const m = new Matrix(3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        m.transpose();
        expect(m.matrix).to.deep.equal([1, 4, 7, 2, 5, 8, 3, 6, 9]);
    })
})

describe('Vec2类测试', function () {
    it ('初始化测试', function () {
        const v = new Vec2(1, 2);
        expect(v.x).to.be.equal(1);
        expect(v.y).to.be.equal(2);
    });

    it ('点积测试', function () {
        const h = new Vec2(1, 0);
        const v = new Vec2(0, 1);
        const dotValue = h.dot(v);
        expect(dotValue).to.be.equal(0);
    });


    it ('叉积测试', function () {
        
    });

    it ('旋转测试', function () {
        const v = new Vec2(1, 0).rotate(90);
        expect(v.x - 0).to.be.lessThan(threshold);
        expect(Math.abs(v.y - 1)).to.be.lessThan(threshold);

        const v2 = new Vec2(1, 1).rotate(45);
        expect(v2.x).to.lessThan(threshold);
        expect(Math.abs(v2.y - Math.hypot(1, 1))).to.lessThan(2 * threshold);
    });

})


describe('Matrix Vec2 交叉测试', function () {
    it ('缩放测试', function () {
        const m = new Matrix(2, [
            1, 0,
            0, 2
        ]);
        const v = [1, 2]
        const result = m.multiVec(v);
        expect(result).to.deep.equal([
            1, 4
        ]);
    })

    it ('缩放测试', function () {
        const m = new Matrix(2, [
            1, 0,
            0, 2
        ]);
        const v = [1, 2]
        const result = m.multiVec(v);
        expect(result).to.deep.equal([
            1, 4
        ]);
    })
})