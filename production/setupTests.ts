/* eslint-disable import/no-extraneous-dependencies */
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'core-js';

import '@testing-library/jest-dom';

configure({ adapter: new Adapter() });

const mockMatchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
});

// mock matchMedia if it does not exist
// https://stackoverflow.com/a/68539103/2214158
global.matchMedia = global.matchMedia || (mockMatchMedia as any);
