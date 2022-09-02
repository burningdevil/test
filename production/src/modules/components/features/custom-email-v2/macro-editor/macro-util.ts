import boldingHelper from "./bolding-helper";
import { BlotDefinition, DenotationChars, ListObject, Macros, MatchedMacro, MentionObject } from "./macro-types";
const createRenderList = (macros: Macros[]): ListObject[] => macros.map((value, id) => ({ value, id }));
const getBracketList = (
    isMultiContent: boolean,
    isNotificationReminder: string,
    availableMacros: Macros[]
  ): ListObject[] => {
    return createRenderList(availableMacros);
  };

/**
   * Callback for a selected item in the macro list.
   * insertItem should be used to insert item to the editor.
   *
   * @param item blot mention object
   * @param insertItem value to be inserted to editor
   */
 const onSelect = (item: MentionObject, insertItem: (item: MentionObject) => void): void => {
    const { OPENING_BRACKET, AMPERSAND, CLOSING_BRACKET, OPENING_SQUARE_BRACKET, CLOSING_SQUARE_BRACKET, AT } =
      DenotationChars;

    const { denotationChar } = item;

    switch (denotationChar) {
      // { => {&value}
      // {& => {&value}
      // {} => {&value}
      // {[ => {[value1]@[value2]}
      case OPENING_BRACKET:
      case OPENING_BRACKET + AMPERSAND:
      case OPENING_BRACKET + CLOSING_BRACKET:
      case OPENING_BRACKET + OPENING_SQUARE_BRACKET:
        item.value = OPENING_BRACKET + AMPERSAND + item.value + CLOSING_BRACKET + ' '; // here insert the blank especially aims to develop the user's habit of leaving blank after the macro.
        break;
      default:
        break;
    }
    insertItem(item);
  };
  /**
   * Decides how to display(render) item on the mention list. It's executed for each item given to renderList
   * If item contains data about searchTermLength and indication that it contains search string,
   * then it injects extra span which results in search string being bolded
   *
   * @param item Macro which should be displayed on the mention list
   * @returns string which contains html code which will be displayed as innerHTML of list item
   */
 const renderItem = (item: MatchedMacro): string => {
    const { value, searchStringIndexInMacroValue, searchTermLength } = item;

    let result: string;

    if (searchTermLength > 0 && searchStringIndexInMacroValue !== boldingHelper.notFoundIndexIndicator) {
      const [prefix, match, suffix] = boldingHelper.splitStringForBolding(
        value,
        searchStringIndexInMacroValue,
        searchTermLength
      );
      result = `${prefix}<span class=${'ql-mention-list-item-search-string-matched'}>${match}</span>${suffix}`;
    } else {
      result = value;
    }
    return result;
  };

export const getConfig = (
    isMultiContent = false,
    isNotificationReminder = '',
    availableMacros: Macros[]
  ): unknown => {
    const allowedChars = /^[A-Za-z0-9@]*$/;
    const mentionDenotationChars: string[] = [
        DenotationChars.OPENING_BRACKET + DenotationChars.CLOSING_BRACKET,
        DenotationChars.OPENING_BRACKET + DenotationChars.AMPERSAND,
        DenotationChars.OPENING_BRACKET + DenotationChars.OPENING_SQUARE_BRACKET,
        DenotationChars.OPENING_BRACKET,
      ];

    const bracketList = getBracketList(
      isMultiContent,
      isNotificationReminder,
      availableMacros
    );
    const blotName = BlotDefinition.NAME;
    const renderMacro = (
        searchTerm: string,
        renderList: (matches: MatchedMacro[], searchTerm: string) => void
      ): void => {
        const searchTermLength = searchTerm.length;
        const matches: MatchedMacro[] = [];
        
        bracketList.forEach((macro) => {
          const { value } = macro;
    
          const searchStringIndexInMacroValue = boldingHelper.checkIfTextContainsSearchString(value, searchTerm);
    
          if (searchTermLength === 0 || searchStringIndexInMacroValue !== boldingHelper.notFoundIndexIndicator) {
            // render element if search string is empty or element contains string which should be bolded
            matches.push({ value, searchStringIndexInMacroValue, searchTermLength });
          }
        });
        renderList(matches, searchTerm);
      };
    return {
      allowedChars,
      blotName,
      mentionDenotationChars,
      availableMacros,
      bracketList: bracketList,
      source: renderMacro,
      renderItem,
      onSelect,
      spaceAfterInsert: true,
      positioningStrategy: 'fixed',
      mentionContainerClass: 'ql-mention-list-container',
      mentionListClass: 'ql-mention-list',
      listItemClass: 'ql-mention-list-item',
    };
  };