import React from 'react'
import DonutWidget from '../../DonutWidget'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

it('Basic render', () => {
  const tree = mount( <DonutWidget text='percentage' value={0.5}/> )
    // .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Update animation render', () => {
  const tree = mount( <DonutWidget text='percentage' value={0.5}/> );
  const donutNodeClass = '.donut-segment'
  const animationClass = 'circle-animation'
  expect(tree.find(donutNodeClass).hasClass(animationClass)).toBe(true)
  tree.find(donutNodeClass).simulate('animationend');
  expect(tree.find(donutNodeClass).hasClass(animationClass)).toBe(false)

  tree.setProps({text:'percentage', value:0.6})
  expect(tree.find(donutNodeClass).render().hasClass(animationClass)).toBe(true)
  tree.find(donutNodeClass).simulate('animationend');
  expect(tree.find(donutNodeClass).render().hasClass(animationClass)).toBe(false)
});
