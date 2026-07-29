-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 29, 2026 at 02:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eyra`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'Admin', 'Admin@Eyra', '2026-04-29 12:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `id` int(11) NOT NULL,
  `name` varchar(300) DEFAULT NULL,
  `email` varchar(300) DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `preferred_date` varchar(255) DEFAULT NULL,
  `prefer_time` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `doctor_id` int(11) DEFAULT NULL,
  `issue` text DEFAULT NULL,
  `admin_response` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(300) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `admin_reply` text DEFAULT NULL,
  `reply_status` varchar(50) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `speciality` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `doctor_image` text DEFAULT NULL,
  `doctor_status` varchar(50) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `doctor_signature` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `doctor_name`, `speciality`, `experience`, `qualification`, `description`, `doctor_image`, `doctor_status`, `created_at`, `email`, `password`, `doctor_signature`) VALUES
(1, 'Priya Mehta', 'Ophthalmologist', '9 Years', 'MBBS, MS Ophthalmology', 'Experienced ophthalmologist specializing in comprehensive eye examinations, vision correction, and the diagnosis and treatment of common eye conditions.', '1785314472900.png', 'active', '2026-07-29 08:29:44', 'priya.mehta@gmail.com', '$2b$10$I9GkfpgfMIh4/CSh/JeR.eo.ndcCjMchKAQ1sgTqYfVHXv2AYW802', '1785313784248.png'),
(2, 'Rajesh Sharma', 'Cataract Specialist', '12 Years ', 'MBBS, MS Ophthalmology', 'Experienced cataract specialist with expertise in cataract diagnosis, modern surgical procedures, and post-operative eye care.', '1785314078063.png', 'active', '2026-07-29 08:34:38', 'rajesh.sharma@gmail.com', '$2b$10$PIgl0R4//vu5eUS1osgLq.gq30GlLZ/wqInJj7ZEFrfsrDz4w1K4G', '1785314078064.png'),
(3, 'Ananya Kapoor', 'Retina Specialist', '8 Years', 'MBBS, DNB Ophthalmology', 'Retina specialist focused on the diagnosis and treatment of retinal disorders, diabetic retinopathy, and age-related eye conditions.', '1785314215370.png', 'active', '2026-07-29 08:36:55', 'Ananya.kapoor@gmail.com', '$2b$10$AYG5V6EC4X3xJYiAdCPb0.0/kh4pHs9LC8CNVECd0v9wM77/nDbdC', '1785314215371.png'),
(4, 'Vikram Singh', 'Glaucoma Specialist', '11 Years', 'MBBS, MS Ophthalmology', 'Glaucoma specialist experienced in early diagnosis, pressure management, and long-term treatment of glaucoma.', '1785314602784.jpg', 'active', '2026-07-29 08:38:39', 'vikram.singh@gmail.com', '$2b$10$W.th93QKjWPRNSPJ.jOxWeQOopjLwLF1KFoul9yfaQOg/RfjgAZla', '1785314319271.png');

-- --------------------------------------------------------

--
-- Table structure for table `eye_donation`
--

CREATE TABLE `eye_donation` (
  `id` int(11) NOT NULL,
  `donor_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `age` int(11) NOT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `address` text NOT NULL,
  `emergency_contact` varchar(20) DEFAULT NULL,
  `consent` enum('yes','no') DEFAULT 'yes',
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `title` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  `publish_by` varchar(255) DEFAULT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient_notifications`
--

CREATE TABLE `patient_notifications` (
  `id` int(11) NOT NULL,
  `patient_email` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `is_read` enum('yes','no') DEFAULT 'no',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archive_status` enum('active','archived') DEFAULT 'active',
  `action_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `patient_email` varchar(100) DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `medicines` text DEFAULT NULL,
  `advice` text DEFAULT NULL,
  `next_visit_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(400) NOT NULL,
  `password` varchar(300) NOT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `address` varchar(300) DEFAULT NULL,
  `ayushmaan_card` text DEFAULT NULL,
  `dis_history` text DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `reg_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profile_complete` varchar(255) DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `mobile`, `gender`, `address`, `ayushmaan_card`, `dis_history`, `photo`, `reg_date`, `profile_complete`) VALUES
(1, 'Aarav Gupta', 'aarav.gupta@gmail.com', '$2b$10$sFHdGjh3gQnuHrD5I3UTG.k6Q1JRwyrcJtsdXoQVbDDuQejTD0u/a', '9876501001', 'male', 'Sector 22, Chandigarh', 'AYUSH-10001', 'No major medical history', '1785315456294.png', '2026-07-29 08:57:36', 'yes'),
(2, 'Rohan Malhotra', 'rohan.malhotra@gmail.com', '$2b$10$OW1fSF1zmppYZe7vPfv1Je1PgnclyvUWkHn6lKj7huCmtlu75eUWi', '9876501003', 'male', 'Sector 15, Panchkula', 'AYUSH-10003', 'Uses corrective glasses', '1785315696588.png', '2026-07-29 09:01:36', 'yes'),
(3, 'Aditya Verma', 'aditya.verma@gmail.com', '$2b$10$CsjupKu763nMRF1pvGuhx.4BKWnD/bziCg4Z3r1vwk1J0c/ciHrXu', '9876501005', 'male', 'Zirakpur, Punjab', 'AYUSH-10005', 'AYUSH-10005', '1785315893065.png', '2026-07-29 09:04:53', 'yes'),
(4, 'Simran Kaur', 'simran.kaur@gmail.com', '$2b$10$hdeQD8LpI.8td/8zYuwOyO9UkZ4hnEJO3H4COZHlr8g6ZvDivUZI6', '9876501002', 'female', 'Phase 7, Mohali', 'AYUSH-10002', 'Allergic eye irritation', '1785317353789.png', '2026-07-29 09:29:13', 'yes'),
(5, 'Kavya Sharma', 'kavya.sharma@gmail.com', '$2b$10$pmlrk1S5QsJBelwIUvgfb.9nhWkTibmJSnXtOxJ3PZBZI7eek5m76', '9876501004', 'female', 'Sector 34, Chandigarh', 'AYUSH-10004', 'Dry-eye symptoms', '1785317398917.png', '2026-07-29 09:29:58', 'yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eye_donation`
--
ALTER TABLE `eye_donation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient_notifications`
--
ALTER TABLE `patient_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescription`
--
ALTER TABLE `prescription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `mobile` (`mobile`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `eye_donation`
--
ALTER TABLE `eye_donation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient_notifications`
--
ALTER TABLE `patient_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prescription`
--
ALTER TABLE `prescription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
