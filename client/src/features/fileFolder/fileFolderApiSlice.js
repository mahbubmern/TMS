import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// create folder

export const createFolder = createAsyncThunk(
  "folders/createFolder",
  async (data) => {
    try {
      const response = await API.post(`/api/v1/dashboard/filemanager`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// get user folder

export const getuserFolders = createAsyncThunk(
  "folders/getuserFolders",
  async (data) => {
    try {
      const response = await API.get(`/api/v1/dashboard/filemanager`, data);

     return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

