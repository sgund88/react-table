export const actionType = {
  SET_EMPLOYEES: "SET_EMPLOYEES",
};

export const setEmployees = (employees) => {
  return {
    type: actionType.SET_EMPLOYEES,
    payload: employees,
  };
};
