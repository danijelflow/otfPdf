import "./theLib.js";
import PDF_EDITOR from "./pdf/editor.js";

class CustomPDF {
  renderRoot = null;
  PDF_DOC_URL = null;
  pdfDocObj = null;
  IS_PDF_SIGNED = false;
  PDF_EDITOR_INSTANCE = null;
  pdfCanvas = null;

  constructor(renderRootSelector, pdfDocUrl) {
    this.renderRoot = document.querySelector(renderRootSelector);
    this.PDF_DOC_URL = pdfDocUrl;

    this.LOADED_IFRAME_ELE = null;
  }

  addPDFCanvas() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "pdf-canvas");
    this.renderRoot.appendChild(canvas);
    this.pdfCanvas = canvas;
  }

  async loadPdf(pdfUrl) {
    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer()
    );
    const bytes = new Uint8Array(existingPdfBytes);

    this.pdfDocObj = await PDFLib.PDFDocument.load(bytes);
  }

  async init() {
    this.addPDFCanvas();
    this.pdfCanvas = this.renderRoot.querySelector("#pdf-canvas");
    this.PDF_EDITOR_INSTANCE = new PDF_EDITOR(this.pdfCanvas);
    console.log({ pdfInsa: this.PDF_EDITOR_INSTANCE });

    await this.loadPdf(this.PDF_DOC_URL);
    return this;
  }

  async render() {
    if (!this.renderRoot) {
      throw Error("render root element not found!");
    }

    const pdfBytes = await this.pdfDocObj.save();
    const docUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    await this.loadPdf(docUrl);
    await this.PDF_EDITOR_INSTANCE.loadPdf(docUrl);
  }

  async addText(text, x, y, size) {
    const pages = this.pdfDocObj.getPages();
    const { height } = pages[0].getSize();

    pages[0].drawText(text, {
      x,
      y: height - 15 - y,
      size,
    });
    await this.render();
  }

  async bulkAddText(arrOfKeys, obj) {
    if (!obj) {
      console.error("obj is required!");
    }
    const pages = this.pdfDocObj.getPages();
    const { height } = pages[0].getSize();

    arrOfKeys.forEach((key) => {
      if (obj[key]) {
        const { x, y, width, text } = obj[key];

        if (!text) return;
        pages[0].drawText(text, {
          x: x,
          y: height - 15 - y,
          size: 12,
        });
      } else {
        console.log(`key ${key} not found in obj`);
      }
    });

    await this.render();
  }

  async convertImageBufferToPDFImage(arrayBuffer) {
    const image = await this.pdfDocObj.embedPng(arrayBuffer);
    return image;
  }

  async convertImageFromUrlToPDFImage(imageUrl) {
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const image = await this.pdfDocObj.embedPng(imageBytes);
    return image;
  }

  async addImage(PDFImage, x, y, imageWidth, imageHeight) {
    const pages = this.pdfDocObj.getPages();
    const { height } = pages[0].getSize();

    pages[0].drawImage(PDFImage, {
      x,
      y: height - 15 - y,
      width: imageWidth || PDFImage.width,
      height: imageHeight || PDFImage.height,
    });

    await this.render();
  }

  isPDFSigned() {
    return this.IS_PDF_SIGNED;
  }

  async updateUserNameV2(textToReplace) {
    if (!textToReplace) return;

    const pages = this.pdfDocObj.getPages();
    const { height } = pages[0].getSize();

    pages[0].drawRectangle({
      // x: 23,
      x: 28,
      // y: 1105,
      // y: 992,
      y: height - 15 - 158,
      width: 250,
      height: 20,
      color: PDFLib.rgb(1, 1, 1),
      opacity: 1,
    });

    pages[0].drawText(textToReplace, {
      x: 28,
      // y: 990,
      y: height - 15 - 158,
      size: 12,
    });

    await this.render();
  }

  async updateUserName(textToReplace) {
    if (!textToReplace) return;

    const pages = this.pdfDocObj.getPages();

    pages[0].drawRectangle({
      x: 23,
      y: 1105,
      width: 250,
      height: 20,
      color: PDFLib.rgb(1, 1, 1),
      opacity: 1,
    });

    pages[0].drawText(textToReplace, {
      x: 25,
      y: 1105,
      size: 12,
    });

    await this.render();
  }

  async downloadPdf(pdfName = "output") {
    const pdfBytes = await this.pdfDocObj.save();
    let blob = new Blob([pdfBytes], { type: "application/pdf" });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = pdfName;
    link.click();
  }

  async getPDFBlob() {
    const pdfBytes = await this.pdfDocObj.save();
    let blob = new Blob([pdfBytes], { type: "application/pdf" });
    return blob;
  }
}

const customPdf = new CustomPDF(
  "[embed-pdf]",
  "https://cdn.prod.website-files.com/68c479e921d502430bd414be/68c9af5e80ee328df2262fe1_OneTeamFunding_Form.pdf"
);

export default customPdf;
