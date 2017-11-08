"use strict";

include("../utilities/utilities.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.OptionsDropdown = function(container) {

    let self = this;

    let options = {};
    let dropdownList = null;

    this.onChange = function() {};

    {
        if (!container)
            container = document.body;

        if (TeacherManager.OptionsDropdown.checkboxes == undefined) {
            TeacherManager.OptionsDropdown.checkboxes = 0;
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

    this.addOption = function(optionID, label, checked) {

        if (checked == undefined)
            checked = false;

        let listItem = createElement("li", dropdownList);
        let link = createElement("a", listItem, {
            href: "#",
            "class": "small"
        });

        let checkboxID = "tm-checkbox" + TeacherManager.OptionsDropdown.checkboxes;

        createElement("input", link, {
            type: "checkbox",
            id: checkboxID
        });

        let toggle = () => {

            let element = document.getElementById(checkboxID);
            element.checked = !element.checked;
            options[optionID] = element.checked;
        };

        link.onclick = function(e) {

            e.stopPropagation();
            toggle();
            self.onChange();
        };
        link.innerHTML += " " + label;

        options[optionID] = false;
        if (checked)
            toggle();

        TeacherManager.OptionsDropdown.checkboxes++;
    };

    this.getOptions = function() {
        return options;
    };
};
