import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
// import IncomingDatatable from "../../../components/Datatables/IncomingDatatable";

// import pdf Viewer
// import PDFViewer from "./PDFViewer";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useEffect, useMemo, useRef, useState } from "react";
// import { useForm } from "../../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import createToast from "../../../utils/createToast";
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
import { sendTask } from "../../../features/task/taskApiSlice";
import Stepper from "../../../components/Stepper/Stepper";

const Incoming = () => {
  const dispatch = useDispatch();
  const { incomingError, incomingMessage } = useSelector(incomingSelector);
  const { user, loader, error, message } = useSelector(authSelector);
  // const pdfUrl = "https://example.com/path/to/your/file.pdf";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
  const [editSelectedFile, setEditSelectedFile] = useState(null);

  // category modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  // user Set state
  const [assignee, setAssignee] = useState(null);

  //Incoming File Data Fetch from API declaring State
  const [data, setData] = useState([]);

  const modalOpen = () => {
    // open the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  //close edit modal
  const closeEditModal = () => {
    // Close the modal
    setIsEditModalOpen(false);
  };

  // Fetch All Incoming File using useEffect

  const fetchIncomingFileData = async () => {
    try {
      const response1 = await API.get(`/api/v1/user/${user._id}`);
      const sortedData1 = response1.data.userDepartment.reverse();
      const userDepartments = sortedData1.map((dept) => dept.name);

      const response = await API.get("/api/v1/incoming");
      const sortedData = response.data.incomingFile;

      const completeIncoming = sortedData.filter(
        (data) =>
          userDepartments.includes(data.category) && data.status == "completed"
      );

      setData(completeIncoming);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchIncomingFileData();
  }, []);

  // handle View Button

  const handleView = (row) => {
    const fileName = row && row.file;
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

  // Incoming Datatable Initialization

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
        },
      ],
      createdRow: function (row, data, dataIndex) {
        if (!data.assigned || data.assigned.length === 1) {
          $(row).css("background-color", "#f2dede");
        }
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

  // useEffect(() => {
  //   const todaysDate = new Date();
  //   const formattedDate = `${todaysDate.getFullYear()}-${(
  //     todaysDate.getMonth() + 1
  //   )
  //     .toString()
  //     .padStart(2, "0")}-${todaysDate.getDate().toString().padStart(2, "0")}`;
  //   setCurrentDate(formattedDate);
  // }, []);

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };
  // form Data init

  const [input, setInput] = useState({
    from: "",
    ref: "",
    date: "",
    subject: "",
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
    }
  };

  const handleIncomingFile = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("from", input.from);
    formData.append("ref", input.ref);
    formData.append("date", currentDate);
    formData.append("subject", input.subject);
    formData.append("category", categoryInput.category);
    formData.append("file", input.file); // Append file to form data

    dispatch(createIncoming(formData)).then(() => {
      fetchIncomingFileData();
    });
    fileInputRef.current.value = "";
    setPdfUrl(null);
  };

  useEffect(() => {
    if (incomingMessage) {
      createToast(incomingMessage, "success");
      dispatch(setEmptyIncomingMessage());
      setInput({
        from: "",
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

  const [categoryInput, setCategoryInput] = useState({ category: "" }); // State to hold category input

  // Function to handle changes in the category input
  const handleCategoryChange = (e) => {
    setCategoryInput({ ...categoryInput, [e.target.name]: e.target.value });
  };
  // handle add category modal

  const handleCategoryAdd = () => {
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  // category form submit

  const handleCategoryForm = async (e) => {
    e.preventDefault();

    try {
      // Send only the category value, not the entire categoryInput object
      await API.post("/api/v1/category", { category: categoryInput.category });
      createToast("Category Created Successfully", "success");
    } catch (error) {
      console.error("Error to Create:", error);
    }
    setCategoryInput({
      category: "",
    });
  };

  const [cate, setCate] = useState([]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // Send only the category value, not the entire categoryInput object
        const response = await API.get("/api/v1/category");
        setCate(response.data.reverse());
      } catch (error) {
        console.error("Error to Fetch:", error);
      }
    };

    fetchCategoryList();
  }, []);

  // Function to handle changes in select inputs
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  // handle Print Data

  const handlePrintData = async (e) => {
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

    printData(formData);
  };

  const printData = (printData) => {
    const printContent = `

            <div>
                  <h3>Incoming File Print</h3>
                  <p><strong>File ID : </strong>${printData._id}</p> 

                  <p><strong>From : </strong>${printData.whereFrom}</p>
                  <p><strong>Reference : </strong>${printData.ref}</p>
                  <p><strong>Date : </strong>${printData.date}</p>
                  <p><strong>Subject : </strong>${printData.subject}</p>
                  <p><strong>Category : </strong>${printData.category}</p>
                  <p><strong>File Name : </strong>${printData.file}</p>
                  <p><strong>Dead Line : </strong>${printData.deadLine}</p>
                  <p><strong>Assigned : </strong>${printData.assigned}</p>
                  <p><strong>Priority : </strong>${printData.priority}</p>
                  <p><strong>Status : </strong>${printData.status}</p>
                  <p><strong>Instruction : </strong>${printData.instruction}</p>
                  <p><strong>Working Log : </strong>${printData.progress}</p>
            </div>
    `;

    const printWindow = window.open("", "", "height=600, width=1200");

    printWindow.document.write(
      "<html><head><title>Print Incoming File Data</title>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  // formated Date
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

  //use effect for formated date conversion

  useEffect(() => {
    const todaysDate = new Date();
    const formattedDate = `${todaysDate.getFullYear()}-${(
      todaysDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${todaysDate.getDate().toString().padStart(2, "0")}`;
    setCurrentDate(formattedDate);
  }, []);

  // useEffect for get User to whom incoming file will be send by fetching api

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/api/v1/user");
        const selectedUsers = response.data.user.filter(
          (item) => item.branch === user.branch
        );
        setAssignee(selectedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [dispatch, user.branch]);

  const assignedSteps = editSelectedFile && editSelectedFile.assigned;

  return (
    <>
      <Title title={"TMS | Incoming"} />
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
                  Incomming Letters
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
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {/* &nbsp; &nbsp;
                  <a
                    className="btn btn-sm bg-success-light"
                    onClick={modalOpen}
                  >
                    <i className="fe fe-plus"></i> Add
                  </a> */}
                </h5>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="Datatable table table-hover table-center mb-0">
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

      <Modal
        show={isModalOpen}
        onHide={closeModal}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          {" "}
          <h6>Incoming Letter</h6>{" "}
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleIncomingFile} encType="multipart/form-data">
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>Where From</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Where From"
                  name="from"
                  value={input.from}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "lightyellow" }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>Reference</Form.Label>
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
                <Form.Label>Date</Form.Label>
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
              <Form.Label>Subject</Form.Label>
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
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>
                  Category &nbsp;{" "}
                  {user.role == "super admin" ? (
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
              </Form.Group>

              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>Document</Form.Label>
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

            <Button type="submit" className="btn btn-sm bg-success-light w-100">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        {/* Render PDFViewer component only if pdfUrl is not null */}
        {/* {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />} */}
      </Modal>

      {/* add category Modal start */}

      <Modal
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
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Category"
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
        {/* Render PDFViewer component only if pdfUrl is not null */}
        {/* {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />} */}
      </Modal>
      {/* add category Modal end */}

      {/* Edit incoming  Modal */}

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
              <Form onSubmit={handlePrintData}>
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
                    value={input.file}
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

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCategory">
                      <Form.Label>
                        <strong style={{ color: "red" }}>
                          File Reaching Status
                        </strong>
                      </Form.Label>
                      <Stepper steps={assignedSteps} />
                    </Form.Group>
                  </Row>

                  <Form.Group as={Col} controlId="formGridAssign">
                    <Form.Label>Assigned </Form.Label>{" "}
                    <Form.Select
                      name="assigned"
                      disabled
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
                    <Form.Control
                      type="date"
                      name="deadLine"
                      disabled
                      value={currentDate}
                      onChange={handleDateChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridPriority">
                    <Form.Label>Priority</Form.Label>{" "}
                    <Form.Select
                      name="priority"
                      disabled
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
                      disabled
                      rows={5}
                      name="instruction"
                      value={input.instruction}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridStatus">
                    <Form.Label>Status</Form.Label>

                    <Form.Select
                      name="status"
                      disable
                      value={input.status || ""}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                      disabled
                    >
                      <option value="Choose">Choose...</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Working Progress</Form.Label>
                    <Form.Control
                      as="textarea"
                      disabled
                      rows={5}
                      name="progress"
                      value={input.progress}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "lightyellow" }}
                    />
                  </Form.Group>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  className="btn  bg-success-light w-100"
                >
                  <i className="fa-solid fa-print "></i> Print
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
      {/* Edit incoming  Modal */}
    </>
  );
};

export default Incoming;
