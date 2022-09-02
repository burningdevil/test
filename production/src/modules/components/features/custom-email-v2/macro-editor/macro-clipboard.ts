import { Quill } from 'react-quill';

import MacroQuillBlot from './macro-quill-blot';

import { Delta as DeltaType } from './macro-types';

const Delta = Quill.import('delta');

/**
 * The Clipboard handles copy, cut and paste between Quill and external applications.
 * This modifies the module to paste according to specifications.
 * More info: https://quilljs.com/docs/modules/clipboard/
 *
 * @class MacroClipboard
 */
class MacroClipboard {
  static nodeMatcher(node: HTMLElement, delta: DeltaType): DeltaType {
    switch (node.tagName) {
      case 'SPAN':
        // If the node is a macro we paste as it is.
        if (node.className === MacroQuillBlot.className) {
          return delta;
        }
        break;

      case 'A':
      case 'P':
        // Keep hyperlinks and paragraphs
        return delta;

      default:
        // Any other nodes paste as text
        return new Delta().insert(node.textContent);
    }

    return new Delta().insert(node.textContent);
  }
}

export default MacroClipboard;
