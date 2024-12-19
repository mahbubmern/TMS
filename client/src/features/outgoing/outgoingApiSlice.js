import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// create Incoming File

export const createOutgoing = createAsyncThunk(
  "incoming/createOutgoing",
  async (data) => {
    try {
      const response = await API.post(`/api/v1/outgoing`, data);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Get All Incoming File

export const getOutgoings = createAsyncThunk(
  "incoming/getOutgoings",
  async () => {
    try {
      const response = await API.get(`/api/v1/outgoing`);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

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

export const editOutgoings = createAsyncThunk(
  "user/editOutgoings",
  async (data) => {
    try {
      const response = await API.patch(`/api/v1/outgoing/${data._id}`, data);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
