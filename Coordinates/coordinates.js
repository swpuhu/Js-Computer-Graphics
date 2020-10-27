import { Tree, TreeNode } from "./Tree.js";
import { Node } from "../Scence/Node.js";
import { Panel } from "./Panel.js";
import { ContextMenu } from "./ContextMenu.js";
import { Matrix } from "../MVP/mat4.js";

document.oncontextmenu = (e) => {
    e.preventDefault();
};
const width = 800;
const height = 800;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

const obj = {
    name: "test",
    onClick: function () {
        console.log(this.name);
    },
    children: [
        {
            name: "test-1",
            onClick: function () {
                console.log(this.name);
            },
            children: [],
        },
    ],
};

const updateParamsDecorator = function (Node, panel, ...params) {
    return function () {
        const obj = new Node(...params);
        obj.onClick = () => {
            panel.updateData(obj);
            draw(ctx);
        };
        return obj;
    };
};

const panel = new Panel([
    {
        key: "tx",
        alias: "X",
    },
    {
        key: "ty",
        alias: "Y",
    },
    {
        key: "sx",
        alias: "Sx",
    },
    {
        key: "sy",
        alias: "Sy",
    },
    {
        key: "rotate",
        alias: "Rotate",
    },
]);

panel.ref.style.cssText = `
    position: absolute;
    left: 900px;
    top: 50px
`;

const NNode = updateParamsDecorator(Node, panel);

const rootNode = new NNode();

const tree = new Tree([rootNode]);

const contextMenu = new ContextMenu([
    {
        title: "添加节点",
        onClick: function () {
            if (tree.selectedTreeNode) {
                const node = new NNode();
                const treeNode = new TreeNode(node, tree);
                tree.selectedTreeNode.addChildren(treeNode);
                console.log(tree);
            }
        },
        isActive: function () {
            return true;
        },
    },
    {
        title: "删除节点",
        onClick: function () {
            console.log("delete node");
        },
        isActive: function () {
            return true;
        },
    },
]);

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
function draw(ctx) {
    const wolrdMatrix = new Matrix(3).createMat3(
        width / 2,
        height / 2,
        1,
        -1,
        0
    );
    ctx.clearRect(0, 0, width, height);
    for (let child of tree.children) {
        child.data.updateMatrix(wolrdMatrix);
        recursiveDraw(ctx, child.data);
    }
}

function recursiveDraw(ctx, node) {
    node.draw && node.draw(ctx);
    node.children.forEach((item) => {
        recursiveDraw(ctx, item.data);
    });
}

tree.root.oncontextmenu = function (e) {
    contextMenu.mountTo(
        this,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop
    );
};

document.body.appendChild(tree.root);

document.body.appendChild(panel.ref);

panel.updateData(rootNode);

panel.on("change", () => {
    draw(ctx);
});

draw(ctx);
