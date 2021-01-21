// Import template
import { template } from './template/index';
import { degreesToRadians, parseJson } from './utils/index';
// Import types
import { Data, Option } from './types/index';
import Konva from 'konva';

class TAchartElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
        let options: any = parseJson(this.getAttribute('options'));
        if (options && Object.keys(options).includes('selector')) {
            let wrapper = document.getElementById(options.selector);
            if (wrapper) {
                let div = document.createElement('div');
                div.id = options.selector + 'ta_radial_chart';
                wrapper.appendChild(div);
            }
            let radialChart = new RadialChart({ ...options, selector: options.selector + 'ta_radial_chart' });
            radialChart.draw();
        }
    }
}

class RadialChart {
    options: Option;
    stage: any;
    layer: any;
    width: number;
    height: number;
    startRadius: number = 150;
    radiusGap: number = 30;
    ticks: Array<number> = [1, 2, 3, 4, 5];
    arcs: Array<any> = [];
    rightArc: any | null = null;
    leftArc: any | null = null;
    labels: Array<string> = [];

    constructor(options: Option) {
        this.options = options
        this.width = 500;
        this.height = 500;
        this.options.data = this.options.data as Data;
        this.labels = this.options?.data?.map((item) => item?.name)
        this.stage = new Konva.Stage({
            container: options.selector,
            width: this.width,
            height: this.height
        });
        this.layer = new Konva.Layer();
    }

    writeText = (text: string, x: number, y: number) => new Konva.Text({ text, x, y });

