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
import { useLocation } from "react-router-dom";
import Select from "react-select";

const TodaysIncoming = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { incomingError, incomingMessage } = useSelector(incomingSelector);
  const { user, loader, error, message } = useSelector(authSelector);
  // const pdfUrl = "https://example.com/path/to/your/file.pdf";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // category modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  // user Set state
  const [assignee, setAssignee] = useState(null);
  const [findSuperAdmin, setFindSuperAdmin] = useState(null);
  const [findRecentId, setFindRecentId] = useState("");
  const [departments, setDepartments] = useState([]);

  //Incoming File Data Fetch from API declaring State
  const [data, setData] = useState([]);
  //Priority
  const [priority, setPriority] = useState("");
  const [deadLines, setDeadLines] = useState("");
  const [options, setOptions] = useState([]);

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

  const fetchFileData = async () => {
    try {
      // Fetch both incoming and outgoing data simultaneously
      // const [incomingResponse, outgoingResponse] = await Promise.all([
      //   API.get("/api/v1/incoming"),
      //   API.get("/api/v1/outgoing"),
      // ]);
      const incomingResponse = await API.get("/api/v1/incoming");
      // Extract data from the responses
      const incomingData = incomingResponse.data.incomingFile;

     
      
      // const outgoingData = outgoingResponse.data.outgoingFile;

      // Initialize an array to store the sorted data

      // Filter incoming data based on user roles
      if (user.extraRole === "pa") {
        // const sortedData = incomingData.filter(
        //   (item) =>
        //     (item.branch === user.branch && item.assigned.length === 0)
        //   || item.to.map((item) => item.split("-")[0] === user.index)

        // );
        // setData(sortedData);
        const sortedData = incomingData.filter((item) => {
          const matchesBranch =
            item.branch === user.branch && item.assigned.length === 0;
          const matchesToArray = item.to.some(
            (toItem) => toItem.split("-")[0] === user.index
          );

          return (
            matchesBranch || (matchesToArray && item.assigned.length === 0)
          );
        });

        setData(sortedData);
      }

      if (user.role === "super admin") {
        
        const sortedData = incomingData.filter(
          (item) =>
            item.assigned.some(
              (toItem) => toItem.split("-")[0] === user.index
            ) && item.assigned.length === 1
        );
        

        setData(sortedData);
      }

     
      

      // Process outgoing data and match with the user's index
      // outgoingData.forEach((item) => {
      //   const to = item.to.map((subItem) => subItem.split("-")[0]);

      //   if (to.includes(user.index)) {
      //     sortedData.push(item);
      //   }
      // });

      // Set the combined data in state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFileData(); // Fetch data when navigating to "Today's Incoming" page
  }, []);

  // useEffect(() => {
  //   // Fetch data immediately when component mounts
  // }, []); // Empty dependency array ensures this runs only once when the component mounts

  //find super Admin
  const fetchSuperAdmin = async () => {
    try {
      const response = await API.get("/api/v1/user");
      const sortedData = response.data.user;

      const filterData = sortedData.filter(
        (item) => item.branch === user.branch && item.role == "super admin"
      );
      const filteredDatawithIndexAndName = `${filterData[0].index}-${filterData[0].name}`;

      setFindSuperAdmin(filteredDatawithIndexAndName);

      // setData(filterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  useEffect(() => {
    if (editSelectedFile) {
      if (editSelectedFile.deadLine === null) {
        setDeadLines(currentDate);
      } else {
        setDeadLines(editSelectedFile.deadLine);
      }
    }
  }, [editSelectedFile]);

  // Incoming Datatable Initialization

  useEffect(() => {
    // Initialize DataTable with buttons
    const table = $(".Datatable").DataTable({
      data: data,
      order: [[3, "desc"]],
      columns: [
        // { data: "whereFrom", title: "From" },
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
        // { data: "subject", title: "Subject" },
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
            if (
              user.role === "super admin" ||
              user.role === "admin" ||
              user.extraRole === "pa"
            ) {
              return `<div class="actions">
                  <button class="btn btn-sm bg-success-light view-btn">
                    <i class="fe fe-eye"></i> View File
                  </button>
                  &nbsp;
                  <button class="btn btn-sm bg-warning-light edit-btn">
                    <i class="fe fe-pencil"></i> Edit
                  </button>
                </div>`;
            } else {
              return `<div class="actions">
                  <button class="btn btn-sm bg-success-light view-btn">
                    <i class="fe fe-eye"></i> View File
                  </button>
                </div>`;
            }
          },
        },
      ],
      createdRow: function (row, data, dataIndex) {
        if (data.assigned.length == 0 || data.assigned.length === 1) {
          $(row).css("background-color", "#f2dede");
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

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const handleDateChangeForDeadLine = (e) => {
    setDeadLines(e.target.value);
  };

  // To handle changes in the Select component for "To" field
  const handleSelectChange2 = (selectedOptions) => {
    setInput((prevInput) => ({
      ...prevInput,
      from: selectedOptions, // selectedOptions is an array of selected items
    }));
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

  let toValue = [];

  const handleIncomingFile = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();

    formData.append("ref", input.ref);
    formData.append("to", toValue);
    formData.append("date", currentDate);
    formData.append("deadLine", deadLines ? deadLines : currentDate);
    formData.append("branch", user.branch);
    formData.append("subject", input.subject);
    formData.append("category", categoryInput.category);
    formData.append("file", input.file); // Append file to form data

    {
      fromOthers
        ? formData.append("from", input.from)
        : input.from.forEach((item) => {
            formData.append("from[]", item.value); // Append each "to" value as part of an array
          });
    }
    // Handle the "to" field as an array

    dispatch(createIncoming(formData)).then(() => {
      fetchFileData();
    });
    // find recent file ID

    fileInputRef.current.value = "";
    setPdfUrl(null);
  };

  useEffect(() => {
    fetchSuperAdmin();
  }, []);

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

  // handle Send Incoming Modal Form

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
      deadLine: deadLines,
      priority,
      status,
      instruction,
      progress,
      _id,
    }; // Convert status to boolean

    if (user.role === "super admin") {
      if (
        formData.category === "" ||
        formData.category === null ||
        formData.category === "choose"
      ) {
        createToast("You must select Category");
        return;
      }
      if (
        formData.assigned === undefined ||
        formData.assigned === "Choose" ||
        formData.assigned.length === 1
      ) {
        createToast("You must select Assignee");
        return;
      }
      if (
        formData.priority === undefined ||
        formData.priority === "Choose" ||
        formData.priority === null ||
        formData.priority === ""
      ) {
        createToast("You must select Priority");
        return;
      }
    }

    if (user.extraRole === "pa") {
      if (
        formData.assigned === undefined ||
        formData.assigned === "Choose" ||
        formData.assigned.length === 0
      ) {
        createToast("You must select Assignee");
        return;
      }
    }

    // // Dispatch the updateUser action
    await dispatch(editIncomings(formData));

    // file send to the specific user
    await dispatch(sendTask(formData));
    // Fetch the updated data from the server

    if (user.extraRole === "pa") {
      try {
        const response = await API.get("/api/v1/incoming");
        const sortedData = response.data.incomingFile;
        const filterData = sortedData.filter(
          (item) => item.assigned.length === 0
        );

        setData(filterData);
        closeEditModal(); // Close the edit modal after successful update
      } catch (error) {
        createToast("Error updating user information", "error");
      }
    }

    if (user.role === "super admin") {
      try {
        const response = await API.get("/api/v1/incoming");
        const sortedData = response.data.incomingFile;
        const filterData = sortedData.filter(
          (item) => item.assigned.length === 1
        );

        setData(filterData);
        closeEditModal(); // Close the edit modal after successful update
      } catch (error) {
        createToast("Error updating user information", "error");
      }
    }

    // navigate("/account-activation-by-otp");
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

        if (user.extraRole === "pa") {
          const selectedUsers = response.data.user.filter(
            (item) => item.branch === user.branch && item.role == "super admin"
          );
          setAssignee(selectedUsers);
        }
        if (user.role === "super admin") {
          const selectedUsers = response.data.user.filter(
            (item) => item.branch === user.branch && item.role == "admin"
          );
          setAssignee(selectedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [dispatch, user.branch]);

  const fetchAllusers = async () => {
    try {
      const response = await API.get("/api/v1/user");
      const allUsers = response.data.user.filter(
        (item) => item.extraRole === "pa" && item.index != user.index
      );

      // const capitalize = (name) => {
      //   return name
      //     .split(" ")
      //     .map(
      //       (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      //     )
      //     .join(" ");
      // };
      const options = allUsers.map((user) => {
        // const capitalizedUserName = capitalize(user.name);
        return {
          value: `${user.index}-${user.name}`, // value contains index and capitalized name
          label: `${user.index}-${user.name}`, // label contains index and capitalized name
        };
      });

      setOptions(options);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllusers();
  }, []); // Empty dependency array ensures this runs once on mount

  const [fromOthers, setFromOthers] = useState(false);
  // const [assignedPa, setAssignedPa] = useState("");

  const switchToToggle = (e) => {
    const { name, checked } = e.target;

    setFromOthers(checked);
    // setAssignedPa(checked ? name : null);
  };

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
                  Todays Incomming Letters
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
                    <polyline points="14 15 9 20 4 15" />
                    <path d="M20 4h-7a4 4 0 0 0-4 4v12" />
                  </svg>
                  &nbsp; &nbsp;
                  {user.extraRole ? (
                    <a
                      className="btn btn-sm bg-success-light"
                      onClick={modalOpen}
                    >
                      <i className="fe fe-plus"></i> Entry
                    </a>
                  ) : (
                    ""
                  )}
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
            <Form.Group controlId="formGridId">
              {/* <Form.Label>Incoming File Branch</Form.Label> */}
              <Form.Control
                type="text"
                name="branch"
                hidden
                defaultValue={user.branch}
                style={{ backgroundColor: "lightyellow" }}
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={
                    fromOthers ? "Letter From Other's" : "Not From Other's"
                  }
                  name="pa"
                  checked={fromOthers}
                  onChange={switchToToggle}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              {fromOthers ? (
                <Form.Group as={Col} controlId="formGridIndex">
                  <Form.Label>Where From</Form.Label>

                  {/* Display red asterisks if user.extraRole is "pa" */}
                  {user.extraRole === "pa" && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "20px",
                        verticalAlign: "middle",
                      }}
                    >
                      ***
                    </span>
                  )}
                  <Form.Control
                    type="text"
                    placeholder="Where From"
                    name="from"
                    value={input.from}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "lightyellow" }}
                  />
                </Form.Group>
              ) : (
                <Form.Group as={Col} controlId="formGridIndex">
                  <Form.Label>Where From</Form.Label>

                  {/* Display red asterisks if user.extraRole is "pa" */}
                  {user.extraRole === "pa" && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "20px",
                        verticalAlign: "middle",
                      }}
                    >
                      ***
                    </span>
                  )}

                  {/* Display loading message if data is still being fetched */}
                  {loading && (
                    <p>
                      Recipient Loading{" "}
                      <span style={{ fontSize: "20px", color: "red" }}>
                        ...
                      </span>
                    </p>
                  )}

                  {/* Select component for choosing options */}
                  <Select
                    options={options}
                    isMulti
                    value={input.from} // Connect to state
                    onChange={handleSelectChange2} // Connect to handleSelectChange
                  />
                </Form.Group>
              )}
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>Reference</Form.Label>
                {user.extraRole === "pa" ? (
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
                {user.extraRole === "pa" ? (
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
                <Form.Control
                  type="date"
                  name="date"
                  value={currentDate}
                  onChange={handleDateChange}
                  style={{ backgroundColor: "lightyellow" }}
                />
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
                  value={deadLines ? deadLines : currentDate}
                  onChange={handleDateChangeForDeadLine}
                  style={{ backgroundColor: "lightyellow" }}
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridId">
              <Form.Label>Subject</Form.Label>
              {user.extraRole === "pa" ? (
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
              {/* {user.role != "user" ? (
                <Form.Group as={Col} controlId="formGridIndex">
                  <Form.Label>
                    Category &nbsp;{" "}
                    <span
                      className="btn btn-sm bg-success-light"
                      onClick={handleCategoryAdd}
                    >
                      Add New Category
                    </span>
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
              ) : (
                ""
              )} */}

              <Form.Group as={Col} controlId="formGridPriority">
                <Form.Label>Priority</Form.Label>{" "}
                {user.extraRole === "pa" ? (
                  ""
                ) : (
                  <span
                    style={{
                      color: "red",
                      fontSize: "20px",
                      verticalAlign: "middle",
                    }}
                  >
                    ***
                  </span>
                )}
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
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>Document</Form.Label>
                {user.extraRole === "pa" ? (
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
                    value={input.file}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "lightyellow" }}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridFrom">
                    <Form.Label>From</Form.Label>
                    {user.extraRole === "pa" ? (
                      <Form.Control
                        type="text"
                        placeholder="From"
                        name="whereFrom"
                        value={input.whereFrom}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        placeholder="From"
                        name="whereFrom"
                        value={input.whereFrom}
                        onChange={handleInputChange}
                        readOnly
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    )}
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridRef">
                    <Form.Label>Reference</Form.Label>
                    {user.extraRole === "pa" ? (
                      <Form.Control
                        type="text"
                        placeholder="Reference"
                        name="ref"
                        value={input.ref}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        placeholder="Reference"
                        name="ref"
                        value={input.ref}
                        onChange={handleInputChange}
                        readOnly
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    )}
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
                    {user.extraRole === "pa" ? (
                      <Form.Control
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        value={input.subject}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        value={input.subject}
                        onChange={handleInputChange}
                        readOnly
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  {/* <Form.Group as={Col} controlId="formGridCategory">
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
                  </Form.Group> */}
                  <Form.Group as={Col} controlId="formGridCategory">
                    <Form.Label>Category </Form.Label>{" "}
                    {user.extraRole != "pa" ? (
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
                      <span style={{ color: "red", fontSize: "14px" }}>
                        [No Need To Select]
                      </span>
                    )}
                    <Form.Select
                      name="category"
                      value={input.category || ""}
                      onChange={handleSelectChange}
                      style={{ backgroundColor: "lightyellow" }}
                    >
                      <option value="choose"> Choose...</option>

                      {departments.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
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
                    {user.extraRole === "pa" ? (
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
                    ) : (
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
                    )}
                  </Form.Group>

                  {user.extraRole != "pa" ? (
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
                        value={deadLines}
                        onChange={handleDateChangeForDeadLine}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    </Form.Group>
                  ) : (
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
                        value={deadLines}
                        onChange={handleDateChangeForDeadLine}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    </Form.Group>
                  )}
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridPriority">
                    <Form.Label>Priority</Form.Label>{" "}
                    {user.extraRole != "pa" ? (
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
                      <span style={{ color: "red", fontSize: "14px" }}>
                        [No Need To Select]
                      </span>
                    )}
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
      {/* Edit incoming  Modal */}
    </>
  );
};

export default TodaysIncoming;
