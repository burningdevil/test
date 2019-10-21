import BasePage from '../basePages/BasePage'
export default class MetricEditorPage extends BasePage {

    // element locators
    getMetricEditorWindow(){
        return this.$('.mstrmojo-Editor.mstrmojo-MetricIDE.modal');
    }

    getNavigationContainer(){
        return this.getMetricEditorWindow().$('.mstrmojo-Box.mstrmojo-MetricIDE-browsers-container');
    }

    getContentContainer(){
        return this.getMetricEditorWindow().$('.mstrmojo-Box.mstrmojo-MetricIDE-editors-container')
    }

    getFormulaContainer(){
        return this.getContentContainer().$('.mstrmojo-Editor.mstrmojo-MetricEditor.mstrmojo-MetricIDE-editor.inline');
    }

    getFunctionContainer(){
        return this.getContentContainer().$('.mstrmojo-Editor.mstrmojo-Editor-me.mstrmojo-SimpleMetricEditor.mstrmojo-MetricIDE-editor.inline');
    }

    getMetricNameInputBox(){
        return this.getFormulaContainer().$('.mstrmojo-TextBox.mstrmojo-ME-nameInput');
    }
    getFormulaButtonContainer(){
        return this.getFormulaContainer().$('.mstrmojo-Editor-buttons').$('.mstrmojo-HBox.mstrmojo-ME-buttonBox');
    }

    getFunctionButtonContainer(){
        return this.getFunctionContainer().$('.mstrmojo-Editor-buttons').$('.mstrmojo-HBox.mstrmojo-ME-buttonBox');
    }

    getToolbarHeader(){
        return this.$('.toolbar-header');
    }

    getButtons(buttonName){
        return this.getToolbarHeader().$$('.toolbar-button').filter(async (elem) => {
            let button = await elem.$('.control-label.center-display').getText();
            return button === buttonName;
        }).first();
    }

    getFormulaModeButton(){
        return this.getToolbarHeader().$('.right-section').$('.toggle-button');
    }

    getConfirmationPopWindow(){
        return this.$$('.mstrmojo-Editor.modal').last()
    }

    getPopUpButtons(buttonName){
        return this.getConfirmationPopWindow().$$('.mstrmojo-HBox-cell.subBox').filter(async (elem)=>{
            let button = await elem.getText();
            return button === buttonName;
        }).first();
    }

    getFunctionSelector(){
        return this.$('.mstrmojo-ListBase2-itemsContainer.hasVertical.mstrmojo-scrollNode');
    }

    getEditorFunction(functionName){
        return this.getFunctionSelector().$$('.mstrmojo-itemwrap').filter(async (elem)=>{
            let func = await elem.$('.mstrmojo-suggest-text.fn').getText();
            return func === functionName;
        }).first();
    }

    getFormulaExpressionToolbar(){
        return this.getContentContainer().$('.mstrmojo-ListBase2.mstrmojo-ExpressionToolbar')
    }

    getFunctionEditorOption(option){
        return this.getFormulaExpressionToolbar().$$('.mstrmojo-itemwrap').filter(async (elem)=>{
        let options = await elem.getText();
        return options === option;
    }).first();
    }

    getFormulaStatusBox(){
        return this.getContentContainer().$('.mstrmojo-MEBox-status');
    }

    getValidateButton(){
        return this.getFormulaStatusBox().$('.mstrmojo-Button.mstrmojo-WebHoverButton.right.hoverLink')
    }

    getFormulaStatus(){
        return this.getContentContainer().$('.mstrmojo-MEBox-vStatus.valid');
    }

    // action helpers

    async clickButton(buttonName){
        return this.getButtons(buttonName).click();
    }

    async clickPopUpButton(buttonName){
        return this.getPopUpButtons(buttonName).click();
    }

    async chooseFunction(functionName){
        return this.getEditorFunction(functionName).click();
    }

    async switchToFormulaEditor(){
        return this.getFormulaModeButton().click();
    }

    async clearFormulaEditor(option){
        return this.getFunctionEditorOption(option).$('.mstrmojo-Button.mstrmojo-WebHoverButton.clear.right.hoverLink').click();
    }

    async doubleClickFunction(functionName){
        return this.doubleClick({elem: this.getEditorFunction(functionName)});
    }

    async clickValidate(){
        await this.getValidateButton().click();
        return this.brwsr.wait(this.EC.presenceOf(this.getFormulaStatus()), 5000, 'Formula is not valid');
    }

    async provideMetricName(metricName){
        await this.getMetricNameInputBox().click();
        await this.getMetricNameInputBox().sendKeys(protractor.Key.HOME, protractor.Key.SHIFT, protractor.Key.END, protractor.Key.BACK_SPACE)
        return this.input(metricName);
    }

    //assertion helpers
    async isMetricEditorPresent(){
        return this.getMetricEditorWindow().isPresent();
    }

    async formulaStatus(){
        return this.getFormulaStatus().getText();
    }
}
