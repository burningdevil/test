import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'
import { ActionTypes } from '../actions/ActionTypes'
import { FeatureState } from 'src/types/redux-state/HomeScreenConfigState'
import { TAGS } from 'src/modules/components/HomeScreenConfigConstant'

const initialState: FeatureState = {
  features: [TAGS.info, TAGS.action, TAGS.share],
}

const FeatureReducer = (state: FeatureState = initialState, action: ActionTypes) => {
  const { type, data } = action
  switch(type) {
    case Actions.SET_FEATURE_TAGS:
      return {
        ...state,
        features: [data]
      }

    default:
  }
  return state
}

export default FeatureReducer
