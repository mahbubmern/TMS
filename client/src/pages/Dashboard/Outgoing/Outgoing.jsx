import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
// import OutgoingDatatable from "../../../components/Datatables/OutgoingDatatable";

// import pdf Viewer
// import PDFViewer from "./PDFViewer";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useEffect, useRef, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import createToast from "../../../utils/createToast";
// import { createOutgoing } from "../../../features/outgoing/outgoingApiSlice";
// import {
//   outgoingSelector,
//   setEmptyOutgoingMessage,
// } from "../../../features/outgoing/outgoingSlice";
import {
  createIncoming,
  editIncomings,
} from "../../../features/incoming/incomingApiSlice";
import {
  incomingSelector,
  setEmptyIncomingMessage,
} from "../../../features/incoming/incomingSlice";
import { authSelector } from "../../../features/auth/authSlice";
import API from "../../../utils/api";
import Title from "../../../components/Title/Title";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons-dt";
import Swal from "sweetalert2";
import Select from "react-select";
import { set } from "mongoose";

const Outgoing = () => {
  const dispatch = useDispatch();
  // const { outgoingError, outgoingMessage } = useSelector(outgoingSelector);
  const { incomingError, incomingMessage } = useSelector(incomingSelector);
  const { user } = useSelector(authSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDate2, setCurrentDate2] = useState("");
  const [options, setOptions] = useState([]);
  const [fileInfo, setFileInfo] = useState({ name: "", size: "" });

  // useEffect for getting all users

  const fetchAllusers = async () => {
    try {
      const response = await API.get("/api/v1/user");
      const allUsers = response.data.user;

      const options = allUsers.map((user) => {
        return {
          value: `${user.index}-${user.name}`, // value contains index and capitalized name
          label: `${user.index}-${user.name}`, // label contains index and capitalized name
        };
      });

      setOptions(options);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllusers();
  }, []);

  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];

  useEffect(() => {
    const todaysDate = new Date();
    const formattedDate = `${todaysDate.getFullYear()}-${(
      todaysDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${todaysDate.getDate().toString().padStart(2, "0")}`;
    setCurrentDate(formattedDate);
    setCurrentDate2(formattedDate);
  }, []);

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const handleDateChange2 = (e) => {
    setCurrentDate2(e.target.value);
  };

  // form Data init

  const [input, setInput] = useState({
    to: "",
    ref: "",
    date: "",
    subject: "",
    category: "",
    department: "",
    file: null, // Initialize file as null
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  // Pdf Element
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [data, setData] = useState("");
  const [workingDepartmentFile, setWorkingDepartmentFile] = useState([]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Retrieve the file object from event
    setInput((prevInput) => ({
      ...prevInput,
      file: file, // Update file object in input state
    }));

    if (file) {
      setPdfUrl(URL.createObjectURL(file));
      setPageNumber(1); // Reset page number when a new file is selected
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB", // Convert size to KB and round to 2 decimal places
      });
    }
  };

  // Function to handle changes in select inputs
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  // To handle changes in the Select component for "To" field
  const handleSelectChange2 = (selectedOptions) => {
    setInput((prevInput) => ({
      ...prevInput,
      to: selectedOptions, // selectedOptions is an array of selected items
    }));
  };

  // handle View Button

  const handleView = (row) => {
    const fileName = row && row.file;
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

  // Fetch All Outgoing File using useEffect

  const fetchOutgoingFileData = async () => {
    try {
      const response = await API.get("/api/v1/incoming");
      const sortedData = response.data.incomingFile;
      const responseForUserDept = await API.get(`/api/v1/user/${user._id}`);

      const sortedData2 = responseForUserDept.data.userDepartment;
      const desiredDepartment = sortedData2.map((item) => item.name);

      setData(
        sortedData.filter(
          (item) =>
            item.whereFrom === user.branch &&
            desiredDepartment.includes(item.department)
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOutgoingFileData();
  }, []);

  // Incoming Datatable Initialization

  useEffect(() => {
    // Initialize DataTable with buttons
    const table = $(".Datatable").DataTable({
      data: data,
      order: [[3, "desc"]],
      columns: [
        {
          data: "to",
          title: "To",
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
        { data: "department", title: "Department" },
        {
          data: "sender",
          title: "Sender",
          render: (data) => {
            return `<div class="subject-column">
            <div class="subject-text">
            ${data}
            </div>
            <div class="tooltip">${data}</div>
          </div>`;
          },
        },

        {
          data: null,
          title: "Actions",
          render: (data) => {
            return `<div class="actions">
                <button class="btn btn-sm bg-success-light view-btn">
                  <i class="fe fe-eye"></i> View File
                </button>
              </div>`;
          },
        },
      ],
      createdRow: function (row, data, dataIndex) {
        if (data.status === "completed") {
          $(row).css("background-color", "#D1F2EB");
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

    $(".Datatable tbody").on("click", ".view-btn", handleViewClick);

    // Cleanup function to destroy the DataTable and remove event listeners on unmount
    return () => {
      $(".Datatable tbody").off("click", ".view-btn", handleViewClick);

      table.destroy();
    };
  }, [data, user.role]);

  const handleOutgoingFile = (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("whereFrom", user.branch); // Directly append user.branch
    formData.append("branch", user.branch); // Directly append user.branch
    formData.append("sender", user.index + "-" + user.name); // Directly append user.branch
    formData.append(
      "department",
      user.department.length === 1 && workingDepartmentFile.length > 0
        ? workingDepartmentFile[0]
        : input.department
    );
    formData.append("ref", input.ref);
    formData.append("date", currentDate);
    formData.append("deadLine", currentDate2);
    formData.append("subject", input.subject);
    formData.append("file", input.file); // Append file to form data

    // Form validation for "to" field
    if (!input.to || input.to.length === 0) {
      createToast("You must select Receiver");
      return;
    }

    // Handle the "to" field as an array
    input.to.forEach((item) => {
      formData.append("to[]", item.value); // Append each "to" value as part of an array
    });

    // Form validation for department field
    if (
      (!input.department || input.department === "Choose") &&
      (user.department.length !== 1 || !workingDepartmentFile[0])
    ) {
      createToast("You must select Your Department");
      return;
    }

    // Form validation for reference field
    if (!input.ref || input.ref.trim() === "") {
      createToast("You must select Your File Reference No");
      return;
    }

    // Form validation for date field
    if (!currentDate || currentDate.trim() === "") {
      createToast("You must select Date");
      return;
    }

    // Form validation for subject field
    if (!input.subject || input.subject.trim() === "") {
      createToast("Subject is Empty");
      return;
    }

    // Form validation for file field
    if (!input.file) {
      createToast("There is no File Attachment");
      return;
    }

    dispatch(createIncoming(formData)).then(() => fetchOutgoingFileData());
    fileInputRef.current.value = "";

    setPdfUrl(null);
    setFileInfo({
      name: "",
      size: "",
    });
  };

  useEffect(() => {
    if (incomingMessage) {
      createToast(incomingMessage, "success");
      dispatch(setEmptyIncomingMessage());
      setInput({
        to: "",
        ref: "",
        date: "",
        subject: "",
        file: null, // Reset file object
      });
    }
    if (incomingError) {
      createToast(incomingError);
      dispatch(setEmptyIncomingMessage());
    }
  }, [incomingMessage, incomingError, dispatch]);

  // handle pdf file
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     setPdfUrl(URL.createObjectURL(file));
  //     setPageNumber(1); // Reset page number when a new file is selected
  //   }
  // };

  const modalOpen = () => {
    // open the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  const fetchUserDepartments = async () => {
    try {
      const response1 = await API.get(`/api/v1/user/${user._id}`);
      const sortedData1 = response1.data.userDepartment.reverse();
      const userDepartments = sortedData1.map((dept) => dept.name);

      setWorkingDepartmentFile(userDepartments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUserDepartments();
  }, []);

  // const [categoryInput, setCategoryInput] = useState({ category: "" }); // Function to handle changes in the category input
  // const handleCategoryChange = (e) => {
  //   setCategoryInput({ ...categoryInput, [e.target.name]: e.target.value });
  // };
  // handle add category modal

  // const handleCategoryAdd = () => {
  //   setCategoryModalOpen(true);
  // };

  // const closeCategoryModal = () => {
  //   setCategoryModalOpen(false);
  // };

  // const handleCategoryForm = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Send only the category value, not the entire categoryInput object
  //     await API.post("/api/v1/category", { category: categoryInput.category });
  //     createToast("Category Created Successful", "success");
  //   } catch (error) {
  //     console.error("Error to Create:", error);
  //   }
  //   setCategoryInput({
  //     category: "",
  //   });
  // };

  // const [cate, setCate] = useState([]);
  // useEffect(() => {
  //   const fetchCategoryList = async () => {
  //     try {
  //       // Send only the category value, not the entire categoryInput object
  //       const response = await API.get("/api/v1/category");
  //       setCate(response.data.reverse());
  //     } catch (error) {
  //       console.error("Error to Fetch:", error);
  //     }
  //   };

  //   fetchCategoryList();
  // }, []);

  return (
    <>
      <Title title={"TMS | Outgoing"} />
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
              <div className="card-header">
                <h5 className="card-title" style={{ color: "red" }}>
                  {" "}
                  Outgoing Letters
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    class="main-grid-item-icon"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <polyline points="15 14 20 9 15 4" />
                    <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                  </svg>
                  &nbsp; &nbsp;
                  <a
                    className="btn btn-sm bg-success-light"
                    onClick={modalOpen}
                  >
                    <i className="fe fe-plus"></i> Add
                  </a>
                </h5>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="Datatable table table-hover table-center mb-0">
                      <thead>
                        <tr></tr>
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

      <Modal
        show={isModalOpen}
        onHide={closeModal}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          {" "}
          <h6>Outgoing Letter</h6>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOutgoingFile} encType="multipart/form-data">
            <Form.Control
              type="text"
              placeholder="Where From"
              name="whereFrom"
              value={user.branch}
              style={{ backgroundColor: "lightyellow" }}
            />

            <Form.Control
              type="text"
              placeholder="Sender"
              name="sender"
              hidden
              value={`${user.index}-${user.name}`}
              style={{ backgroundColor: "lightyellow" }}
            />

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>To</Form.Label>{" "}
                <span
                  style={{
                    color: "red",
                    fontSize: "20px",
                    verticalAlign: "middle",
                  }}
                >
                  ***
                </span>
                {/* <Form.Control
                  type="text"
                  placeholder="To"
                  name="to"
                  value={input.to}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "lightyellow" }}
                /> */}
                <Select
                  options={options}
                  isMulti
                  value={input.to} // Connect to state
                  onChange={handleSelectChange2} // Connect to handleSelectChange
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridDepartment">
                <Form.Label>Department </Form.Label>{" "}
                <span
                  style={{
                    color: "red",
                    fontSize: "20px",
                    verticalAlign: "middle",
                  }}
                >
                  ***
                </span>
                {user.department.length === 1 &&
                workingDepartmentFile.length > 0 ? (
                  <Form.Control
                    type="text"
                    placeholder="Department"
                    name="department"
                    value={workingDepartmentFile || ""}
                    style={{ backgroundColor: "lightyellow" }}
                    readOnly
                  />
                ) : (
                  <Form.Select
                    name="department"
                    value={input.department || ""}
                    onChange={handleSelectChange}
                    style={{ backgroundColor: "lightyellow" }}
                  >
                    <option value="choose"> Choose...</option>
                    {workingDepartmentFile.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>Reference</Form.Label>{" "}
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
                  type="text"
                  placeholder="Reference"
                  name="ref"
                  value={input.ref}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "lightyellow" }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Date</Form.Label>{" "}
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
                  name="date"
                  value={currentDate}
                  onChange={handleDateChange}
                  style={{ backgroundColor: "lightyellow" }}
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridId">
              <Form.Label>Subject</Form.Label>{" "}
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
                type="text"
                placeholder="Subject"
                name="subject"
                value={input.subject}
                onChange={handleInputChange}
                style={{ backgroundColor: "lightyellow" }}
              />
            </Form.Group>

            <Row className="mb-3">
              {/* <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>
                  Category &nbsp;{" "}
                  {user.role == "admin" ? (
                    <span
                      className="btn btn-sm bg-success-light"
                      onClick={handleCategoryAdd}
                    >
                      Add New Category
                    </span>
                  ) : (
                    ""
                  )}{" "}
                </Form.Label>
                <Form.Select
                  name="category"
                  value={categoryInput.category}
                  onChange={handleCategoryChange}
                  style={{ backgroundColor: "lightyellow" }}
                >
                  <option value="">-Select-</option>
                  {cate &&
                    cate.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group> */}

              <Form.Group as={Col} controlId="formGridDeadLine">
                <Form.Label>Dead Line</Form.Label>
                <Form.Control
                  type="date"
                  name="deadLine"
                  value={currentDate2}
                  onChange={handleDateChange2}
                  style={{ backgroundColor: "lightyellow" }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>Document</Form.Label>{" "}
                <span
                  style={{
                    color: "red",
                    fontSize: "20px",
                    verticalAlign: "middle",
                  }}
                >
                  ***
                </span>{" "}
                {fileInfo.name && (
                  <span style={{ color: "blue" }}>
                    [File Name: {fileInfo.name}, &nbsp; File Size:{" "}
                    {fileInfo.size}]
                  </span>
                )}
                <Form.Control
                  type="file"
                  name="file"
                  ref={fileInputRef} // Assign the ref to the file input element
                  onChange={handleFileChange}
                  style={{ backgroundColor: "lightyellow" }}
                />
              </Form.Group>
            </Row>

            <div>
              {/* <input type="file" onChange={handleFileChange} /> */}
              {pdfUrl && (
                <div>
                  <iframe
                    title="pdfViewer"
                    src={pdfUrl}
                    width="100%"
                    height="500px"
                    type="application/pdf"
                    frameBorder="0"
                    onLoadSuccess={onDocumentLoadSuccess}
                  />
                </div>
              )}
            </div>

            <Button variant="primary" type="submit" className="w-100">
              <i className="far fa-paper-plane"></i> &nbsp; Send
            </Button>
          </Form>
        </Modal.Body>
        {/* Render PDFViewer component only if pdfUrl is not null */}
        {/* {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />} */}
      </Modal>

      {/* <Modal
        show={categoryModalOpen}
        onHide={closeCategoryModal}
        size="sm"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          {" "}
          <h6>Add Category</h6>{" "}
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCategoryForm}>
            <Form.Group className="mb-3" controlId="formGridId">
              <Form.Control
                type="text"
                placeholder="Write"
                name="category"
                value={categoryInput.category}
                onChange={handleCategoryChange}
                style={{ backgroundColor: "lightyellow" }}
              />
            </Form.Group>
            <Button type="submit" className="btn btn-sm bg-success-light w-100">
              Add Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal> */}
    </>
  );
};

export default Outgoing;
