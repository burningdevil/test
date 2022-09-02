/* eslint-disable class-methods-use-this */
class BoldingHelper {
    notFoundIndexIndicator = -1;
    /**
     * Splits given stringToBold into 3 parts so that bolding can be applied to middle part
     *
     * @param stringToBold text which contains part to be bolded e.g username
     * @param indexOfSearchStringInText index at which searchString is contained in stringToBold
     * @param searchStringLength length of the searchString
     * @returns 3 substrings of stringToBold, where match part is equal to searchString
     */
    splitStringForBolding(
      stringToBold: string,
      indexOfSearchStringInText: number,
      searchStringLength: number
    ): [string, string, string] {
      const prefix = stringToBold.substring(0, indexOfSearchStringInText);
  
      const suffix = stringToBold.substring(indexOfSearchStringInText + searchStringLength);
  
      const match = stringToBold.substring(indexOfSearchStringInText, indexOfSearchStringInText + searchStringLength);
  
      return [prefix, match, suffix];
    }
  
    /**
     * Checks if given searchString is part of longer string. Returns index of searchString if true and -1 if false
     *
     * @param givenText text which can contain part equal to searchString
     * @param searchString text which user inputs as searchString
     * @returns Index at which searchString is contained in givenText or -1
     */
    checkIfTextContainsSearchString(givenText: string, searchString: string): number {
      return givenText.toLowerCase().indexOf(searchString.toLowerCase());
    }
  }
  
  const boldingHelper = new BoldingHelper();
  export default boldingHelper;
  