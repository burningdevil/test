import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { cleanUpEnzymeAfterEachTest } from './enzymeSaveMount'

configure({ adapter: new Adapter() });

afterEach(() => {
  cleanUpEnzymeAfterEachTest();
})
