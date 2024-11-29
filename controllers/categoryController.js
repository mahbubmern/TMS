import asyncHandler from "express-async-handler";
import Users from "../models/userModel.js";
import Category from "../models/categoryModel.js";

/**
 * @description : get all user
 * @method : GET
 * @access : public
 * @route : '/api/v1/user'
 */
export const getAllCategory = asyncHandler(async (req, res) => {
  // Find all categories in the database
  const categories = await Category.find();

  const categoryList = categories[0].list;
  // If categories are found, return them in the response
  res.status(200).json(categoryList);
});

/**
 * @description : create Category
 * @method : POST
 * @access : public
 * @route : '/api/v1/category'
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category must fill" });
  }
  // Check if the category already exists
  let existingCategory = await Category.findOne();

  // If the category doesn't exist, create a new one
  if (!existingCategory) {
    existingCategory = new Category({ list: [] });
  }

  if (existingCategory.list.includes(category)) {
    return res.status(400).json({ message: "Category must fill" });
  }

  // If the category list does not contain the new category, add it
  if (!existingCategory.list.includes(category)) {
    existingCategory.list.push(category);
  }

  // Save the category to the database
  await existingCategory.save();

  res.status(201).json({
    category: existingCategory,
    message: "Category created Successful",
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

//   const { name, index, role, status } = req.body;

//   // check user exists
//   const ExistsUSer = await Users.findOne({ _id: id });

//   if (!ExistsUSer) {
//     return res.status(400).json({
//       message: "User Not Exists",
//     });
//   }

//   const userUpdate = await Users.findOneAndUpdate(
//     { _id: ExistsUSer._id },
//     { $set: { status: status, role: role } },
//     { new: true }
//   );

//   if (!userUpdate) {
//     return res.status(500).json({ message: "Failed to update user" });
//   }

//   res.status(200).json({ user: userUpdate, message: "User Update Successful" });
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
