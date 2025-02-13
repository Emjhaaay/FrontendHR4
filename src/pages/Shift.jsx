import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icons
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const Shift = () => {
  const [shifts, setShifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [differentialRate, setDifferentialRate] = useState(0);
  const [salary, setSalary] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false); // Modal for editing shift

  // Daily Salary Positions
  const positions = {
    Doctor: 3182,
    Nurse: 1591,
    Pharmacist: 1136,
    "Physical Therapist": 909,
    "Administrative Staff": 682,
  };

  // Shift Types Differential Rates %
  const shiftTypes = {
    "Regular Shift": 0,
    "Weekend Shift": 10,
    "Holiday Shift": 15,
    "Graveyard Shift": 10,
  };

  // Format Salary
  const formatSalary = (amount) =>
    `₱${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

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
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false }), 3000);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newShift = {
      employeeName,
      employeePosition,
      shiftType,
      differentialRate,
      salary,
      timeRange: `${convertTo12HourFormat(startTime)} - ${convertTo12HourFormat(
        endTime
      )}`,
    };

    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:8059/shifts/${editId}`, newShift);
        const updatedShifts = shifts.map((shift, index) =>
          index === editIndex ? { ...shift, ...newShift } : shift
        );
        setShifts(updatedShifts);
        showNotification("success", "Employee's Shift updated successfully!");
        resetForm();
      } else {
        const response = await axios.post(
          "http://localhost:8059/shifts",
          newShift
        );
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
    setEmployeeName("");
    setEmployeePosition("");
    setShiftType("");
    setDifferentialRate(0);
    setSalary(0);
    setStartTime("");
    setEndTime("");
    setEditIndex(null);
    setEditId(null);
  };

  // Handle Edit
  const handleEdit = (index) => {
    const shiftToEdit = shifts[index];
    setEmployeeName(shiftToEdit.employeeName);
    setEmployeePosition(shiftToEdit.employeePosition);
    setShiftType(shiftToEdit.shiftType);
    setDifferentialRate(shiftToEdit.differentialRate);
    setSalary(shiftToEdit.salary);
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
    const baseSalary = positions[position] || 0;
    const differential = (differentialRate / 100) * baseSalary;
    setSalary(baseSalary + differential);
  };

  // Handle Shift Type Change
  const handleShiftTypeChange = (e) => {
    const type = e.target.value;
    setShiftType(type);
    const rate = shiftTypes[type] || 0;
    const baseSalary = positions[employeePosition] || 0;
    const newSalary = baseSalary + (baseSalary * rate) / 100;
    setDifferentialRate(rate);
    setSalary(newSalary);
  };

  // Filter Shifts Based on Search Term
  const filteredShifts = shifts.filter((shift) =>
    shift.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F0F0F0] mt-16">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-30 right-5 p-4 border rounded flex items-center space-x-2 transition-opacity duration-500 ease-in-out ${
            notification.show ? "opacity-100 visible" : "opacity-0 invisible"
          } ${
            notification.type === "success"
              ? "bg-green-100 border-green-300 text-green-800"
              : "bg-red-100 border-red-300 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <FaCheckCircle size={20} className="text-green-600" />
          ) : (
            <FaExclamationCircle size={20} className="text-red-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Shift Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold p-4 mb-8 sm:mb-6 text-gray-800">
          Shift Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Employee */}
          <div className="mb-4">
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

          {/* Employee Name */}
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
              />
              <span>-</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className=" mt-2 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
              >
                {editIndex !== null ? "Update Shift" : "Add Shift"}
              </button>
            </div>
        </div>
      </form>

      {/* Shift Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
              <th className="border px-4 sm:px-6 py-2">Employee Name</th>
              <th className="border px-4 sm:px-6 py-2">Position</th>
              <th className="border px-4 sm:px-6 py-2">Shift Type</th>
              <th className="border px-4 sm:px-6 py-2">Time Range</th>
              <th className="border px-4 sm:px-6 py-2">Daily Salary</th>
              <th className="border px-4 sm:px-6 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            
            {filteredShifts.map((shift, index) => (
              <tr key={shift._id} className="text-xs sm:text-sm bg-white hover:bg-gray-100">
                <td className="py-2 px-4">{shift.employeeName}</td>
                <td className="py-2 px-4">{shift.employeePosition}</td>
                <td className="py-2 px-4">{shift.shiftType}</td>
                <td className="py-2 px-4">{shift.timeRange}</td>
                <td className="py-2 px-4">{formatSalary(shift.salary)}</td>
                <td className="py-2 px-4 flex space-x-2">
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
            ))}
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
        <Box className=" bg-white p-6 rounded-md max-w-lg mx-auto mt-24">
          <h2 className="text-2xl font-bold text-center mb-4">
            Edit Employee's Shift
          </h2>
          {/* Modal Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="font-bold">Employee's Name</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">Employee's Position</label>
              <select
                value={employeePosition}
                onChange={handlePositionChange}
                className="border border-gray-300 rounded p-2 w-full"
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
                />
                <span className="mt-1">To</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-[#090367] font-bold text-white rounded px-4 py-2"
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
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
      </Modal>
    </div>
  );
};

export default Shift;
