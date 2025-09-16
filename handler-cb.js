import PDF_Handler from "./mypdf.js";

import SignatureBoxModalHandler from "./pdf/signatureBox.js";

import {
  USER_DATA_PROPS,
  INPUT_FORM_SEARCHEABLE_PROPS,
  DUPLICATE_NAMES,
  USER_DATA_ELE_POSTION,
  USER_DATA_ELE_POSTION_NO_BASIC,
  EVENTS_LIST,
} from "./mainObject.js";
import "./requestSubmitPolyfill.js";
import AlertBox from "./AlertBox.js";
import HandleTableOnPage from "./debt-table.js";


function moveSlides() {
  console.log("move slides");
  $(".w-slider-arrow-right").trigger('tap')
$(".w-slider-arrow-right").trigger('tap')
$(".w-slider-arrow-right").trigger('tap')
$(".w-slider-arrow-right").trigger('tap')
  // $(".w-slider-arrow-right").trigger('tap')
  // $(".w-slider-arrow-right").trigger('tap')
}

// moveSlides()
class FormHandler {
  constructor() {
    this.$form = document.querySelector("[custom-form='pspdf']");
    this.$uploadPdfBtn = document.querySelector("[upload-pdf='to-form']");
    this.$addUsernameBtn = document.querySelector(
      "[pdf-action-btn='add-username']"
    );
    this.alertBox = new AlertBox();
    this.SignatureHandler = new SignatureBoxModalHandler();

    this.$nextSlideBtns = document.querySelectorAll(".slider-right.w-button");
    this.$prevSlideBtns = document.querySelectorAll(".slider-left");

    this.TOTAL_FILE_SIZE_ALLOWED = 25 * 1024 * 1024; // 25MB

    this.init();
  }

  async init() {
    this.disableBtn();
    PDF_Handler.PDF_DOC_URL = `https://cdn.prod.website-files.com/68c479e921d502430bd414be/68c9af5e80ee328df2262fe1_OneTeamFunding_Form.pdf`;
    await PDF_Handler.init();

    this.activateEvents();
    this.updateDocsLogic();

    this.loadTable();
    this.addCustomCss();

  }

  addCustomCss() {
    const styleInner = `
      .sign-box {
        bottom: 3.6em;
        left: 2em;
      }
    `;

    const style = document.createElement("style");
    style.innerHTML = styleInner;
    document.head.appendChild(style);
  }

