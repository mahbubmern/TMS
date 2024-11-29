import asyncHandler from "express-async-handler";
import Outgoings from "../models/outgoingModel.js";
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
export const getAllOutgoing = asyncHandler(async (req, res) => {
  const outgoingFile = await Outgoings.find();

  //check Incoming Letter
  if (outgoingFile.length === 0) {
    return res.status(404).json({ message: "No Ougoing Letter Found" });
  }
  res
    .status(200)
    .json({ outgoingFile, message: "Outgoing Letter Found Successful" });
});

/**
 * @description : get all Pending Letter
 * @method : GET
 * @access : public
 * @route : '/api/v1/incoming/pending'
 */
export const getAllPendings = asyncHandler(async (req, res) => {
  const pendingFile = await Outgoings.find()
    .where("status")
    .equals("pending")
    .where("assigned")
    .ne(null);

  //check Incoming Letter
  if (pendingFile.length === 0) {
    return res.status(404).json({ message: "No Pending Letter Found" });
  }
  res
    .status(200)
    .json({ pendingFile, message: "Pending File Found Successful" });
});

/**
 * @description : create Incoming Letter
 * @method : POST
 * @access : public
 * @route : '/api/v1/incoming'
 */
export const createOutgoing = asyncHandler(async (req, res) => {
  const { to, department, subject, date, ref, whereFrom, sender } = req.body;

  //data validation

  if (!subject || !date || !to || !ref || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check file exist

  let pdfFile = null;
  if (req.file) {
    const data = req.file.filename;
    pdfFile = data;
  }

  //user create

  const newOutgoingLetter = await Outgoings.create({
    subject,
    date,
    ref,
    to,
    department,
    whereFrom,
    sender,
    file: pdfFile,
  });

  let findUserIndexArray = [];
  //index split
  to.map((item) => {
    findUserIndexArray.push(item.split("-")[0]);
  });

  // Handle the 'to' array: find users by index number and update their tasks
  for (const userIndex of findUserIndexArray) {
    const user = await Users.findOne({ index: userIndex });
    if (user) {
      // Add the Outgoing File ObjectId to the user's tasks field
      user.task.push(newOutgoingLetter._id);
      user.notification.push(newOutgoingLetter._id);
      await user.save();

      // You can add any additional logic to send notifications or handle the user here
    }
  }

  // response

  res.status(201).json({
    outgoingFile: newOutgoingLetter,
    message: "Created and Send File to the Recipient Successful",
  });

  // const newIncomingLetter = await Incomings.create({

  //   photo: photoFile,
  // });
  // response

  // res.status(201).json({ incomingLetter: newIncomingLetter, message: "Incoming Letter created Successful" });// const newIncomingLetter = await Incomings.create({

  //   photo: photoFile,
  // });
  // // response

  // res.status(201).json({ incomingLetter: newIncomingLetter, message: "Incoming Letter created Successful" });

  // //check file exist

  // let pdfFile = null;
  // if (req.file) {
  //   const data = await fileUploadToCloud(req.file.path);
  //   photoFile = data.secure_url;
  // }
});

// /**
//  * @description : update incoming File
//  * @method : PUT/PATCH
//  * @access : public
//  * @route : '/api/v1/incoming'
//  */
export const updateOutgoingFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { assigned, status, instruction } = req.body;

  // Check if required fields are provided
  if (!assigned || !status || !instruction) {
    return res.status(400).json({
      message: "Some Fields are Required",
    });
  }

  // Check if the file exists
  const existingFile = await Outgoings.findById(id);
  if (!existingFile) {
    return res.status(400).json({
      message: "File Not Exists",
    });
  }

  // Update the file
  const updatedFile = await Outgoings.findByIdAndUpdate(
    id,
    { assigned, status, instruction },
    { new: true }
  );

  // // Store shared data in recipient's data
  // const fileSendToUser = await Users.findOneAndUpdate(
  //   { index: assigned },
  //   { $push: { task: id } },
  //   { new: true }
  // ).populate("task");

  // if (!fileSendToUser) {
  //   return res.status(500).json({ message: "Failed to send File" });
  // }

  // if (!fileSendToUser) {
  //   return res.status(500).json({ message: "Failed to sending File" });
  // }

  if (!updatedFile) {
    return res.status(500).json({ message: "Failed to update Outgoing File" });
  }

  res.status(200).json({
    outgoingFile: updatedFile,
    message: "Data update & Sent to User Successful",
  });
});

// /**
//  * @description : get single user
//  * @method : GET
//  * @access : public
//  * @route : '/api/v1/user'
//  */
// export const getSingleUser = asyncHandler(async (req, res) => {});

// /**
//  * @description : delete user
//  * @method : DELETE
//  * @access : public
//  * @route : '/api/v1/user'
//  */

// export const deleteUser = asyncHandler(async (req, res) => {

//       const {id} = req.params

//       const deletedUser = await Users.findByIdAndDelete(id);

//       await fileDeleteFromCloud(getPublicID(deletedUser.photo));

//  res.status(200).json({ user: deletedUser, message: "User delete Successful" });
// });
