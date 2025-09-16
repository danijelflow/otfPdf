import { EVENTS_LIST } from '../mainObject.js';

class SignatureBoxModalHandler {
    signatured = false;
    constructor() {
        this.$signatureModal = document.querySelector(
            "[modal='signature-box']",
        );
        this.canvas = this.$signatureModal.querySelector('#sig-canvas');

        this.$clearBtn = this.$signatureModal.querySelector(
            "[ps-action-btn='clear-signature']",
        );
        this.$saveBtn = this.$signatureModal.querySelector(
            "[ps-action-btn='add-signature']",
        );
        this.$saveBtn.setAttribute('disabled', true);

        this.SIGNATURE_TEXT = null;

        this.init();
    }

    init() {
        this.closeModal();
        this.initCanvasFunc();
    }

    initCanvasFunc() {
        this.requestCanvasFrameFunc();
    }

    async signatureChangeFunc(blob) {
        let imageBytes = await fetch(blob).then((res) => res.arrayBuffer());
        console.log({ imageBytes });
        this.SIGNATURE_TEXT = imageBytes;

        document.dispatchEvent(
            new Event(EVENTS_LIST.SIGNATURE_SAVE_BTN_CLICKED),
        );
        // let signatureImage = await myPDF.convertImageBufferToPDFImage(imageBytes);
        // myPDF.addText("again", 100, 255, 12);
        // await myPDF.addImage(signatureImage, 50, 80, 150, 75);
    }

    requestCanvasFrameFunc() {
        window.requestAnimFrame = (function (callback) {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimaitonFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        })();

        var ctx = this.canvas.getContext('2d');
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;

        var drawing = false;
        var mousePos = {
            x: 0,
            y: 0,
        };
        var lastPos = mousePos;

        this.canvas.addEventListener(
            'mousedown',
            (e) => {
                drawing = true;
                lastPos = getMousePos(this.canvas, e);
            },
            false,
        );

        this.canvas.addEventListener(
            'mouseup',
            (e) => {
                drawing = false;
                this.signatured = true;
            },
            false,
        );

        this.canvas.addEventListener(
            'mousemove',
            (e) => {
                mousePos = getMousePos(this.canvas, e);
            },
            false,
        );

        // Add touch event support for mobile
        this.canvas.addEventListener('touchstart', (e) => {}, false);

        this.canvas.addEventListener(
            'touchmove',
            (e) => {
                var touch = e.touches[0];
                var me = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                });
                this.canvas.dispatchEvent(me);
            },
            false,
        );

        this.canvas.addEventListener(
            'touchstart',
            (e) => {
                mousePos = getTouchPos(this.canvas, e);
                var touch = e.touches[0];
                var me = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                });
                this.canvas.dispatchEvent(me);
            },
            false,
        );

        this.canvas.addEventListener(
            'touchend',
            (e) => {
                var me = new MouseEvent('mouseup', {});
                this.canvas.dispatchEvent(me);
            },
            false,
        );

        function getMousePos(canvasDom, mouseEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: mouseEvent.clientX - rect.left,
                y: mouseEvent.clientY - rect.top,
            };
        }

        function getTouchPos(canvasDom, touchEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX - rect.left,
                y: touchEvent.touches[0].clientY - rect.top,
            };
        }

        function renderCanvas() {
            if (drawing) {
                ctx.moveTo(lastPos.x, lastPos.y);
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();
                lastPos = mousePos;
            }
        }

        this.signatureEvents();

        // Prevent scrolling when touching the this.canvas

        (function drawLoop() {
            requestAnimFrame(drawLoop);
            renderCanvas();
        })();
    }

    clearCanvas() {
        this.canvas.width = this.canvas.width;
    }

    signatureEvents() {
        document.body.addEventListener(
            'touchstart',
            (e) => {
                if (e.target == this.canvas) {
                    e.preventDefault();
                }
            },
            false,
        );
        document.body.addEventListener(
            'touchend',
            (e) => {
                if (e.target == this.canvas) {
                    e.preventDefault();
                }
            },
            false,
        );
        document.body.addEventListener(
            'touchmove',
            (e) => {
                if (e.target == this.canvas) {
                    e.preventDefault();
                }
            },
            false,
        );

        this.$saveBtn.addEventListener(
            'click',
            (e) => {
                e.preventDefault();

                if (!this.signatured) return;

                var dataUrl = this.canvas.toDataURL('image/png');
                console.log({ dataUrl });
                this.signatureChangeFunc(dataUrl);
                this.closeModal();
            },
            false,
        );

        this.$clearBtn.addEventListener(
            'click',
            (e) => {
                this.signatured = false;
                this.clearCanvas();
                // sigText.innerHTML = "Data URL for your signature will go here!";
                // sigImage.setAttribute("src", "");
            },
            false,
        );
    }

    openModal() {
        this.$signatureModal.classList.add('show');
    }

    closeModal() {
        this.$signatureModal.classList.remove('show');
    }
}

export default SignatureBoxModalHandler;
