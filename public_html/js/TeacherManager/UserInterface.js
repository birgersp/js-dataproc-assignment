include("../thirdparty/jquery-3.2.1.min.js");
include("../thirdparty/bootstrap.min.js");

TeacherManager.UserInterface = function () {

    const APP_TITLE = "Teacher Manager";

    let initialized = false;
    let noOfTabs = 0;

    let navBarList = null;

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

    function createTab(label) {

        noOfTabs;
        let listItem = element("li", navBarList);
        if (noOfTabs === 0)
            listItem.classList.add("active");

        let listItemLink = element("a", listItem);
        listItemLink.setAttribute("href", "#");
        listItemLink.innerHTML = label;

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

        createTab("Teacher Workload");
        createTab("Teachers");
        createTab("Courses");
        createTab("Info (0)");

        initialized = true;
    };
};