  loadTable() {
    const $table = document.querySelector("[debt-sheet-comp]");
    // we're using tabulator library to render the table
    const tableColumns = [
      // no sorting for columns
      { title: "Creditors", field: "creditors", editor: "input" },
      { title: "Payment Amount", field: "paymentAmount", editor: "input" },
      { title: "Payment Frequency", field: "paymentFrequency", editor: "input" },
      { title: "Interest Rate", field: "interestRate", editor: "input" },
      { title: "Maturity Date", field: "maturityDate", editor: "input" },
    ];
    // load 10 empty rows with above columns fields and add ids to each row
    const tableData = Array.from({length: 10}, (_, i) => {
      return {
        ...tableColumns.reduce((acc, curr) => {
          acc.id = i;
          return acc;
        }, {})
      }
    });

    this.debtTableHanlder = new HandleTableOnPage($table, {
      tableColumns,
      tableData,
    });


    this.$uploadScheduleBtn = document.querySelector("[upload-debt-schedule='to-form']");
    this.$uploadScheduleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.debtTableHanlder.downloadPDF();

    });

    document.addEventListener("downloadEncoder", (e) => {
      const { fileContents, mimeType } = e.detail;
      const blob = new Blob([fileContents], { type: mimeType });
      const url = URL.createObjectURL(blob);

       const userDebtScheduleEle = document.createElement("input");
        userDebtScheduleEle.type = "file";
        userDebtScheduleEle.id = "debtSchedule";
        userDebtScheduleEle.name = "debtSchedule";
        userDebtScheduleEle.style.display = "none";

      // attach as file to form
      const formData = new FormData(this.$form);
      formData.append("debtSchedule", blob, "debtSchedule.csv");

      let file = new File([blob], "debtSchedule.pdf", {
        type: "application/pdf",
        lastModified: new Date().getTime(),
      });

      let container = new DataTransfer();
      container.items.add(file);
      userDebtScheduleEle.files = container.files;

      // subtract size of pdf from total size
      const fileSize = blob.size;
      this.TOTAL_FILE_SIZE_ALLOWED -= fileSize;

      this.$form.appendChild(userDebtScheduleEle);
      this.checkAndHandleFileUploadSizes();
    });
  }

  handleNextSlideChange(btn) {
    const $btn = btn;
    const $parentSlideEle = $btn.closest(".slide-2.w-slide");
    const $allRequiredInputs = $parentSlideEle.querySelectorAll("input[required]");

    const hasUnfilledInput = [...$allRequiredInputs].find(input => !input.value);

    if(hasUnfilledInput){
      hasUnfilledInput.focus();
      this.alertBox.showAlert("Please fill all the required fields","error");
      return false;
    }

    return true;
  }

  checkFileSizesOnUpload() {
    const fileInputs = document.getElementById('input[type="file"]');

    input.addEventListener('change', (event) => {
      const target = event.target
        if (target.files && target.files[0]) {

          const maxAllowedSize = 5 * 1024 * 1024;
          if (target.files[0].size > maxAllowedSize) {
            target.value = ''
          }
      }
    })
  }

  controlSlides(toDo) {
    const $slideLeft = $('#flowbaseSlider .w-slider-arrow-left');
    const $slideRight = $('#flowbaseSlider .w-slider-arrow-right');


    if(toDo === 'next'){
      $slideRight.trigger('tap');
    } else {
      console.log("prev");
      $slideLeft.trigger('tap');
    }
  }

  activateEvents() {
    this.$nextSlideBtns.forEach(btn => {
      btn.addEventListener("click",(e)=>{
        return this.handleNextSlideChange(btn) ? this.controlSlides('next') : false;
      })
    })

    this.$prevSlideBtns.forEach(btn => {
      btn.addEventListener("click",(e)=>{
        console.log("clicked prev");
       this.controlSlides('prev');
      })
    })


    this.$form.addEventListener("submit", async (e) => {
      await this.handleSubmit(e);
    });

    document.addEventListener("pdf-signed", () => {
      this.$uploadPdfBtn.setAttribute("disabled", false);
      this.$uploadPdfBtn.style.cursor = "pointer";
      this.$uploadPdfBtn.style.pointerEvents = "auto";
    });

    this.$uploadPdfBtn &&
      this.$uploadPdfBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (PDF_Handler.isPDFSigned()) {
          await this.uploadPdf();
          return false;
        } else {
          this.alertBox.showAlert(
            "Please sign the document before uploading",
            "error"
          );
          return true;
        }
      });

    this.$addUsernameBtn &&
      this.$addUsernameBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.addUsername();
        this.updateAllInputAnnotations();
        this.addInteractiveSignBox();
      });

    document.addEventListener(
      EVENTS_LIST.SIGNATURE_SAVE_BTN_CLICKED,
      async () => {
        const signatureText = this.SignatureHandler.SIGNATURE_TEXT;
        if (signatureText) {
          let signatureImage = await PDF_Handler.convertImageBufferToPDFImage(
            signatureText
          );

          this.$signBox.style.display = "none";

          await PDF_Handler.addImage(signatureImage, 46, 1200, 191, 59);
          PDF_Handler.IS_PDF_SIGNED = true;
          document.dispatchEvent(new CustomEvent("pdf-signed"));
        }
      }
    );
    let ctaArray = document.querySelectorAll(".slider-left, .slider-right");
    ctaArray.forEach(cta => {
      cta.addEventListener("click",()=>{
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
    })

    // this.trackInputChanges();
  }

  checkAndHandleFileUploadSizes() {
    const $fileInputs = this.$form.querySelectorAll(".file-upload[type='file']");
    this.MAX_FILE_SIZE = this.TOTAL_FILE_SIZE_ALLOWED / $fileInputs.length;

    $fileInputs.forEach(($fileInput) => {
      $fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file.size > this.MAX_FILE_SIZE) {
          this.alertBox.showAlert(
            `File size cannot be more than ${MAX_FILE_SIZE_IN_MB}MB`,
            "error"
          );
          $fileInput.value = "";
        }
      });
    });
  }

   addInteractiveSignBox() {
    const $signBox = document.createElement("div");
    $signBox.classList.add("sign-box");

    $signBox.innerHTML = `Click To Accept`;

    $signBox.addEventListener("click", async () => {
      const imgArr = await fetch(`https://uploads-ssl.webflow.com/63dc3392bda1342ab437f8b5/656eeb0d6445f3bdeca6333f_agree-text%20(1).png`).then((res) => res.arrayBuffer());

      let signatureImage = await PDF_Handler.convertImageBufferToPDFImage(
            imgArr
          );

      PDF_Handler.addImage(signatureImage, 42, 1074, 600, 20);
      PDF_Handler.IS_PDF_SIGNED = true;
      document.dispatchEvent(new CustomEvent("pdf-signed"));

      $signBox.style.display = "none";



    });

    this.$signBox = $signBox;

    PDF_Handler.renderRoot.appendChild($signBox);
  }

  updateDocsLogic() {
    const $loanAmntInput = this.$form.querySelector(
      `[user-ele-input="amount_requested"]`
    );

    if (!$loanAmntInput) {
      return;
    }

    $loanAmntInput.addEventListener("input", () => {
      const loanAmnt = $loanAmntInput.value;

      const selectedDDOptionIdx = $loanAmntInput.selectedIndex;

      if (selectedDDOptionIdx >= 1 && selectedDDOptionIdx <= 2) {
        hideShowInputDocs(["bank-statements"]);
      } else if (selectedDDOptionIdx === 3) {
        hideShowInputDocs([
          "bank-statements",
          "tax-returns-1",
          "debt-schedule",
        ]);
      } else if (selectedDDOptionIdx >= 4) {
        hideShowInputDocs([
          "bank-statements",
          "tax-returns-1",
          "tax-returns-2",
          "debt-schedule",
          "balance-sheet",
          "p-and-l-statement",
        ]);
      }
    });

    function hideShowInputDocs(arrOfClasses = []) {
      const $inputDocs = document.querySelectorAll("[doc-input-boxes]");

      $inputDocs.forEach(($inputDoc) => {
        const $inputDocClass = $inputDoc.getAttribute("doc-input-boxes");
        const $uploadInput = $inputDoc.querySelector("[type='file']");

        if (arrOfClasses.includes($inputDocClass)) {
          $inputDoc.style.display = "block";
          // $uploadInput.setAttribute("required", true);
        } else {
          $inputDoc.style.display = "none";
          // $uploadInput.removeAttribute("required");
        }
      });
    }
  }

  disableBtn() {
    this.$uploadPdfBtn.setAttribute("disabled", true);
    this.$uploadPdfBtn.style.cursor = "not-allowed";
    this.$uploadPdfBtn.style.pointerEvents = "none";
  }

  trackInputChanges() {
    this.ALL_INPUTS_TO_TRACK = Object.values(USER_DATA_PROPS).map((val) => {
      const $input = this.$form.querySelector(`[user-ele-input="${val}"]`);
      if (!$input) return null;
      $input.addEventListener("input", () => {
        this.handleInputChanges($input);
      });
      return $input;
    });
  }

  async updateAllInputAnnotations() {
    const newClonedObj = {
      ...USER_DATA_ELE_POSTION_NO_BASIC,
    };
    const inputsToSkip = [
      USER_DATA_PROPS.firstName,
      USER_DATA_PROPS.lastName,
      USER_DATA_PROPS.email,
      USER_DATA_PROPS.dob,
      USER_DATA_PROPS.phone,
    ];

    const eles = Object.values(USER_DATA_PROPS).filter(prop => !inputsToSkip.includes(prop)).map((val) => {
      const $input = this.$form.querySelector(`[user-ele-input="${val}"]`);
      if (!$input) return null;

      const inputVal = $input.value;

      newClonedObj[val] && (newClonedObj[val].text = inputVal);

      return $input;
    });

    await PDF_Handler.bulkAddText(Object.values(USER_DATA_PROPS).filter(prop => !inputsToSkip.includes(prop)), newClonedObj);
  }

  async addUsername() {
    const $firstName = this.$form.querySelector(
      `[user-ele-input="${USER_DATA_PROPS.primaryOwnerFirstName}"]`
    );
    // const $lastName = this.$form.querySelector(
    //   `[user-ele-input="${USER_DATA_PROPS.lastName}"]`
    // );

    const fullName = `${$firstName.value}`; // ${$lastName.value}`;

    await PDF_Handler.updateUserNameV2(fullName);
  }

  handleInputChanges(ele) {
    if (!ele) return;
    const FORM_SEARCH_TEXT = ele.getAttribute("user-ele-input");
    const SEARCHABLE_TEXT = INPUT_FORM_SEARCHEABLE_PROPS[FORM_SEARCH_TEXT];

    if (!SEARCHABLE_TEXT) return;

    let getResultFrom = null;
    let previewTextToSearch = null;

    if (FORM_SEARCH_TEXT === USER_DATA_PROPS.email) {
      getResultFrom = 0;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.primaryOwnerEmail) {
      getResultFrom = 1;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.primaryOwnerCity) {
      getResultFrom = 0;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.mailingCity) {
      getResultFrom = 1;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.mailingState) {
      getResultFrom = 1;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.primaryOwnerState) {
      getResultFrom = 0;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.mailingZip) {
      getResultFrom = 1;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.primaryOwnerZip) {
      getResultFrom = 0;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.mailingAddress) {
      getResultFrom = 1;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.primaryOwnerAddress) {
      getResultFrom = 0;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.primaryOwnerAddressTwo) {
      getResultFrom = 1;
    } else if (FORM_SEARCH_TEXT === USER_DATA_PROPS.mailingAddressTwo) {
      getResultFrom = 0;
    }

    if (getResultFrom !== null) {
      previewTextToSearch = DUPLICATE_NAMES[SEARCHABLE_TEXT]?.[getResultFrom];
    }

    // PDF_HANDLER.updateText(SEARCHABLE_TEXT, ele.value, previewTextToSearch);
  }

  async uploadPdf() {
    try {
      // const arrayBuffer = await PDF_HANDLER.instance.exportPDF();

      const blob = await PDF_Handler.getPDFBlob();


      let hasPdfEle = document.querySelector("#user-signed-pdf");
      if (!hasPdfEle) {
        hasPdfEle = document.createElement("input");
        hasPdfEle.type = "file";
        hasPdfEle.id = "user-signed-pdf";
        hasPdfEle.name = "user-signed.pdf";
      }

      let file = new File([blob], "user-signed.pdf", {
        type: "application/pdf",
        lastModified: new Date().getTime(),
      });

      let container = new DataTransfer();
      container.items.add(file);
      hasPdfEle.files = container.files;

      // subtract size of pdf from total size
      const pdfSize = blob.size;
      this.TOTAL_FILE_SIZE_ALLOWED -= pdfSize;
      console.log("append csv to form");

      this.$form.appendChild(hasPdfEle);

      // this.checkAndHandleFileUploadSizes();
      const $fileInputs = this.$form.querySelectorAll(".file-upload[type='file']");
      this.MAX_FILE_SIZE = this.TOTAL_FILE_SIZE_ALLOWED / $fileInputs.length;

      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }

  handleSubmitBtn(disable, state) {
    const $submitBtn = this.$form.querySelector("[type='submit']");
    if (disable) {
      $submitBtn.setAttribute("disabled", true);
      $submitBtn.style.cursor = "not-allowed";
      $submitBtn.style.pointerEvents = "none";
    } else {
      $submitBtn.removeAttribute("disabled");
      $submitBtn.style.cursor = "pointer";
      $submitBtn.style.pointerEvents = "auto";
    }

    if (state === "loading") {
      $submitBtn.innerHTML =
        $submitBtn.getAttribute("data-wait") || "Please Wait...";
      $submitBtn.value =
        $submitBtn.getAttribute("data-wait") || "Please Wait...";
    } else {
      $submitBtn.innerHTML = $submitBtn.getAttribute("value");
      $submitBtn.value = $submitBtn.getAttribute("value");
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const $parentEle = this.$form.parentElement;
    this.handleSubmitBtn(true, "loading");
    try {
      const formData = new FormData(this.$form);

      const resData = await fetch(this.$form.getAttribute("action"), {
        method: "POST",
        body: formData,
        dataType: "json",
      });

      if (resData.status === 200) {
        if (this.$form.getAttribute("redirect")) {
          window.location.href = this.$form.getAttribute("redirect");
        } else {
          $parentEle.querySelector("form").style.display = "none";
          $parentEle.querySelector(".w-form-done").style.display = "block";
        }
      } else {
        $parentEle.querySelector(".w-form-fail").style.display = "block";
      }

      this.handleSubmitBtn(false);
      return true;
    } catch (error) {
      console.log({ error });
      this.handleSubmitBtn(false);
      return false;
    }
  }
}

new FormHandler();
