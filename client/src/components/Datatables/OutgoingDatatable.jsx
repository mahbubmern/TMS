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
// import Badge from "react-bootstrap/Badge";

// import {
//   formatDateToDDMMYYYY,
//   formatTimeToHHMMSS,
// } from "../../utils/ConvertTime";
// import { useForm } from "../../hooks/useForm";
// import { useDispatch, useSelector } from "react-redux";
// import { setEmptyMessage, userSelector } from "../../features/users/userSlice";
// import createToast from "../../utils/createToast";
// import { getAllUser, updateUser } from "../../features/users/userApiSlice";
// import { authSelector } from "../../features/auth/authSlice";
// import { outgoingSelector } from "../../features/outgoing/outgoingSlice";
// import { editOutgoings } from "../../features/outgoing/outgoingApiSlice";
// import API from "../../utils/api";
// // import { sendTask } from "../../features/task/taskApiSlice";

// const OutgoingDatatable = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector(authSelector);
//   const { loader, error, message } = useSelector(userSelector);
//   const { outgoingFile } = useSelector(outgoingSelector);
//   const { input, setInput, handleInputChange } = useForm({
//     id: "",
//     index: "",
//     name: "",
//     email: "",
//     role: "",
//     state: "", // Add state field to the initial state
//     status: "",
//     // Add status field to the initial state
//   });

//   // Function to handle changes in select inputs
//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setInput((prevInput) => ({
//       ...prevInput,
//       [name]: value,
//     }));
//   };

//   const handleSendIncomingModalForm = async (e) => {
//     e.preventDefault();
//     const { assigned, status, instruction, _id } = input;
//     const formData = {
//       assigned,

//       status,
//       instruction,
//       _id,
//     }; // Convert status to boolean

//     // Dispatch the updateUser action
//     await dispatch(editOutgoings(formData));

//     // file send to the specific user
//     // await dispatch(sendTask(formData));
//     // Fetch the updated data from the server
//     try {
//       const response = await API.get("/api/v1/outgoing");
//       const sortedData = response.data.outgoingFile.reverse().map((item) => ({
//         ...item,
//         file: (
//           <>
//             <p hidden>{item.file}</p>
//           </>
//         ), // Assuming "status" is a boolean field, converting it to "Active" or "Blocked" string
//       }));
//       setData(sortedData); // Update the table data state with the updated data
//       closeEditModal(); // Close the edit modal after successful update
//     } catch (error) {
//       createToast("Error updating user information", "error");
//     }

//     // navigate("/account-activation-by-otp");
//   };

//   useEffect(() => {
//     if (message) {
//       createToast(message, "success");
//       dispatch(setEmptyMessage());
//       setIsEditModalOpen(false);
//     }
//     if (error) {
//       createToast(error);
//       dispatch(setEmptyMessage());
//     }
//   }, [message, error, dispatch]);

//   const [data, setData] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null); // State to store the selected user
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the modal
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
//   const [editSelectedFile, setEditSelectedFile] = useState(null); // State to control the visibility of the modal
//   const [assignee, setAssignee] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await API.get("/api/v1/outgoing");
//         const sortedData = response.data.outgoingFile.reverse().map((item) => ({
//           ...item,
//           file: (
//             <>
//               <p hidden>{item.file}</p>
//             </>
//           ), // Embedding the file link in img tag
//         }));
//         setData(sortedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await API.get("/api/v1/user"); // Adjust the URL as per your API endpoint
//         setAssignee(response.data.user); // Assuming the response contains an array of users
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "to",
//         header: "To",
//         size: 150,
//       },
//       {
//         accessorKey: "ref",
//         header: "Reference",
//         size: 80,
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
//         accessorKey: "category",
//         header: "Category",
//         size: 100,
//       },
//       // {
//       //   accessorKey: "assigned",
//       //   header: "Assign",
//       //   size: 150,
//       // },

//       // {
//       //   accessorKey: "instruction",
//       //   header: "Instruction",
//       //   size: 100,
//       // },
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
//               className="btn btn-sm bg-success-light"
//               onClick={() => handleView(row)}
//             >
//               <i className="fe fe-eye"></i> View File
//             </a>
//             {/* &nbsp;
//             {user.role === "admin" && (
//               <a
//                 className="btn btn-sm bg-warning-light"
//                 onClick={() => handleEdit(row)}
//               >
//                 <i className="fe fe-pencil"></i> Edit
//               </a>
//             )} */}
//           </>
//         ),
//       },
//     ],
//     []
//   );

//   // Pdf Element
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [fullscreen, setFullscreen] = useState(true);
//   const [pdfUrl, setPdfUrl] = useState(null);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

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
//             <h5>Outgoing File Send</h5>{" "}
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

//               <Form onSubmit={handleSendIncomingModalForm}>
//                 <Form.Group
//                   className="mb-3"
//                   controlId="formGridId"
//                   disable
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
//                   readOnly
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
//                     <Form.Label>To</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="To"
//                       name="to"
//                       value={input.to}
//                       onChange={handleInputChange}
//                       readOnly
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
//                       readOnly
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridDate">
//                     <Form.Label>Date</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Date"
//                       name="date"
//                       value={input.date}
//                       onChange={handleInputChange}
//                       readOnly
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
//                       readOnly
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
//                       readOnly
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridAssign">
//                     <Form.Label>Assigned</Form.Label>
//                     <Form.Select
//                       name="assigned"
//                       value={input.assigned || ""}
//                       onChange={handleSelectChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     >
//                       <option>Choose...</option>
//                       {assignee.map((item) => (
//                         <option
//                           key={item.id}
//                           value={item.index}
//                         >{`${item.index}-${item.name}`}</option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </Row>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridStatus">
//                     <Form.Label>Status</Form.Label>
//                     <Form.Select
//                       name="status"
//                       value={input.status || ""}
//                       onChange={handleSelectChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     >
//                       <option>Choose...</option>
//                       <option value="pending">Pending</option>
//                       <option value="ongoing">Ongoing</option>
//                       <option value="completed">Completed</option>
//                     </Form.Select>
//                   </Form.Group>
//                 </Row>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
//                     <Form.Label>Instruction</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={5}
//                       name="instruction"
//                       value={input.instruction}
//                       onChange={handleInputChange}
//                       style={{ backgroundColor: "lightyellow" }}
//                     />
//                   </Form.Group>
//                 </Row>

//                 <Button
//                   variant="primary"
//                   type="submit"
//                   className="btn btn-sm bg-success-light w-100"
//                 >
//                   <i className="fa-regular fa-paper-plane"></i>{" "}
//                   {loader ? "Updating" : "Update File"}
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

// export default OutgoingDatatable;
