function TMDataValidator() {

    let self = this;

    this.minimumWorkloadPercent = 25;
    this.maximumWorkloadPercent = 100;

    this.getCourseCoverage = function(course) {

        let coverage = 0;
        for (let teacherID in course.teachingCoveredPercent)
            coverage += course.teachingCoveredPercent[teacherID];
        return coverage;
    };

    this.teacherHasWorkloadAboveThreshold = function(teacher, season) {

        if ((!teacher.isExternal) && (!teacher.isStudentAssistant))
            if (teacher.workloadNormalized[season] * 100 < self.minimumWorkloadPercent)
                return false;

        return true;
    };

    this.teacherHasWorkloadBelowThreshold = function(teacher, season) {

        if ((!teacher.isExternal) && (!teacher.isStudentAssistant))
            if (teacher.workloadNormalized[season] * 100 > self.maximumWorkloadPercent)
                return false;

        return true;

    };

    this.validateTeacher = function(teacher) {

        if (teacher.isExternal || teacher.isStudentAssistant)
            return true;

        if (!self.teacherHasWorkloadAboveThreshold(teacher, TMCourse.Season.SPRING))
            return false;

        if (!self.teacherHasWorkloadAboveThreshold(teacher, TMCourse.Season.FALL))
            return false;

        if (!self.teacherHasWorkloadBelowThreshold(teacher, TMCourse.Season.SPRING))
            return false;

        if (!self.teacherHasWorkloadBelowThreshold(teacher, TMCourse.Season.FALL))
            return false;

        return true;
    };

    this.courseCoverageAboveThreshold = function(course) {

        return self.getCourseCoverage(course) > 0;
    };

    this.courseCoverageBelowThreshold = function(course) {

        return self.getCourseCoverage(course) == 100;
    };

    this.validateCourse = function(course) {

        if (!self.courseCoverageAboveThreshold(course))
            return false;

        if (!self.courseCoverageBelowThreshold(course))
            return false;

        return true;
    };
}
