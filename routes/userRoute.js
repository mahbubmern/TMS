import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getAllUserWithPendingTasks,
  getSingleUserDepartment,
  updateUser,

} from "../controllers/userController.js";
import {userPhoto} from "../utils/mullter.js";

// router initialize

const router = express.Router();

// route set

router.route("/").get(getAllUser).post(userPhoto, createUser);
router
  .route("/:id")
  .get(getSingleUserDepartment)
  .put(updateUser)
  .patch(userPhoto,updateUser)
  .delete(deleteUser);

  router.route("/users/pending-tasks").get(getAllUserWithPendingTasks)

// export userRoute

export default router;
