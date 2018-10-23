define([
    'core/js/adapt',
    './competencyResultModel',
    './competencyResultView'
], function(Adapt, CompetencyResultModel, CompetencyResultView) {

    return Adapt.register("competencyResult", {
        model: CompetencyResultModel,
        view: CompetencyResultView
    });

});
