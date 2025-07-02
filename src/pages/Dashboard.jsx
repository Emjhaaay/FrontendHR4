import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaUsers } from "react-icons/fa";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import RedeemIcon from "@mui/icons-material/Redeem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [shiftCounts, setShiftCounts] = useState({});
  const [leaveCounts, setLeaveCounts] = useState({});
  const [overtimeData, setOvertimeData] = useState({
    labels: [],
    data: [],
    approvedCount: 0,
    pendingCount: 0,
  });
  const [predictedOvertimeData, setPredictedOvertimeData] = useState({
    labels: [],
    data: [],
  });
  const [predictedSalaryData, setPredictedSalaryData] = useState({
    labels: [],
    data: [],
  });
  const [benefitsData, setBenefitsData] = useState({
    labels: [
      "SSS, Pag-Ibig, Philhealth",
      "Hazard Pay",
      "Holiday Incentives",
      "Paid Leave",
      "13th Month",
      "Retirement",
    ],
    counts: [0, 0, 0, 0, 0, 0],
  });

  const [eligibleCount, setEligibleCount] = useState(0);
  const [notEligibleCount, setNotEligibleCount] = useState(0);
  const [eligibleEmployees, setEligibleEmployees] = useState([]);
  const [regularEmployeeCount, setRegularEmployeeCount] = useState(0);
  const [contractualEmployeeCount, setContractualEmployeeCount] = useState(0);

  useEffect(() => {
    const fetchShiftCounts = async () => {
      try {
        const response = await fetch("https://newbackendhr4.vercel.app/shifts");
        const data = await response.json();
        const counts = data.reduce((acc, shift) => {
          const { shiftType } = shift;
          acc[shiftType] = (acc[shiftType] || 0) + 1;
          return acc;
        }, {});
        setShiftCounts(counts);
      } catch (error) {
        console.error("Error fetching shift counts:", error);
      }
    };

    const fetchLeaveCounts = async () => {
      try {
        const response = await fetch("http://localhost:8059/leaves");
        const data = await response.json();
        const counts = data.reduce((acc, leave) => {
          const { status } = leave;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        setLeaveCounts(counts);
      } catch (error) {
        console.error("Error fetching leave counts:", error);
      }
    };

    const fetchOvertimeData = async () => {
      try {
        const response = await fetch("https://newbackendhr4.vercel.app/overtimes");
        const data = await response.json();

        const sortedData = data
          .sort((a, b) => b.overtimeHours - a.overtimeHours)
          .slice(0, 4);

        const labels = sortedData.map((item) => item.name);
        const overtimeHours = sortedData.map((item) => item.overtimeHours);

        // Calculate approved and pending counts
        const approvedCount = data.filter((emp) => emp.approved).length;
        const pendingCount = data.filter((emp) => !emp.approved).length;

        setOvertimeData({
          labels,
          data: sortedData,
          approvedCount,
          pendingCount,
        });
      } catch (error) {
        console.error("Error fetching overtime data:", error);
      }
    };

    const fetchPredictedOvertimeData = async () => {
      try {
        const response = await fetch("https://newbackendhr4.vercel.app/overtimes");
        const data = await response.json();
        const sortedData = data
          .sort((a, b) => b.overtimeHours - a.overtimeHours)
          .slice(0, 4);

        const labels = sortedData.map((item) => item.name);
        const predictedOvertimeHours = sortedData.map((item) =>
          Math.round(item.overtimeHours * 1.1)
        );

        setPredictedOvertimeData({
          labels,
          data: predictedOvertimeHours,
        });
      } catch (error) {
        console.error("Error fetching predicted overtime data:", error);
      }
    };

    const fetchPredictedSalaryData = async () => {
      try {
        const response = await fetch("https://newbackendhr4.vercel.app/overtimes");
        const data = await response.json();
        const sortedData = data
          .sort((a, b) => b.totalSalary - a.totalSalary)
          .slice(0, 4);

        const labels = sortedData.map((item) => item.name);
        const predictedSalaries = sortedData.map(
          (item) => item.totalSalary * 1.05
        );

        setPredictedSalaryData({
          labels,
          data: predictedSalaries,
        });
      } catch (error) {
        console.error("Error fetching predicted salary data:", error);
      }
    };

    const fetchBenefitsData = async () => {
      try {
        const response = await fetch("https://newbackendhr4.vercel.app/benefits");
        const data = await response.json();

        const counts = [
          data.reduce((acc, benefit) => acc + benefit.sss, 0),
          data.reduce((acc, benefit) => acc + benefit.hazardPay, 0),
          data.reduce((acc, benefit) => acc + benefit.holidayIncentives, 0),
          data.reduce((acc, benefit) => acc + benefit.leave, 0),
          data.reduce((acc, benefit) => acc + benefit.thirteenthMonth, 0),
          data.reduce((acc, benefit) => acc + benefit.retirement, 0),
        ];

        // Count employee types from benefits data
        const regularCount = data.filter(
          (emp) => emp.employeeType === "Regular Employee"
        ).length;
        const contractualCount = data.filter(
          (emp) => emp.employeeType === "Contractual Employee"
        ).length;
        setRegularEmployeeCount(regularCount);
        setContractualEmployeeCount(contractualCount);

        setBenefitsData((prevState) => ({
          ...prevState,
          counts: counts,
        }));
      } catch (error) {
        console.error("Error fetching benefits data:", error);
      }
    };

    const fetchIncentivesData = async () => {
      try {
        const response = await fetch("https://newbackendhr4.vercel.app/incentives");
        const data = await response.json();

        const eligibleEmployeesList = data.filter(
          (emp) => emp.attendance >= 15
        );
        setEligibleEmployees(eligibleEmployeesList);
        setEligibleCount(eligibleEmployeesList.length);
        setNotEligibleCount(data.length - eligibleEmployeesList.length);
      } catch (error) {
        console.error("Error fetching incentives data:", error);
      }
    };

    fetchShiftCounts();
    fetchLeaveCounts();
    fetchOvertimeData();
    fetchPredictedOvertimeData();
    fetchPredictedSalaryData();
    fetchBenefitsData();
    fetchIncentivesData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getShiftIcon = (shiftType) => {
    switch (shiftType) {
      case "Regular Shift":
        return <AccessTimeIcon className="text-blue-600" fontSize="medium" />;
      case "Graveyard Shift":
        return <NightlightIcon className="text-indigo-700" fontSize="medium" />;
      case "Weekend Shift":
        return <WbSunnyIcon className="text-yellow-600" fontSize="medium" />;
      case "Holiday Shift":
        return <FlagIcon className="text-red-600" fontSize="medium" />;
      default:
        return <AccessTimeIcon className="text-gray-600" fontSize="medium" />;
    }
  };

  return (
    <div className="bg-[#F0F0F0] p-4 md:p-6 min-h-screen">
      {/* Header Card */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive overview of workforce analytics
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employee Type Card */}
        {/* Employee Type Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <FaUsers className="text-blue-600 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Employee Metrics
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Regular Employees Metric */}
            <motion.div
              className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col items-center"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-gray-600 text-sm font-medium mb-1">
                Regular Employees
              </span>
              <span className="text-3xl font-bold text-blue-800">
                {regularEmployeeCount}
              </span>
            </motion.div>

            {/* Contractual Employees Metric */}
            <motion.div
              className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex flex-col items-center"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-gray-600 text-sm font-medium mb-1">
                Contractual Employees
              </span>
              <span className="text-3xl font-bold text-purple-800">
                {contractualEmployeeCount}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Overtime Approval Summary Cards */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <AccessTimeIcon className="text-blue-600 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Overtime Approvals
            </h3>
          </div>

          <div className="space-y-3">
            {/* Approved Overtime Card */}
            <motion.div
              className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <CheckCircleIcon
                    className="text-green-600"
                    fontSize="small"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Approved</h4>
                  <p className="text-xs text-gray-500">By Supervisor</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {overtimeData.approvedCount}
              </span>
            </motion.div>

            {/* Pending Overtime Card */}
            <motion.div
              className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center justify-between"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-full mr-3">
                  <HourglassEmptyIcon
                    className="text-yellow-600"
                    fontSize="small"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Pending</h4>
                  <p className="text-xs text-gray-500">Approval</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {overtimeData.pendingCount}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Incentives Eligibility Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <RedeemIcon className="text-blue-600 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Incentives Eligibility
            </h3>
          </div>

          <div className="space-y-3">
            <motion.div
              className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center justify-between"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <CheckCircleIcon
                    className="text-green-600"
                    fontSize="small"
                  />
                </div>
                <span className="font-medium text-gray-700">Eligible</span>
              </div>
              <span className="px-3 py-1  text-green-800  text-xl font-bold">
                {eligibleCount}
              </span>
            </motion.div>

            <motion.div
              className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-center justify-between"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <HourglassEmptyIcon
                    className="text-red-600"
                    fontSize="small"
                  />
                </div>
                <span className="font-medium text-gray-700">Not Eligible</span>
              </div>
              <span className="px-3 py-1  text-red-800 text-xl font-bold">
                {notEligibleCount}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Shift Counts Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <AvTimerIcon className="text-purple-600 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Shift Distribution
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(shiftCounts).map(([shiftType, count]) => (
              <motion.div
                key={shiftType}
                className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between"
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-white rounded-full mr-3 shadow-sm">
                    {getShiftIcon(shiftType)}
                  </div>
                  <span className="font-medium text-gray-700">{shiftType}</span>
                </div>
                <span className="px-3 py-1 bg-white rounded-full font-semibold text-xl shadow-sm">
                  {count}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 md:col-span-2 lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <MedicalServicesOutlinedIcon className="text-green-600 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Benefits Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefitsData.labels.map((label, index) => (
              <motion.div
                key={label}
                className={`p-3 rounded-lg border ${
                  index % 2 === 0
                    ? "bg-blue-50 border-blue-100"
                    : "bg-indigo-50 border-indigo-100"
                } flex items-center justify-between`}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="font-medium text-gray-700 text-sm">
                  {label}
                </span>
                <span className="px-2 py-1 bg-white rounded-full font-semibold text-xl shadow-sm">
                  {benefitsData.counts[index]}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leave Requests Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <CalendarMonthIcon className="text-yellow-600 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Leave Requests
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(leaveCounts).map(([status, count]) => (
              <motion.div
                key={status}
                className={`p-3 rounded-lg border ${getStatusColor(
                  status
                )} flex items-center justify-between`}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center">
                  <div className="p-2  rounded-full mr-3 shadow-sm">
                    {status === "Approved" && (
                      <CheckCircleIcon
                        className="text-green-600 bg-green-100"
                        fontSize="small"
                      />
                    )}
                    {status === "Pending" && (
                      <HourglassEmptyIcon
                        className="text-yellow-600 bg-yellow-100"
                        fontSize="small"
                      />
                    )}
                    {status === "Rejected" && (
                      <HourglassEmptyIcon
                        className="text-red-600"
                        fontSize="small"
                      />
                    )}
                  </div>
                  <span className="font-medium">{status}</span>
                </div>
                <span className="px-3 py-1  font-semibold text-xl shadow-sm">
                  {count}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
        <p>
          &copy; {new Date().getFullYear()} Nodado General Hospital. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
