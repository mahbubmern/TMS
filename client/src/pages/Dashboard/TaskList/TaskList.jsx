// import { useSelector } from "react-redux";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import Title from "../../../components/Title/Title";

import { useMemo, useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useForm } from "../../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmptyMessage } from "../../../features/users/userSlice";
import createToast from "../../../utils/createToast";
import { authSelector } from "../../../features/auth/authSlice";
import { sendTask, updateTask } from "../../../features/task/taskApiSlice";
import {
  setEmptyTaskMessage,
  taskSelector,
} from "../../../features/task/taskSlice";
import API from "../../../utils/api";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons-dt";
import Swal from "sweetalert2";
import { editIncomings } from "../../../features/incoming/incomingApiSlice";
import Stepper from "../../../components/Stepper/Stepper";

const TaskList = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelector);
  const { taskloader, taskmessage, taskerror } = useSelector(taskSelector);

  const { input, setInput, handleInputChange } = useForm({
    whereFrom: "",
    ref: "",
    date: "",
    subject: "",
    category: "",
    file: "",
    assigned: "",
    deadLine: "",
    priority: "",
    status: "",
    instruction: "",
    progress: "",
    _id: "",
  });

  // Function to handle changes in select inputs
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleTaskModalForm = async (e) => {
    e.preventDefault();

    if (user.role == "admin" || user.role == "sub admin") {
      const {
        assigned,
        deadLine,
        priority,
        status,
        progress,
        _id,
        instruction,
      } = input;
      const formDataSend = {
        assigned,
        status,
        progress,
        deadLine,
        priority,
        instruction,
        _id,
      };

      if (
        assigned &&
        assigned[assigned.length - 1].split("-")[0] === user.index
      ) {
        createToast("You must select Assignee");
        return;
      }
      // if (
      //   assigned &&
      //   assigned.indexOf(`${user.index}-${user.name}`) <
      //     assigned[assigned.length - 1]
      // ) {
      //   createToast("Data Updated");
      //   return;
      // }

      // Edit Incoming File
      await dispatch(editIncomings(formDataSend));
      // Send Incoming File to the USer
      await dispatch(sendTask(formDataSend));
    }

    if (user.role == "user") {
      const { status, progress, _id } = input;
      const formData = {
        status,
        progress,
        _id,
      };
      // Dispatch the updateUser action
      await dispatch(updateTask(formData));
    }

    //   Fetch the updated data from the server
    try {
      const response = await API.get(`/api/v1/task/${user._id}`);
      const sortedData = response.data.userTask.task.reverse().map((item) => ({
        ...item,
        file: (
          <>
            <p hidden>{item.file}</p>
          </>
        ), // Embedding the file link in img tag
      }));

      setData(sortedData); // Update the table data state with the updated data
    } catch (error) {
      createToast("Error updating user information", "error");
    }
  };

  // close edit modal function
  const closeEditModal = () => {
    // Close the modal
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (taskmessage) {
      createToast(taskmessage, "success");
      dispatch(setEmptyTaskMessage());
      closeEditModal();
    }
    if (taskerror) {
      createToast(taskerror);
      dispatch(setEmptyTaskMessage());
    }
  }, [taskmessage, taskerror, dispatch]);

  const [data, setData] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
  const [editSelectedFile, setEditSelectedFile] = useState(null); // State to control the visibility of the modal
  const [departments, setDepartments] = useState([]);
  const [targetUsers, setTargetUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/v1/task/${user._id}`);
        const sortedData = response.data.userTask.task
          .reverse()
          .map((item) => ({
            ...item,
            file: (
              <>
                <p hidden>{item.file}</p>
              </>
            ), // Embedding the file link in img tag
          }));

        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // handle View Button

  const handleView = (row) => {
    const fileName = row && row.file.props.children.props.children;
    if (fileName == null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No PDF file is attached here.",
      });
      return;
    }
    const halffilepath = `http://localhost:5050/files`;
    const filePath = `${halffilepath}/${fileName}`;
    window.open(filePath, "_blank");
  };

  // handle edit button

  const handleEdit = (row) => {
    setEditSelectedFile(row);
    setIsEditModalOpen(true);
    setInput(row);
  };

  // Task List Datatable Initialization

  useEffect(() => {
    // Initialize DataTable with buttons
    const table = $(".Datatable").DataTable({
      data: data,
      order: [[3, "asc"]],
      columns: [
        {
          data: "whereFrom",
          title: "From",
          render: (data) => {
            return `<div class="subject-column">
                  <div class="subject-text" >
                  ${data}
                  </div>
                  <div class="tooltip">${data}</div>
                </div>`;
          },
        },
        { data: "ref", title: "Ref" },
        {
          data: "subject",
          title: "Subject",
          render: (data) => {
            return `<div class="subject-column">
            <div class="subject-text">
            ${data}
            </div>
            <div class="tooltip">${data}</div>
          </div>`;
          },
        },
        { data: "date", title: "Date" },
        { data: "deadLine", title: "Dead Line" },
        { data: "category", title: "Category" },
        {
          data: "assigned",
          title: "Assigned",
          render: (data) => {
            if (data) {
              return `
                <div class="subject-column">
                  <div class="subject-text" title="${data}">
                    ${data}
                  </div>
                  <div class="tooltip">${data}</div>
                </div>`;
            }
            return ""; // Return an empty string if there's no data
          },
        },
        { data: "priority", title: "Priority" },
        {
          data: "instruction",
          title: "Instruction",
          render: (data) => {
            if (data) {
              return `
                  <div class="subject-column">
                    <div class="subject-text" title="${data}">
                      ${data}
                    </div>
                    <div class="tooltip">${data}</div>
                  </div>`;
            }
            return ""; // Return an empty string if there's no data
          },
        },
        {
          data: "progress",
          title: "Working Progress",
          render: (data) => {
            if (data) {
              return `
                <div class="subject-column">
                  <div class="subject-text" title="${data}">
                    ${data}
                  </div>
                  <div class="tooltip">${data}</div>
                </div>`;
            }
            return ""; // Return an empty string if there's no data
          },
        },
        { data: "status", title: "Status" },
        {
          data: null,
          title: "Actions",
          render: (data) => {
            // if (
            //   user.role === "super admin" ||
            //   user.role === "admin" ||
            //   user.role === "sub admin"
            // ) {
            return `<div class="actions">
                  <button class="btn btn-sm bg-success-light view-btn">
                    <i class="fe fe-eye"></i> View File
                  </button>
                  &nbsp;
                  <button class="btn btn-sm bg-warning-light edit-btn">
                    <i class="fe fe-pencil"></i> Edit
                  </button>
                </div>`;
          },
          //   else {
          //     return `<div class="actions">
          //         <button class="btn btn-sm bg-success-light view-btn">
          //           <i class="fe fe-eye"></i> View File
          //         </button>
          //       </div>`;
          //   }
          // },
        },
      ],
      createdRow: function (row, data, dataIndex) {
        if (data.status === "pending") {
          $(row).css("background-color", "#f2dede");
        } else {
          $(row).css("background-color", "skyblue");
        }
      },
      destroy: true,
      layout: {
        topStart: {
          buttons: ["copy", "csv", "excel", "pdf", "print"],
        },
      },
    });

    // View button handler
    const handleViewClick = (event) => {
      const row = table.row($(event.currentTarget).closest("tr")).data();
      handleView(row);
    };

    // Edit button handler
    const handleEditClick = (event) => {
      const row = table.row($(event.currentTarget).closest("tr")).data();
      handleEdit(row);
    };

    $(".Datatable tbody").on("click", ".view-btn", handleViewClick);
    $(".Datatable tbody").on("click", ".edit-btn", handleEditClick);

    // Cleanup function to destroy the DataTable and remove event listeners on unmount
    return () => {
      $(".Datatable tbody").off("click", ".view-btn", handleViewClick);
      $(".Datatable tbody").off("click", ".edit-btn", handleEditClick);
      table.destroy();
    };
  }, [data, user.role]);

  const formattedDate = useMemo(() => {
    if (input.date) {
      const [year, month, day] = input.date.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${day}-${months[parseInt(month) - 1]}-${year}`;
    }
    return ""; // Return an empty string if input.date is not available
  }, [input.date]);

  //useEffect for fetching admin department
  useEffect(() => {
    const fetchAdminDepartment = async () => {
      try {
        const response = await API.get(`/api/v1/user/${user._id}`);
        const sortedData = response.data.userDepartment.reverse();

        setDepartments(sortedData.map((dept) => dept._id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAdminDepartment();
  }, [user._id]);

  //useEffect for fetch sub-admin user and normal targeted users

  useEffect(() => {
    if (user.role === "admin") {
      if (departments.length > 0) {
        const fetchSubAdmin = async () => {
          try {
            const response = await API.get(`/api/v1/user`);
            const sortedData = response.data.user.reverse();

            // Filter sub-admins in the specified departments
            // const filteredSubAdmins = sortedData.filter(user =>
            //   user.role === 'sub admin' && departments.includes(user.department)
            // );

            // const filteredSubAdmins = sortedData.filter(user =>
            //   user.role === 'sub admin' &&
            //   user.department.some(dept => departments.includes(dept.toString()))
            // );

            const filteredSubAdmins = sortedData.filter(
              (findUSer) =>
                findUSer.role === "sub admin" &&
                findUSer.department.some((dept) =>
                  user.department.includes(dept.toString())
                )
            );

            setTargetUsers(filteredSubAdmins);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchSubAdmin();
      }
    }

    if (user.role === "sub admin") {
      if (departments.length > 0) {
        const fetchTargetUsers = async () => {
          try {
            const response = await API.get(`/api/v1/user`);
            const sortedData = response.data.user.reverse();

            // Filter sub-admins in the specified departments
            // const filteredSubAdmins = sortedData.filter(user =>
            //   user.role === 'sub admin' && departments.includes(user.department)
            // );

            // const filteredSubAdmins = sortedData.filter(user =>
            //   user.role === 'sub admin' &&
            //   user.department.some(dept => departments.includes(dept.toString()))
            // );

            const filteredTargetedUSer = sortedData.filter(
              (findUSer) =>
                findUSer.role === "user" &&
                findUSer.department.some((dept) =>
                  user.department.includes(dept.toString())
                )
            );

            setTargetUsers(filteredTargetedUSer);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchTargetUsers();
      }
    }
  }, [departments]);

 


  const assignedSteps = editSelectedFile && editSelectedFile.assigned;

  return (
    <>
      <Title title={"TMS | TaskList"} />
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

              <div className="card-header">
                <h5 className="card-title" style={{ color: "red" }}>
                  {" "}
                  Task List &nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="main-grid-item-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <polyline points="9 10 4 15 9 20" />
                    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                  </svg>
                </h5>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="Datatable table table-hover table-center mb-0">
                      <thead>
                        <tr>
                          <th>From</th>
                          <th>Ref</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Dead Line </th>
                          <th>Priority</th>
                          <th>Instruction</th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Edit Modal Start */}
      <Modal
        show={isEditModalOpen}
        onHide={closeEditModal}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h5>Task Details</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {editSelectedFile && (
            <>
              <Form onSubmit={handleTaskModalForm}>
                <Form.Group
                  className="mb-3"
                  controlId="formGridId"
                  disabled
                  hidden
                >
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="User ID"
                    name="id"
                    value={input._id}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "lightyellow" }}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formGridFile"
                  disabled
                  hidden
                >
                  <Form.Label>File</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="File"
                    name="file"
                    value={input.file.props.children.props.children}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "lightyellow" }}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridFrom">
                    <Form.Label>From</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="From"
                      name="whereFrom"
                      value={input.whereFrom}
                      onChange={handleInputChange}
                      disabled
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridRef">
                    <Form.Label>Reference</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Reference"
                      name="ref"
                      value={input.ref}
                      onChange={handleInputChange}
                      disabled
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Date"
                      name="date"
                      value={formattedDate}
                      onChange={handleInputChange}
                      disabled
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group controlId="formGridSubject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Subject"
                      name="subject"
                      value={input.subject}
                      onChange={handleInputChange}
                      disabled
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCategory">
                    <Form.Label><strong style={{color: "red"}}>File Reaching Status</strong></Form.Label>
                    <Stepper steps={assignedSteps} />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Category"
                      name="category"
                      value={input.category}
                      onChange={handleInputChange}
                      disabled
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>

                  {user.role == "user" ? (
                    <Form.Group as={Col} controlId="formGridAssign">
                      <Form.Label>Assigned</Form.Label>
                      <Form.Select
                        name="assigned"
                        disabled
                        value={`${user.index}-${user.name}`}
                        onChange={handleSelectChange}
                        style={{ backgroundColor: "lightyellow" }}
                      >
                        <option
                          value={`${user.index}-${user.name}`}
                        >{`${user.index}-${user.name}`}</option>
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Form.Group as={Col} controlId="formGridAssign">
                      <Form.Label>Assigned</Form.Label>
                      {user.role === "admin" || user.role === "sub admin" ? (
                        <span
                          style={{
                            color: "red",
                            fontSize: "20px",
                            verticalAlign: "middle",
                          }}
                        >
                          ***
                        </span>
                      ) : (
                        ""
                      )}

                      <Form.Select
                        name="assigned"
                        value={input.assigned || ""}
                        onChange={handleSelectChange}
                        style={{ backgroundColor: "lightyellow" }}
                      >
                        <option>-Select-</option>

                        {targetUsers &&
                          targetUsers.map((targetUser) => (
                            <option
                              key={targetUser.index}
                              value={`${targetUser.index}- ${targetUser.name}`}
                            >
                              {`${targetUser.index}- ${targetUser.name}`}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  )}

                  <Form.Group as={Col} controlId="formGridDeadLine">
                    <Form.Label>Dead Line</Form.Label>
                    <Form.Control
                      disabled
                      type="date"
                      name="deadLine"
                      value={input.deadLine}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridPriority">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      disabled
                      name="priority"
                      value={input.priority || ""}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                    >
                      <option>Choose...</option>
                      <option value="urgent">Urgent</option>
                      <option value="normal">Normal</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridStatus">
                    <Form.Label>Status</Form.Label>
                    {user.role === "admin" || user.role === "sub admin" ? (
                      <Form.Select
                        name="status"
                        value={input.status || ""}
                        onChange={handleSelectChange}
                        style={{ backgroundColor: "lightyellow" }}
                        disabled
                      >
                        <option value="Choose">Choose...</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </Form.Select>
                    ) : (
                      <Form.Select
                        name="status"
                        value={input.status || ""}
                        onChange={handleSelectChange}
                        style={{ backgroundColor: "lightyellow" }}
                      >
                        <option value="Choose">Choose...</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </Form.Select>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Instruction</Form.Label> &nbsp;
                    {user.role === "admin" || user.role === "sub admin" ? (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        [ You May Put Your Instruction]
                      </span>
                    ) : (
                      ""
                    )}
                    {user.role === "user" ? (
                      <Form.Control
                        disabled
                        as="textarea"
                        rows={5}
                        name="instruction"
                        value={input.instruction}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    ) : (
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="instruction"
                        value={input.instruction}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    )}
                  </Form.Group>

                  <Form.Group as={Col} controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Working Progress</Form.Label>
                    {user.role === "user" ? (
                      <span
                        style={{
                          color: "red",
                          fontSize: "20px",
                          verticalAlign: "middle",
                        }}
                      >
                        ***
                      </span>
                    ) : (
                      ""
                    )}

                    {user.role === "admin" || user.role === "sub admin" ? (
                      <Form.Control
                        as="textarea"
                        rows={10}
                        disabled
                        name="progress"
                        value={input.progress}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    ) : (
                      <Form.Control
                        as="textarea"
                        rows={10}
                        name="progress"
                        value={input.progress}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    )}
                  </Form.Group>
                </Row>

                <Button variant="primary" type="submit" className="w-100">
                  {taskloader ? "Updating..." : "Update File"}
                </Button>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
      {/* Task Edit Modal End */}
    </>
  );
};

export default TaskList;
