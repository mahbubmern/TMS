// create slice

import { createSlice } from "@reduxjs/toolkit";
import {
  createUserTodo,
  deleteTodo,
  getUserTodos,
  updateTodo,
} from "./todoApiSlice";

const initialState = {
  todo: null,
  todoMessage: null,
  todoError: null,
  todoLoader: false,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setEmptyTodoMessage: (state) => {
      (state.todoMessage = null), (state.todoError = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserTodo.pending, (state) => {
        state.todoLoader = true;
      })
      .addCase(createUserTodo.fulfilled, (state, action) => {
        state.todoLoader = false;
        state.todo = action.payload.todo;
        state.todoMessage = action.payload.message;
      })
      .addCase(createUserTodo.rejected, (state, action) => {
        state.todoLoader = false;
        state.todoError = action.error.message;
      })
      // get All Incomings
      .addCase(getUserTodos.pending, (state) => {
        state.todoLoader = true;
      })
      .addCase(getUserTodos.fulfilled, (state, action) => {
        state.todoLoader = false;
        state.todo = action.payload.userTodo;
        state.todoMessage = action.payload.message;
      })
      .addCase(getUserTodos.rejected, (state, action) => {
        state.todoLoader = false;
        state.todoError = action.error.message;
      })

      // Update Incomings file
      .addCase(updateTodo.pending, (state) => {
        state.todoLoader = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.todoLoader = false;
        state.todo = action.payload.todo;
        state.todoMessage = action.payload.message;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.todoLoader = false;
        state.todoError = action.error.message;
      })
      // delete todo
      .addCase(deleteTodo.pending, (state) => {
        state.todoLoader = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todoLoader = false;
        state.todo = action.payload.todo;
        state.todoMessage = action.payload.message;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.todoLoader = false;
        state.todoError = action.error.message;
      });
  },
});

//selector export

export const todoSelector = (state) => state.todo;

//actions export

export const { setEmptyTodoMessage } = todoSlice.actions;

//reducer export

export default todoSlice.reducer;
