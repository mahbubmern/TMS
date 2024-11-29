// create slice

import { createSlice } from "@reduxjs/toolkit";
import {
  createOutgoing,
  editOutgoings,
  getOutgoings,
} from "./outgoingApiSlice";

const initialState = {
  outgoingFile: null,
  outgoingMessage: null,
  outgoingError: null,
  outgoingLoader: false,
};

const outgoingSlice = createSlice({
  name: "outgoing",
  initialState,
  reducers: {
    setEmptyOutgoingMessage: (state) => {
      (state.outgoingMessage = null), (state.outgoingError = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOutgoing.pending, (state) => {
        state.outgoingLoader = true;
      })
      .addCase(createOutgoing.fulfilled, (state, action) => {
        state.outgoingLoader = false;
        state.outgoingFile = action.payload.outgoingFile;
        state.outgoingMessage = action.payload.message;
      })
      .addCase(createOutgoing.rejected, (state, action) => {
        state.outgoingLoader = false;
        state.outgoingError = action.error.message;
      })
      // get All Incomings
      .addCase(getOutgoings.pending, (state) => {
        state.outgoingLoader = true;
      })
      .addCase(getOutgoings.fulfilled, (state, action) => {
        state.outgoingLoader = false;
        state.outgoingFile = action.payload;
        state.outgoingMessage = action.payload.message;
      })
      .addCase(getOutgoings.rejected, (state, action) => {
        state.outgoingLoader = false;
        state.outgoingError = action.error.message;
      })

      // Update Incomings file
      .addCase(editOutgoings.pending, (state) => {
        state.outgoingLoader = true;
      })
      .addCase(editOutgoings.fulfilled, (state, action) => {
        state.outgoingLoader = false;
        state.outgoingFile = action.payload.outgoingFile;
        state.outgoingMessage = action.payload.message;
      })
      .addCase(editOutgoings.rejected, (state, action) => {
        state.outgoingLoader = false;
        state.outgoingError = action.error.message;
      });
  },
});

//selector export

export const outgoingSelector = (state) => state.outgoing;

//actions export

export const { setEmptyOutgoingMessage } = outgoingSlice.actions;

//reducer export

export default outgoingSlice.reducer;
