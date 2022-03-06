// import * as AC from './ActionConstants'

const initialState = { };

type ActionType = {
  type: string,
  payload: string
}

export default (state = initialState, action: ActionType) => {
  const { type } = action
  switch(type) {
    default:
  }
  return state
}
