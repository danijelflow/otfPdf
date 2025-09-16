class HandleTableOnPage {
  constructor($table, options) {
    this.$table = $table;
    this.options = options;
    this.init();
  }

  init() {
    this.loadTable();
    // this.downloadPDF();
  }

  loadTable() {
    this.table = new Tabulator(this.$table, {
      data: this.options.tableData, //assign data to table
      columns: this.options.tableColumns,
      layout:"fitColumns",
       history:true,

      downloadEncoder: function (fileContents, mimeType) {

        console.log("downloadEncoder",fileContents, mimeType);
         document.dispatchEvent(new CustomEvent("downloadEncoder", { detail: { fileContents, mimeType } }));
         return false; //must return a blob to proceed with the download, return false to abort download
         //  return new Blob([fileContents], { type: mimeType });
       }
    });
  }

  downloadPDF() {
    this.table.download("pdf", "debtScheduler.pdf", {
      orientation: "portrait",
      title: "Debt Schedule Report",
    });
  }
}

export default HandleTableOnPage;