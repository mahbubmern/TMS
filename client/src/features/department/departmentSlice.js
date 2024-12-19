// create slice

import { createSlice } from "@reduxjs/toolkit";
import {
  createDepartment,
  deleteDepartment,
  getUserDepartment,
  updateDepartment,
} from "./departmentApiSlice";

const initialState = {
  department: null,
  departmentMessage: null,
  departmentError: null,
  departmentLoader: false,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setEmptyDepartmentMessage: (state) => {
      (state.departmentMessage = null), (state.departmentError = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDepartment.pending, (state) => {
        state.departmentLoader = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departmentLoader = false;
        state.department = action.payload.department;
        state.departmentMessage = action.payload.message;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.departmentLoader = false;
        state.departmentError = action.error.message;
      })
      // get All Incomings
      .addCase(getUserDepartment.pending, (state) => {
        state.departmentLoader = true;
      })
      .addCase(getUserDepartment.fulfilled, (state, action) => {
        state.departmentLoader = false;
        state.department = action.payload.department;
        state.departmentMessage = action.payload.message;
      })
      .addCase(getUserDepartment.rejected, (state, action) => {
        state.departmentLoader = false;
        state.departmentError = action.error.message;
      })

      // Update Incomings file
      .addCase(updateDepartment.pending, (state) => {
        state.departmentLoader = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.departmentLoader = false;
        state.department = action.payload.department;
        state.departmentMessage = action.payload.message;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.departmentLoader = false;
        state.departmentError = action.error.message;
      })
      // delete todo
      .addCase(deleteDepartment.pending, (state) => {
        state.departmentLoader = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departmentLoader = false;
        state.department = action.payload.department;
        state.departmentMessage = action.payload.message;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.departmentLoader = false;
        state.departmentError = action.error.message;
      });
  },
});

//selector export

export const departmentSelector = (state) => state.department;

//actions export

export const { setEmptyDepartmentMessage } = departmentSlice.actions;

//reducer export

export default departmentSlice.reducer;
