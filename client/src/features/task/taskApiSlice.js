import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// create Incoming File

export const sendTask = createAsyncThunk("incoming/sendTask", async (data) => {

  try {
    const response = await API.post(`/api/v1/task`, data);

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// Get All Incoming File

export const getAllTask = createAsyncThunk("incoming/getAllTask", async () => {
  try {
    const response = await API.get(`/api/v1/task`);

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// Update Incoming File

// export const editIncomings = createAsyncThunk(
//   "incoming/editIncomings",
//   async (data) => {
//     console.log(data);
//     try {
//       const response = await API.patch(`api/v1/incoming/${data._id}`);

//       console.log(response.data);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response.data.message);
//     }
//   }
// );

export const updateTask = createAsyncThunk("user/updateTask", async (data) => {
  try {
    const response = await API.patch(`/api/v1/task/${data._id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
