/* eslint-disable import/no-extraneous-dependencies */
import { configure } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import 'core-js'
import 'isomorphic-fetch'

import '@testing-library/jest-dom'

configure({ adapter: new Adapter() })
