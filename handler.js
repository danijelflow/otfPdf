import PDF_Handler from "./mypdf.js";

import SignatureBoxModalHandler from "./pdf/signatureBox.js";

import {
  USER_DATA_PROPS,
  INPUT_FORM_SEARCHEABLE_PROPS,
  DUPLICATE_NAMES,
  USER_DATA_ELE_POSTION,
  EVENTS_LIST,
} from "./mainObject.js";
import "./requestSubmitPolyfill.js";
import AlertBox from "./AlertBox.js";

class FormHandler {
  constructor() {
    this.$form = document.querySelector("[custom-form='pspdf']");
    this.$uploadPdfBtn = document.querySelector("[upload-pdf='to-form']");
    this.$addUsernameBtn = document.querySelector(
      "[pdf-action-btn='add-username']"
    );
    this.alertBox = new AlertBox();
    this.SignatureHandler = new SignatureBoxModalHandler();

    console.log({ SignatureHandler: this.SignatureHandler });

    this.init();
  }

  async init() {
    this.disableBtn();
    await PDF_Handler.init();

    this.activateEvents();
    this.updateDocsLogic();
    this.checkAndHandleFileUploadSizes();

    console.log({ PDF_Handler });
  }

  activateEvents() {
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
    const $fileInputs = this.$form.querySelectorAll("[type='file']");
    const MAX_FILE_SIZE_IN_MB = 5;
    const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024; // 5MB

    $fileInputs.forEach(($fileInput) => {
      $fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file.size > MAX_FILE_SIZE) {
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

    $signBox.innerHTML = `Add Signature`;

    $signBox.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setTimeout(()=>{
        this.SignatureHandler.openModal();
      },200)
    });

    this.$signBox = $signBox;

    PDF_Handler.renderRoot.appendChild($signBox);
  }

  updateDocsLogic() {
    const $loanAmntInput = this.$form.querySelector(
      `[user-ele-input="amount_requested"]`
    );

    if (!$loanAmntInput) {
      console.log("Loan amount input not found");
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
      ...USER_DATA_ELE_POSTION,
    };
    const eles = Object.values(USER_DATA_PROPS).map((val) => {
      const $input = this.$form.querySelector(`[user-ele-input="${val}"]`);
      if (!$input) return null;

      const inputVal = $input.value;

      newClonedObj[val] && (newClonedObj[val].text = inputVal);

      return $input;
    });

    await PDF_Handler.bulkAddText(Object.values(USER_DATA_PROPS), newClonedObj);
  }

  async addUsername() {
    const $firstName = this.$form.querySelector(
      `[user-ele-input="${USER_DATA_PROPS.firstName}"]`
    );
    const $lastName = this.$form.querySelector(
      `[user-ele-input="${USER_DATA_PROPS.lastName}"]`
    );

    const fullName = `${$firstName.value} ${$lastName.value}`;

    await PDF_Handler.updateUserName(fullName);
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

      console.log({ blob });

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

      this.$form.appendChild(hasPdfEle);
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
