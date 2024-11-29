// create slice

import { createSlice } from "@reduxjs/toolkit";
import { sendTask, getAllTask, updateTask } from "./taskApiSlice";

const initialState = {
  task: null,
  taskmessage: null,
  taskerror: null,
  taskloader: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setEmptyTaskMessage: (state) => {
      (state.taskmessage = null), (state.taskerror = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTask.pending, (state) => {
        state.taskloader = true;
      })
      .addCase(sendTask.fulfilled, (state, action) => {
        state.taskloader = false;
        state.task = action.payload.userTask;
        state.taskmessage = action.payload.message;
      })
      .addCase(sendTask.rejected, (state, action) => {
        state.taskloader = false;
        state.taskerror = action.error.message;
      })
      // get All task
      .addCase(getAllTask.pending, (state) => {
        state.taskloader = true;
      })
      .addCase(getAllTask.fulfilled, (state, action) => {
        state.taskloader = false;
        state.task = action.payload.userTask;
        state.taskmessage = action.payload.message;
      })
      .addCase(getAllTask.rejected, (state, action) => {
        state.taskloader = false;
        state.taskerror = action.error.message;
      })

      // Update task file
      .addCase(updateTask.pending, (state) => {
        state.taskloader = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.taskloader = false;
        state.task = action.payload.userTask;
        state.taskmessage = action.payload.message;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.taskloader = false;
        state.taskerror = action.error.message;
      });
  },
});

//selector export

export const taskSelector = (state) => state.task;

//actions export

export const { setEmptyTaskMessage } = taskSlice.actions;

//reducer export

export default taskSlice.reducer;
