import express from "express";
import {
  createCategory,
  getAllCategory,


} from "../controllers/categoryController.js";

// router initialize

const router = express.Router();

// route set

router.route("/").get(getAllCategory).post(createCategory);
// router
//   .route("/:id")
//   .put(updateUser)
//   .delete(deleteUser);

// export userRoute

export default router;
