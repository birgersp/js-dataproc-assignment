if (!window.TeacherManager)
    window.TeacherManager = {};

TeacherManager.TeacherBrowser = function() {

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

    this.container = null;

    this.initialize = function() {
    };

    this.setTeacherData = function(teachers) {

        this.container.innerHTML = "";

        let table = createElement("table", self.container, {
            "class": "table table-striped"
        });
        let tableHead = createElement("thead", table);
        let headRow = createElement("tr", tableHead);

        for (let key in attributeKeys)
            createElement("th", headRow, {innerHTML: attributeKeys[key]});

        let tableBody = createElement("tbody", table);

        for (let teacherID in teachers) {
            let teacher = teachers[teacherID];
            let tableBodyRow = createElement("tr", tableBody);
            for (let key in attributeKeys)
                createElement("td", tableBodyRow, {innerHTML: teacher[key]});
        }
    };
};
