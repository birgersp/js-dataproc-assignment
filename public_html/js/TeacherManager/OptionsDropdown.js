"use strict";

include("../utilities/utilities.js");

function TMOptionsDropdown(container) {

    let self = this;

    this.options = {};
    let dropdownList = null;

    this.onChange = function() {};

    {
        if (!container)
            container = document.body;

        if (TMOptionsDropdown.checkboxes == undefined) {
            TMOptionsDropdown.checkboxes = 0;
        }

        let dropdownDiv = createElement("div", container, {"class": "dropdown"});

        let button = createElement("button", dropdownDiv, {
            type: "button",
            "class": "btn btn-default btn-sm dropdown-toggle",
            "data-toggle": "dropdown"
        });

        createElement("span", button, {
            "class": "glyphicon glyphicon-cog",
            innerHTML: " "
        });
        button.innerHTML += " ";

        createElement("span", button, {
            "class": "caret"
        });

        dropdownList = createElement("ul", dropdownDiv, {
            "class": "dropdown-menu"
        });
    }

    this.addOption = function(optionID, label) {

        let listItem = createElement("li", dropdownList);
        let link = createElement("a", listItem, {
            href: "#",
            "class": "small"
        });

        let checkboxID = "tm-checkbox" + TMOptionsDropdown.checkboxes;

        createElement("input", link, {
            type: "checkbox",
            id: checkboxID
        });

        let toggle = () => {

            let element = document.getElementById(checkboxID);
            element.checked = !element.checked;
            self.options[optionID] = element.checked;
        };

        link.onclick = function(e) {

            e.stopPropagation();
            toggle();
            self.onChange();
        };
        link.innerHTML += " " + label;

        if (self.options[optionID] == undefined)
            self.options[optionID] = false;
        else
            document.getElementById(checkboxID).checked = self.options[optionID];

        TMOptionsDropdown.checkboxes++;
    };
}
