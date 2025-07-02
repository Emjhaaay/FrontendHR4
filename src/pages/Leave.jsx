import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Modal from "@mui/material/Modal"; // Import Modal
import Box from "@mui/material/Box"; // Import Box
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert
import { motion } from "framer-motion";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [form, setForm] = useState({
    employeeNo: "", // New field for employee number
    employeeName: "",
    employeePosition: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    attachment: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const positions = [
    "Medical Center Chief",
    "Medical Specialist III",
    "Chief of Hospital",
    "Chief Nursing Officer",
    "Chief Medical Officer",
    "Chief Administrative Officer",
    "Chief Financial Officer",
    "Chief Information Officer",
    "Medical Specialist II",
    "Psychiatrist",
    "Dentist",
    "Information Technology Officer",
    "Financial and Management Officer",
    "Medical Officer IV",
    "Chief Medical Technologist",
    "Chief Pharmacist",
    "Medical Officer III",
    "Medical Officer II",
    "Medical Officer I",
    "Nurse 2",
    "Nurse 3",
    "Nurse 4",
    "Medical Specialist I",
    "Medical Technologist",
    "HR Management Officer",
    "Information Officer",
    "Licensing Officer",
    "Dietician/Nutritionist",
    "Nurse 1",
    "Psychologist",
    "Health Physicist",
    "Chemist",
    "Physical Therapist",
    "Ward Assistant",
    "Administrative Officer",
    "Administrative Assistant",
    "Administrative Aide",
    "Medical Equipment Technician",
    "Laboratory Aide",
  ];

  const leaveTypes = [
    "Sick Leave",
    "Vacation Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Solo Parent Leave",
  ];

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("https://newbackendhr4.vercel.app/leaves");
        setLeaves(response.data);
        setFilteredLeaves(response.data);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchLeaves();
  }, []);

  useEffect(() => {
    const filtered = leaves.filter((leave) => {
      const matchesSearchTerm = leave.employeeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPosition = filterPosition
        ? leave.employeePosition === filterPosition
        : true;
      return matchesSearchTerm && matchesPosition;
    });
    setFilteredLeaves(filtered);
  }, [searchTerm, filterPosition, leaves]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      // Handle file attachment
      if (name === "attachment") {
        updatedForm.attachment = files[0]; // Store the file
      }

      // Set end date based on leave type
      if (name === "leaveType") {
        const today = new Date();
        const startDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        updatedForm.startDate = startDate;

        // Set end date based on leave type
        switch (value) {
          case "Maternity Leave":
            const maternityEndDate = new Date(today);
            maternityEndDate.setDate(today.getDate() + 104); // 105 days total
            updatedForm.endDate = maternityEndDate.toISOString().split("T")[0];
            break;
          case "Paternity Leave":
            const paternityEndDate = new Date(today);
            paternityEndDate.setDate(today.getDate() + 6); // 7 days total
            updatedForm.endDate = paternityEndDate.toISOString().split("T")[0];
            break;
          case "Vacation Leave":
            const vacationEndDate = new Date(today);
            vacationEndDate.setDate(today.getDate() + 4); // 5 days total
            updatedForm.endDate = vacationEndDate.toISOString().split("T")[0];
            break;
          case "Sick Leave":
            const sickEndDate = new Date(today);
            sickEndDate.setDate(today.getDate() + 4); // 5 days total
            updatedForm.endDate = sickEndDate.toISOString().split("T")[0];
            break;
          case "Solo Parent Leave":
            const soloParentEndDate = new Date(today);
            soloParentEndDate.setDate(today.getDate() + 6); // 7 days total
            updatedForm.endDate = soloParentEndDate.toISOString().split("T")[0];
            break;
          default:
            updatedForm.endDate = ""; // Reset end date if no valid leave type is selected
        }
      }

      // Adjust end date if start date is changed
      if (name === "startDate") {
        const newStartDate = new Date(value);
        if (prev.leaveType === "Maternity Leave") {
          const maternityEndDate = new Date(newStartDate);
          maternityEndDate.setDate(newStartDate.getDate() + 104);
          updatedForm.endDate = maternityEndDate.toISOString().split("T")[0];
        } else if (prev.leaveType === "Paternity Leave") {
          const paternityEndDate = new Date(newStartDate);
          paternityEndDate.setDate(newStartDate.getDate() + 6);
          updatedForm.endDate = paternityEndDate.toISOString().split("T")[0];
        } else if (prev.leaveType === "Vacation Leave") {
          const vacationEndDate = new Date(newStartDate);
          vacationEndDate.setDate(newStartDate.getDate() + 4);
          updatedForm.endDate = vacationEndDate.toISOString().split("T")[0];
        } else if (prev.leaveType === "Sick Leave") {
          const sickEndDate = new Date(newStartDate);
          sickEndDate.setDate(newStartDate.getDate() + 4);
          updatedForm.endDate = sickEndDate.toISOString().split("T")[0];
        } else if (prev.leaveType === "Solo Parent Leave") {
          const soloParentEndDate = new Date(newStartDate);
          soloParentEndDate.setDate(newStartDate.getDate() + 6);
          updatedForm.endDate = soloParentEndDate.toISOString().split("T")[0];
        }
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Create a FormData object to handle file uploads
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      if (editingId) {
        await axios.put(`https://newbackendhr4.vercel.app/leaves/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setLeaves((prev) =>
          prev.map((leave) =>
            leave._id === editingId ? { ...form, _id: editingId } : leave
          )
        );
        setFilteredLeaves((prev) =>
          prev.map((leave) =>
            leave._id === editingId ? { ...form, _id: editingId } : leave
          )
        );
        setNotification({
          message: "Employee's Leave updated successfully!",
          type: "success",
        });
        setEditingId(null);
      } else {
        const response = await axios.post(
          "https://newbackendhr4.vercel.app/leaves",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setLeaves([...leaves, { ...form, _id: response.data._id }]);
        setFilteredLeaves([...leaves, { ...form, _id: response.data._id }]);
        setNotification({
          message: "Employee's Leave added successfully!",
          type: "success",
        });
      }
      setForm({
        employeeNo: "", // Reset employeeNo
        employeeName: "",
        employeePosition: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        status: "Pending",
        attachment: null, // Reset attachment
      });
    } catch (error) {
      console.error("Error saving leave:", error); // Log the error for debugging
      setNotification({
        message: "Error saving leave. Please try again.",
        type: "error",
      });
    }
    setSnackbarOpen(true); // Open Snackbar
  };

  const handleEdit = (leave) => {
    setForm(leave);
    setEditingId(leave._id);
    setOpenEditModal(true); // Open edit modal
  };

  const handleDelete = async () => {
    if (!selectedLeave) return;
    try {
      await axios.delete(`https://newbackendhr4.vercel.app/leaves/${selectedLeave}`);
      setLeaves(leaves.filter((leave) => leave._id !== selectedLeave));
      setFilteredLeaves(
        filteredLeaves.filter((leave) => leave._id !== selectedLeave)
      );
      setNotification({
        message: "Employee's Leave deleted successfully!",
        type: "success",
      });
      setOpenDeleteModal(false); // Close delete modal
    } catch (error) {
      console.error("Error deleting leave:", error); // Log the error for debugging
      setNotification({ message: "Error deleting leave.", type: "error" });
    }
    setSnackbarOpen(true); // Open Snackbar
  };

  const handleOpenDeleteModal = (leaveId) => {
    setSelectedLeave(leaveId);
    setOpenDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingId(null);
    setForm({
      employeeNo: "", // Reset employeeNo
      employeeName: "",
      employeePosition: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      status: "Pending",
      attachment: null, // Reset attachment
    });
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedLeave(null);
  };

  const handleOpenImageModal = (attachment) => {
    if (attachment) {
      const imageUrl = `https://newbackendhr4.vercel.app/uploads/${attachment}`; // Construct the image URL
      setImageSrc(imageUrl); // Set the image source
      setOpenImageModal(true); // Open the image modal
    } else {
      console.error("No attachment found for this leave.");
    }
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false); // Close the image modal
    setImageSrc(""); // Reset the image source
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      case "Pending":
      default:
        return "bg-yellow-200 text-yellow-800";
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="bg-[#F0F0F0]  p-6">
      {/* Snackbar for notifications */}
       <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
            >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Positioning the Snackbar
      >
        <Alert onClose={handleSnackbarClose} severity={notification.type}>
          {notification.message}
        </Alert>
      </Snackbar>

      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl p-4 font-bold mb-8 sm:mb-6 text-gray-800">
            Leave Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Name
              </label>
              <input
                type="text"
                name="employeeName"
                value={form.employeeName}
                onChange={handleChange}
                placeholder="Employee's Name"
                required
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none rounded-md focus:ring-2 focus:ring-[#090367]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Position
              </label>
              <select
                name="employeePosition"
                value={form.employeePosition}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              >
                <option value="">Choose a Position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              >
                <option value="">Choose a leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Start
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                End
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Attachment
              </label>
              <input
                type="file"
                name="attachment"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div className="mt-2 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[white] text-black font-semibold rounded-md shadow-md hover:bg-[#304994] hover:text-white transition-colors duration-200"
              >
                {editingId ? "Update Leave" : "Add Leave"}
              </button>
            </div>
          </div>
        </form>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Search Employee
            </label>
            <input
              type="text"
              placeholder="Search Employee's Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Filter by Position
            </label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
            >
              <option value="">All Positions</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr className="bg-[white] text-black text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee No</th>
                <th className="border px-4 sm:px-6 py-2">Employee's Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">Leave Type</th>
                <th className="border px-4 sm:px-6 py-2">Start Date</th>
                <th className="border px-4 sm:px-6 py-2">End Date</th>
                <th className="border px-4 sm:px-6 py-2">Status</th>
                <th className="border px-4 sm:px-6 py-2">
                  Attachment <AttachFileIcon />
                </th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 p-2">
                      {leave.employeeNo}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {leave.employeeName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {leave.employeePosition}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {leave.leaveType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <span
                        className={`font-bold ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        } px-2 py-1 rounded w-full`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {leave.attachment && (
                        <button
                          onClick={() => handleOpenImageModal(leave.attachment)}
                          className="text-blue-500 hover:underline"
                        >
                          View Attachment
                        </button>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 flex justify-center">
                      <EditIcon
                        onClick={() => handleEdit(leave)}
                        className="cursor-pointer text-blue-500 hover:text-[#090367]"
                      />
                      <DeleteIcon
                        onClick={() => handleOpenDeleteModal(leave._id)}
                        className="cursor-pointer text-red-500 hover:text-[#EA0D10]"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No Employee Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        open={openImageModal}
        onClose={handleCloseImageModal}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box className="bg-white p-6 rounded-md max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Attachment</h2>
          <img
            src={imageSrc}
            alt="Attachment"
            className="w-full h-auto"
            onError={(e) => {
              e.target.onerror = null; // Prevent looping
              e.target.src = "path/to/default/image.png"; // Set a default image or handle error
            }}
          />
          <div className="flex justify-center mt-4">
            <button
              onClick={handleCloseImageModal}
              className="bg-gray-300 text-black hover:bg-[#304994] hover:text-white rounded px-4 py-2"
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Box className="bg-white p-6 rounded-md max-w-2xl mx-auto">
            {" "}
            {/* Increased size to max-w-2xl */}
            <h2 className="text-2xl font-bold text-center mb-4">
              Edit Employee's Leave
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="font-bold">Employee No.</label>
                <input
                  type="text"
                  name="employeeNo"
                  value={form.employeeNo}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">Employee's Name</label>
                <input
                  type="text"
                  name="employeeName"
                  value={form.employeeName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">Employee's Position</label>
                <select
                  name="employeePosition"
                  value={form.employeePosition}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-bold">Leave Type</label>
                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="">Choose a leave type</option>
                  {leaveTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date and End Date Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-bold">Attachment</label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="hover:bg-[#304994] hover:text-white font-bold text-black rounded px-4 py-2"
                >
                  Update Leave
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="text-gray-600 font-bold hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Box>
        </motion.div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Box className="bg-white p-6 rounded-md max-w-lg mx-auto mt-80">
            <h2 className="text-2xl font-bold text-center mb-4">
              Are you sure you want to delete this employee's leave?
            </h2>
            <div className="flex justify-between items-center">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white rounded px-4 py-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setOpenDeleteModal(false)}
                className="bg-gray-300 text-black rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </Box>
        </motion.div>
      </Modal>

      <footer className="bg-white mt-32 p-4 rounded-md shadow-md">
      <p>&copy; {new Date().getFullYear()} Nodado General Hospital. All rights reserved.</p>
      </footer>
      </motion.div>
    </div>
  );
};

export default Leave;
