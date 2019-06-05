
const descPrefix = 'mstrWeb.'

declare var window: any
let DESCRIPTORS: any = null
function getDescriptors() {
  if (!DESCRIPTORS) {
    DESCRIPTORS = window.mstrDescriptors && window.mstrDescriptors.descriptors
  }
  return DESCRIPTORS || {}
}

export default function (descID: number, defText: string) {
  let $DESCRIPTORS = getDescriptors()

  if (descID !== null && descID !== undefined) {
    // Was it found?
    if ($DESCRIPTORS.hasOwnProperty(descPrefix + descID)) {
      return $DESCRIPTORS[descPrefix + descID]
    }

    // Give a meaningful string if omitted...
    defText = defText || "No string descriptor found for descID=" + descID
  }

  // "Decorate" the default text...
  var decDefText = "[" + defText + "]"

  // Put the replacement text in the array so it doesn't get continually loaded from the Web Server...
  $DESCRIPTORS[descPrefix + descID] = decDefText

  return decDefText
}
