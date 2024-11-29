import express from "express";
import {
  getAllDepartment , createDepartment, updateDepartment, deleteDepartment,getSingleUserDepartment
} from "../controllers/departmentController.js";

// router initialize

const router = express.Router();

// route set

router.route("/").get(getAllDepartment).post(createDepartment);
router
.route("/:id")
.get(getSingleUserDepartment)
.patch(updateDepartment)
router.route("/:userId/:departmentId").delete(deleteDepartment)

  // .get(getSingleUser)
  // .put(updateUser)
  // .delete(deleteUser);

// export userRoute

export default router;
