/* Include all your custom JS code in here, it will be available to the app instance */

function setCurrentISODate(params) {
    if (params.length < 1) {
      throw new Error(
        "setCurrentISODate is missing one or more required parameters"
      );
    }
    var dateField = params[0];
    var survey = this.survey;
  
    var date = new Date();
    survey.setValue(dateField, date.toISOString());
  }

/* An array containing custom functions that will be automatically registered with
 * SurveyJS so that they can be used in triggers.
 */
surveyFunctions = [setCurrentISODate];
