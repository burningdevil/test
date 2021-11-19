const joints = new Map()

function pipeIn(key, val) {
    console.log(`the jont '${key}' is updated with the value '${val}'`)
    joints.set(key, val)
}

/**
 *
 * @param {string} key - the joint that will be initialzed or updated
 * @param {function | Object} alternative - the function to generate an alternative value or the alternative value
 * @returns joint values
 */

function pipeOutOrElse(key, alternative) {
    if (joints.has(key)) {
        return joints.get(key)
    } else {
        console.log(`the jont '${key}' is not found, return the alternative value`)
        if (undefined === alternative) {
            throw new Error(`the jont '${key}' is not found, and there is no alternative value`)
        } else if (typeof (alternative) === 'function') {
            return alternative()
        } else {
            return alternative
        }
    }
}

function clearJoints() {
    joints.clear()
}

module.exports = { pipeIn, pipeOutOrElse, clearJoints }
