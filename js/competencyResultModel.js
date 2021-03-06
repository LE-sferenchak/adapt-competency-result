define([
    'core/js/adapt',
    'core/js/models/componentModel'
], function(Adapt, ComponentModel) {

    var CompetencyResultModel = ComponentModel.extend({

        init: function() {
            this.set('originalBody', this.get('body'));// save the original body text so we can restore it when the assessment is reset

            this.listenTo(Adapt, {
                'assessments:complete': this.onAssessmentComplete,
                'assessments:reset': this.onAssessmentReset
            });
        },

        /**
         * Checks to see if the assessment was completed in a previous session or not
         */
        checkIfAssessmentComplete: function() {
            if (!Adapt.assessment || this.get('_assessmentId') === undefined) {
                return;
            }

            var assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
            if (!assessmentModel || assessmentModel.length === 0) return;

            var state = assessmentModel.getState();
            if (state.isComplete) {
                this.onAssessmentComplete(state);
                return;
            }

            this.setVisibility();
        },

        onAssessmentComplete: function(state) {
            if (this.get('_assessmentId') === undefined ||
                this.get('_assessmentId') != state.id) return;

            /*
            make shortcuts to some of the key properties in the state object so that
            content developers can just use {{attemptsLeft}} in json instead of {{state.attemptsLeft}}
            */
            var avgRating = 0;

            avgRating = this.getAvgRating(state);

            this.set( {
                _state: state,
                attempts: state.attempts,
                attemptsSpent: state.attemptsSpent,
                attemptsLeft: state.attemptsLeft,
                avgRating: avgRating
            });

            this.setFeedbackBand(avgRating);

            this.checkRetryEnabled(state);

            this.setFeedbackText();

            this.toggleVisibility(true);
        },

        getAvgRating: function(state) {
            var questionComponents = state.questionModels; //Adapt.components.where('_isQuestionType');
            var valueArray = [];


            questionComponents.forEach((component) => {
                //let id = component.get('_id');
                let value = component.get('_selectedItem');
                valueArray.push(value.value);
                //console.log(`Here is a summary of your competency ratings: 
                //${id} : ${value.value}`);
            });
            return avgRating = (valueArray.reduce((a, b) => (a+b)) / valueArray.length).toFixed(2);
        },

        setFeedbackBand: function(avgRating) {
            var bands = _.sortBy(this.get('_bands'), '_rating');

            for (var i = (bands.length - 1); i >= 0; i--) {
                var isScoreInBandRange =  (avgRating >= bands[i]._rating);
                if (!isScoreInBandRange) continue;

                this.set('_feedbackBand', bands[i]);
                break;
            }
        },

        checkRetryEnabled: function(state) {
            var assessmentModel = Adapt.assessment.get(state.id);
            if (!assessmentModel.canResetInPage()) return false;

            var isRetryEnabled = this.get('_feedbackBand')._allowRetry !== false;
            var isAttemptsLeft = (state.attemptsLeft > 0 || state.attemptsLeft === 'infinite');
            var showRetry = isRetryEnabled && isAttemptsLeft && (!state.isPass || state.allowResetIfPassed);

            this.set({
                _isRetryEnabled: showRetry,
                retryFeedback: showRetry ? this.get('_retry').feedback : ''
            });
        },

        setFeedbackText: function() {
            var feedbackBand = this.get('_feedbackBand');

            // ensure any handlebars expressions in the .feedback are handled...
            var feedback = feedbackBand.feedback ? Handlebars.compile(feedbackBand.feedback)(this.toJSON()) : '';

            this.set({
                feedback: feedback,
                body: this.get('_completionBody')
            });
        },

        setVisibility: function() {
            if (!Adapt.assessment) return;

            var isVisibleBeforeCompletion = this.get('_isVisibleBeforeCompletion') || false;
            var wasVisible = this.get('_isVisible');

            var assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
            if (!assessmentModel || assessmentModel.length === 0) return;

            var state = assessmentModel.getState();
            var isComplete = state.isComplete;
            var isAttemptInProgress = state.attemptInProgress;
            var attemptsSpent = state.attemptsSpent;
            var hasHadAttempt = (!isAttemptInProgress && attemptsSpent > 0);

            var isVisible = (isVisibleBeforeCompletion && !isComplete) || hasHadAttempt;

            if (!wasVisible && isVisible) isVisible = false;

            this.toggleVisibility(isVisible);
        },

        toggleVisibility: function (isVisible) {
            if (isVisible === undefined) {
                isVisible = !this.get('_isVisible');
            }

            this.set('_isVisible', isVisible, {pluginName: 'assessmentResults'});
        },

        checkCompletion: function() {
            if (this.get('_setCompletionOn') === 'pass' && !this.get('isPass')) {
                return;
            }

            this.setCompletionStatus();
        },

        onAssessmentReset: function(state) {
            if (this.get('_assessmentId') === undefined ||
                this.get('_assessmentId') != state.id) return;

            this.reset('hard', true);
        },

        reset: function() {
            this.set({
                body: this.get('originalBody'),
                state: null,
                feedback: '',
                _feedbackBand: null,
                retryFeedback: '',
                _isRetryEnabled: false
            });

            ComponentModel.prototype.reset.apply(this, arguments);
        }
    });

    return CompetencyResultModel;

});
