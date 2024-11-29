import { useMemo, useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
// import Example from "../../../components/Datatables/Datatables";
// import Datatables from "../../../components/Datatables/Datatables";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";

import {
  formatDateToDDMMYYYY,
  formatTimeToHHMMSS,
} from "../../../utils/ConvertTime.js";
import { useForm } from "../../../hooks/useForm.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmptyMessage,
  userSelector,
} from "../../../features/users/userSlice";
import createToast from "../../../utils/createToast";
import { getAllUser, updateUser } from "../../../features/users/userApiSlice";
import { authSelector } from "../../../features/auth/authSlice";
import API from "../../../utils/api";

import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons-dt";
import Title from "../../../components/Title/Title.jsx";

const Users = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { loader, error, message } = useSelector(userSelector);

  const { input, setInput, handleInputChange } = useForm({
    id: "",
    index: "",
    name: "",
    email: "",
    role: "",
    status: "", // Add status field to the initial state
  });

  // Function to handle changes in select inputs
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  // handle checkbox value
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (checked) {
      setSelectedDepartments([...selectedDepartments, name]);
    } else {
      setSelectedDepartments(
        selectedDepartments.filter((dept) => dept !== name)
      );
    }
  };

  const handleEditUserModalForm = async (e) => {
    e.preventDefault();
    const { name, index, role, status, _id } = input;
    const formData = {
      name,
      index,
      role,
      status,
      department: selectedDepartments,
      extraRole: assignedPa,
      _id,
    };

    // Save the current page index
    const table = $(".datatable").DataTable();
    const currentPage = table.page();

    // Convert status to boolean
    // Dispatch the updateUser action
    await dispatch(updateUser(formData));

    // Fetch the updated data from the server
    try {
      const response = await API.get("/api/v1/user");
      const sortedData = response.data.user.reverse();
      const filteredData = sortedData.filter(
        (data) => data.branch == user.branch
      );
      setData(filteredData); // Update the table data state with the updated data
      closeEditModal(); // Close the edit modal after successful update

      // Update the DataTable with the new data without resetting the page
      table.clear().rows.add(filteredData).draw(false);

      // Restore the page index
      table.page(currentPage).draw(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      createToast("Error updating user information", "error");
    }
  };

  useEffect(() => {
    if (message) {
      createToast(message, "success");
      dispatch(setEmptyMessage());
      setIsEditModalOpen(false);
    }
    if (error) {
      createToast(error);
      dispatch(setEmptyMessage());
    }
  }, [message, error, dispatch]);

  const [data, setData] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
  const [editSelectedUser, setEditSelectedUser] = useState(null); // State to control the visibility of the modal
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [viewDepartment, setViewDepartment] = useState([]);
  const [pa, setPa] = useState(false);
  const [assignedPa, setAssignedPa] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/api/v1/user");
        const sortedData = response.data.user.reverse();
        
        

        if (user.role === "super admin") {
          setData(sortedData.filter((data) => data.branch === user.branch));
          
        } else {
          setData(
            sortedData.filter((data) =>
              data.department.some((dept) => user.department.includes(dept))
            )
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  

  useEffect(() => {
    if (editSelectedUser) {
      const fetchUserDepartmentData = async () => {
        try {
          const response = await API.get(
            `/api/v1/user/${editSelectedUser._id}`
          );
          const sortedData = response.data.userDepartment;
          const desiredDepartment = sortedData.map((item) => item.name);
          setSelectedDepartments(desiredDepartment || []);
          setPa(response.data.user.extraRole || "");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      setInput(editSelectedUser);

      fetchUserDepartmentData();
    }
  }, [editSelectedUser]);

  // useEffect for Displaying User Department when view Button is Clicked

  useEffect(() => {
    if (selectedUser) {
      const fetchUserDepartmentData = async () => {
        try {
          const response = await API.get(`/api/v1/user/${selectedUser._id}`);
          const sortedData = response.data.userDepartment;
          const desiredDepartment = sortedData.map((item) => item.name);
          setViewDepartment(desiredDepartment || []);
          setPa(response.data.user.extraRole || "");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchUserDepartmentData();
    }
  }, [selectedUser]);

  const handleView = (row) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  //Function to handle edit button click
  const handleEdit = (row) => {
    if (row) {
      setEditSelectedUser(row);
      setIsEditModalOpen(true);
      setInput(row);
    }
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  const closeEditModal = () => {
    // Close the modal
    setIsEditModalOpen(false);
  };

  //toggle PA

  const switchToToggle = (e) => {
    const { name, checked } = e.target;
    setPa(checked);
    setAssignedPa(checked ? name : null);
  };

  // users datatable
  useEffect(() => {
    // Initialize DataTable with buttons
    const table = $(".datatable").DataTable({
      data: data,
      columns: [
        {
          data: "name",
          title: "Name",
          render: (data) => {
            return `<div class="subject-column">
                  <div class="subject-text" >
                  ${data}
                  </div>
                  <div class="tooltip">${data}</div>
                </div>`;
          },
        },
        { data: "index", title: "Index" },
        {
          data: "email",
          title: "E-mail",
          render: (data) => {
            return `<div class="subject-column">
                  <div class="subject-text" >
                  ${data}
                  </div>
                  <div class="tooltip">${data}</div>
                </div>`;
          },
        },
        { data: "role", title: "Role" },
        {
          data: "status",
          title: "Status",
          render: (data) => {
            return data === "Active"
              ? '<span class="badge bg-success">Active</span>'
              : '<span class="badge bg-danger">Blocked</span>';
          },
        },
        {
          data: null,
          title: "Actions",
          render: (data) => {
            if (user.role == "super admin") {
              return `<div class="actions">
                <button class="btn btn-sm bg-success-light view-btn">
                  <i class="fe fe-eye"></i> View
                </button>
                &nbsp;
                <button class="btn btn-sm bg-warning-light edit-btn">
                  <i class="fe fe-pencil"></i> Edit
                </button>
              </div>`;
            } else {
              return `
              <div class="actions">
                <button class="btn btn-sm bg-success-light view-btn">
                  <i class="fe fe-pencil"></i> View
                </button>
              </div>`;
            }
          },
        },
      ],
      destroy: true,
      layout: {
        topStart: {
          buttons: ["copy", "csv", "excel", "pdf", "print"],
        },
      },
    });

    // View button handler
    $(".datatable tbody").on("click", ".view-btn", function () {
      const row = table.row($(this).closest("tr")).data();
      handleView(row);
    });

    // Edit button handler
    $(".datatable tbody").on("click", ".edit-btn", function () {
      const row = table.row($(this).closest("tr")).data();
      handleEdit(row);
    });

    // Cleanup function to destroy the DataTable on unmount
    return () => {
      table.destroy();
    };
  }, [data]);

  // Department Name fetch by Divisional Super Admin

  useEffect(() => {
    const fetchUserDepartment = async () => {
      try {
        const response = await API.get(`/api/v1/user/${user._id}`);
        const sortedData = response.data.userDepartment.reverse();
        setDepartments(sortedData.map((dept) => dept.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserDepartment();
  }, [user._id]);

  return (
    <>
      <Title title={"TMS | Users"} />
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
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="datatable table table-hover table-center mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Index</th>
                          <th>E-mail</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
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

      {/* view user modal */}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>User Information</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>Name: {selectedUser.name}</p>
              <p>Index: {selectedUser.index}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Role: {selectedUser.role}</p>
              <p>
                <span
                  style={{
                    color: "red",
                    marginBottom: "7px",
                    display: "block",
                  }}
                >
                  <strong>Departments: </strong>
                </span>
                {viewDepartment.length === 0 ? (
                  <span style={{ color: "tomato" }}>
                    No Departments Are Assigned To You
                  </span>
                ) : (
                  viewDepartment.map((item, index) => (
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: "0",
                        margin: "0",
                      }}
                      key={index}
                    >
                      <li>
                        <span>
                          {index + 1}. {item}
                        </span>
                      </li>
                    </ul>
                  ))
                )}
              </p>

              <p>
                <span
                  style={{
                    color: "red",
                    marginBottom: "7px",
                    display: "block",
                  }}
                >
                  <strong>Extra Role: </strong>
                </span>

                <p>
                  {pa ? (
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: "0",
                        margin: "0",
                      }}
                    >
                      <li>
                        <span>PA</span>
                      </li>
                    </ul>
                  ) : (
                    <span style={{ color: "tomato" }}>
                      No Extra Role is Assigned To You
                    </span>
                  )}
                </p>
              </p>

              <p>
                Status:{" "}
                {selectedUser.status == "Active" ? (
                  <Badge bg="success">{selectedUser.status}</Badge>
                ) : (
                  <Badge bg="danger">{selectedUser.status}</Badge>
                )}
              </p>
              <p>
                Created Date: {formatDateToDDMMYYYY(selectedUser.createdAt)}{" "}
              </p>
              <p>Created Time: {formatTimeToHHMMSS(selectedUser.createdAt)} </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <a className="btn btn-sm bg-danger-light" onClick={closeModal}>
            <i className="fe fe-close"></i> Close
          </a>
        </Modal.Footer>
      </Modal>

      {/* view user modal End */}

      {/* edit user modal Start */}

      <Modal show={isEditModalOpen} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h5>Edit User Information</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {editSelectedUser && (
            <>
              {/* <Form onSubmit={handleEditUserModalForm}>
                <Form.Group className="mb-3" controlId="formIndex">
                  <Form.Label>Index</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter index"
                    name="index"
                    value={input.index}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={input.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={input.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter role"
                    name="role"
                    value={input.role}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form> */}

              <Form onSubmit={handleEditUserModalForm}>
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
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridIndex">
                    <Form.Label>Index</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Index"
                      name="index"
                      disabled
                      value={input.index}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      name="name"
                      disabled
                      value={input.name}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    disabled
                    value={input.email}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "lightyellow" }}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Label>Departments</Form.Label>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    {departments.map((dept) => (
                      <Form.Check
                        inline
                        label={dept}
                        name={dept}
                        type="checkbox"
                        checked={selectedDepartments.includes(dept)}
                        onChange={handleCheckboxChange}
                        key={dept}
                        id={`inline-checkbox-${dept}`}
                      />
                    ))}
                  </div>
                </Row>
                <Row className="mb-3">
                  <Form.Label>Marked As PA? &nbsp; </Form.Label>

                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={pa ? "Assigned to PA" : "Not Assigned to PA"}
                    name="pa"
                    checked={pa}
                    onChange={switchToToggle}
                  />
                </Row>
                <Row className="mb-3"></Row>

                <Row className="mb-3">
                  {/* <Form.Group as={Col} controlId="formGridRole">
                    <Form.Label>
                      Role : <span style={{ color: "red" }}>{input.role}</span>
                    </Form.Label>
                  </Form.Group> */}

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>Change Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={input.role}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="sub admin">Sub Admin</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridStatus">
                    <Form.Label>Change Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={input.status}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Block</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  className="btn btn-sm bg-success-light w-100"
                >
                  <i className="fe fe-check"></i>{" "}
                  {loader ? "Updating..." : "Update User"}
                </Button>
              </Form>
              {/* <p>Name: {editSelectedUser.name}</p>
              <p>Index: {editSelectedUser.index}</p>
              <p>Email: {editSelectedUser.email}</p>
              <p>Role: {editSelectedUser.role}</p>
              <p>
                Created Date: {formatDateToDDMMYYYY(editSelectedUser.createdAt)}{" "}
              </p>
              <p>
                Created Time: {formatTimeToHHMMSS(editSelectedUser.createdAt)}{" "}
              </p> */}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Users;
