"use strict";

include("../utilities/utilities.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.OptionsDropdown = function(container) {

    if (!container)
        container = document.body;

    (() => {

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

        let dropdownList = createElement("ul", dropdownDiv, {
            "class": "dropdown-menu"
        });

        let li1 = createElement("li", dropdownList);
        let a1 = createElement("a", li1, {
            href: "#",
            "class": "small"
        });

        let checkbox1 = createElement("input", a1, {
            type: "checkbox",
            id: "checkbox"
        });

        let check = () => {
            let element = document.getElementById("checkbox");
            element.checked = !element.checked;
        };

        a1.onclick = function(e) {
            check();
            e.stopPropagation();
        };

        a1.innerHTML += " Option 1";
    })();

    this.addCheckbox = function(label) {
    };
};
