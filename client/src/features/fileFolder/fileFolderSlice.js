// create slice

import { createSlice } from "@reduxjs/toolkit";
import { createFolder, getuserFolders } from "./fileFolderApiSlice";

const folderSlice = createSlice({
  name: "folders",
  initialState: {
    folders: [],
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setEmptyMessage : (state) =>{
      state.message = null,
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getuserFolders.pending, (state) => {
        state.loader = true;
      })
      .addCase(getuserFolders.fulfilled, (state, action) => {
        state.loader = false;
        state.folders =  action.payload.folders;
        state.message = action.payload.message
      })
      .addCase(getuserFolders.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })

      //create folder

      .addCase(createFolder.pending, (state) => {
        state.loader = true;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loader = false;
        state.folders = [...action.payload, action.payload.folders];
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      ;
  },
});



//selector export

export const foldersSelector = (state) => state.folders;

//actions export

export const {setEmptyMessage} = folderSlice.actions;

//reducer export

export default folderSlice.reducer;

