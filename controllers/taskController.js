import asyncHandler from "express-async-handler";
import Incomings from "../models/incomingModel.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { fileDeleteFromCloud, fileUploadToCloud } from "../utils/cloudinary.js";
import {
  getPublicID,
  isValidEmail,
  isValidPhoneNumber,
} from "../helpers/helpers.js";

/**
 * @description : get all Incoming Letter
 * @method : GET
 * @access : public
 * @route : '/api/v1/incoming'
 */
export const getSingleUserData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Users.findOne().where("_id").equals(id).populate("task");
  const userTask = user.task;

  //check Incoming Letter
  if (userTask.length === 0) {
    return res.status(404).json({ message: "No Task Found" });
  }
  res.status(200).json({ userTask: user });
});

/**
 * @description : create Incoming Letter
 * @method : POST
 * @access : public
 * @route : '/api/v1/incoming'
 */
export const sendTask = asyncHandler(async (req, res) => {
  const { assigned, deadLine, priority, status, instruction, progress, _id } =
    req.body;

  // if (assigned == undefined || assigned == "choose") {
  //   return res.status(400).json({
  //     message: "Plese Select Assigee",
  //   });
  // }

  // if (priority == null || priority == "choose") {
  //   return res.status(400).json({
  //     message: "Plese Select Priority",
  //   });
  // }
  const nameSplit = assigned.split("-");

  // Check if required fields are provided
  if (!deadLine) {
    return res.status(400).json({
      message: "Some Fields are Required",
    });
  }

  // Check if the Incomings already exists
  let existingIncomingFile = await Incomings.findByIdAndUpdate(_id);

  if (existingIncomingFile.assigned.includes(assigned)) {
    return res.status(400).json({ message: "File Already Sent to this user" });
  }

  // If the Incomings list does not contain the new Incomings, add it
  if (!existingIncomingFile.assigned.includes(assigned)) {
    existingIncomingFile.assigned.push(assigned);
  }

  // Save the category to the database

  // Store shared data in recipient's data
  const fileSendToUser = await Users.findOneAndUpdate(
    { index: nameSplit[0] },
    {
      $push: { task: _id },
      $addToSet: { notification: _id }, // Push _id into notification keys
    },
    { new: true }
  ).populate("task");

  if (!fileSendToUser) {
    return res.status(500).json({ message: "Failed to send File" });
  }

  await existingIncomingFile.save();

  res
    .status(200)
    .json({ userTask: {fileSendToUser, existingIncomingFile}, message: "Task Send Successful" });
});
// /**
//  * @description : update incoming File
//  * @method : PUT/PATCH
//  * @access : public
//  * @route : '/api/v1/incoming'
//  */
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, progress } = req.body;

  // Check if required fields are provided
  if (!status || !progress) {
    return res.status(400).json({
      message: "Some Fields are Required",
    });
  }

  if (status == undefined || status == "Choose") {
    return res.status(400).json({
      message: "Please Select Status",
    });
  }

  // // Check if the file exists
  const existingFile = await Incomings.findById(id);
  if (!existingFile) {
    return res.status(400).json({
      message: "File Not Exists",
    });
  }

  // Update the file
  const updatedFile = await Incomings.findByIdAndUpdate(
    id,
    { $set: { status: status, progress: progress } },
    { new: true }
  );
  if (!updatedFile) {
    return res.status(500).json({ message: "Failed to update Task File" });
  }

  res.status(200).json({
    userTask: updatedFile,
    message: "Update Successful",
  });
});
