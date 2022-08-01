import axios from "axios";

const basicUrl = axios.create({
  baseURL: "https://hub.dummyapis.com",
});

export const getAllEmployee = async () => {
  const response = await basicUrl.get(
    "/employee?noofRecords=100&idStarts=1001"
  );
  return response;
};
