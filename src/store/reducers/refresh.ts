// Set initial state
const initialState = {};

export default function refresh(state = initialState, action) {
  console.log("refresh action type>>", action.type)  
  switch (action.type) {
    case 'REFRESH':
      return {
        ...state,
        event: action.data,
      }
    default:
      return state;
  }
}