import * as React from 'react';
import Module from './Module1'
import { shallow } from 'enzyme'

const wrapper = shallow<Module>(<Module/>);

describe('Example test for Module 1', () => {
  it('should have div with text Hello World!', () => {
    expect(wrapper.find('div').at(1).html()).toMatch(/Hello World!/)
  })
})
