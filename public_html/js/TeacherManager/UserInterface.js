"use strict";

include("../thirdparty/jquery-3.2.1.min.js");
include("../thirdparty/bootstrap.min.js");

include("Tab.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.UserInterface = function() {

    let ui = this;

    this.appTitle = "UNTITLED";

    let initialized = false;
    let noOfTabs = 0;
    let navBarList = null;
    let navBarContentContainer = null;

    function loadBootstrapCSS() {

        let bootstrapCSS = createElement("link", document.head);
        bootstrapCSS.setAttribute("rel", "stylesheet");
        bootstrapCSS.setAttribute("href", "css/bootstrap.min.css");
    }

    this.initialize = function() {

        if (initialized)
            throw "Already initialized";

        loadBootstrapCSS();
        document.body.innerHTML = "";

        let container = document.body;

        let navBarElement = createElement("nav", container, {"class": "navbar navbar-default"});
        let navBarContainerDiv = createElement("div", navBarElement);
        let navBarHeaderDiv = createElement("div", navBarContainerDiv, {"class": "navbar-header"});
        let navBarButton = createElement("button", navBarHeaderDiv,
                {
                    "class": "navbar-toggle collapsed",
                    "type": "button",
                    "data-toggle": "collapse",
                    "data-target": "#navbar",
                    "aria-expanded": "false",
                    "aria-controls": "navbar"
                });
        createElement("span", navBarButton, {"class": "icon-bar"});
        createElement("span", navBarButton, {"class": "icon-bar"});
        createElement("span", navBarButton, {"class": "icon-bar"});

        createElement("a", navBarHeaderDiv,
                {
                    href: "#",
                    "class": "navbar-brand",
                    innerHTML: ui.appTitle
                });

        let navBarButtonsDiv = createElement("div", navBarContainerDiv,
                {
                    id: "navbar",
                    "class": "navbar-collapse collapse"
                });

        navBarList = createElement("ul", navBarButtonsDiv, {"class": "nav navbar-nav"});
        navBarContentContainer = createElement("div", container, {"class": "tab-content"});

        initialized = true;
    };

    /**
     * Creates a tab in the UI, and returns its corresponding tab object
     * @param {String} id
     * @param {String} label
     * @returns {TeacherManager.Tab}
     */
    this.createTab = function(id, label) {

        let listItem = createElement("li", navBarList);
        if (noOfTabs === 0)
            listItem.classList.add("active");

        let listItemLink = createElement("a", listItem);
        listItemLink.setAttribute("id", id);
        listItemLink.setAttribute("href", "#" + id + "-container");
        listItemLink.setAttribute("data-toggle", "tab");
        listItemLink.innerHTML = label;

        let tabContainer = createElement("div", navBarContentContainer);
        tabContainer.setAttribute("id", id + "-container");
        tabContainer.setAttribute("class", "tab-pane");

        if (noOfTabs === 0)
            tabContainer.classList.add("active");

        let content = createElement("p", tabContainer);
        content.innerHTML = "<h4>Loading ...</h4>";

        noOfTabs++;

        let tab = new TeacherManager.Tab();
        tab.container = tabContainer;
        tab.id = id;
        tab.tabLink = listItemLink;
        tab.tabLink.addEventListener("click", tab.open);
        return tab;
    };
};
