export class Slider {
    constructor ({
        min: min,
        max: max,
        value: value = 0,
        step: step = 1,
        width: width = 200,
        height: height = 5,
        labelText: labelText
    }) {
        this.min = min;
        this.max = max;
        this.range = max - min;
        this.step = step;
        this.value = value;
        this.width = width;
        this.height = height;
        this.labelText = labelText;


        this.sliderRoot = null;
        this.root = null;
        this.slider = null;
        this.point = null;
        this.label = null;

        this.onChange = null;
        this.onChangeStart = null;
        this.onChangeEnd = null;
        this.init();
    }

    init () {
        this.createDOM();
        this.bindEvent();
    }

    createDOM () {

        this.root = document.createElement('div');
        this.root.style.cssText = `
            display: flex;
            align-items: center;
        `

        this.sliderRoot = document.createElement('div');
        this.sliderRoot.style.cssText = `position: relative;width: ${this.width}px;height: ${this.height}px`

        this.slider = document.createElement('div');
        this.slider.style.cssText = `position: absolute; width: 100%;height: 100%; background: #ffdcb8`;

        this.point = document.createElement('div');
        this.point.style.cssText = `
            position: absolute;
            top: ${this.height / 2}px; 
            left: ${Math.floor((this.value - this.min) / this.range * this.width)}px;
            width: 20px;
            height: 20px; 
            border-radius: 50%; 
            background: #f60; 
            transform: translate(-50%, -50%)
        `;


        if (this.labelText) {
            this.label = document.createElement('div');
            this.label.style.cssText = `margin: 0 10px`
            this.label.textContent = this.labelText;
            this.root.appendChild(this.label);
        }

        this.sliderRoot.appendChild(this.slider);
        this.sliderRoot.appendChild(this.point);

        this.root.appendChild(this.sliderRoot);
    }

    bindEvent () {
        this.point.onmousedown = (e) => {
            const initX = Math.floor((this.value - this.min) / this.range * this.width);
            this.onChangeStart && this.onChangeStart(this.value);
            const move = (ev) => {
                const offsetX = ev.clientX - e.clientX;
                this.value = (initX + offsetX) / this.width * this.range + this.min;
                this.value = this.value - this.value % this.step
                if (this.value < this.min) {
                    this.value = this.min;
                } else if (this.value > this.max) {
                    this.value = this.max;
                }
                this.onChange && this.onChange(this.value);
                this.point.style.left = Math.floor((this.value - this.min) / this.range * this.width) + 'px';
            }   
            
            const up = () => {
                this.onChangeEnd && this.onChangeEnd(this.value);
                this.point.title = this.value;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }
            
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        }
    }

    setValue (value) {
        if (value < this.min) {
            this.value = this.min;
        } else if (value > this.max) {
            this.value = this.max;
        }
        this.value = value;
        this.point.style.left = Math.floor((this.value - this.min) / this.range * this.width) + 'px';
        this.onChange && this.onChange(this.value);

    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    mountTo (dom) {
        dom.appendChild(this.root);
    }


}