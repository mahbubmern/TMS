import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// Get User Todos

export const getUserDepartment = createAsyncThunk(
  "department/getUserDepartment",
  async (data) => {
    try {
      const response = await API.get(`/api/v1/department/${data._id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Create Department

export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (data) => {
    try {
      const response = await API.post(`/api/v1/department`, data);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Update Department

export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async (data) => {
    try {
      const response = await API.patch(`/api/v1/department/${data._id}`, data);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Delete Department

export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async ({ userId, departmentId }) => {
    try {
      const response = await API.delete(
        `/api/v1/department/${userId}/${departmentId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
