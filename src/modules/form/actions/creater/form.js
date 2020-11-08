import { ADD_FORM, EDIT_FORM, RESET_FORM, SET_VALIDATE_SUBMIT } from "../types/FormActions";
import { RESET_TASK_DETAIL } from "../../../task/actions/types/task";


export function addForm(item, _data) {
  return async (dispatch) => {

    //get profile user 
    const data = {
      label: item.label,
      propertyName: item._key,
      propertyType: item.type,
      _id: item._id,
      multiple: false,
      dataSources: '',
      referenceId: null,
      data: _data,
      index: item.index,
      product: item.product,
      program: item.program,
      programList: item.programList
    };

    return dispatch({
      type: ADD_FORM,
      data,
    })
  }
}


const setValidateSubmit = (data) => {
  return {
    type: SET_VALIDATE_SUBMIT,
    data
  }
}
const editForm = (data) => ({
  type: EDIT_FORM,
  data,
});
const resetForm = () => ({
  type: RESET_FORM,
});

const resetTaskDetail = () => ({ type: RESET_TASK_DETAIL });

export { editForm, resetForm, resetTaskDetail, setValidateSubmit };
