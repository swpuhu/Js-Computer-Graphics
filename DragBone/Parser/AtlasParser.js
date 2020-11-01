export class AtlasParser {
    constructor(str) {
        this.name = "";
        this.size = [];
        this.format = "";
        this.filter = [];
        this.repeat = "none";
        this.data = Object.create(null);
        this.parse(str);
    }

    parse(str) {
        let arr = str.trim().split("\n");
        this.name = arr[0];
        this.size = arr[1];
        this.format = arr[2];
        this.filter = arr[3];
        this.repeat = arr[4];
        arr = arr.slice(5);
        for (let i = 0; i < arr.length; i += 7) {
            const obj = Object.create(null);
            this.data[arr[i]] = obj;
            for (let j = 1; j < 7; j++) {
                const [key, value] = arr[i + j]
                    .split(":")
                    .map((item) => item.trim());
                if (value === "true" || value === "false") {
                    obj[key] = value === "true" ? true : false;
                } else if (/,/.test(value)) {
                    obj[key] = value.split(",").map((item) => +item);
                } else {
                    obj[key] = +value;
                }
            }
        }
    }
}
