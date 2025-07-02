import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";
import "/src/index.css";

const OvertimeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeNo: "", // New field for employee number
    name: "",
    position: "",
    overtimeHours: 0,
    predictedOvertimeHours: 0,
    approved: false, // New field for approval status
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const positions = [
    { position: "Medical Center Chief" },
    { position: "Medical Specialist III" },
    { position: "Chief Medical Officer" },
    { position: "Chief of Hospital" },
    { position: "Chief Nursing Officer" },
    { position: "Chief Administrative Officer" },
    { position: "Chief Financial Officer" },
    { position: "Chief Information Officer" },
    { position: "Medical Specialist II" },
    { position: "Psychiatrist" },
    { position: "Dentist" },
    { position: "Information Technology Officer" },
    { position: "Financial and Management Officer" },
    { position: "Medical Officer IV" },
    { position: "Chief Medical Technologist" },
    { position: "Chief Pharmacist" },
    { position: "Medical Officer III" },
    { position: "Medical Officer II" },
    { position: "Medical Officer I" },
    { position: "Nurse 2" },
    { position: "Nurse 3" },
    { position: "Nurse 4" },
    { position: "Medical Specialist I" },
    { position: "Medical Technologist" },
    { position: "HR Management Officer" },
    { position: "Information Officer" },
    { position: "Licensing Officer" },
    { position: "Dietician/Nutritionist" },
    { position: "Nurse 1" },
    { position: "Psychologist" },
    { position: "Health Physicist" },
    { position: "Chemist" },
    { position: "Physical Therapist" },
    { position: "Ward Assistant" },
    { position: "Administrative Officer" },
    { position: "Administrative Assistant" },
    { position: "Administrative Aide" },
    { position: "Medical Equipment Technician" },
    { position: "Laboratory Aide" },
  ];

  const calculatePredictedOvertimeHours = (currentOvertimeHours) => {
    const increasePercentage = 0.1; // Example: 10% increase
    const predictedHours = Math.round(
      currentOvertimeHours * (1 + increasePercentage)
    );
    return Math.max(predictedHours, 0); // Ensure no negative values
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Prevent negative input for overtime hours
    if (name === "overtimeHours" && value < 0) {
      return; // Do not update state if the value is negative
    }

    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://newbackendhr4.vercel.app/overtimes");
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const predictedOvertimeHours = calculatePredictedOvertimeHours(
      formData.overtimeHours
    );
    setFormData((prevData) => ({
      ...prevData,
      predictedOvertimeHours,
    }));
  }, [formData.overtimeHours]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeNo, name, position, overtimeHours, approved } = formData;

    try {
      if (isEditing) {
        await axios.put(
          `https://newbackendhr4.vercel.app/overtimes/${employees[currentIndex]._id}`,
          {
            employeeNo, // Include employeeNo in the update
            name,
            position,
            overtimeHours,
            approved, // Include approval status
          }
        );
        setNotification({
          message: "Employee's Overtime updated successfully!",
          type: "success",
        });
      } else {
        await axios.post("https://newbackendhr4.vercel.app/overtimes", {
          employeeNo, // Include employeeNo in the new employee
          name,
          position,
          overtimeHours,
          approved, // Include approval status
        });
        setNotification({
          message: "Employee added successfully!",
          type: "success",
        });
      }
      fetchEmployees();
    } catch (err) {
      console.error("Error saving employee:", err);
      setNotification({
        message: "Error occurred while saving employee.",
        type: "error",
      });
    }

    setFormData({
      employeeNo: "", // Reset employeeNo
      name: "",
      position: "",
      overtimeHours: 0,
      predictedOvertimeHours: 0,
      approved: false, // Reset approval status
    });
    setIsEditing(false);
    setCurrentIndex(null);
    setOpenEditModal(false);

    setSnackbarOpen(true);
  };

  const handleEdit = (index) => {
    const employee = employees[index];
    setFormData({
      employeeNo: employee.employeeNo, // Set employeeNo for editing
      name: employee.name,
      position: employee.position,
      overtimeHours: employee.overtimeHours,
      predictedOvertimeHours: calculatePredictedOvertimeHours(
        employee.overtimeHours
      ),
      approved: employee.approved, // Set approval status for editing
    });
    setIsEditing(true);
    setCurrentIndex(index);
    setOpenEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://newbackendhr4.vercel.app/overtimes/${selectedEmployeeId}`
      );
      fetchEmployees();
      setNotification({
        message: "Employee's Overtime deleted successfully!",
        type: "success",
      });
      setOpenDeleteModal(false);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setNotification({
        message: "Error occurred while deleting employee.",
        type: "error",
      });
    }

    setSnackbarOpen(true);
  };

  const handleOpenDeleteModal = (index) => {
    setSelectedEmployeeId(employees[index]._id);
    setOpenDeleteModal(true);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearchQuery = employee.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition
      ? employee.position === selectedPosition
      : true;
    return matchesSearchQuery && matchesPosition;
  });

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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={notification.type}
          sx={{
            backgroundColor: notification.type === "success" ? "white" : "red",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <form
        className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl p-4 sm:text-3xl font-bold mb-8 sm:mb-6 text-gray-800">
          Employee's Overtime
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Employee's Name
            </label>
            <input
              type="text"
              placeholder="Employee's Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Employee's Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              required
            >
              <option value="">Choose a Position</option>
              {positions.map((position) => (
                <option key={position.position} value={position.position}>
                  {position.position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Overtime Hours
            </label>
            <input
              type="number"
              placeholder="Overtime Hours"
              name="overtimeHours"
              value={formData.overtimeHours}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Predicted OT Hours (Next Month)
            </label>
            <input
              type="text"
              placeholder="Predicted OT Hours"
              name="predictedOvertimeHours"
              value={formData.predictedOvertimeHours}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="approved"
              checked={formData.approved}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Approved by Supervisor
            </label>
          </div>

          <div className="mt-2 ml-8">
            <button
              type="submit"
              className="mt-4 py-2 px-4 bg-[white] text-black font-semibold rounded-md shadow-md hover:bg-[#304994] hover:text-white transition-colors duration-200"
            >
              {isEditing ? "Update Overtime" : "Add Overtime"}
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1 text-gray-800">
            Search Employee
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Employee's Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1 text-gray-800">
            Filter by Position
          </label>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
          >
            <option value="">All Positions</option>
            {positions.map((position) => (
              <option key={position.position} value={position.position}>
                {position.position}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees List */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr className="bg-[white] text-black text-xs sm:text-sm leading-normal">
              <th className="border px-4 sm:px-6 py-2">Employee No.</th>
              <th className="border px-4 sm:px-6 py-2">Employee's Name</th>
              <th className="border px-4 sm:px-6 py-2">Position</th>
              <th className="border px-4 sm:px-6 py-2">Overtime Hours</th>
              <th className="border px-4 sm:px-6 py-2">Predicted OT Hours</th>
              <th className="border px-4 sm:px-6 py-2">
                Approved by Supervisor
              </th>{" "}
              {/* New Column */}
              <th className="border px-4 sm:px-6 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm ">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => {
                const predictedOTHours = calculatePredictedOvertimeHours(
                  employee.overtimeHours
                );

                return (
                  <tr
                    key={employee._id}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 p-2">
                      {employee.employeeNo}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {employee.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {employee.position}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {employee.overtimeHours} Hours
                    </td>
                    <td className="border border-gray-300 p-2">
                      {predictedOTHours} Hours (Next Month)
                    </td>
                    <td className="border border-gray-300 p-2">
                      <span
                        className={`font-bold ${
                          employee.approved
                            ? "bg-green-100 text-green-600 "
                            : "bg-yellow-100 text-yellow-600 "
                        } px-2 py-1 rounded w-full`}
                      >
                        {employee.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-500 hover:text-[#090367]"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(index)}
                        className="text-red-500 hover:text-[#EA0D10]"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-sm">
                  No Employee Found.
                </td>
              </tr>
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
              Edit Employee's Overtime
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="font-bold">Employee No.</label>
                <input
                  type="text"
                  name="employeeNo"
                  value={formData.employeeNo}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">Employee's Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="">Choose a Position</option>
                  {positions.map((position) => (
                    <option key={position.position} value={position.position}>
                      {position.position}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-bold">Overtime Hours</label>
                <input
                  type="number"
                  name="overtimeHours"
                  value={formData.overtimeHours}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">
                  Predicted OT Hours (Next Month)
                </label>
                <input
                  type="text"
                  placeholder="Predicted OT Hours"
                  value={calculatePredictedOvertimeHours(
                    formData.overtimeHours
                  )}
                  readOnly
                  className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="approved"
                  checked={formData.approved}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Approved by Supervisor
                </label>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="hover:bg-[#304994] hover:text-white font-bold text-black rounded px-4 py-2"
                >
                  Update Overtime
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
              Are you sure you want to delete this employee's overtime?
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
      <p>&copy; {new Date().getFullYear()} Nodado General Hospital. All rights reserved.</p>
      </footer>
      </motion.div>
    </div>
  );
};

export default OvertimeManagement;