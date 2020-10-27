import { Input, BaseUI } from "../MVP/UICreator.js";
// const obj = [{
//     key: 'tx',
//     alias: 'X',
//     setter?: function () {},
//     getter? : function () {},
// }];

// const keys = [
//     {
//         key: 'tx',
//         alias: 'X'
//     },{
//         key: 'ty',
//         alias: 'Y'
//     },{
//         key: 'sx',
//         alias: 'Sx'
//     },{
//         key: 'sy',
//         alias: 'Sy'
//     },{
//         key: 'rotate',
//         alias: 'Rotate'
//     }
// ]

export class Panel extends BaseUI {
    constructor(keys) {
        super();
        this.keys = keys;
        this.uis = [];
        this.bindObj = null;
        this.createElement();
    }

    createElement() {
        this.ref = document.createElement("div");
        for (let item of this.keys) {
            const ui = new Input({
                label: item.alias,
                type: "number",
                value: 0,
            });
            const obj = {
                key: item.key,
                ref: ui,
            };
            this.uis.push(obj);
            ui.on("change", (v) => {
                if (this.bindObj) {
                    this.bindObj[obj.key] = +v;
                }
                this.dispatch("change", this.bindObj, obj.key);
            });
            ui.mountTo(this.ref);
        }
    }

    updateData(instance) {
        this.bindObj = instance;
        for (let o of this.keys) {
            const uiObj = this.uis.find((item) => item.key === o.key);
            if (uiObj) {
                uiObj.ref.setValue(instance[uiObj.key]);
            }
        }
    }
}
