import { combineReducers } from 'redux';
import i18n from '../../modules/setting/languages/reducers/i18';
import task from '../../modules/task/reducers/task';
import product from '../../modules/product/reducers/product';
import org from '../../modules/task/reducers/org';
import category from '../../modules/task/reducers/category';
import contact from '../../modules/customer/reducers/contact';

import user from '../../modules/authentication/reducers/user';
import formSubmit from '../../modules/form/reducers/formSubmit';
import order from '../../modules/orders/reducers/order';
import refresh from './refresh';
import device from './device';
import metadata from './metadata';

const appReducer = combineReducers({
  i18n,
  task,
  product,
  org,
  category,
  user,
  contact,
  formSubmit,
  order,
  refresh,
  device,
  metadata
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = { i18n: state.i18n, metadata: state.metadata };
  }

  return appReducer(state, action);
};

export default rootReducer;
