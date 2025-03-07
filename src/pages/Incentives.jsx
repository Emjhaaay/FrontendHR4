import React, { useState, useEffect } from "react";
import { FaStar, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Modal from "@mui/material/Modal"; // Import Modal
import Box from "@mui/material/Box"; // Import Box

const Incentives = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
    incentives: 0,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const positions = [
    { name: "Doctor", salary: 70000 },
    { name: "Nurse", salary: 35000 },
    { name: "Pharmacist", salary: 25000 },
    { name: "Physical Therapist", salary: 20000 },
    { name: "Administrative Staff", salary: 15000 },
  ];

  useEffect(() => {
    fetchIncentives();
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, employees]);

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

  // Predictive analytics model for incentives
  const predictIncentives = (rating, position) => {
    const baseIncentive = rating * 1000; // Incentives based on rating (1 to 5)
    let positionMultiplier = 1;

    switch (position) {
      case "Doctor":
        positionMultiplier = 1.5; // Doctors get higher incentives
        break;
      case "Nurse":
        positionMultiplier = 1.3;
        break;
      case "Pharmacist":
        positionMultiplier = 1.2;
        break;
      default:
        positionMultiplier = 1;
        break;
    }

    return baseIncentive * positionMultiplier;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      salary:
        name === "position"
          ? positions.find((pos) => pos.name === value)?.salary || ""
          : prevData.salary,
    }));
  };

  const handleStarClick = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      incentives: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const predictedIncentive = predictIncentives(
      formData.incentives,
      formData.position
    );
    const totalSalary = parseFloat(formData.salary) + predictedIncentive;

    try {
      if (editIndex !== null) {
        const updatedEmployee = { ...formData, totalSalary };
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
        const newEmployee = { ...formData, totalSalary };
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
      setFormData({ name: "", position: "", salary: "", incentives: 0 });
      setOpenEditModal(false); // Close the edit modal
    } catch (error) {
      console.error("Error saving employee:", error);
      showNotification("error", "Error saving employee!");
    }
  };

  const handleDelete = async () => {
   
    try {
      await axios.delete(`http://localhost:8059/incentives/${selectedEmployeeId}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== selectedEmployeeId)
      );
      showNotification(
        "success",
        "Employee's Incentives deleted successfully!"
      );
      setOpenDeleteModal(false); // Close the delete modal
    } catch (error) {
      console.error("Error deleting employee:", error);
      showNotification("error", "Error deleting employee!");
    }
  };

  const handleEdit = (index) => {
    setFormData(employees[index]);
    setEditIndex(index);
    setOpenEditModal(true); // Open the edit modal
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedEmployeeId(id);
    setOpenDeleteModal(true); // Open the delete modal
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const formatCurrency = (amount) => {
    const numberAmount = parseFloat(amount) || 0; 
    return `₱${numberAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="bg-[#F0F0F0] mt-16 ">
      <div className="bg-[#F0F0F0] md:grid-cols-2 gap-4 mt-8 p-4">
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

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold p-4 mb-8 sm:mb-6 text-gray-800">
            Employee's Incentives
          </h1>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Search Employee
              </label>
              <input
                type="text"
                placeholder="Search Employee's Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>

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
                Position
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
            <div className="flex items-center">
              <div>
                <label className=" block text-sm font-medium mb-2 text-gray-700">
                Customers Satisfaction Rating:
                </label>
                <div className="flex space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-2xl cursor-pointer ${
                        formData.incentives >= star
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleStarClick(star)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Base Salary
              </label>
              <input
                type="text" // Change type to text for formatted currency display
                name="salary"
                value={formatCurrency(formData.salary)} // Use formatCurrency to display the formatted salary
                onChange={handleChange} // Optional if you're allowing changes to the input
                className="w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                disabled // Keep disabled if you don't want user edits
              />
            </div>
            <div className="mt-3 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
              >
                {editIndex !== null ? "Update Incentives" : "Add Incentives"}
              </button>
            </div>
          </div>
        </form>

        {/* Employees Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee's Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">Base Salary</th>
                <th className="border px-4 sm:px-6 py-2">Customers Satisfaction</th>
                <th className="border px-4 sm:px-6 py-2">Total Salary</th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className=" text-xs sm:text-sm">
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                >
                  <td className="border border-gray-300 p-2">
                    {employee.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {employee.position}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {formatCurrency(employee.salary)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className=" flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-lg ${
                            employee.incentives >= star
                              ? "text-yellow-500"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatCurrency(employee.totalSalary)}
                  </td>
                  <td className="border border-gray-300 p-2 flex justify-center">
                    <button
                      onClick={() => {
                        handleEdit(index);
                        setOpenEditModal(true); // Open the edit modal
                      }}
                      className="text-blue-500 hover:text-[#090367]"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(employee._id)} // Pass employee ID to delete modal
                      className="text-red-500 hover:text-[#EA0D10]"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4  text-sm">
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
          <Box className="bg-white p-6 rounded-md max-w-lg mx-auto mt-24">
            <h2 className="text-2xl font-bold text-center mb-4">
              Edit Employee's Incentives
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="font-bold">Customers Satisfaction Rating:</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-2xl cursor-pointer ${
                        formData.incentives >= star
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleStarClick(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-[#090367] font-bold text-white rounded px-4 py-2"
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
        </Modal>

        <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
          <p>2024 Hospital Management System. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Incentives;