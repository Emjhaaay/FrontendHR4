import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Modal,
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const Benefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [ssSChecked, setSssChecked] = useState(false);
  const [pagIbigChecked, setPagIbigChecked] = useState(false);
  const [philHealthChecked, setPhilHealthChecked] = useState(false);
  const [leaveChecked, setLeaveChecked] = useState(false);
  const [thirteenthMonthChecked, setThirteenthMonthChecked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const positions = [
    { name: "Nurse", benefits: { sss: true, pagIbig: true, philHealth: true, leave: true, thirteenthMonth: true } },
    { name: "Doctor", benefits: { sss: true, pagIbig: true, philHealth: true, leave: true, thirteenthMonth: true } },
    { name: "Pharmacist", benefits: { sss: true, pagIbig: true, philHealth: true, leave: true, thirteenthMonth: true } },
    { name: "Physical Therapist", benefits: { sss: true, pagIbig: true, philHealth: true, leave: true, thirteenthMonth: true } },
    { name: "Administrative Staff", benefits: { sss: true, pagIbig: true, philHealth: true, leave: true, thirteenthMonth: true } },
  ];

  useEffect(() => {
    fetchBenefits();
  }, []);

  useEffect(() => {
    const selectedPosition = positions.find(pos => pos.name === employeePosition);
    if (selectedPosition) {
      setSssChecked(selectedPosition.benefits.sss);
      setPagIbigChecked(selectedPosition.benefits.pagIbig);
      setPhilHealthChecked(selectedPosition.benefits.philHealth);
      setLeaveChecked(selectedPosition.benefits.leave);
      setThirteenthMonthChecked(selectedPosition.benefits.thirteenthMonth);
    } else {
      resetCheckboxes();
    }
  }, [employeePosition]);

  const fetchBenefits = async () => {
    try {
      const response = await axios.get("http://localhost:8059/benefits");
      setBenefits(response.data);
    } catch (error) {
      console.error("Error fetching benefits:", error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const benefitData = {
      employeeName,
      employeePosition,
      sss: ssSChecked,
      pagIbig: pagIbigChecked,
      philHealth: philHealthChecked,
      leave: leaveChecked,
      thirteenthMonth: thirteenthMonthChecked,
    };

    if (editIndex !== null) {
      try {
        await axios.put(`http://localhost:8059/benefits/${benefits[editIndex]._id}`, benefitData);
        const updatedBenefits = [...benefits];
        updatedBenefits[editIndex] = { ...updatedBenefits[editIndex], ...benefitData };
        setBenefits(updatedBenefits);
        showNotification("Employee's Benefits updated successfully!", "success");
      } catch (error) {
        showNotification("Error updating benefit", "error");
        console.error("Error updating benefit:", error);
      }
    } else {
      try {
        const response = await axios.post("http://localhost:8059/benefits", benefitData);
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
    setEmployeeName(benefit.employeeName);
    setEmployeePosition(benefit.employeePosition);
    setSssChecked(benefit.sss);
    setPagIbigChecked(benefit.pagIbig);
    setPhilHealthChecked(benefit.philHealth);
    setLeaveChecked(benefit.leave);
    setThirteenthMonthChecked(benefit.thirteenthMonth);
    setEditIndex(index);
    setOpenEditModal(true);
  };

  const handleOpenDeleteModal = (index) => {
    setDeleteIndex(index);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteIndex !== null) {
      try {
        await axios.delete(`http://localhost:8059/benefits/${benefits[deleteIndex]._id}`);
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
    setPagIbigChecked(false);
    setPhilHealthChecked(false);
    setLeaveChecked(false);
    setThirteenthMonthChecked(false);
  };

  const filteredBenefits = benefits.filter((benefit) =>
    benefit.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <div className="bg-[#F0F0F0] mt-16">
      <div className="bg-[#F0F0F0] md:grid-cols-2 gap-4 mt-8 p-4">
        {notification.show && (
          <div
            className={`fixed top-20 right-5 p-4 border rounded flex items-center space-x-2 transition-opacity duration-500 ease-in-out ${
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
                  Search Employee
                </label>
                <input
                  type="text"
                  placeholder="Search Employee's Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#090367]"
                />
              </div>

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
                  Position
                </label>
                <select
                  value={employeePosition}
                  onChange={(e) => setEmployeePosition(e.target.value)}
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
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Benefits:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <input
                      id="sss"
                      type="checkbox"
                      checked={ssSChecked}
                      onChange={(e) => setSssChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sss"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      SSS
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="pagIbig"
                      type="checkbox"
                      checked={pagIbigChecked}
                      onChange={(e) => setPagIbigChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="pagIbig"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Pag-Ibig
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="philHealth"
                      type="checkbox"
                      checked={philHealthChecked}
                      onChange={(e) => setPhilHealthChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="philHealth"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      PhilHealth
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="leave"
                      type="checkbox"
                      checked={leaveChecked}
                      onChange={(e) => setLeaveChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="leave"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      leave
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="thirteenthMonth"
                      type="checkbox"
                      checked={thirteenthMonthChecked}
                      onChange={(e) =>
                        setThirteenthMonthChecked(e.target.checked)
                      }
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="thirteenthMonth"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      13th Month
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2 ml-8">
                <button
                  type="submit"
                  className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
                >
                  {editIndex !== null ? "Update Benefit" : "Add Benefit"}
                </button>
              </div>
            </div>
          </form>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="min-w-full bg-white shadow-md rounded-lg">
                <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                  <th className="border px-4 sm:px-6 py-2">Employee Name</th>
                  <th className="border px-4 sm:px-6 py-2">Position</th>
                  <th className="border px-4 sm:px-6 py-2">SSS</th>
                  <th className="border px-4 sm:px-6 py-2">Pag-Ibig</th>
                  <th className="border px-4 sm:px-6 py-2">PhilHealth</th>
                  <th className="border px-4 sm:px-6 py-2">Leave</th>
                  <th className="border px-4 sm:px-6 py-2">13th Month</th>
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
                        {benefit.pagIbig ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.philHealth ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.leave ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.thirteenthMonth ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                      </td>
                      <td className="border border-gray-300 p-2 flex justify-center">
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
                    <td colSpan="8" className="text-center py-4">No Employee Found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
          <p>2024 Hospital Management System. All Rights Reserved.</p>
        </footer>
      </div>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
                onChange={(e) => setEmployeePosition(e.target.value)}
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
                      checked={pagIbigChecked}
                      onChange={(e) => setPagIbigChecked(e.target.checked)}
                    />
                  }
                  label="Pag-Ibig"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={philHealthChecked}
                      onChange={(e) => setPhilHealthChecked(e.target.checked)}
                    />
                  }
                  label="PhilHealth"
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
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-[#090367] font-bold text-white rounded px-4 py-2"
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
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
      </Modal>
    </div>
  );
};

export default Benefits;