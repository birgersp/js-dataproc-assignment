function TMTeacherValidator() {

    let self = this;

    this.minimumWorkloadPercent = 25;
    this.maximumWorkloadPercent = 100;

    this.hasWorkloadAboveThreshold = function(teacher, season) {

        if ((!teacher.isExternal) && (!teacher.isStudentAssistant))
            if (teacher.workloadNormalized[season] * 100 < self.minimumWorkloadPercent)
                return false;

        return true;
    };

    this.hasWorkloadBelowThreshold = function(teacher, season) {

        if ((!teacher.isExternal) && (!teacher.isStudentAssistant))
            if (teacher.workloadNormalized[season] * 100 > self.maximumWorkloadPercent)
                return false;

        return true;

    };

    this.validate = function(teacher) {

        if (teacher.isExternal || teacher.isStudentAssistant)
            return true;

        if (!self.hasWorkloadAboveThreshold(teacher, TMCourse.Season.SPRING))
            return false;

        if (!self.hasWorkloadAboveThreshold(teacher, TMCourse.Season.FALL))
            return false;

        if (!self.hasWorkloadBelowThreshold(teacher, TMCourse.Season.SPRING))
            return false;

        if (!self.hasWorkloadBelowThreshold(teacher, TMCourse.Season.FALL))
            return false;

        return true;
    };
}
