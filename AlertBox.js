class AlertBox {
  constructor(alertEle, options) {
    if (!alertEle) {
      const $alertEleToAdd = $(`<div class="alert-box"></div>`);
      $alertEleToAdd.hide();
      $("body").append($alertEleToAdd);
    }

    this.$alertEle = alertEle ? $(alertEle) : $(".alert-box");
    this.options = options;
    this.showAlertTime = this.options?.showAlertTime || 5000;
    this.init();
  }

  init() {
    this.hideAlert();
  }

  showAlert(alertMsg, alertType, showTill) {
    this.$alertEle.removeClass(["success", "error", "warning"]);

    switch (alertType) {
      case "success":
        this.$alertEle.addClass("success");
        break;
      case "error":
        this.$alertEle.addClass("error");
        break;
      case "warning":
        this.$alertEle.addClass("warning");
        break;
      default:
        break;
    }

    this.$alertEle.text(alertMsg);
    this.$alertEle.slideDown();

    setTimeout(() => {
      this.hideAlert();
    }, showTill || this.showAlertTime);
  }

  hideAlert() {
    this.$alertEle.slideUp();
  }
}

export default AlertBox;
