import { Quill } from 'react-quill';


import {
  BlotDefinition,
  Delta,
  DeltaStatic,
  DenotationChars,
  Macros,
  MentionObject,
  Range
} from './macro-types';

const Embed = Quill.import('blots/embed');

/**
 * Custom blot used by quill-mention to represent macros in the editor.
 * More info: https://github.com/quilljs/parchment
 *
 * @class MacroQuillBlot
 * @extends {Embed}
 */
class MacroQuillBlot extends Embed {
  /**
   * Creates corresponding DOM node to be inserted into Quill
   *
   * @static
   * @param data mention object
   */
  static create(data: MentionObject): HTMLElement {
    const node = super.create();
    node.textContent = data.value;
    return MacroQuillBlot.setDataValues(node, data);
  }

  /**
   * Adds custom quill-mention attributes to the dataset of the node
   *
   * @static
   * @param element HTML element created and used by quill
   * @param data data attributes passed by quill
   */
  static setDataValues(element: HTMLElement, data: MentionObject): HTMLElement {
    const domNode = element;
    Object.keys(data).forEach((key) => {
      const objectKey = key as keyof MentionObject;
      domNode.dataset[objectKey] = data[objectKey] as string;
    });
    return domNode;
  }

  /**
   * Returns value represented by this blot
   *
   * @static
   * @param domNode html blot element
   */
  static value(domNode: HTMLElement): DOMStringMap {
    return domNode.dataset;
  }

  /**
   * Returns a string used to create a regexp with the text present in a macro array
   *
   * @static
   * @param openingChar {& to start the macro
   * @param closingChar } or &} to finish the macro
   * @param macros array of strings for macros
   */
  static createMacroStringRegExp(openingChar: string, closingChar: string, macros: string[]): string {
    const regEx = `${openingChar}(${macros.join('|')})${closingChar}`;
    return regEx.replace(/[[\]{}]/g, '\\$&');
  }

  /**
   * Creates a regexp that checks if a macro is present in a string
   *
   * @static
   * @param macros array of macros
   * @param text string to be checked
   */
  static checkForMacrosInString(macros: string[], text = ''): boolean {
    const { OPENING_BRACKET, CLOSING_BRACKET, AMPERSAND } = DenotationChars;
    const bracketOpen = OPENING_BRACKET + AMPERSAND;
    const bracketClose = CLOSING_BRACKET;
    const regExp = new RegExp(this.createMacroStringRegExp(bracketOpen, bracketClose, macros), 'g');
    return regExp.test(text);
  }

  /**
   * Escapes html entity characters of a blot string
   *
   * @static
   * @param unsafe unescaped text
   */
  static escapeHTMLBlot(unsafe: string): string {
    return unsafe
      .replace(/(?<!{)&(?!})/g, '&amp;') // We don't want to escape & in macro opening '{&' and '&}' in macro closing
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Creates new Regular Expression for Regular Macro based on given parameters
   *
   * @static
   * @param isMultiContent flag to indicate if plugin is in multicontent mode
   * @param areMultiContentMacrosSupported whether env version is 11.3.5 or above
   */
  static getRegularMacroRegExp(availableMacros: Macros[]): RegExp {
    const { OPENING_BRACKET, AMPERSAND, CLOSING_BRACKET } = DenotationChars;
    let bracketMacros = availableMacros;
    const bracketOpen = OPENING_BRACKET + AMPERSAND;
    const bracketClose = CLOSING_BRACKET;

    const bracketRegExp = this.createMacroStringRegExp(bracketOpen, bracketClose, bracketMacros);

    return new RegExp(bracketRegExp, 'g');
  }

  /**
   * Converts plain text from defaultValue to required html
   *
   * @static
   * @param text test to restore
   * @param isMultiContent false for single line input (e.g., subject)
   */
  static getHtmlFromText(
    isMultiContent: boolean,
    text: string,
    availableMacros: Macros[]
  ): string {
    let str = MacroQuillBlot.escapeHTMLBlot(text);

    const macroRegExp = this.getRegularMacroRegExp(availableMacros);

    const replacerMacro = `<span class="macro" data-value="$&" contenteditable="false">$&</span>`;
    str = str
      .replace(macroRegExp, replacerMacro)
    if (isMultiContent) {
      return `${str.replace(/\n/g, '<br>')}`;
    }
    return str;
  }

  /**
   * Converts a quill delta with mentions to a flat string and removes new lines if requested
   *
   * @static
   * @param delta quill object representing a single editor operation
   * @param multiline flag to indicate if plugin is in multi-content mode
   */
  static getTextFromDelta(delta: Delta | any, multiline: boolean): string {
    const { ops } = delta;
    let text = '';

    for (const op of ops) {
      const { insert: operation } = op;
      switch (typeof operation) {
        case 'string':
          text += operation;
          break;

        case 'object':
          if (operation.macro) {
            text += operation.macro.value;
          }
          break;

        default:
          break;
      }
    }

    if (multiline) {
      return `${text.replace(/[\r\n]+$/g, '')}`; // NOSONAR
    }
    // Removes all new lines, return characters and whitespaces
    return text.replace(/[\r\n]+/gm, '').trim();
  }

  /**
   * get the current cursor scope of extended.
   * the previous operation or the next operation contains \n, the extend operation is forbidden.
   * @static
   * @param delta quill object representing a single editor operation
   * @param multiline flag to indicate if plugin is in multi-content mode
   * @param range the current cursor location
   */
   static getExtendRangeFromSelection(delta: DeltaStatic | any, range: Range): boolean[] {
    if(!range) return null;
    const { ops } = delta;
    let res = range.index;
    for (let i=0; i<ops.length; i++) {
      const op = ops[i];
      const { insert: operation } = op;
      switch (typeof operation) {
        case 'string':
          let realText = operation.replace(/[\r\n]/gm, '#'); // it's just to count the string count.
          res -= realText.length;
          break;

        case 'object':
          if (operation.macro) {
            if(res === 0){
              // judge the previous and next op whether is \n;
              let previous = i > 1 ? ops[i-1] : null;
              let next = i < ops.length - 1 ? ops[i + 1] : null;
              const judge = (p: any) => {
                if(typeof p?.insert !== 'string'){
                  return true;
                }else {
                  return /[\r\n]+/gm.test(p.insert);
                }
              }
              return [true, judge(previous), judge(next)];
            }
            res -= 1;
          }
          break;

        default:
          break;
      }
    }
    return [false, false,false];
  }

  static judgeTextFromSelection(
    text: string,
    availableMacros: Macros[]) {
    const macroRegExp = this.getRegularMacroRegExp(availableMacros);
    if(macroRegExp.test(text) && (text[0] !== ' ' || text[text.length - 1] !== ' ')){
      return true;
    }
    return false;
  }
}

MacroQuillBlot.blotName = BlotDefinition.NAME;
MacroQuillBlot.className = BlotDefinition.CLASS;
MacroQuillBlot.tagName = BlotDefinition.TAG;

export default MacroQuillBlot;
