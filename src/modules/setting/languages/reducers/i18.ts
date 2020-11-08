
export default (state = { translations: null, locale: '' }, action) => {
  switch (action.type) {
    case "SET_LOCALE":
      return {
        ...state,
        locale: action.data,
      };
    default:
      return state;
  }
};
