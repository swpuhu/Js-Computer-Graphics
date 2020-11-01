export class ImgCutter {
    /**
     *
     * @param {HTMLImageElement} img
     */
    constructor(img) {
        this.img = img;
        this.width = 0;
        this.height = 0;
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.decodeImage();
    }

    decodeImage() {
        this.width = this.img.width;
        this.height = this.img.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context.drawImage(this.img, 0, 0);
    }

    getBuffer(sx, sy, width, height) {
        return this.context.getImageData(sx, sy, width, height);
    }
}
