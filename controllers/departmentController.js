import asyncHandler from "express-async-handler";
import Departments from "../models/departmentModel.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { fileDeleteFromCloud, fileUploadToCloud } from "../utils/cloudinary.js";
import {
  getPublicID,
  isValidEmail,
  isValidPhoneNumber,
} from "../helpers/helpers.js";

/**
 * @description : get all Department
 * @method : GET
 * @access : private
 * @route : '/api/v1/department'
 */
export const getAllDepartment = asyncHandler(async (req, res) => {
  const todo = await Todos.find();

  //  check Incoming Letter
  if (todo.length === 0) {
    return res.status(404).json({ message: "No Todo Found" });
  }
  res.status(200).json({ todo, message: "Todo Found Successful" });
});

/**
 * @description : create Department
 * @method : POST
 * @access : private
 * @route : '/api/v1/department'
 */
export const createDepartment = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  // Find User
  const findUser = await Users.findById(id);

  console.log(id, name);
  console.log(findUser);

  if (!findUser) {
    return res.status(400).json({ message: "User Not Found" });
  }

  // Data validation
  if (!name) {
    return res.status(400).json({ message: "Department Name Must Required" });
  }

  // Todo creation
  const newDepartment = await Departments.create({
    name,
  });

  // Associate todo with user
  findUser.department.push(newDepartment);
  await findUser.save();

  // Response
  res.status(201).json({
    department: newDepartment,
    message: "Department Created Successfully",
  });
});

// /**
//  * @description : update department
//  * @method : PUT/PATCH
//  * @access : private
//  * @route : '/api/v1/department'
//  */
export const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Check if required fields are provided
  if (!name) {
    return res.status(400).json({
      message: "Department Name  Required",
    });
  }

  // Check if the file exists
  const existingDepartment = await Departments.findById(id);
  if (!existingDepartment) {
    return res.status(400).json({
      message: "Department Not Exists",
    });
  }

  // Update the Todo
  const updatedDepartment = await Departments.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  if (!updatedDepartment) {
    return res.status(500).json({ message: "Failed to update Department" });
  }

  res.status(200).json({
    department: updatedDepartment,
    message: "Department Name update Successful",
  });
});

//get User Todo

export const getSingleUserDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Users.findOne()
    .where("_id")
    .equals(id)
    .populate("department");

  const userDepartment = user.department;

  //check Incoming Letter
  if (userDepartment.length === 0) {
    return res.status(404).json({ message: "No Department Found" });
  }
  res.status(200).json({ userDepartment: user });
});

// /**
//  * @description : delete Department
//  * @method : DELETE
//  * @access : private
//  * @route : '/api/v1/Department'
//  */

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { userId, departmentId } = req.params;

  // Validate the user ID and todo ID
  if (!userId || !departmentId) {
    return res
      .status(400)
      .json({ message: "Invalid user ID or Department ID" });
  }

  try {
    // Find the user by ID and update their todos array to remove the specified todo ID
    const updatedUsersDepartment = await Users.updateMany(
      {},
      { $pull: { department: departmentId } },
      { new: true }
    );

    const departmentDelete = await Departments.findByIdAndDelete(departmentId);

    // Check if the user exists and the todo was successfully removed
    if (!updatedUsersDepartment) {
      return res.status(404).json({ message: "Users Department not found" });
    }

    // Respond with success message
    res.status(200).json({
      department: updatedUsersDepartment,
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    // Respond with error message
    res.status(500).json({ message: "Internal server error" });
  }
});
