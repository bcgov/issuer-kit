/* Include all your custom JS code in here, it will be available to the app instance on the window object */

function myCoolFunction() {
  console.log("Do something great here.");
}

/* All custom functions that will be used in SurveyJS triggers
 * must be listed in this array, so that they will be automatically registered.
 */
surveyFunctions = [myCoolFunction];
