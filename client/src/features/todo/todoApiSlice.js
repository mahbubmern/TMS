import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// Get User Todos

export const getUserTodos = createAsyncThunk(
  "todo/getUserTodos",
  async (data) => {
    try {
      const response = await API.get(`/api/v1/todo/${data._id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// create User Todo

export const createUserTodo = createAsyncThunk(
  "todo/createUserTodo",
  async (data) => {
    try {
      const response = await API.post(`/api/v1/todo`, data);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// create User Todo

export const updateTodo = createAsyncThunk("todo/updateTodo", async (data) => {
  try {
    const response = await API.patch(`/api/v1/todo/${data._id}`, data);

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// create User Todo

export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async ({ userId, todoId }) => {
    try {
      const response = await API.delete(`/api/v1/todo/${userId}/${todoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
