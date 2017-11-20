function TMTeacherValidator() {

    let self = this;

    this.minimumWorkloadPercent = 25;
    this.maximumWorkloadPercent = 100;

    this.validate = function(teacher) {

        if (teacher.workloadNormalized.spring * 100 > self.maximumWorkloadPercent)
            return false;

        if (teacher.workloadNormalized.fall * 100 > self.maximumWorkloadPercent)
            return false;

        if (teacher.workloadNormalized.spring * 100 < self.minimumWorkloadPercent)
            return false;

        if (teacher.workloadNormalized.fall * 100 < self.minimumWorkloadPercent)
            return false;

        return true;
    };
}
