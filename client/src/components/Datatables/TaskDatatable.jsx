// import { useMemo, useState, useEffect } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import Form from "react-bootstrap/Form";
// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import { useForm } from "../../hooks/useForm";
// import { useDispatch, useSelector } from "react-redux";
// import { setEmptyMessage } from "../../features/users/userSlice";
// import createToast from "../../utils/createToast";
// import { authSelector } from "../../features/auth/authSlice";
// import { updateTask } from "../../features/task/taskApiSlice";
// import {
//   setEmptyTaskMessage,
//   taskSelector,
// } from "../../features/task/taskSlice";
// import API from "../../utils/api";

// const TaskDatatable = () => {
//   const dispatch = useDispatch();

//   const { user } = useSelector(authSelector);
//   const { taskloader, taskmessage, taskerror } = useSelector(taskSelector);

//   const { input, setInput, handleInputChange } = useForm({
//     whereFrom: "",
//     ref: "",
//     date: "",
//     subject: "",
//     category: "",
//     file: "",
//     assigned: "",
//     deadLine: "",
//     priority: "",
//     status: "",
//     instruction: "",
//     progress: "",
//     _id: "",
//   });

//   // Function to handle changes in select inputs
//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setInput((prevInput) => ({
//       ...prevInput,
//       [name]: value,
//     }));
//   };

//   const handleTaskModalForm = async (e) => {
//     e.preventDefault();
//     const { status, progress, _id } = input;
//     const formData = {
//       status,
//       progress,
//       _id,
//     }; // Convert status to boolean

//     // Dispatch the updateUser action
//     await dispatch(updateTask(formData));

//     // Fetch the updated data from the server
//     try {
//       const response = await API.get(`/api/v1/task/${user._id}`);
//       const sortedData = response.data.userTask.task.reverse().map((item) => ({
//         ...item,
//         file: (
//           <>
//             <p hidden>{item.file}</p>
//           </>
//         ), // Embedding the file link in img tag
//       }));

//       setData(sortedData); // Update the table data state with the updated data
//     } catch (error) {
//       createToast("Error updating user information", "error");
//     }

//     // navigate("/account-activation-by-otp");
//   };

//   useEffect(() => {
//     if (taskmessage) {
//       createToast(taskmessage, "success");
//       dispatch(setEmptyTaskMessage());
//       closeEditModal();
//     }
//     if (taskerror) {
//       createToast(taskerror);
//       dispatch(setEmptyTaskMessage());
//     }
//   }, [taskmessage, taskerror, dispatch]);

//   const [data, setData] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the modal
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
//   const [editSelectedFile, setEditSelectedFile] = useState(null); // State to control the visibility of the modal

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await API.get(`/api/v1/task/${user._id}`);
//         const sortedData = response.data.userTask.task
//           .reverse()
//           .map((item) => ({
//             ...item,
//             file: (
//               <>
//                 <p hidden>{item.file}</p>
//               </>
//             ), // Embedding the file link in img tag
//           }));

//         setData(sortedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "whereFrom",
//         header: "From",
//         size: 150,
//       },
//       {
//         accessorKey: "subject",
//         header: "Subject",
//         size: 150,
//       },
//       {
//         accessorKey: "date",
//         header: "Date",
//         size: 100,
//       },
//       {
//         accessorKey: "deadLine",
//         header: "Dead Line",
//         size: 100,
//       },

//       {
//         accessorKey: "priority",
//         header: "Priority",
//         size: 100,
//       },

//       {
//         accessorKey: "instruction",
//         header: "Instruction",
//         size: 100,
//       },
//       {
//         accessorKey: "progress",
//         header: "Working Progress",
//         size: 100,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         size: 100,
//       },
//       // {
//       //   accessorKey: "status",
//       //   header: "Status",
//       //   size: 100,
//       //   Cell: ({ row }) => (
//       //     <>
//       //       {row.original.status === "Active" ? (
//       //         <Badge bg="success">{row.original.status}</Badge>
//       //       ) : (
//       //         <Badge bg="danger">{row.original.status}</Badge>
//       //       )}
//       //     </>
//       //   ),
//       // },
//       {
//         accessorKey: "actions",
//         header: "Actions",
//         size: 220,
//         Cell: ({ row }) => (
//           <>
//             <a
//               onClick={() => handleView(row)}
//               className="btn btn-sm bg-success-light"
//             >
//               <i className="fe fe-eye"></i> View File
//             </a>
//             &nbsp;
//             {/* {user.role === "admin" && (
             
