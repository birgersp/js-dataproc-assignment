include("../thirdparty/jquery-3.2.1.min.js");
include("../thirdparty/bootstrap.min.js");

TeacherManager.UserInterface = function () {

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

    function element(type, parent, attributes) {

        let result = document.createElement(type);
        if (parent)
            parent.appendChild(result);

        if (attributes)
            for (let key in attributes) {
                if (key === "innerHTML")
                    result[key] = attributes[key];
                else
                    result.setAttribute(key, attributes[key]);
            }

        return result;
    }

    function loadBootstrapCSS() {

        let bootstrapCSS = element("link", document.head);
        bootstrapCSS.setAttribute("rel", "stylesheet");
        bootstrapCSS.setAttribute("href", "css/bootstrap.min.css");
    }

    function createTab(id, label) {

        let listItem = element("li", navBarList);
        if (noOfTabs === 0)
            listItem.classList.add("active");

        let listItemLink = element("a", listItem);
        listItemLink.setAttribute("id", id);
        listItemLink.setAttribute("href", "#" + id + "-container");
        listItemLink.setAttribute("data-toggle", "tab");
        listItemLink.innerHTML = label;

        let tabContainer = element("div", navBarContentContainer);
        tabContainer.setAttribute("id", id + "-container");
        tabContainer.setAttribute("class", "tab-pane");

        if (noOfTabs === 0)
            tabContainer.classList.add("active");

        let content = element("p", tabContainer);
        content.innerHTML = "Hei hei " + id;

        noOfTabs++;
    }

    this.initialize = function () {

        if (initialized)
            throw "Already initialized";

        loadBootstrapCSS();
        document.body.innerHTML = "";

        let container = document.body;

        let navBarElement = element("nav", container, {"class": "navbar navbar-default navbar-static-top"});
        let navBarContainerDiv = element("div", navBarElement, {"class": "container"});
        let navBarHeaderDiv = element("div", navBarContainerDiv, {"class": "navbar-header"});
        let navBarButton = element("button", navBarHeaderDiv,
                {
                    "class": "navbar-toggle collapsed",
                    "type": "button",
                    "data-toggle": "collapse",
                    "data-target": "#navbar",
                    "aria-expanded": "false",
                    "aria-controls": "navbar"
                });
        element("span", navBarButton, {"class": "icon-bar"});
        element("span", navBarButton, {"class": "icon-bar"});
        element("span", navBarButton, {"class": "icon-bar"});

        element("a", navBarHeaderDiv,
                {
                    href: "#",
                    "class": "navbar-brand",
                    innerHTML: APP_TITLE
                });

        let navBarButtonsDiv = element("div", navBarContainerDiv,
                {
                    id: "navbar",
                    "class": "navbar-collapse collapse"
                });

        navBarList = element("ul", navBarButtonsDiv, {"class": "nav navbar-nav"});
        navBarContentContainer = element("div", container, {"class": "tab-content"});

        createTab(WORKLOAD_TAB_ID, WORKLOAD_TAB_LABEL);
        createTab(TEACHERS_TAB_ID, TEACHERS_TAB_LABEL);
        createTab(COURSES_TAB_ID, COURSES_TAB_LABEL);
        createTab(INFO_TAB_ID, INFO_TAB_LABEL);

        initialized = true;
    };
};
