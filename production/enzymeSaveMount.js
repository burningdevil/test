import { mount } from 'enzyme'

let allWrappers = []

/*
 * Wrapper around Enzyme's `mount` that enables automatic cleanup after each test.
 *
 * With Enzyme's `mount`, event listeners may interfere with subsequent tests.
 * By unmounting all components after each test, we can ensure that
 * event listeners are automatically cleaned up.
 */
export const safeMount = (...args) => {
  // eslint-disable-next-line no-restricted-syntax
  const wrapper = mount(...args)
  allWrappers.push(wrapper)
  return wrapper
}

export const cleanUpEnzymeAfterEachTest = () => {
  for (const wrapper of allWrappers) {
    if (wrapper.length > 0) {
      wrapper.unmount()
    }
  }
  allWrappers = []
}
