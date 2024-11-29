import { useSelector } from "react-redux";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { authSelector } from "../../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../../../features/department/departmentApiSlice";
import API from "../../../utils/api";
import Modal from "react-bootstrap/Modal";
import {
  setEmptyDepartmentMessage,
  departmentSelector,
} from "../../../features/department/departmentSlice";
import createToast from "../../../utils/createToast";
import Title from "../../../components/Title/Title";

import Swal from "sweetalert2";

const Department = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { departmentMessage, departmentError } =
    useSelector(departmentSelector);

  const [department, setDepartment] = useState(null);

  const [currentDepartment, setCurrentDepartment] = useState(null);

  const [input, setInput] = useState({
    id: user._id,
    name: "",
  });

  const handleInputChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle Todo Create form

  const handleDepartmentForm = async (e) => {
    e.preventDefault();
    // Dispatching the action to create a new todo
    await dispatch(createDepartment(input));
    // Fetching updated todo list after adding a new todo
    const response = await API.get(`/api/v1/department/${user._id}`);

    // Updating the todo state with the newly fetched todo list
    setDepartment(response.data.userDepartment.department.reverse());
  };

  useEffect(() => {
    if (departmentMessage) {
      createToast(departmentMessage, "success");
      dispatch(setEmptyDepartmentMessage());
      setInput({
        id: user._id,
        name: "",
      });
    }
    if (departmentError) {
      createToast(departmentError);
      dispatch(setEmptyDepartmentMessage());
    }
  }, [departmentMessage, departmentError, dispatch]);

  // hande todo edit

  const handleEditDepartment = (item) => {
    // Set the current todo being edited when the "Edit" button is clicked
    setCurrentDepartment(item);
    modalOpen();
  };

  // edit todo form submit

  const handleEditDepartmentForm = async (e) => {
    e.preventDefault();
    await dispatch(updateDepartment(currentDepartment));
    // Fetching updated todo list after adding a new todo
    const response = await API.get(`/api/v1/department/${user._id}`);
    // Updating the todo state with the newly fetched todo list
    setDepartment(response.data.userDepartment.department.reverse());
    closeModal();
  };

  // handle delete Department
  const handleDeleteDepartment = (item) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your Depatment has been deleted.",
          icon: "success",
        });

        // Merge user._id with item
        const data = {
          userId: user._id,
          departmentId: item._id,
        };

        const deleteResponse = await dispatch(deleteDepartment(data));
        if (deleteResponse) {
          setDepartment((prevDepartments) =>
            prevDepartments.filter((department) => department._id !== item._id)
          );
        }
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/v1/department/${user._id}`);
        // Updating the todo state with the newly fetched todo list
        setDepartment(response.data.userDepartment.department.reverse());
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    fetchData();
  });

  // const pendingTaskModalOpen = ()=>{
  //   setViewPendingTaskModal(true)
  // }

  const modalOpen = () => {
    // open the modal
    setEditModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setEditModalOpen(false);
  };

  const TotalCount = department ? department.length : 0;

  return (
    <>
      <Title title={"TMS | Department"} />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <Breadcrumb />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              {/* Recent Orders */}
              <div className="card card-table">
                {/* <div className="card-header">
                  <h5 className="card-title" style={{ color: "red" }}>
                    {" "}
                    Departments &nbsp; &nbsp; &nbsp;
                  
                  </h5>
                </div> */}
                <div className="card-body">
                  <div className="table-responsive">
                    <div className="card card-table flex-fill">
                      <div className="card-header">
                        <h6 className="card-title">
                          Type Your Department Name
                        </h6>
                        <br />
                        <div className="form-container">
                          <form>
                            <div className="row">
                              <div className="col-12">
                                <input
                                  type="text"
                                  disabled
                                  hidden
                                  name="id"
                                  value={user._id}
                                />
                              </div>
                              <div className="col-10">
                                <input
                                  type="text"
                                  name="name"
                                  value={input.name}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="col-2">
                                <button
                                  className="save-button"
                                  type="submit"
                                  onClick={handleDepartmentForm}
                                >
                                  Create Department
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>

                        <hr />
                      </div>
                      <div className="card-body">
                        <div className="todo-container">
                          {department &&
                            department.map((item, index) => (
                              <div key={index} className="task-list-container">
                                <div className="left-item">
                                  <span>{item.name}</span>
                                </div>
                                <div className="right-item">
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleEditDepartment(item)}
                                  >
                                    <i className="fa fa-edit"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteDepartment(item)}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Edit Modal Start */}
                      <Modal
                        show={editModalOpen}
                        onHide={closeModal}
                        size="md"
                        aria-labelledby="example-modal-sizes-title-md"
                      >
                        <Modal.Header closeButton>Edit Todo</Modal.Header>
                        <Modal.Body>
                          <form onSubmit={handleEditDepartmentForm}>
                            <div className="row">
                              {/* Populate the input field with the current todo title */}

                              <div className="col-12">
                                <input
                                  disabled
                                  hidden
                                  type="text"
                                  name="id"
                                  className="form-control"
                                  value={
                                    currentDepartment
                                      ? currentDepartment._id
                                      : ""
                                  } // Populate input with todo title
                                />
                              </div>

                              <div className="col-12">
                                <div className="mb-3">
                                  <input
                                    type="text"
                                    name="todo"
                                    className="form-control"
                                    value={
                                      currentDepartment
                                        ? currentDepartment.name
                                        : ""
                                    } // Populate input with todo title
                                    onChange={(e) =>
                                      setCurrentDepartment({
                                        ...currentDepartment,
                                        name: e.target.value,
                                      })
                                    } // Update todo title in state
                                  />
                                </div>
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="btn btn-sm bg-success-light w-100"
                            >
                              Save
                            </button>
                          </form>
                        </Modal.Body>
                      </Modal>
                      {/* Edit Modal End */}

                      <div
                        className="card-footer"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <span style={{ fontWeight: "700", color: "#1B5990" }}>
                          Total Department : {TotalCount}
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Recent Orders */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Department;
