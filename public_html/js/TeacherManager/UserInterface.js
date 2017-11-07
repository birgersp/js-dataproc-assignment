"use strict";

include("../thirdparty/jquery-3.2.1.min.js");
include("../thirdparty/bootstrap.min.js");

if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.UserInterface = function() {

    const APP_TITLE = "Teacher Manager";

    const WORKLOAD_TAB_ID = "workload";
    const WORKLOAD_TAB_LABEL = "Teacher Workload";

    const TEACHERS_TAB_ID = "teachers";
    const TEACHERS_TAB_LABEL = "Teachers";

    const COURSES_TAB_ID = "courses";
    const COURSES_TAB_LABEL = "Courses";

    const INFO_TAB_ID = "info";
    const INFO_TAB_LABEL = "Info";

    let initialized = false;
    let noOfTabs = 0;
    let navBarList = null;
    let navBarContentContainer = null;

    let workloadContainer = null;

    function loadBootstrapCSS() {

        let bootstrapCSS = createElement("link", document.head);
        bootstrapCSS.setAttribute("rel", "stylesheet");
        bootstrapCSS.setAttribute("href", "css/bootstrap.min.css");
    }

    function createTab(id, label) {

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

        return tabContainer;
    }

    this.initialize = function() {

        if (initialized)
            throw "Already initialized";

        loadBootstrapCSS();
        document.body.innerHTML = "";

        let container = document.body;

        let navBarElement = createElement("nav", container, {"class": "navbar navbar-default"});
        let navBarContainerDiv = createElement("div", navBarElement, {"class": "container"});
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
                    innerHTML: APP_TITLE
                });

        let navBarButtonsDiv = createElement("div", navBarContainerDiv,
                {
                    id: "navbar",
                    "class": "navbar-collapse collapse"
                });

        navBarList = createElement("ul", navBarButtonsDiv, {"class": "nav navbar-nav"});
        navBarContentContainer = createElement("div", container, {"class": "tab-content"});

        workloadContainer = createTab(WORKLOAD_TAB_ID, WORKLOAD_TAB_LABEL);
        createTab(TEACHERS_TAB_ID, TEACHERS_TAB_LABEL);
        createTab(COURSES_TAB_ID, COURSES_TAB_LABEL);
        createTab(INFO_TAB_ID, INFO_TAB_LABEL);

        initialized = true;
    };

    this.getWorkloadContainer = function() {
        return workloadContainer;
    };
};
