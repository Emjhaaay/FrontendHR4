import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icons
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box"; // Import Box
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert
import { motion } from "framer-motion";

const Shift = () => {
  const [shifts, setShifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeNo, setEmployeeNo] = useState(""); // New state for employee number
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [differentialRate, setDifferentialRate] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false); // Modal for editing shift
  const [filterPosition, setFilterPosition] = useState(""); // State for filter position

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Daily Salary Positions
  const positions = {
    "Medical Center Chief": 6209.09,
    "Medical Specialist III": 4667.27,
    "Chief of Hospital": 4090.82,
    "Chief Nursing Officer": 4090.82,
    "Chief Medical Officer": 4090.82,
    "Chief Administrative Officer": 4090.82,
    "Chief Financial Officer": 4090.82,
    "Chief Information Officer": 4090.82,
    "Medical Specialist II": 4090.82,
    Psychiatrist: 4090.82,
    Dentist: 4090.82,
    "Information Technology Officer": 4090.91,
    "Financial and Management Officer": 4090.91,
    "Medical Officer IV": 3255.05,
    "Chief Medical Technologist": 3255.05,
    "Chief Pharmacist": 3255.05,
    "Medical Officer III": 2602.09,
    "Medical Officer II": 2128.86,
    "Medical Officer I": 1803.27,
    "Nurse 2": 1803.27,
    "Nurse 3": 1956.82,
    "Nurse 4": 2338.5,
    "Medical Specialist I": 3636.5,
    "Medical Technologist": 1227.27,
    "HR Management Officer": 1227.27,
    "Information Officer": 1227.27,
    "Licensing Officer": 1227.27,
    "Dietician/Nutritionist": 1664.5,
    "Nurse 1": 1664.5,
    Psychologist: 1156.32,
    "Health Physicist": 1156.32,
    Chemist: 1156.32,
    "Physical Therapist": 1156.32,
    "Ward Assistant": 627.14,
    "Administrative Officer": 1053.45,
    "Administrative Assistant": 897.09,
    "Administrative Aide": 590.91,
    "Medical Equipment Technician": 765.32,
    "Laboratory Aide": 707.18,
  };

  // Shift Types Differential Rates %
  const shiftTypes = {
    "Regular Shift": 0,
    "Weekend Shift": 10,
    "Holiday Shift": 15,
    "Graveyard Shift": 10,
  };

  // Convert time from 24-hour to 12-hour format (AM/PM)
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };

  // Fetch Shifts on Component Mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get("http://localhost:8059/shifts");
        setShifts(response.data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
        showNotification("error", "Error fetching shifts. Please try again.");
      }
    };

    fetchShifts();
  }, []);

  // Show Notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setSnackbarOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newShift = {
      employeeNo, // Include employeeNo in the new shift object
      employeeName,
      employeePosition,
      shiftType,
      differentialRate,
      timeRange: `${convertTo12HourFormat(startTime)} - ${convertTo12HourFormat(
        endTime
      )}`,
    };

    console.log("Submitting new shift:", newShift); // Debugging log

    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:8059/shifts/${editId}`, newShift);
        const updatedShifts = shifts.map((shift, index) =>
          index === editIndex ? { ...shift, ...newShift } : shift
        );
        setShifts(updatedShifts);
        showNotification("success", "Employee's Shift updated successfully!");
        resetForm();
        setOpenEditModal(false); // Close the modal after successful update
      } else {
        const response = await axios.post(
          "http://localhost:8059/shifts",
          newShift
        );
        console.log("Shift added successfully:", response.data); // Debugging log
        setShifts([...shifts, response.data]);
        showNotification("success", "Employee's Shift added successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error saving shift:", error);
      showNotification("error", "Error saving shift. Please try again.");
    }
  };

  // Reset Form Fields
  const resetForm = () => {
    setEmployeeNo(""); // Reset employeeNo
    setEmployeeName("");
    setEmployeePosition("");
    setShiftType("");
    setDifferentialRate(0);
    setStartTime("");
    setEndTime("");
    setEditIndex(null);
    setEditId(null);
  };

  // Handle Edit
  const handleEdit = (index) => {
    const shiftToEdit = shifts[index];
    setEmployeeNo(shiftToEdit.employeeNo); // Set employeeNo for editing
    setEmployeeName(shiftToEdit.employeeName);
    setEmployeePosition(shiftToEdit.employeePosition);
    setShiftType(shiftToEdit.shiftType);
    setDifferentialRate(shiftToEdit.differentialRate);
    setStartTime(shiftToEdit.timeRange.split(" - ")[0]);
    setEndTime(shiftToEdit.timeRange.split(" - ")[1]);
    setEditIndex(index);
    setEditId(shiftToEdit._id);
    setOpenEditModal(true); // Open the Edit Modal
  };

  // Open delete modal
  const openDeleteModalHandler = (index) => {
    setDeleteIndex(index);
    setOpenDeleteModal(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    const shiftToDelete = shifts[deleteIndex];
    try {
      await axios.delete(`http://localhost:8059/shifts/${shiftToDelete._id}`);
      const updatedShifts = shifts.filter((_, i) => i !== deleteIndex);
      setShifts(updatedShifts);
      showNotification("success", "Employee's Shift deleted successfully!");
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Error deleting shift:", error);
      showNotification("error", "Error deleting shift. Please try again.");
      setOpenDeleteModal(false);
    }
  };

  // Handle Position Change
  const handlePositionChange = (e) => {
    const position = e.target.value;
    setEmployeePosition(position);
  };

  // Handle Shift Type Change
  const handleShiftTypeChange = (e) => {
    const type = e.target.value;
    setShiftType(type);
    const rate = shiftTypes[type] || 0;
    setDifferentialRate(rate);

    // Automatically set time range for Graveyard Shift
    if (type === "Graveyard Shift") {
      setStartTime("22:00"); // 10:00 PM
      setEndTime("06:00"); // 6:00 AM
    } else {
      setStartTime(""); // Reset if not Graveyard Shift
      setEndTime(""); // Reset if not Graveyard Shift
    }
  };

  // Filter Shifts Based on Search Term and Filter Position
  const filteredShifts = shifts.filter((shift) => {
    const matchesSearchTerm = shift.employeeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition
      ? shift.employeePosition === filterPosition
      : true;
    return matchesSearchTerm && matchesPosition;
  });

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="bg-[#F0F0F0] p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Snackbar for notifications */}
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

        {/* Shift Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold p-4 mb-8 sm:mb-6 text-gray-800">
            Shift Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Name
              </label>
              <input
                type="text"
                placeholder="Employee's Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Position
              </label>
              <select
                value={employeePosition}
                onChange={handlePositionChange}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              >
                <option value="">Select Position</option>
                {Object.keys(positions).map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Type */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Shift Type
              </label>
              <select
                value={shiftType}
                onChange={handleShiftTypeChange}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              >
                <option value="">Select Shift Type</option>
                {Object.keys(shiftTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Time Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                  required
                />
                <span>-</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                  required
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-2 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[white] text-black font-semibold rounded-md shadow-md hover:bg-[#304994] hover:text-white transition-colors duration-200"
              >
                {editIndex !== null ? "Update Shift" : "Add Shift"}
              </button>
            </div>
          </div>
        </form>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
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
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Filter by Position
            </label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
            >
              <option value="">All Positions</option>
              {Object.keys(positions).map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shift Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr className="bg-[white] text-black text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee No</th>{" "}
                {/* New column for Employee No */}
                <th className="border px-4 sm:px-6 py-2">Employee's Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">Shift Type</th>
                <th className="border px-4 sm:px-6 py-2">Time Range</th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-sm">
                    No Employee Found.
                  </td>
                </tr>
              ) : (
                filteredShifts.map((shift, index) => (
                  <tr
                    key={shift._id}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 p-2">
                      {shift.employeeNo}
                    </td>{" "}
                    {/* Display Employee No */}
                    <td className="border border-gray-300 p-2">
                      {shift.employeeName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {shift.employeePosition}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {shift.shiftType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {shift.timeRange}
                    </td>
                    <td className="border border-gray-300 p-2 flex justify-center">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => openDeleteModalHandler(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        <Modal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Box className="bg-white p-6 rounded-md max-w-lg mx-auto mt-24">
              <h2 className="text-2xl font-bold text-center mb-4">
                Edit Employee's Shift
              </h2>
              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-bold">Employee No</label>
                  <input
                    type="text"
                    value={employeeNo}
                    onChange={(e) => setEmployeeNo(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Employee's Name</label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Employee's Position</label>
                  <select
                    value={employeePosition}
                    onChange={handlePositionChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  >
                    <option value="">Select Position</option>
                    {Object.keys(positions).map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Shift Type</label>
                  <select
                    value={shiftType}
                    onChange={handleShiftTypeChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  >
                    <option value="">Select Shift Type</option>
                    {Object.keys(shiftTypes).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Time Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    />
                    <span className="mt-1">To</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="hover:bg-[#304994] hover:text-white font-bold text-black rounded px-4 py-2"
                  >
                    Update Shift
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenEditModal(false)}
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
                Are you sure you want to delete this shift?
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
        <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
          <p>
            &copy; {new Date().getFullYear()} Nodado General Hospital. All
            rights reserved.
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Shift;
