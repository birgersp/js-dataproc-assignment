"use strict";

include("../utilities/utilities.js");

/**
 * Creates a dropdown-menu of options
 * @param {Element} container A DOM element which shall contain the dropdown menu
 * @returns {TMOptionsDropdown}
 */
function TMOptionsDropdown(container) {

    let self = this;

    this.options = {};
    let dropdownList = null;

    /**
     * Callback which is invoked when options have changed
     */
    this.onChange = function() {};

    // Initialization, creates necessary DOM elements
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

    /**
     * Adds a checkable option to the dropdown menu
     * Attempts to find the option matching the target key in the options member
     * If the option is not found, it is created (default value is false)
     * @param {String} targetKey
     * @param {String} label
     */
    this.addOption = function(targetKey, label) {

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
            self.options[targetKey] = element.checked;
        };

        link.onclick = function(e) {

            // This prevents the webpage from closing the dropdown when an option is clicked
            e.stopPropagation();
            toggle();
            self.onChange();
        };
        link.innerHTML += " " + label;

        if (self.options[targetKey] == undefined)
            self.options[targetKey] = false;
        else
            document.getElementById(checkboxID).checked = self.options[targetKey];

        TMOptionsDropdown.checkboxes++;
    };
}
