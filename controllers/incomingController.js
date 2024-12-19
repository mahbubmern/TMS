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
import { incomingFile } from "../utils/mullter.js";

/**
 * @description : get all Incoming Letter
 * @method : GET
 * @access : public
 * @route : '/api/v1/incoming'
 */
export const getAllIncomings = asyncHandler(async (req, res) => {
  const incomingFile = await Incomings.find();

  //check Incoming Letter
  if (incomingFile.length === 0) {
    return res.status(404).json({ message: "No Incoming Letter Found" });
  }
  res
    .status(200)
    .json({ incomingFile, message: "Incoming Letter Found Successful" });
});

/**
 * @description : get all Pending Letter
 * @method : GET
 * @access : public
 * @route : '/api/v1/incoming/pending'
 */
export const getAllPendings = asyncHandler(async (req, res) => {
  const pendingFile = await Incomings.find()
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
export const createIncoming = asyncHandler(async (req, res) => {
  const {
    to,
    department,
    from,
    subject,
    date,
    deadLine,
    ref,
    category,
    branch,
    whereFrom,
    sender,
  } = req.body;

  //data validation

  if (from) {
    //check file exist

    let pdfFile = null;
    if (req.file) {
      const data = req.file.filename;
      pdfFile = data;
    }

    // Handle whereFrom based on the type of 'from'
    const whereFromValue = Array.isArray(from) ? from[0] : from;

    //user create

    let findUserIndexArray = [];

    const newIncomingLetter = await Incomings.create({
      subject,
      date,
      ref,
      to: [],
      branch,
      department,
      deadLine,
      whereFrom: whereFromValue,
      sender,
      file: pdfFile,
    });

    //index split
    if (to.length > 0) {
      to.map((item) => {
        findUserIndexArray.push(item.split("-")[0]);
      });

      // Handle the 'to' array: find users by index number and update their tasks
      for (const userIndex of findUserIndexArray) {
        const user = await Users.findOne({ index: userIndex });
        if (user) {
          // Add the Outgoing File ObjectId to the user's tasks field
          user.task.push(newIncomingLetter._id);
          user.notification.push(newIncomingLetter._id);
          await user.save();

          // You can add any additional logic to send notifications or handle the user here
        }
      }
    }

    // response

    res.status(201).json({
      incomingFileFile: newIncomingLetter,
      message: "Created Successful",
    });
  } else {
    //check file exist

    let pdfFile = null;
    if (req.file) {
      const data = req.file.filename;
      pdfFile = data;
    }

    //user create

    const newIncomingLetter = await Incomings.create({
      subject,
      date,
      ref,
      to,
      branch,
      department,
      deadLine,
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
        // user.task.push(newIncomingLetter._id);
        user.notification.push(newIncomingLetter._id);
        await user.save();

        // You can add any additional logic to send notifications or handle the user here
      }
    }
    // response

    res.status(201).json({
      incomingLetter: newIncomingLetter,
      message: "Created and Send File to the Recipient Successful",
    });
  }

  // const newIncomingLetter = await Incomings.create({

  //   photo: photoFile,
  // });
  // // response

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
export const updateIncomingFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    whereFrom,
    ref,
    subject,
    deadLine,
    priority,
    category,
    status,
    instruction,
    progress,
  } = req.body;

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

  // Check if required fields are provided
  if (!deadLine) {
    return res.status(400).json({
      message: "You Must Select DeadLine",
    });
  }

  // Check if the file exists
  const existingFile = await Incomings.findById(id);
  if (!existingFile) {
    return res.status(400).json({
      message: "File Not Exists",
    });
  }

  // Update the file
  const updatedFile = await Incomings.findByIdAndUpdate(
    id,
    {
      whereFrom,
      ref,
      subject,
      category,
      deadLine,
      priority,
      status,
      instruction,
      progress,
    },
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
    return res.status(500).json({ message: "Failed to update Incoming File" });
  }

  res.status(200).json({
    incomingFile: updatedFile,
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
