function TMListBrowser() {

    let self = this;

    let listContainer = null;
    let listTableBody = null;

    let detailsContainer = null;
    let detailsTableBody = null;

    this.container = null;
    this.itemSelected = function(id) {};

    this.initialize = function() {

        listContainer = createElement("div", self.container);
        detailsContainer = createElement("div", self.container);

        let table = createElement("table", detailsContainer, {
            "class": "table table-striped table-hover"
        });

        detailsTableBody = createElement("tbody", table);
    };

    this.addList = function(label, tableHeaders) {

        if (label) {
            createElement("h4", listContainer, {innerHTML: label});
        }

        let table = createElement("table", listContainer, {
            "class": "table table-striped table-hover"
        });
        let tableHead = createElement("thead", table);
        let headRow = createElement("tr", tableHead);

        for (let key in tableHeaders)
            createElement("th", headRow, {innerHTML: tableHeaders[key]});

        listTableBody = createElement("tbody", table);
    };

    this.addListItem = function(id, values) {

        let tableBodyRow = createElement("tr", listTableBody);
        tableBodyRow.addEventListener("click", () => {
            self.itemSelected(id);
        });

        for (let key in values)
            createElement("td", tableBodyRow, {innerHTML: values[key]});
    };

    this.clearDetails = function() {

        while (detailsTableBody.hasChildNodes())
            detailsTableBody.removeChild(detailsTableBody.lastChild);
    };

    this.createDetail = function(header) {

        let tableBodyRow = createElement("tr", detailsTableBody);
        createElement("th", tableBodyRow, {innerHTML: header, style: "width: 1%; white-space: nowrap;"});
        return createElement("td", tableBodyRow);
    };

    this.addDetail = function(header, value) {

        let cell = self.createDetail(header);
        cell.innerHTML = value;
    };

    this.enableDetailView = function() {

        detailsContainer.style.setProperty("display", "block");
        listContainer.style.setProperty("display", "none");
    };

    this.disableDetailView = function() {

        detailsContainer.style.setProperty("display", "none");
        listContainer.style.setProperty("display", "block");
    };
}
