"use strict";

include("../thirdparty/jquery-3.2.1.min.js");
include("../thirdparty/bootstrap.min.js");

include("Tab.js");

function TMUserInterface() {

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

        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = 'h4 { margin-left: 10px; margin-top: 40px; } tr.clickable:hover  {cursor: pointer; } ul { margin-bottom: 0px; }';
        document.getElementsByTagName('head')[0].appendChild(style);

        initialized = true;
    };

    /**
     * Creates a tab in the UI, and returns its corresponding tab object
     * @param {String} id
     * @param {String} label
     * @returns {TMTab}
     */
    this.createTab = function(id, label) {

        let listItem = createElement("li", navBarList);
        if (noOfTabs === 0)
            listItem.classList.add("active");

        let listItemLink = createElement("a", listItem, {
            id: id,
            href: "#" + id + "-container",
            "data-toggle": "tab",
            innerHTML: label
        });

        let tabContainer = createElement("div", navBarContentContainer, {
            id: id + "-container",
            "class": "tab-pane"
        });

        if (noOfTabs === 0)
            tabContainer.classList.add("active");

        noOfTabs++;

        let tab = new TMTab();
        tab.container = tabContainer;
        tab.id = id;
        tab.tabLink = listItemLink;
        tab.tabLink.addEventListener("click", tab.open);
        return tab;
    };
}
