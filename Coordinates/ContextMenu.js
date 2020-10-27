const menu = [
    {
        name: "menu1",
        onClick: function () {},
    },
];

export class ContextMenu {
    constructor(menu) {
        this.menu = menu;
        this.createElement();
        document.addEventListener("click", () => this.ref.remove());
    }

    createElement() {
        this.ref = document.createElement("div");
        this.ref.classList.add("context-menu");
        this.ref.style.position = "absolute";
        for (let m of this.menu) {
            const item = document.createElement("div");
            item.classList.add("item");
            item.onclick = () => {
                m.onClick && m.onClick();
            };
            item.textContent = m.title;
            this.ref.appendChild(item);
        }
    }

    /**
     *
     * @param {HTMLElement} ele
     * @param {number} x
     * @param {number} y
     */
    mountTo(ele, x = 0, y = 0) {
        this.refreshStatus();
        ele.appendChild(this.ref);
        this.ref.style.left = x + "px";
        this.ref.style.top = y + "px";
    }

    refreshStatus() {}
}