//             )} */}
//             <a
//               onClick={() => handleEdit(row)}
//               className="btn btn-sm bg-warning-light"
//             >
//               <i className="fe fe-pencil"></i> Edit
//             </a>
//           </>
//         ),
//       },
//     ],
//     []
//   );

//   // Pdf Element

//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [fullscreen, setFullscreen] = useState(true);

//   //   const handlePdfView = (file) => {
//   //     setPdfUrl(file.props.children.props.children);
//   //     console.log(file.props.children.props.children);
//   //   };

//   // Function to handle view button click
//   const handleView = (row) => {
//     setPdfUrl(row.original.file.props.children.props.children);
//     setIsModalOpen(true);
//   };

//   // Function to handle edit button click
//   const handleEdit = (row) => {
//     setEditSelectedFile(row.original);
//     setIsEditModalOpen(true);
//     setInput(row.original);
//   };

//   const closeModal = () => {
//     // Close the modal
//     setIsModalOpen(false);
//   };

//   const closeEditModal = () => {
//     // Close the modal
//     setIsEditModalOpen(false);
//   };

//   const table = useMaterialReactTable({
//     columns,
//     data,
//   });

//   const formattedDate = useMemo(() => {
//     if (input.date) {
//       const [year, month, day] = input.date.split("-");
//       const months = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];
//       return `${day}-${months[parseInt(month) - 1]}-${year}`;
//     }
//     return ""; // Return an empty string if input.date is not available
//   }, [input.date]);

//   return (
//     <>
//       <MaterialReactTable table={table} />

//       {/* view incoming File modal */}
//       <Modal
//         show={isModalOpen}
//         onHide={closeModal}
//         fullscreen={fullscreen}
//         aria-labelledby="example-modal-sizes-title-lg"
//       >
//         <Modal.Header closeButton></Modal.Header>
//         <Modal.Body>
//           <div>
//             {pdfUrl && (
//               <div className="pdf-container">
//                 <embed
//                   src={pdfUrl}
//                   type="application/pdf"
//                   className="pdf-embed"
//                 />
//               </div>
//             )}
//           </div>
//         </Modal.Body>
//       </Modal>

//       {/* view incoming File modal End */}

//       {/* Send Incoming File modal Start */}

//       <Modal
//         show={isEditModalOpen}
//         onHide={closeEditModal}
//         size="lg"
//         aria-labelledby="example-modal-sizes-title-lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {" "}
//             <h5>Task Details</h5>{" "}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ color: "black" }}>
//           {editSelectedFile && (
//             <>
//               {/* <Form onSubmit={handleEditUserModalForm}>
//                   <Form.Group className="mb-3" controlId="formIndex">
//                     <Form.Label>Index</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Enter index"
//                       name="index"
//                       value={input.index}
//                       onChange={handleInputChange}
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3" controlId="formName">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Enter name"
//                       name="name"
//                       value={input.name}
//                       onChange={handleInputChange}
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3" controlId="formEmail">
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control
//                       type="email"
//                       placeholder="Enter email"
//                       name="email"
//                       value={input.email}
//                       onChange={handleInputChange}
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3" controlId="formRole">
//                     <Form.Label>Role</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Enter role"
//                       name="role"
//                       value={input.role}
//                       onChange={handleInputChange}
//                     />
//                   </Form.Group>
//                   <Button variant="primary" type="submit">
//                     Update
//                   </Button>
//                 </Form> */}

