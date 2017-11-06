include("../thirdparty/jquery-3.2.1.min.js");
include("../thirdparty/bootstrap.min.js");

TeacherManager.UserInterface = function () {

    // Element which contains the user interface
    let container = null;

    // List element which contains the tab links (buttons)
    let tabListElement = null;

    // Element which contains the tab content divs
    let tabDivsContainer = null;

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

        tabDivsContainer.appendChild(tabContentDiv);
        return tabContentDiv;
    }

    this.initialize = function () {

        if (initialized)
            throw "Already initialized";

        loadBootstrapCSS();

        document.body.innerHTML = "";

        container = document.body;

        tabListElement = document.createElement("ul");
        tabListElement.classList.add("nav");
        tabListElement.classList.add("nav-tabs");
        container.appendChild(tabListElement);

        tabDivsContainer = document.createElement("div");
        tabDivsContainer.classList.add("tab-content");
        container.appendChild(tabDivsContainer);

        let teachersDiv = createTab("Teacher Workload");
        teachersDiv.innerHTML = "<h4>Teacher Workload</h4>";

        let coursesDiv = createTab("Courses");
        coursesDiv.innerHTML = "<h4>Courses</h4>";

        initialized = true;
    };
};
