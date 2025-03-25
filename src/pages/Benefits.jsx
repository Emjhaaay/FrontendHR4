import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import {
  Modal,
  Box,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";

const Benefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [ssSChecked, setSssChecked] = useState(false);
  const [hazardPayChecked, setHazardPayChecked] = useState(false);
  const [holidayIncentivesChecked, setHolidayIncentivesChecked] = useState(false);
  const [leaveChecked, setLeaveChecked] = useState(false);
  const [thirteenthMonthChecked, setThirteenthMonthChecked] = useState(false);
  const [retirementChecked, setRetirementChecked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const positions = [
    {
      name: "Medical Center Chief",
      salary: 136620,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Specialist III",
      salary: 102690,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Information Technology Officer",
      salary: 90000,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Financial and Management Officer",
      salary: 90000,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief Medical Officer",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief of Hospital",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief Nursing Officer",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief Administrative Officer",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief Financial Officer",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief Information Officer",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Specialist II",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Psychiatrist",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Dentist",
      salary: 90078,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Specialist I",
      salary: 80003,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief Medical Technologist",
      salary: 71511,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chief Pharmacist",
      salary: 71511,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Officer IV",
      salary: 71511,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Officer III",
      salary: 57346,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Officer II",
      salary: 46725,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Officer I",
      salary: 39672,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Nurse 2",
      salary: 39672,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Nurse 3",
      salary: 43030,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Nurse 4",
      salary: 51357,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Nurse 1",
      salary: 36619,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Dietician/Nutritionist",
      salary: 36619,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Physical Therapist",
      salary: 25439,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Psychologist",
      salary: 25439,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Health Physicist",
      salary: 1156.32,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Chemist",
      salary: 25439,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Ward Assistant",
      salary: 13807,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Administrative Officer",
      salary: 23176,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Administrative Aide",
      salary: 13000,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Administrative Assistant",
      salary: 19744,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "HR Management Officer",
      salary: 27000,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Information Officer",
      salary: 27000,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Licensing Officer",
      salary: 27000,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Medical Equipment Technician",
      salary: 16877,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
    {
      name: "Laboratory Aide",
      salary: 15586,
      benefits: {
        sss: true,
        hazardPay: true,
        holidayIncentives: true,
        leave: true,
        thirteenthMonth: true,
        retirement: true,
      },
    },
  ];

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const response = await axios.get("http://localhost:8059/benefits");
      setBenefits(response.data);
    } catch (error) {
      console.error("Error fetching benefits:", error);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const benefitData = {
      employeeName,
      employeePosition,
      sss: ssSChecked,
      hazardPay: hazardPayChecked,
      holidayIncentives: holidayIncentivesChecked,
      leave: leaveChecked,
      thirteenthMonth: thirteenthMonthChecked,
      retirement: retirementChecked,
    };

    if (editIndex !== null) {
      try {
        await axios.put(
          `http://localhost:8059/benefits/${benefits[editIndex]._id}`,
          benefitData
        );
        const updatedBenefits = [...benefits];
        updatedBenefits[editIndex] = {
          ...updatedBenefits[editIndex],
          ...benefitData,
        };
        setBenefits(updatedBenefits);
        showNotification("Employee's Benefits updated successfully!", "success");
      } catch (error) {
        showNotification("Error updating benefit", "error");
        console.error("Error updating benefit:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8059/benefits",
          benefitData
        );
        setBenefits([...benefits, response.data]);
        showNotification("Employee's Benefits added successfully!", "success");
      } catch (error) {
        showNotification("Error adding benefit", "error");
        console.error("Error adding benefit:", error);
      }
    }
    handleCloseEditModal();
  };

  const handleEdit = (index) => {
    const benefit = benefits[index];
    if (benefit) {
      setEmployeeName(benefit.employeeName);
      setEmployeePosition(benefit.employeePosition);
      setSssChecked(benefit.sss);
      setHazardPayChecked(benefit.hazardPay);
      setHolidayIncentivesChecked(benefit.holidayIncentives);
      setLeaveChecked(benefit.leave);
      setThirteenthMonthChecked(benefit.thirteenthMonth);
      setRetirementChecked(benefit.retirement);
      setEditIndex(index);
      setOpenEditModal(true);
    } else {
      console.error("Benefit not found for index:", index);
    }
  };

  const handlePositionChange = (e) => {
    const selectedPosition = e.target.value;
    setEmployeePosition(selectedPosition);
    
    const positionBenefits = getBenefitsForPosition(selectedPosition);
    setSssChecked(positionBenefits.sss);
    setHazardPayChecked(positionBenefits.hazardPay);
    setHolidayIncentivesChecked(positionBenefits.holidayIncentives);
    setLeaveChecked(positionBenefits.leave);
    setThirteenthMonthChecked(positionBenefits.thirteenthMonth);
    setRetirementChecked(positionBenefits.retirement);
  };

  const getBenefitsForPosition = (positionName) => {
    const position = positions.find(pos => pos.name === positionName);
    return position ? position.benefits : {
      sss: false,
      hazardPay: false,
      holidayIncentives: false,
      leave: false,
      thirteenthMonth: false,
      retirement: false,
    };
  };

  const handleOpenDeleteModal = (index) => {
    setDeleteIndex(index);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteIndex !== null) {
      try {
        await axios.delete(
          `http://localhost:8059/benefits/${benefits[deleteIndex]._id}`
        );
        const updatedBenefits = benefits.filter((_, i) => i !== deleteIndex);
        setBenefits(updatedBenefits);
        showNotification("Employee's Benefits deleted successfully!", "success");
      } catch (error) {
        showNotification("Error deleting benefit", "error");
        console.error("Error deleting benefit:", error);
      }
      handleCloseDeleteModal();
    }
  };

  const resetForm = () => {
    setEmployeeName("");
    setEmployeePosition("");
    resetCheckboxes();
  };

  const resetCheckboxes = () => {
    setSssChecked(false);
    setHazardPayChecked(false);
    setHolidayIncentivesChecked(false);
    setLeaveChecked(false);
    setThirteenthMonthChecked(false);
    setRetirementChecked(false);
  };

  const filteredBenefits = benefits.filter(
    (benefit) =>
      benefit.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPosition ? benefit.employeePosition === filterPosition : true)
  );

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <div className="bg-[#F0F0F0]  p-6">
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.type}>
          {notification.message}
        </Alert>
      </Snackbar>

      <div className="bg-[#F0F0F0] rounded-lg mb-6">
        <form
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
          onSubmit={handleAddOrUpdate}
        >
          <h1 className="text-3xl font-bold mb-4 p-4 text-gray-800">
            Employee's Benefits
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's name
              </label>
              <input
                type="text"
                placeholder="Employee's Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
                className="border border-gray-300 p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Position
              </label>
              <select
                value={employeePosition}
                onChange={handlePositionChange} // Updated to use the new handler
                required
                className="border border-gray-300 p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#090367]"
              >
                <option value="">Choose a Position</option>
                {positions.map((position, index) => (
                  <option key={index} value={position.name}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[white] text-black font-semibold rounded-md shadow-md hover:bg-[#304994] hover:text-white transition-colors duration-200"
              >
                {editIndex !== null ? "Update Benefit" : "Add Benefit"}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Benefits:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ssSChecked}
                    onChange={(e) => setSssChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label="SSS, Pag-Ibig, Philhealth"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hazardPayChecked}
                    onChange={(e) => setHazardPayChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label="Hazard Pay"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={holidayIncentivesChecked}
                    onChange={(e) => setHolidayIncentivesChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label="Holiday Incentives"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={leaveChecked}
                    onChange={(e) => setLeaveChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label="Leave"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={thirteenthMonthChecked}
                    onChange={(e) => setThirteenthMonthChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label="13th Month"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={retirementChecked}
                    onChange={(e) => setRetirementChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label="Retirement"
              />
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
                <option key={pos.name} value={pos.name}>
                  {pos.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="min-w-full bg-white shadow-md rounded-lg">
              <tr className="bg-[white] text-black text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee's Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">SSS, Pag-Ibig, Philhealth</th>
                <th className="border px-4 sm:px-6 py-2">Hazard Pay</th>
                <th className="border px-4 sm:px-6 py-2">Holiday Incentives</th>
                <th className="border px-4 sm:px-6 py-2">Paid Leave</th>
                <th className="border px-4 sm:px-6 py-2">13th Month</th>
                <th className="border px-4 sm:px-6 py-2">Retirement</th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {filteredBenefits.length > 0 ? (
                filteredBenefits.map((benefit, index) => (
                  <tr key={index} className="text-xs sm:text-sm bg-white hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{benefit.employeeName}</td>
                    <td className="border border-gray-300 p-2">{benefit.employeePosition}</td>
                    <td className="border border-gray-300 p-2">
                      {benefit.sss ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {benefit.hazardPay ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {benefit.holidayIncentives ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {benefit.leave ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {benefit.thirteenthMonth ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {benefit.retirement ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button onClick={() => handleEdit(index)} className="cursor-pointer text-blue-500 hover:text-[#090367]">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleOpenDeleteModal(index)} className="cursor-pointer text-red-500 hover:text-[#EA0D10]">
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">No Employee Found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
          <Box className="bg-white p-6 rounded-md max-w-lg mx-auto mt-24">
            <h2 className="text-2xl font-bold text-center mb-4">Edit Employee's Benefits</h2>
            <form onSubmit={handleAddOrUpdate} className="space-y-4">
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
                  onChange={handlePositionChange} // Updated to use the new handler
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position.name}>
                      {position.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-bold">Benefits:</label>
                <div className="flex flex-col space-y-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ssSChecked}
                        onChange={(e) => setSssChecked(e.target.checked)}
                      />
                    }
                    label="SSS"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hazardPayChecked}
                        onChange={(e) => setHazardPayChecked(e.target.checked)}
                      />
                    }
                    label="Hazard Pay"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={holidayIncentivesChecked}
                        onChange={(e) => setHolidayIncentivesChecked(e.target.checked)}
                      />
                    }
                    label="Holiday Incentives"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={leaveChecked}
                        onChange={(e) => setLeaveChecked(e.target.checked)}
                      />
                    }
                    label="Leave"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={thirteenthMonthChecked}
                        onChange={(e) => setThirteenthMonthChecked(e.target.checked)}
                      />
                    }
                    label="13th Month"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={retirementChecked}
                        onChange={(e) => setRetirementChecked(e.target.checked)}
                      />
                    }
                    label="Retirement"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="hover:bg-[#304994] hover:text-white font-bold text-black rounded px-4 py-2"
                >
                  Update Benefits
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
        onClose={handleCloseDeleteModal}
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
              Are you sure you want to delete this benefit?
            </h2>
            <div className="flex justify-between items-center">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white rounded px-4 py-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCloseDeleteModal}
                className="bg-gray-300 text-black rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </Box>
        </motion.div>
      </Modal>

      <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
        <p>2024 Hospital Management System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Benefits;