    draw() {
        let indexOf;
        let { data } = this.options;

        let revArr = [...this.ticks];
        for (let i = 0; i < data?.length; i++) {
            this.rightArc = new Konva.Shape({
                name: JSON.stringify(data[i]),
                strokeWidth: 30,
                stroke: this.options.rightArcColor || "black",
                sceneFunc: (c: any, shape: any) => {
                    c.moveTo(this.width / 2, this.height / 2);
                    c.beginPath();
                    indexOf = revArr.indexOf(data[i]?.right?.value) + 1;
                    c.arc(
                        this.width / 2,
                        this.height / 2,
                        this.startRadius - i * this.radiusGap,
                        degreesToRadians(
                            360 -
                            (indexOf === this.ticks.length
                                ? 0
                                : indexOf === 1
                                    ? 90 - 90 / this.ticks.length
                                    : 90 / indexOf)
                        ),
                        degreesToRadians(270),
                        true
                    );
                    c.fillStrokeShape(shape);
                    c.closePath();
                },
            });
            this.leftArc = new Konva.Shape({
                name: JSON.stringify(data[i]),
                strokeWidth: 30,
                stroke:
                    data[i]?.left?.value <= data[i]?.right?.value
                        ? this.options?.rightArcColor
                        : this.options?.leftArcColorOnFailure,
                sceneFunc: (c, shape) => {
                    c.moveTo(this.width / 2, this.height / 2);
                    c.beginPath();
                    indexOf = revArr.indexOf(data[i]?.left?.value) + 1;
                    c.arc(
                        this.width / 2,
                        this.height / 2,
                        this.startRadius - i * this.radiusGap,
                        degreesToRadians(270),
                        degreesToRadians(
                            180 +
                            (indexOf === this.ticks.length
                                ? 0
                                : indexOf === 1
                                    ? 90 - 90 / this.ticks.length
                                    : 90 / indexOf)
                        ),
                        true
                    );
                    c.fillStrokeShape(shape);
                    c.closePath();
                },
            });

            this.arcs.push(this.leftArc);
            this.arcs.push(this.rightArc);
        }

        let indicatorShape = new Konva.Shape({
            stroke: this.options.valueInticatorColor || "orange",
            strokeWidth: 2,
            sceneFunc: (c, shape) => {
                c.beginPath();
                c.arc(
                    this.width / 2,
                    this.height / 2,
                    180,
                    degreesToRadians(360),
                    degreesToRadians(180),
                    true
                );
                c.fillStrokeShape(shape);
            },
        });

        let verticalLineShape = new Konva.Shape({
            stroke: this.options.verticalLineColor || "black",
            strokeWidth: 3,
            sceneFunc: (c, shape) => {
                c.beginPath();
                c.moveTo(this.width / 2, this.height / 2);
                c.lineTo(this.width / 2, this.height / 2 - this.startRadius - 15);
                c.stroke();
                c.fillStrokeShape(shape);
            },
        });

        // left side label
        let leftLabel = new Konva.Text({
            x: this.width / 2 - 180 - 40,
            y: this.height / 2 + 40,
            text: this.options.leftLabel,
        });

        //right side label
        let rightLabel = new Konva.Text({
            x: this.width / 2 + 180 - 40,
            y: this.height / 2 + 40,
            text: this.options.rightLabel,
        });

        let left1Text = this.writeText("1", 180, 70);
        let right1Text = this.writeText("1", 315, 70);
        let left2Text = this.writeText("2", 120, 110);
        let right2Text = this.writeText("2", 375, 110);
        let left3Text = this.writeText("3", 80, 160);
        let right3Text = this.writeText("3", 415, 160);
        let left4Text = this.writeText("4", 65, 200);
        let right4Text = this.writeText("4", 430, 200);
        let left5Text = this.writeText("5", 60, this.height / 2 - 5);
        let right5Text = this.writeText("5", 435, this.height / 2 - 5);

        this.layer.add(left1Text);
        this.layer.add(right1Text);
        this.layer.add(left2Text);
        this.layer.add(right2Text);
        this.layer.add(left3Text);
        this.layer.add(right3Text);
        this.layer.add(left4Text);
        this.layer.add(right4Text);
        this.layer.add(left5Text);
        this.layer.add(right5Text);

        this.layer.add(leftLabel);
        this.layer.add(rightLabel);
        this.layer.add(indicatorShape);
        this.arcs.forEach((shape) => {
            this.layer.add(shape);
        });

        for (let i = this.labels?.length - 1; i >= 0; i--) {
            this.layer.add(
                this.writeText(
                    this.labels[i],
                    this.width / 2 - 25,
                    this.height / 2 - this.startRadius / 4 - i * 30
                )
            );
        }

        this.layer.add(verticalLineShape);
        this.stage.add(this.layer);
        this.layer.draw();

        this.stage.on("click", function () {
            // let exist = document.getElementById("chart__tooltip");

            // if (e.target.attrs?.name) {
            //     let obj = JSON.parse(e.target.attrs?.name);
            //     leftValue = obj.left.value;
            //     rightValue = obj.right.value;
            //     left = e.evt.clientX;
            //     top = e.evt.clientY;
            //     title = obj.name;
            //     if (exist) {
            //         exist.setAttribute(
            //             "style",
            //             `position:absolute;top:${top}px ;left: ${left}px;
            //             background-color: white;
            //             padding: 5px 10px;
            //             box-shadow: 1px 1px 5px black, -1px -1px 5px black;
            //             font-size: 14px;
            //             text-align: center;
            //             `
            //         );
            //         exist.innerHTML = `<p>${title}</p>
            //         <p>${options?.data[0]?.left?.name} - ${leftValue}</p>
            //         <p>${options?.data[0]?.right?.name} - ${rightValue}</p>`;
            //     } else {
            //         let tooltip = document.createElement("div");
            //         tooltip.innerHTML = `<div transition:fade id="chart__tooltip"
            //             style="
            //             position:absolute;
            //             top:${top}px ;
            //             left: ${left}px;
            //             background-color: white;
            //             padding: 5px 10px;
            //             box-shadow: 1px 1px 5px black, -1px -1px 5px black;
            //             font-size: 14px;
            //             text-align: center"
            //             >
            //                <p>${title}</p>
            //                <p>${options?.data[0]?.left?.name} - ${leftValue}</p>
            //                <p>${options?.data[0]?.right?.name} - ${rightValue}</p>
            //             </div>`;
            //         document.querySelector("body").append(tooltip);
            //     }
            // } else {
            //     if (document.getElementById("chart__tooltip"))
            //         document.getElementById(
            //             "chart__tooltip"
            //         ).style.display = "none";
            // }
        });
    }
}

window.customElements.define('ta-chart', TAchartElement)
console.log("2222222222222")
