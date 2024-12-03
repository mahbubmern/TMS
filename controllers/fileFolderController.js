import asyncHandler from "express-async-handler";
import Users from "../models/userModel.js";
import { Folder } from "../models/fileFolderModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateOTP,
  getPublicID,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  tokenDecode,
} from "../helpers/helpers.js";
import { AccountVerifyMail } from "../mails/mail.js";
import { sendSMS } from "../mails/sendSMS.js";

//===========================================================

/**
 * @description : Create Folder
 * @method : POST
 * @access : public
 * @route : '/api/v1/createfolder'
 */
export const createFolder = asyncHandler(async (req, res) => {
  const { name, parentFolder } = req.body;

  

  // Validate request
  if (!name) {
    return res.status(400).json({ message: "Folder name Required" });
  }

  // // Check if a folder with the same name exists in the same parent folder
  // const existingFolder = await Folder.findOne({
  //   folderName: folderName,
  //   parentFolder: parentFolder || null, // Null for root folders
  // });

  // if (existingFolder) {
  //   return res.status(400).json({
  //     message: "Folder with the same name already exists in this directory.",
  //   });
  // }

  // Create the new folder
  const newFolder = new Folder({
    name,
    parentFolder: parentFolder || null, // Null if it's a root folder
  });

  const savedFolder = await newFolder.save();

  // Respond with the newly created folder
  res.status(201).json({
    message: "Folder created successfully.",
    folders: savedFolder,
  });
});
// /**
//  * @description : update user
//  * @method : PUT/PATCH
//  * @access : public
//  * @route : '/api/v1/user'
//  */
// export const updateUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { name, index, role, status, department, extraRole } = req.body;

//   // Check if the user exists
//   const existsUser = await Users.findOne({ _id: id });

//   if (!existsUser) {
//     return res.status(400).json({
//       message: "User Not Exists",
//     });
//   }

//   //Convert department names to ObjectIds
//   const departmentIds = await Promise.all(
//     department.map(async (dept) => {
//       const department = await Departments.findOne({ name: dept });
//       if (department) {
//         return department._id;
//       } else {
//         // Create new department if not found
//         const newDepartment = new Departments({ name: dept });
//         const savedDepartment = await newDepartment.save();
//         return savedDepartment._id;
//       }
//     })
//   );

//   const userUpdate = await Users.findOneAndUpdate(
//     { _id: existsUser._id },
//     {
//       $set: { name, index, role, status, department: departmentIds, extraRole },
//     },
//     { new: true }
//   );

//   if (!userUpdate) {
//     return res.status(500).json({ message: "Failed to update user" });
//   }

//   res.status(200).json({ user: userUpdate, message: "User Update Successful" });
//   // const { id } = req.params;

//   // const { name, index, role, status, department } = req.body;

//   // // check user exists
//   // const ExistsUSer = await Users.findOne({ _id: id });

//   // if (!ExistsUSer) {
//   //   return res.status(400).json({
//   //     message: "User Not Exists",
//   //   });
//   // }

//   // // Convert department values to ObjectIds
//   // const departmentObjectIds = department.map((dept) => ObjectId(dept));

//   // console.log(name, index, role, status, departmentObjectIds);

//   // const userUpdate = await Users.findOneAndUpdate(
//   //   { _id: ExistsUSer._id },
//   //   { $set: { status, role, department: departmentObjectIds } },
//   //   { new: true }
//   // );

//   // if (!userUpdate) {
//   //   return res.status(500).json({ message: "Failed to update user" });
//   // }

//   // res.status(200).json({ user: userUpdate, message: "User Update Successful" });
// });

// /**
//  * @description : delete user
//  * @method : DELETE
//  * @access : public
//  * @route : '/api/v1/user'
//  */

// export const deleteUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const deletedUser = await Users.findByIdAndDelete(id);

//   await fileDeleteFromCloud(getPublicID(deletedUser.photo));

//   res
//     .status(200)
//     .json({ user: deletedUser, message: "User delete Successful" });
// });
