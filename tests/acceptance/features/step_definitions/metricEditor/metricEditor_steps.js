const { Given, When, Then } = require('cucumber');

  Then('Metric editor window should be displayed', async function () {
    await metricEditor.switchToNewWebView();
    return expect(metricEditor.isMetricEditorDisplayed()).become(true);
  });

  Then('Metric editor window should NOT be displayed', async function () {
    await metricEditor.switchToNewWebView();
    return expect(metricEditor.isMetricEditorDisplayed()).become(false);
  });

  When ('I click button {button} in {mode}', async function(button, mode){
    await metricEditor.switchToNewWebView();
    if(mode==='SimpleMode'){
      await metricEditor.clickSimpleModeButton(button);
    }
    else{
      await metricEditor.clickEditorModeButton(button);
    }
    return metricEditor.switchToDefaultWebView();
  });

  When ('I click popup button {button}', async function(button){
    await metricEditor.switchToNewWebView();
    await metricEditor.clickPopUpButton(button);
    return metricEditor.switchToDefaultWebView();
  });

  When ('I choose metric editor function {functionName}', async function(functionName){
    return metricEditor.chooseFunction(functionName);
  });

  When ('I switch to formula editor', async function(){
    return metricEditor.clickFormulaEditorButton();
  });

  When ('I choose function editor option {option}', async function(option){
    return metricEditor.clearFormulaEditor(option);
  });

  When ('I double click on {functionName}', async function(functionName){
    return metricEditor.doubleClickFunction(functionName);
  });

  When('I provide input {text}', async function(text){
    return metricEditor.input(text);
  });

  When('I click validate button', async function(){
    return metricEditor.clickValidate();
  });

  When('Formula should be valid', async function(){
    return expect(metricEditor.formulaStatus()).become('Valid metric formula.');
  });

  When('I name metric as {metricName}', async function(provideMetricName){
    return metricEditor.provideMetricName(provideMetricName);
  });