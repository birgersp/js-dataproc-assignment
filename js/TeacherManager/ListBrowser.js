"use strict";

/**
 * Creates a browser of one or more lists, where each entry (line) in the list may be selected to view details about the entry
 * @returns {TMListBrowser}
 */
function TMListBrowser() {

    let self = this;

    let listContainer = null;
    let listTableBody = null;

    let detailsContainer = null;
    let detailsTableBody = null;

    let tableBodyRow = null;

    this.container = null;
    this.itemSelected = function(id) {};

    /**
     * Creates two containers, one to contain one or more lists (tables) for overview and one to contain a single table for details
     */
    this.initialize = function() {

        listContainer = createElement("div", self.container);
        detailsContainer = createElement("div", self.container);

        let table = createElement("table", detailsContainer, {
            "class": "table table-striped table-hover"
        });

        detailsTableBody = createElement("tbody", table);
    };

    /**
     * Adds a new list (table) to the browser with the attribute labels of the data on top
     * @param {String} label
     * @param {String[]} tableHeaders
     */
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

    /**
     * Adds a new row to the previously added list (table)
     * The ID of the row is used when selecting (clicking) a row
     * @param {String} id
     */
    this.addListRow = function(id) {

        tableBodyRow = createElement("tr", listTableBody, {"class": "clickable"});
        tableBodyRow.addEventListener("click", () => {
            self.itemSelected(id);
        });
    };

    /**
     * Adds a cell with containing a value to the previously added table row
     * The value may be marked red by setting the "markRed" parameter
     * @param {String} value
     * @param {Boolean} markRed (optional)
     */
    this.addListValue = function(value, markRed) {
        let cell = createElement("td", tableBodyRow, {innerHTML: value});
        if (markRed === true) {
            cell.setAttribute("style", "color:red; font-weight:bold;");
        }
    };

    /**
     * Adds a row to the previously added table, and fills in the row with values
     * @param {String} id ID of the row to add
     * @param {String[]} values
     */
    this.addListItem = function(id, values) {

        self.addListRow(id);
        for (let key in values)
            self.addListValue(values[key]);
    };

    /**
     * Hides (removes DOM elements of) all details
     * Use this when clearing old and showing details of a different entry than earlier
     */
    this.clearDetails = function() {

        while (detailsTableBody.hasChildNodes())
            detailsTableBody.removeChild(detailsTableBody.lastChild);
    };

    /**
     * Adds a row to the table of details and displays a attribute name (header)
     * @param {String} header Label
     * @returns {Element} The table cell element containing the detail (attribute value)
     */
    this.createDetail = function(header) {

        let tableBodyRow = createElement("tr", detailsTableBody);
        createElement("th", tableBodyRow, {innerHTML: header, style: "width: 1%; white-space: nowrap;"});
        return createElement("td", tableBodyRow);
    };

    /**
     * Adds a row to the table of details, with a attribute name and value
     * @param {String} header
     * @param {String} value
     */
    this.addDetail = function(header, value) {

        let cell = self.createDetail(header);
        cell.innerHTML = value;
    };

    /**
     * Hides the overview lists (tables) and shows the list (table) of details
     */
    this.enableDetailView = function() {

        detailsContainer.style.setProperty("display", "block");
        listContainer.style.setProperty("display", "none");
    };

    /**
     * Hides the list (table) of details and shows the overview lists (tables)
     */
    this.disableDetailView = function() {

        detailsContainer.style.setProperty("display", "none");
        listContainer.style.setProperty("display", "block");
    };
}
