import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";

import {
  formatDateToDDMMYYYY,
  formatTimeToHHMMSS,
} from "../../utils/ConvertTime";
import { useForm } from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmptyMessage, userSelector } from "../../features/users/userSlice";
import createToast from "../../utils/createToast";
import { getAllUser, updateUser } from "../../features/users/userApiSlice";
import { authSelector } from "../../features/auth/authSlice";
import { incomingSelector } from "../../features/incoming/incomingSlice";
import { editIncomings } from "../../features/incoming/incomingApiSlice";
import { sendTask } from "../../features/task/taskApiSlice";
import API from "../../utils/api";

const IncomingDatatable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { loader, error, message } = useSelector(userSelector);
  const { incomingFile } = useSelector(incomingSelector);
  const { input, setInput, handleInputChange } = useForm({
    id: "",
    index: "",
    name: "",
    email: "",
    role: "",
    state: "", // Add state field to the initial state
    status: "",
    // Add status field to the initial state
  });

  // Function to handle changes in select inputs
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

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

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const todaysDate = new Date();
    const formattedDate = `${todaysDate.getFullYear()}-${(
      todaysDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${todaysDate.getDate().toString().padStart(2, "0")}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const handleSendIncomingModalForm = async (e) => {
    e.preventDefault();
    const {
      whereFrom,
      ref,
      date,
      subject,
      category,
      file,
      assigned,
      deadLine,
      priority,
      status,
      instruction,
      progress,
      _id,
    } = input;
    const formData = {
      whereFrom,
      ref,
      date,
      subject,
      category,
      file,
      assigned,
      deadLine: currentDate,
      priority,
      status,
      instruction,
      progress,
      _id,
    }; // Convert status to boolean

    // Dispatch the updateUser action
    await dispatch(editIncomings(formData));

    // file send to the specific user
    await dispatch(sendTask(formData));
    // Fetch the updated data from the server
    try {
      const response = await API.get("/api/v1/incoming");
      const sortedData = response.data.incomingFile.reverse().map((item) => ({
        ...item,
        file: (
          <>
            <p hidden>{item.file}</p>
          </>
        ), // Assuming "status" is a boolean field, converting it to "Active" or "Blocked" string
      }));
      setData(sortedData); // Update the table data state with the updated data
      closeEditModal(); // Close the edit modal after successful update
    } catch (error) {
      createToast("Error updating user information", "error");
    }

    // navigate("/account-activation-by-otp");
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
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
  const [editSelectedFile, setEditSelectedFile] = useState(null); // State to control the visibility of the modal
  const [assignee, setAssignee] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/api/v1/incoming");
        const sortedData = response.data.incomingFile.reverse().map((item) => ({
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
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/api/v1/user"); // Adjust the URL as per your API endpoint
        setAssignee(response.data.user); // Assuming the response contains an array of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "whereFrom",
        header: "From",
        size: 150,
      },
      {
        accessorKey: "ref",
        header: "Ref",
        size: 80,
      },
      {
        accessorKey: "subject",
        header: "Subject",
        size: 150,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 100,
      },
      {
        accessorKey: "deadLine",
        header: "Dead Line",
        size: 100,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 100,
      },
      {
        accessorKey: "assigned",
        header: "Assign",
        size: 150,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 100,
      },

      {
        accessorKey: "instruction",
        header: "Instruction",
        size: 100,
      },
      {
        accessorKey: "progress",
        header: "Working Progress",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
      },
      // {
      //   accessorKey: "status",
      //   header: "Status",
      //   size: 100,
      //   Cell: ({ row }) => (
      //     <>
      //       {row.original.status === "Active" ? (
      //         <Badge bg="success">{row.original.status}</Badge>
      //       ) : (
      //         <Badge bg="danger">{row.original.status}</Badge>
      //       )}
      //     </>
      //   ),
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 220,
        Cell: ({ row }) => (
          
          <>
            <a
              onClick={() => handleView(row)}
              className="btn btn-sm bg-success-light"
            >
              <i className="fe fe-eye"></i> View File
            </a>
            {/* <button
              className="btn btn-sm btn-success"
              onClick={() => handleView(row)}
            >
              <i className="fa-solid fa-file-pdf"></i>
            </button> */}
            &nbsp;
            {user.role === "admin" && (
              <>
                <a
                  onClick={() => handleEdit(row)}
                  className="btn btn-sm bg-warning-light"
                >
                  <i className="fe fe-pencil"></i> Edit
                </a>
              </>
            )}
          </>
        ),
      },
    ],
    []
  );

  // Pdf Element
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullscreen, setFullscreen] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePdfView = (file) => {
    setPdfUrl(file.props.children.props.children);
  };

  // Function to handle view button click
  const handleView = (row) => {
    setPdfUrl(row.original.file.props.children.props.children);
    setIsModalOpen(true);
  };

  // Function to handle edit button click
  const handleEdit = (row) => {
    setEditSelectedFile(row.original);
    setIsEditModalOpen(true);
    setInput(row.original);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  const closeEditModal = () => {
    // Close the modal
    setIsEditModalOpen(false);
  };

  const table = useMaterialReactTable({
    columns,
    data,
      });

  return (
    <>
      <MaterialReactTable table={table} />

      {/* view incoming File modal */}
      <Modal
        show={isModalOpen}
        onHide={closeModal}
        fullscreen={fullscreen}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div>
            {pdfUrl && (
              <div className="pdf-container">
                <embed
                  src={pdfUrl}
                  type="application/pdf"
                  className="pdf-embed"
                />
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* view incoming File modal End */}

      {/* Send Incoming File modal Start */}

      <Modal
        show={isEditModalOpen}
        onHide={closeEditModal}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h5>Incoming File Send</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {editSelectedFile && (
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

              <Form onSubmit={handleSendIncomingModalForm}>
                <Form.Group
                  className="mb-3"
                  controlId="formGridId"
                  disable
                  readOnly
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
                  readOnly
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
                      readOnly
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
                      readOnly
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
                      readOnly
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
                      readOnly
                      style={{ backgroundColor: "lightyellow" }}
                    />
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
                      readOnly
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridAssign">
                    <Form.Label>Assigned </Form.Label>{" "}
                    <span
                      style={{
                        color: "red",
                        fontSize: "20px",
                        verticalAlign: "middle",
                      }}
                    >
                      ***
                    </span>
                    <Form.Select
                      name="assigned"
                      value={input.assigned || ""}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                    >
                      <option value="choose"> Choose...</option>
                      {assignee.map((item) => (
                        <option
                          key={item.id}
                          value={`${item.index}-${item.name}`}
                        >{`${item.index}-${item.name}`}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridDeadLine">
                    <Form.Label>Dead Line</Form.Label>{" "}
                    <span
                      style={{
                        color: "red",
                        fontSize: "20px",
                        verticalAlign: "middle",
                      }}
                    >
                      ***
                    </span>
                    <Form.Control
                      type="date"
                      name="deadLine"
                      value={currentDate}
                      onChange={handleDateChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridPriority">
                    <Form.Label>Priority</Form.Label>{" "}
                    <span
                      style={{
                        color: "red",
                        fontSize: "20px",
                        verticalAlign: "middle",
                      }}
                    >
                      ***
                    </span>
                    <Form.Select
                      name="priority"
                      value={input.priority || ""}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                    >
                      <option value="choose">Choose...</option>
                      <option value="urgent">Urgent</option>
                      <option value="normal">Normal</option>
                    </Form.Select>
                  </Form.Group>

                  {/* <Form.Group as={Col} controlId="formGridStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={input.status || ""}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                    >
                      <option>Choose...</option>
                      <option value="pending">Pending</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Form.Group> */}
                  <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Instruction</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="instruction"
                      value={input.instruction}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                {/* <Row className="mb-3">
                  

                  <Form.Group as={Col} controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Working Progress</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="progress"
                      value={input.progress}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row> */}

                <Button
                  variant="primary"
                  type="submit"
                  className="btn  bg-success-light w-100"
                >
                  <i className="fa-regular fa-paper-plane"></i>{" "}
                  {loader ? "Sending..." : "Send File"}
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

      {/* edit user modal End */}
    </>
  );
};

export default IncomingDatatable;
