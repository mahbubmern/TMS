// import  { useEffect, useState, } from 'react';
// import { classNames } from 'primereact/utils';
// import { FilterMatchMode, FilterService } from 'primereact/api';
// import { DataTable,  } from 'primereact/datatable';
// import { Column,  } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown, } from 'primereact/dropdown';
// import { MultiSelect,  } from 'primereact/multiselect';
// import { Tag } from 'primereact/tag';
// import { TriStateCheckbox, } from 'primereact/tristatecheckbox';
// import { InputNumber } from 'primereact/inputnumber';
// import { Button } from 'primereact/button';

// import "primereact/resources/themes/lara-light-cyan/theme.css";

// const products = [
//   {
//     id: 1000,
//     name: 'Butt',
//     country: {
//         name: 'Algeria',
//         code: 'dz'
//     },
//     company: 'Benton, John B Jr',
//     date: '2015-09-13',
//     status: 'unqualified',
//     verified: true,
//     activity: 17,
//     representative: {
//         name: 'Ioni Bowcher',
//         image: 'ionibowcher.png'
//     },
//     balance: 70663
// },
// {
//   id: 1000,
//   name: 'James',
//   country: {
//       name: 'Algeria',
//       code: 'dz'
//   },
//   company: 'Benton, John B Jr',
//   date: '2015-09-13',
//   status: 'unqualified',
//   verified: true,
//   activity: 20,
//   representative: {
//       name: 'Ioni Bowcher',
//       image: 'ionibowcher.png'
//   },
//   balance: 70663
// },
// {
//   id: 1000,
//   name: 'Alen',
//   country: {
//       name: 'Algeria',
//       code: 'dz'
//   },
//   company: 'Benton, John B Jr',
//   date: '2015-09-13',
//   status: 'unqualified',
//   verified: true,
//   activity: 27,
//   representative: {
//       name: 'Ioni Bowcher',
//       image: 'ionibowcher.png'
//   },
//   balance: 70663
// },
// ]

// const Datatables = () => {
// // The rule argument should be a string in the format "custom_[field]".
// FilterService.register('custom_activity', (value, filters) => {
//   const [from, to] = filters ?? [null, null];
//   if (from === null && to === null) return true;
//   if (from !== null && to === null) return from <= value;
//   if (from === null && to !== null) return value <= to;
//   return from <= value && value <= to;
// });

// const [filters, setFilters] = useState({
//   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//   name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//   'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//   representative: { value: null, matchMode: FilterMatchMode.IN },
//   // For using custom filters, you must set FilterMatchMode.CUSTOM to matchMode.
//   activity: { value: null, matchMode: FilterMatchMode.CUSTOM },
//   status: { value: null, matchMode: FilterMatchMode.EQUALS },
//   verified: { value: null, matchMode: FilterMatchMode.EQUALS }
// });

// const [globalFilterValue, setGlobalFilterValue] = useState('');
// const [representatives] = useState([
//   { name: 'Amy Elsner', image: 'amyelsner.png' },
//   { name: 'Anna Fali', image: 'annafali.png' },
//   { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
//   { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
//   { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
//   { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
//   { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
//   { name: 'Onyama Limba', image: 'onyamalimba.png' },
//   { name: 'Stephen Shaw', image: 'stephenshaw.png' },
//   { name: 'XuXue Feng', image: 'xuxuefeng.png' }
// ]);
// const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

// const getSeverity = (status) => {
//   switch (status) {
//       case 'unqualified':
//           return 'danger';

//       case 'qualified':
//           return 'success';

//       case 'new':
//           return 'info';

//       case 'negotiation':
//           return 'warning';

//       case 'renewal':
//           return null;
//   }
// };

// const onGlobalFilterChange = (e) => {
//   const value = e.target.value;
//   let _filters = { ...filters };

//   _filters['global'].value = value;

//   setFilters(_filters);
//   setGlobalFilterValue(value);
// };

// const renderHeader = () => {
//   return (
//       <div className="flex justify-content-end">
//           <span className="p-input-icon-left">
//               <i className="pi pi-search" />
//               <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
//           </span>
//       </div>
//   );
// };

// const countryBodyTemplate = (rowData) => {
//   return (
//       <div className="flex align-items-center gap-2">
//           <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
//           <span>{rowData.country.name}</span>
//       </div>
//   );
// };

// const representativeBodyTemplate = (rowData) => {
//   const representative = rowData.representative;

//   return (
//       <div className="flex align-items-center gap-2">
//           <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
//           <span>{representative.name}</span>
//       </div>
//   );
// };

// const representativesItemTemplate = (option) => {
//   return (
//       <div className="flex align-items-center gap-2">
//           <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
//           <span>{option.name}</span>
//       </div>
//   );
// };

// const statusBodyTemplate = (rowData) => {
//   return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
// };

// const statusItemTemplate = (option) => {
//   return <Tag value={option} severity={getSeverity(option)} />;
// };

// const verifiedBodyTemplate = (rowData) => {
//   return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified, 'false-icon pi-times-circle': !rowData.verified })}></i>;
// };

