import "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.js";

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window["pdfjs-dist/build/pdf"];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";

class PDF_EDITOR {
  constructor(embedToEle) {
    this.embedToEle = embedToEle;
    this.PDF_LOADED = false;
    this.pdf = null;
    this.renderTask = null;
    this.initIdx = 0;
  }

  createAndNewCanvas() {
    const canvasParent = this.embedToEle.parentElement;
    const newCanvas = document.createElement("canvas");
    newCanvas.setAttribute(
      "id",
      this.embedToEle.getAttribute("id") + this.initIdx++
    );

    newCanvas.style.width = this.embedToEle.style.width;
    newCanvas.style.height = this.embedToEle.style.height;

    this.embedToEle.style.display = "none";

    canvasParent.appendChild(newCanvas);

    this.embedToEle = newCanvas;
  }

  async loadPdf(pdfUrl) {
    try {
      // PDFJS.getDocument({ url: pdf_url }).promise.then((pdf_doc) => {
      //   if (this.pdf_doc) {
      //     this.pdf_doc.destroy();
      //   }
      //   this.pdf_doc = pdf_doc;
      //   this.total_pages = this.pdf_doc.numPages;
      // });

      // if (this.renderTask !== null) {
      //   this.renderTask.cancel();
      //   return;
      // }

      this.createAndNewCanvas();

      const pdfTaskPro = pdfjsLib.getDocument(pdfUrl);
      const pdf = await pdfTaskPro.promise;

      console.log({ newPdf: pdf, oldPdf: this.pdf });

      if (this.pdf) {
        this.pdf.destroy();
        //   const canvasParent = this.embedToEle.parentElement;
        //   const newCanvas = document.createElement("canvas");
        //   newCanvas.setAttribute("id", this.embedToEle.getAttribute("id"));
        //   newCanvas.style.width = this.embedToEle.style.width;
        //   newCanvas.style.height = this.embedToEle.style.height;

        //   canvasParent.replaceChild(newCanvas, this.embedToEle);

        //   console.log({ newCanvas, oldCanvas: this.embedToEle });

        //   canvasParent.innerHTML = "";
        //   canvasParent.appendChild(newCanvas);

        //   this.embedToEle = newCanvas;
        //   // await this.pdf.destroy();
      }

      this.pdf = pdf;

      this.PDF_LOADED = true;

      const page = await pdf.getPage(1);

      var scale = 1;
      var viewport = page.getViewport({ scale: scale });

      // // Prepare canvas using PDF page dimensions
      var canvas = this.embedToEle;
      var context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Check if there is an ongoing rendering task and cancel it
      if (this.renderTask !== null) {
        this.renderTask.cancel();
      }

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Set dimensions to Canvas
      // var resolution = 2; // for example

      // canvas.height = resolution * viewport.height; //actual size
      // canvas.width = resolution * viewport.width;

      // canvas.style.height = viewport.height; //showing size will be smaller size
      // canvas.style.width = viewport.width;

      // // Prepare object needed by render method
      // var renderContext = {
      //   canvasContext: context,
      //   viewport: viewport,
      //   transform: [resolution, 0, 0, resolution, 0, 0], // force it bigger size
      // };

      // Render PDF page
      // page.render(renderContext);

      this.renderTask = page.render(renderContext);
      await this.renderTask.promise;
      this.renderTask = null;
    } catch (e) {
      console.log("error loading pdf", e);

      // this.renderTask = null;
      // if (e.name === "RenderingCancelledException") {
      //   // renderPage();
      //   console.log("render cancelled");
      //   this.loadPdf(pdfUrl);
      //   return;
      // }
    }
  }
}

export default PDF_EDITOR;
