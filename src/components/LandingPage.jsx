import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Nodado from "../images/logo.png";
import backgroundImage from "../assets/bg.jpg";
import { motion } from "framer-motion";

// Navbar Component with improved styling
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white text-black sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={Nodado} alt="Nodado Logo" className="h-10 w-auto" />
          <div className="text-xl font-bold text-blue-900">
            Nodado General Hospital
          </div>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-blue-900 hover:text-blue-700 focus:outline-none transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <ul
          className={`md:flex md:items-center md:space-x-6 ${
            isOpen
              ? "block absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6"
              : "hidden"
          }`}
        >
          <li>
            <a
              href="#home"
              className="block py-2 px-4 text-blue-900 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="block py-2 px-4 text-blue-900 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#services"
              className="block py-2 px-4 text-blue-900 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="block py-2 px-4 text-blue-900 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const adminPanelVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      delay: 0.5,
    },
  },
};

// About Section Component
const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
            About Nodado General Hospital
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Committed to excellence in healthcare since 1985
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden shadow-xl"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Nodado Hospital Building"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-blue-900 bg-opacity-30 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">Our Facility</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-6">Our Story</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">??+</div>
                <div className="text-gray-600">Years of Service</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Healthcare Professionals</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Services Section Component
const ServicesSection = () => {
  const services = [
    {
      title: "Emergency Care",
      description:
        "24/7 emergency services with rapid response teams and state-of-the-art trauma center.",
      icon: "🚑",
    },
    {
      title: "Surgical Services",
      description:
        "Advanced surgical procedures including minimally invasive and robotic-assisted surgeries.",
      icon: "⚕️",
    },
    {
      title: "Maternity Care",
      description:
        "Comprehensive prenatal, delivery, and postnatal care in our modern maternity ward.",
      icon: "👶",
    },
    {
      title: "Cardiology",
      description:
        "Full range of cardiac services from diagnostics to interventional procedures.",
      icon: "❤️",
    },
    {
      title: "Oncology",
      description:
        "Multidisciplinary cancer care with cutting-edge treatment options.",
      icon: "🩺",
    },
    {
      title: "Pediatrics",
      description:
        "Specialized care for children of all ages in a child-friendly environment.",
      icon: "🧸",
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
            Our Services
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services for all your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-700">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-blue-50 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-blue-900 mb-4">
            And Many More Services
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We also offer specialized services in neurology, orthopedics,
            radiology, physical therapy, and many other areas of healthcare.
          </p>
          <Button
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium"
          >
            View All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

// LandingPage Component with enhanced styling
const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLoginRedirect = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Framer Motion */}
      <div
        id="home"
        className="relative flex-grow flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between py-16">
          {/* Left Content with animations */}
          <motion.div
            className="w-full lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="block text-blue-300 text-2xl sm:text-3xl mb-2">
                Welcome to
              </span>
              Nodado General Hospital
            </motion.h1>
            <motion.h2
              className="text-2xl sm:text-3xl font-semibold text-blue-200 mb-8"
              variants={itemVariants}
            >
              Employee's Compensation and Benefits
            </motion.h2>
            <motion.p
              className="text-lg text-gray-200 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Welcome to the HR portal for Compensation and Benefits. Here you
              can find all the information you need regarding your compensation,
              benefits, and more.
            </motion.p>
          </motion.div>

          {/* Right Admin Panel with animation */}
          <motion.div
            className="w-full lg:w-1/3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white border-opacity-20"
            variants={adminPanelVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Admin Panel
              </h2>
              <p className="text-gray-200 mb-8">
                Access the administrative dashboard to manage employee
                compensation and benefits.
              </p>
              <Button
                variant="contained"
                onClick={handleLoginRedirect}
                className="w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Admin Login"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* About Section */}
      <AboutSection />
      {/* Services Section */}
      <ServicesSection />
      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center mb-4">
                <img src={Nodado} alt="Nodado Logo" className="h-8 mr-3" />
                <h3 className="text-xl font-bold">Nodado General Hospital</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Providing quality healthcare services with compassion and
                excellence since 1985.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">
                Contact Us
              </h3>
              <address className="text-gray-400 not-italic space-y-3">
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Capt. Samano St. Area A, Brgy 175, Camarin, Caloocan
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  (123) 456-7890
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@nodadohospital.com
                </p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Nodado General Hospital. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
