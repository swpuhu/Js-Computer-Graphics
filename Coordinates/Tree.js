const obj = {
    name: "test",
    onClick: function () {},
    children: [],
};

export class Tree {
    constructor(obj) {
        this.data = obj;
        this.children = [];
        this.selectedTreeNode = null;
        this.root = this.createElement();
    }

    createElement() {
        const root = document.createElement("div");
        root.classList.add("tree");
        for (let obj of this.data) {
            const treeNode = new TreeNode(obj, this);
            root.appendChild(treeNode.root);
            this.children.push(treeNode);
        }

        return root;
    }

    unSelect() {
        for (let child of this.children) {
            child.unSelect();
        }
    }
}

export class TreeNode {
    constructor(obj, tree) {
        this.tree = tree;
        this.data = obj;
        this.children = [];
        this.root = this.createElement();
    }

    createElement() {
        const root = document.createElement("div");
        root.classList.add("treenode");
        const textNode = document.createElement("div");
        textNode.textContent = this.data.name;

        textNode.onclick = () => {
            this.tree.unSelect();
            this.select();
            this.data.onClick && this.data.onClick();
        };

        root.appendChild(textNode);

        for (let child of this.data.children) {
            const node = new TreeNode(child, this.tree);
            this.children.push(node);
            root.appendChild(node.root);
        }

        this.textNode = textNode;
        return root;
    }

    addChildren(...treeNode) {
        for (let node of treeNode) {
            this.children.push(node);
            this.root.appendChild(node.root);
            this.data.addChildlren(node.data);
        }
    }

    select() {
        this.tree.selectedTreeNode = this;
        this.textNode.classList.add("active");
    }

    unSelect() {
        this.textNode.classList.remove("active");
        for (let child of this.children) {
            child.unSelect();
        }
    }
}