//               <Form onSubmit={handleTaskModalForm}>
//                 <Form.Group
//                   className="mb-3"
//                   controlId="formGridId"
//                   disabled
//                   hidden
//                 >
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="User ID"
//                     name="id"
//                     value={input._id}
//                     onChange={handleInputChange}
//                     style={{ backgroundColor: "lightyellow" }}
//                   />
//                 </Form.Group>
//                 <Form.Group
//                   className="mb-3"
//                   controlId="formGridFile"
//                   disabled
//                   hidden
//                 >
//                   <Form.Label>File</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="File"
//                     name="file"
//                     value={input.file.props.children.props.children}
//                     onChange={handleInputChange}
//                     style={{ backgroundColor: "lightyellow" }}
//                   />
//                 </Form.Group>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridFrom">
//                     <Form.Label>From</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="From"
//                       name="whereFrom"
//                       value={input.whereFrom}
//                       onChange={handleInputChange}
//                       disabled
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridRef">
//                     <Form.Label>Reference</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Reference"
//                       name="ref"
//                       value={input.ref}
//                       onChange={handleInputChange}
//                       disabled
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridDate">
//                     <Form.Label>Date</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Date"
//                       name="date"
//                       value={formattedDate}
//                       onChange={handleInputChange}
//                       disabled
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>
//                 </Row>
//                 <Row className="mb-3">
//                   <Form.Group controlId="formGridSubject">
//                     <Form.Label>Subject</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Subject"
//                       name="subject"
//                       value={input.subject}
//                       onChange={handleInputChange}
//                       disabled
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>
//                 </Row>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridCategory">
//                     <Form.Label>Category</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Category"
//                       name="category"
//                       value={input.category}
//                       onChange={handleInputChange}
//                       disabled
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridAssign">
//                     <Form.Label>Assigned</Form.Label>
//                     <Form.Select
//                       name="assigned"
//                       disabled
//                       value={input.assigned || ""}
//                       onChange={handleSelectChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     >
//                       <option value="44957">{input.assigned}</option>
//                     </Form.Select>
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridDeadLine">
//                     <Form.Label>Dead Line</Form.Label>
//                     <Form.Control
//                       disabled
//                       type="date"
//                       name="deadLine"
//                       value={input.deadLine}
//                       onChange={handleInputChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>
//                 </Row>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridPriority">
//                     <Form.Label>Priority</Form.Label>
//                     <Form.Select
//                       disabled
//                       name="priority"
//                       value={input.priority || ""}
//                       onChange={handleSelectChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     >
//                       <option>Choose...</option>
//                       <option value="urgent">Urgent</option>
//                       <option value="normal">Normal</option>
//                     </Form.Select>
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridStatus">
//                     <Form.Label>Status</Form.Label>
//                     <Form.Select
//                       name="status"
//                       value={input.status || ""}
//                       onChange={handleSelectChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     >
//                       <option value="Choose">Choose...</option>
//                       <option value="pending">Pending</option>
//                       <option value="completed">Completed</option>
//                     </Form.Select>
//                   </Form.Group>
//                 </Row>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
//                     <Form.Label>Instruction</Form.Label>
//                     <Form.Control
//                       disabled
//                       as="textarea"
//                       rows={5}
//                       name="instruction"
//                       value={input.instruction}
//                       onChange={handleInputChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="exampleForm.ControlTextarea2">
//                     <Form.Label>Working Progress</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={5}
//                       name="progress"
//                       value={input.progress}
//                       onChange={handleInputChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>
//                 </Row>

//                 <Button variant="primary" type="submit" className="w-100">
//                   {taskloader ? "Updating..." : "Update File"}
//                 </Button>
//               </Form>
//               {/* <p>Name: {editSelectedUser.name}</p>
//                 <p>Index: {editSelectedUser.index}</p>
//                 <p>Email: {editSelectedUser.email}</p>
//                 <p>Role: {editSelectedUser.role}</p>
//                 <p>
//                   Created Date: {formatDateToDDMMYYYY(editSelectedUser.createdAt)}{" "}
//                 </p>
//                 <p>
//                   Created Time: {formatTimeToHHMMSS(editSelectedUser.createdAt)}{" "}
//                 </p> */}
//             </>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* edit user modal End */}
//     </>
//   );
// };

// export default TaskDatatable;
