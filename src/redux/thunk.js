import { getAllEmployee } from "./service";
import { setEmployees } from "./actions";

export const fetchAllEmployees = () => {
  return (dispatch) => {
    getAllEmployee()
      .then((response) => {
        if (response.status === 200) {
          dispatch(setEmployees(response.data));
        } else {
          console.log(response.error);
        }
      })
      .catch((error) => {
        dispatch(console.log(error));
      });
  };
};
