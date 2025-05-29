import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Modal from "@mui/material/Modal"; // Import Modal
import { motion } from "framer-motion";
import Box from "@mui/material/Box"; // Import Box
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert

const Incentives = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeNo: "", // Add employeeNo to form data
    name: "",
    position: "",
    employeeType: "Regular Employee", // Added employee type
    attendance: 0,
    unusedLeaveBonus: "Not Used",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterEmployeeType, setFilterEmployeeType] = useState(""); // Added filter for employee type
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const positions = [
    { name: "Medical Center Chief" },
    { name: "Medical Specialist III" },
    { name: "Chief Medical Officer" },
    { name: "Chief of Hospital" },
    { name: "Chief Nursing Officer" },
    { name: "Chief Administrative Officer" },
    { name: "Chief Financial Officer" },
    { name: "Chief Information Officer" },
    { name: "Medical Specialist II" },
    { name: "Psychiatrist" },
    { name: "Dentist" },
    { name: "Information Technology Officer" },
    { name: "Financial and Management Officer" },
    { name: "Medical Officer IV" },
    { name: "Chief Medical Technologist" },
    { name: "Chief Pharmacist" },
    { name: "Medical Officer III" },
    { name: "Medical Officer II" },
    { name: "Medical Officer I" },
    { name: "Nurse 2" },
    { name: "Nurse 3" },
    { name: "Nurse 4" },
    { name: "Medical Specialist I" },
    { name: "Medical Technologist" },
    { name: "HR Management Officer" },
    { name: "Information Officer" },
    { name: "Licensing Officer" },
    { name: "Dietician/Nutritionist" },
    { name: "Nurse 1" },
    { name: "Psychologist" },
    { name: "Health Physicist" },
    { name: "Chemist" },
    { name: "Physical Therapist" },
    { name: "Ward Assistant" },
    { name: "Administrative Officer" },
    { name: "Administrative Assistant" },
    { name: "Administrative Aide" },
    { name: "Medical Equipment Technician" },
    { name: "Laboratory Aide" },
  ];

  const employeeTypes = ["Regular Employee", "Contractual Employee"]; // Added employee types

  useEffect(() => {
    fetchIncentives();
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter((emp) => {
        const matchesSearchTerm =
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPosition = filterPosition
          ? emp.position === filterPosition
          : true;
        const matchesEmployeeType = filterEmployeeType
          ? emp.employeeType === filterEmployeeType
          : true;
        return matchesSearchTerm && matchesPosition && matchesEmployeeType;
      })
    );
  }, [searchTerm, filterPosition, filterEmployeeType, employees]);

  const fetchIncentives = async () => {
    try {
      const response = await axios.get("http://localhost:8059/incentives");
      if (response.data.length === 0) {
        console.log("No employee data available");
      }
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching incentives:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "attendance") {
      const numericValue = Number(value);
      if (numericValue < 0) {
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const determineEligibility = (attendance) => {
    return attendance >= 15 ? "✅ Yes" : "❌ No";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.attendance < 0 || formData.attendance > 22) {
      showNotification("error", "Attendance must be between 0 and 22!");
      return;
    }

    try {
      if (editIndex !== null) {
        const updatedEmployee = { ...formData };
        await axios.put(
          `http://localhost:8059/incentives/${employees[editIndex]._id}`,
          updatedEmployee
        );
        const updatedEmployees = [...employees];
        updatedEmployees[editIndex] = updatedEmployee;
        setEmployees(updatedEmployees);
        setEditIndex(null);
        showNotification(
          "success",
          "Employee's Incentives updated successfully!"
        );
      } else {
        const newEmployee = { ...formData };
        const response = await axios.post(
          "http://localhost:8059/incentives",
          newEmployee
        );
        setEmployees((prevEmployees) => [...prevEmployees, response.data]);
        showNotification(
          "success",
          "Employee's Incentives added successfully!"
        );
      }

      setFormData({
        employeeNo: "",
        name: "",
        position: "",
        employeeType: "Regular Employee",
        attendance: 0,
        unusedLeaveBonus: "Not Used",
      });
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error saving employee:", error);
      if (error.response) {
        showNotification(
          "error",
          `Error saving employee: ${
            error.response.data.message || error.message
          }`
        );
      } else {
        showNotification("error", "Error saving employee! Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8059/incentives/${selectedEmployeeId}`
      );
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== selectedEmployeeId)
      );
      showNotification(
        "success",
        "Employee's Incentives deleted successfully!"
      );
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
      showNotification("error", "Error deleting employee!");
    }
  };

  const handleEdit = (index) => {
    setFormData(employees[index]);
    setEditIndex(index);
    setOpenEditModal(true);
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedEmployeeId(id);
    setOpenDeleteModal(true);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="bg-[#F0F0F0] p-6 ">
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
        <Alert onClose={handleSnackbarClose} severity={notification.type}>
          {notification.message}
        </Alert>
      </Snackbar>

      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold p-4 mb-8 sm:mb-6 text-gray-800">
            Employee's Incentives
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Employee's Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Employee's Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Employee's Position
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              >
                <option value="">Choose a Position</option>
                {positions.map((pos) => (
                  <option key={pos.name} value={pos.name}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Employee Type
              </label>
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              >
                {employeeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Attendance
              </label>
              <input
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
                max="22"
              />
            </div>
            <div className="mt-3 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[white] text-black font-semibold rounded-md shadow-md hover:bg-[#304994] hover:text-white transition-colors duration-200"
              >
                {editIndex !== null ? "Update Incentives" : "Add Incentives"}
              </button>
            </div>
          </div>
        </form>

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
                <option key={pos.name} value={pos.name}>
                  {pos.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Filter by Employee Type
            </label>
            <select
              value={filterEmployeeType}
              onChange={(e) => setFilterEmployeeType(e.target.value)}
              className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
            >
              <option value="">All Types</option>
              {employeeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr className="bg-[white] text-black text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee No.</th>
                <th className="border px-4 sm:px-6 py-2">Employee's Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">Employee Type</th>
                <th className="border px-4 sm:px-6 py-2">Attendance</th>
                <th className="border px-4 sm:px-6 py-2">
                  AI Incentives Eligibility
                </th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {filteredEmployees.map((employee, index) => {
                const eligibility = determineEligibility(employee.attendance);
                return (
                  <tr
                    key={employee._id}
                    className={`text-xs sm:text-sm bg-white hover:bg-gray-100`}
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
                      {employee.employeeType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {employee.attendance}/22 days
                    </td>
                    <td className="border border-gray-300 p-2">
                      {eligibility}
                    </td>
                    <td className="border border-gray-300 p-2 ">
                      <button
                        onClick={() => {
                          handleEdit(index);
                          setOpenEditModal(true);
                        }}
                        className="text-blue-500 hover:text-[#090367]"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(employee._id)}
                        className="text-red-500 hover:text-[#EA0D10]"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
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
                Edit Employee's Incentives
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-bold">Employee No.:</label>
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
                  <label className="font-bold">Employee's Name:</label>
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
                  <label className="font-bold">Position:</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  >
                    <option value="">Choose a Position</option>
                    {positions.map((pos) => (
                      <option key={pos.name} value={pos.name}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Employee Type:</label>
                  <select
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  >
                    {employeeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Attendance:</label>
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                    max="22"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="hover:bg-[#304994] hover:text-white font-bold text-black rounded px-4 py-2"
                  >
                    Update Incentives
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
                Are you sure you want to delete this employee's incentives?
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
      </div>
      </motion.div>
    </div>
  );
};

export default Incentives;