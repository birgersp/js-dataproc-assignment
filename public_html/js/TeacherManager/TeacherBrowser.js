function TMTeacherBrowser() {

    let self = this;

    let attributeKeys = {
        lastName: "Lastname",
        firstName: "Firstname",
        facultyCode: "Faculty",
        departmentCode: "Department",
        isExternal: "Is external",
        isStudentAssistant: "Is stud.ass.",
        employmentPercentage: "% Employment"
    };

    let teacherOverviewDiv = null;
    let teacherDetailedView = null;
    let teachers = {};

    this.container = null;

    this.initialize = function() {

        let warningHeader = createElement("h4");
        warningHeader.innerHTML = "Awaiting teacher data...";

        this.container.innerHTML = "";
        teacherOverviewDiv = createElement("div", self.container);
        teacherOverviewDiv.appendChild(warningHeader);

        teacherDetailedView = createElement("div", self.container);
        teacherDetailedView.appendChild(warningHeader);
    };

    this.setTeacherData = function(newTeachers) {

        teacherOverviewDiv.innerHTML = "";

        let table = createElement("table", teacherOverviewDiv, {
            "class": "table table-striped table-hover"
        });
        let tableHead = createElement("thead", table);
        let headRow = createElement("tr", tableHead);

        for (let key in attributeKeys)
            createElement("th", headRow, {innerHTML: attributeKeys[key]});

        let tableBody = createElement("tbody", table);

        for (let teacherID in newTeachers) {
            let teacher = newTeachers[teacherID];
            let tableBodyRow = createElement("tr", tableBody);
            tableBodyRow.addEventListener("click", () => {
                self.showTeacherDetails(teacher);
            });
            for (let key in attributeKeys)
                createElement("td", tableBodyRow, {innerHTML: teacher[key]});

            teachers[teacherID] = newTeachers[teacherID];
        }
    };

    this.showTeacherDetails = function(teacher) {

        teacherDetailedView.innerHTML = "";
        let table = createElement("table", teacherDetailedView, {
            "class": "table table-striped table-hover"
        });

        let tableBody = createElement("tbody", table);

        let createRowValue = (label, value) => {
            let tableBodyRow = createElement("tr", tableBody);
            createElement("th", tableBodyRow, {innerHTML: label, style: "width: 1%; white-space: nowrap;"});
            return  createElement("td", tableBodyRow, {innerHTML: value});
        };

        for (let key in attributeKeys)
            createRowValue(attributeKeys[key], teacher[key]);

        createRowValue("Workload, spring", teacher.workload.spring + " hours (" + Math.round(teacher.workloadNormalized.spring * 100) + "%)");
        createRowValue("Workload, fall", teacher.workload.fall + " hours (" + Math.round(teacher.workloadNormalized.fall * 100) + "%)");

        teacherOverviewDiv.style.setProperty("display", "none");
        teacherDetailedView.style.setProperty("display", "block");
    };

    this.resetView = function() {
        teacherDetailedView.style.setProperty("display", "none");
        teacherOverviewDiv.style.setProperty("display", "block");
    };
}
;