// const representativeRowFilterTemplate = (options) => {
//   return (
//       <MultiSelect
//           value={options.value}
//           options={representatives}
//           itemTemplate={representativesItemTemplate}
//           onChange={(e) => options.filterApplyCallback(e.value)}
//           optionLabel="name"
//           placeholder="Any"
//           className="p-column-filter"
//           maxSelectedLabels={1}
//           style={{ minWidth: '14rem' }}
//       />
//   );
// };

// const statusRowFilterTemplate = (options) => {
//   return (
//       <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
//   );
// };

// const verifiedRowFilterTemplate = (options) => {
//   return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
// };

// const activityRowFilterTemplate = (options) => {
//   const [from, to] = options.value ?? [null, null];

//   return (
//       <div className="flex gap-1">
//           <InputNumber value={from} onChange={(e) => options.filterApplyCallback([e.value, to])} className="w-full" placeholder="from" />
//           <InputNumber value={to} onChange={(e) => options.filterApplyCallback([from, e.value])} className="w-full" placeholder="to" />
//       </div>
//   );
// };

// const activityBodyTemplate = (rowData) => {
//   return (
//     <div>
//       {/* Your custom rendering for the activity column body */}
//       {rowData.activity}
//     </div>
//   );
// };

// const viewButtonTemplate = (rowData) => {
//   return <Button icon="pi pi-eye" onClick={() => handleView(rowData)} />;
// };

// const editButtonTemplate = (rowData) => {
//   return <Button icon="pi pi-pencil" onClick={() => handleEdit(rowData)} />;
// };

// const deleteButtonTemplate = (rowData) => {
//   return <Button icon="pi pi-trash" onClick={() => handleDelete(rowData)} />;
// };

// const header = renderHeader();

//   return (
//     <>

//     <DataTable value={products} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row"
//                     globalFilterFields={['name', 'country.name', 'representative.name', 'status']} header={header} emptyMessage="No User found.">
//                 <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
//                 <Column header="Index" filterField="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" />
//                 <Column header="Email" filterField="representative" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
//                     body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} />
//                 <Column field="activity" header="Activity(Custom Filter)" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityRowFilterTemplate} />
//                 <Column field="status" header="Status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
//                 <Column field="verified" header="Verified" dataType="boolean" style={{ minWidth: '6rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedRowFilterTemplate} />
//                 <Column header="Actions"  body={viewButtonTemplate}  />
//                 <Column body={editButtonTemplate} />
//                 <Column body={deleteButtonTemplate} />

//             </DataTable>
//     </>
//   )
// }

// export default Datatables

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
import API from "../../utils/api";

const Datatables = () => {
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

  const handleEditUserModalForm = async (e) => {
    e.preventDefault();
    const { name, index, role, status, _id } = input;
    console.log(role, status);
    const formData = {
      name,
      index,
      role,
      status,
      _id,
    }; // Convert status to boolean
    // Dispatch the updateUser action
    await dispatch(updateUser(formData));
    // Fetch the updated data from the server
    try {
      const response = await API.get("/api/v1/user");
      const sortedData = response.data.user.reverse();
      setData(sortedData.filter((data) => data.branch == user.branch)); // Update the table data state with the updated data
      closeEditModal(); // Close the edit modal after successful update
    } catch (error) {
      console.error("Error fetching data:", error);
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
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the visibility of the modal
  const [editSelectedUser, setEditSelectedUser] = useState(null); // State to control the visibility of the modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/api/v1/user");
        const sortedData = response.data.user.reverse();
        setData(sortedData.filter((data) => data.branch == user.branch));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "index",
        header: "Index",
        size: 100,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 100,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 100,
        Cell: ({ row }) => (
          <>
            {row.original.role === "super admin" ? (
              <Badge bg="warning" style={{ textTransform: "Capitalize" }}>
                {row.original.role}
              </Badge>
            ) : (
              <Badge bg="info" style={{ textTransform: "Capitalize" }}>
                {row.original.role}
              </Badge>
            )}
          </>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ row }) => (
          <>
            {row.original.status === "Active" ? (
              <Badge bg="success">{row.original.status}</Badge>
            ) : (
              <Badge bg="danger">{row.original.status}</Badge>
            )}
          </>
        ),
      },
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
              <i className="fe fe-eye"></i> View
            </a>
            &nbsp;
            {user.role === "super admin" && (
              <a
                onClick={() => handleEdit(row)}
                className="btn btn-sm bg-warning-light"
              >
                <i className="fe fe-pencil"></i> Edit
              </a>
            )}
          </>
        ),
      },
    ],
    []
  );

  // Function to handle view button click
  const handleView = (row) => {
    setSelectedUser(row.original);
    setIsModalOpen(true);
  };

  // Function to handle edit button click
  const handleEdit = (row) => {
    setEditSelectedUser(row.original);
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

      {/* view user modal */}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>Name: {selectedUser.name}</p>
              <p>Index: {selectedUser.index}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Role: {selectedUser.role}</p>
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
                    value={input.email}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "lightyellow" }}
                  />
                </Form.Group>

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

      {/* edit user modal End */}
    </>
  );
};

export default Datatables;
