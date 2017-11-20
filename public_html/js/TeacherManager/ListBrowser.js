function TMListBrowser() {

    let self = this;

    let tableBody = null;

    this.container = null;

    this.itemSelected = function(id) {};

    this.addList = function(label, tableHeaders) {

        let table = createElement("table", self.container, {
            "class": "table table-striped table-hover"
        });
        let tableHead = createElement("thead", table);
        let headRow = createElement("tr", tableHead);

        for (let key in tableHeaders)
            createElement("th", headRow, {innerHTML: tableHeaders[key]});

        tableBody = createElement("tbody", table);
    };

    this.addListItem = function(id, values) {

        let tableBodyRow = createElement("tr", tableBody);
        tableBodyRow.addEventListener("click", () => {
            self.itemSelected(id);
        });

        for (let key in values)
            createElement("td", tableBodyRow, {innerHTML: values[key]});
    };

    this.clearDetails = function() {};

    this.createDetail = function(header) {

    };

    this.addDetail = function(header, value) {

    };

    this.enableDetailView = function() {};
    this.disableDetailView = function() {};
}
