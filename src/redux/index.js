import { combineReducers } from "redux";
import { EmployeeReducer } from "./Reducer";

const reducers = combineReducers({
  allEmployees: EmployeeReducer,
});

export default reducers;
