// ReF: mstrmojo.base64.js

// This class is borrowed from http://www.webtoolkit.info/javascript-base64.html
const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const $FROM_CHAR_CODE = String.fromCharCode

declare var mstrmojo: any

function utf8Encode(string: string) {
  string = string.replace(/\r\n/g, '\n')
  let utfText = ''

  for (let n = 0; n < string.length; n++) {
    const c = string.charCodeAt(n)
    if (c < 128) {
      utfText += $FROM_CHAR_CODE(c)
    } else if ((c > 127) && (c < 2048)) {
      utfText += $FROM_CHAR_CODE((c >> 6) | 192)
      utfText += $FROM_CHAR_CODE((c & 63) | 128)
    } else {
      utfText += $FROM_CHAR_CODE((c >> 12) | 224)
      utfText += $FROM_CHAR_CODE(((c >> 6) & 63) | 128)
      utfText += $FROM_CHAR_CODE((c & 63) | 128)
    }
  }

  return utfText
}

function utf8Decode(utfText: string) {
  let string = ''
  let i = 0
  let c = 0
  let c1 = 0
  let c2 = 0

  while (i < utfText.length) {
    c = utfText.charCodeAt(i)
    if (c < 128) {
      string += $FROM_CHAR_CODE(c)
      i++
    } else if ((c > 191) && (c < 224)) {
      c1 = utfText.charCodeAt(i + 1)
      string += $FROM_CHAR_CODE(((c & 31) << 6) | (c1 & 63))
      i += 2
    } else {
      c1 = utfText.charCodeAt(i + 1)
      c2 = utfText.charCodeAt(i + 2)
      string += $FROM_CHAR_CODE(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63))
      i += 3
    }
  }
  return string
}

export default {
  /**
   * <p> Decode the Base64-encoded response header whose value are in the following format: '=?UTF-8?B?EncodedText?=' </p>
   *
   * @param {String} value The value of a response header.
   *
   * @returns {String} The decoded response header.
   */
  decodeHttpHeader: function decodeHttpHeader(value: string) {
    const rEncoded = /\=\?UTF-8\?B\?(.+?)\?\=/g
    if (value && value.indexOf('=?UTF-8?B?') === 0) {
      let decMsg = ''
      let result
      while ((result = rEncoded.exec(value)) !== null) {
        decMsg += mstrmojo.base64.decode(result[1])
      }
      return decMsg
    }
    return value
  },

  /**
   * Use Base64 to encode a string input.
   *
   * @param {String} input A string value.
   *
   * @returns {String} The Base64 encoded string.
   */
  encode: function encode(input: string) {
    let output = ''
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0

    input = utf8Encode(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)

      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63

      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }

      output += _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4)

    }
    return output
  },

  /**
   * Decode a Base64 encoded string.
   *
   * @param {String} input A Base64 encoded string value.
   *
   * @returns {String} The decoded string.
   */
  decode: function decode(input: string) {
    let output = ''
    let i = 0
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4

    input = input.replace(/[^A-Za-z0-9+/=]/g, '')
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++))
      enc2 = _keyStr.indexOf(input.charAt(i++))
      enc3 = _keyStr.indexOf(input.charAt(i++))
      enc4 = _keyStr.indexOf(input.charAt(i++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      output += $FROM_CHAR_CODE(chr1)

      if (enc3 !== 64) {
        output += $FROM_CHAR_CODE(chr2)
      }
      if (enc4 !== 64) {
        output += $FROM_CHAR_CODE(chr3)
      }
    }
    output = utf8Decode(output)
    return output
  }
}
