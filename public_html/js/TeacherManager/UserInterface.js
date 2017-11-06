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

    function element(type, parent) {

        let result = document.createElement(type);
        if (parent)
            parent.appendChild(result);
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

        let navBarElement = element("nav", container);
        navBarElement.setAttribute("class", "navbar navbar-default navbar-static-top");

        let navBarContainerDiv = element("div", navBarElement);
        navBarContainerDiv.setAttribute("class", "container");

        let navBarHeaderDiv = element("div", navBarContainerDiv);
        navBarHeaderDiv.setAttribute("class", "navbar-header");

        let navBarBrandLink = element("a", navBarHeaderDiv);
        navBarBrandLink.setAttribute("class", "navbar-brand");
        navBarBrandLink.setAttribute("href", "#");
        navBarBrandLink.innerHTML = APP_TITLE;

        let navBarButtonsDiv = element("div", navBarContainerDiv);
        navBarButtonsDiv.setAttribute("class", "navbar-collapse collapse");

        navBarList = element("ul", navBarButtonsDiv);
        navBarList.setAttribute("class", "nav navbar-nav");

        navBarContentContainer = element("div", container);
        navBarContentContainer.setAttribute("class", "tab-content");

        createTab(WORKLOAD_TAB_ID, WORKLOAD_TAB_LABEL);
        createTab(TEACHERS_TAB_ID, TEACHERS_TAB_LABEL);
        createTab(COURSES_TAB_ID, COURSES_TAB_LABEL);
        createTab(INFO_TAB_ID, INFO_TAB_LABEL);

        initialized = true;
    };
};
