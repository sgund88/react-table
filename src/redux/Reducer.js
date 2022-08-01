import { actionType } from "./actions";

const initialState = {
  employees: [],
};

export const EmployeeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.SET_EMPLOYEES:
      return { ...state, employees: payload };
    default:
      return state;
  }
};
