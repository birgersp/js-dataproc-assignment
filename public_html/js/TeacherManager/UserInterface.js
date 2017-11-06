include("../thirdparty/jquery-3.2.1.min.js");
include("../thirdparty/bootstrap.min.js");

TeacherManager.UserInterface = function () {

    let tabContentContainer = null;
    let tabListElement = null;
    let initialized = false;

    let noOfTabs = 0;

    function loadBootstrapCSS() {
        let bootstrapCSS = document.createElement("link");
        bootstrapCSS.setAttribute("rel", "stylesheet");
        bootstrapCSS.setAttribute("href", "css/bootstrap.min.css");
        document.head.appendChild(bootstrapCSS);
    }

    function createTab(label) {

        noOfTabs++;
        let id = "tab" + noOfTabs;

        let listItem = document.createElement("li");
        tabListElement.appendChild(listItem);
        if (noOfTabs === 1)
            listItem.classList.add("active");

        let link = document.createElement("a");
        link.setAttribute("href", "#" + id);
        link.setAttribute("data-toggle", "tab");
        link.innerHTML = label;
        listItem.appendChild(link);

        let tabContentDiv = document.createElement("div");
        tabContentDiv.setAttribute("id", id);
        tabContentDiv.classList.add("tab-pane");

        if (noOfTabs === 1)
            tabContentDiv.classList.add("active");

        tabContentContainer.appendChild(tabContentDiv);
        return tabContentDiv;
    }

    this.initialize = function () {

        if (initialized)
            throw "Already initialized";

        loadBootstrapCSS();

        document.body.innerHTML = "";

        tabContentContainer = document.body;

        tabListElement = document.createElement("ul");
        tabListElement.classList.add("nav");
        tabListElement.classList.add("nav-tabs");
        tabContentContainer.appendChild(tabListElement);

        let teachersDiv = createTab("Teacher Workload");
        teachersDiv.innerHTML = "(TEACHER WORKLOAD)";

        let coursesDiv = createTab("Courses");
        coursesDiv.innerHTML = "(COURSES)";

        initialized = true;
    };
};
