-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-03-2026 a las 18:17:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `mooc_db`;
CREATE DATABASE `mooc_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mooc_db`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `categories`
--
CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Programming'),
(2, 'Databases'),
(3, 'Cloud'),
(4, 'Data Science'),
(5, 'DevOps');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `plans`
--
CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` decimal(6,2) DEFAULT 0.00,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plans`
--
INSERT INTO `plans` (`id`, `name`, `price`, `description`) VALUES
(1, 'Free', 0.00, 'Access to introductory courses and core platform features.'),
(2, 'Pro', 12.99, 'Access to a wider catalog, intermediate content and advanced features.'),
(3, 'Premium', 24.99, 'Full access to the complete catalog and premium learning features.');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `tags`
--
CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tags`
--
INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'Python'),
(2, 'Java'),
(3, 'Angular'),
(4, 'React'),
(5, 'SQL'),
(6, 'MySQL'),
(7, 'PostgreSQL'),
(8, 'MongoDB'),
(9, 'AWS'),
(10, 'Azure'),
(11, 'Docker'),
(12, 'Kubernetes'),
(13, 'Git'),
(14, 'GitHub'),
(15, 'CI/CD'),
(16, 'Linux'),
(17, 'Power BI'),
(18, 'Machine Learning'),
(19, 'Pandas'),
(20, 'NumPy'),
(21, 'TypeScript'),
(22, 'OOP'),
(23, 'REST API'),
(24, 'Data Analysis');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `users`
--
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student') DEFAULT 'student',
  `client_type` enum('student','professional','company') DEFAULT 'student',
  `plan_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `client_type`, `plan_id`, `created_at`) VALUES
(1, 'Alejandro Martin', 'alejandro.martin@moocdemo.com', '$2b$10$A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6', 'admin', 'professional', 3, '2026-03-08 16:21:07'),
(2, 'Lucia Fernandez', 'lucia.fernandez@moocdemo.com', '$2b$10$B1c2D3e4F5g6H7i8J9k0L1m2N3o4P5q6R7s8T9u0V1w2X3y4Z5a6', 'admin', 'student', 3, '2026-03-08 16:21:07'),
(3, 'Sofia Herrera', 'sofia.herrera@moocdemo.com', '$2b$10$C1d2E3f4G5h6I7j8K9l0M1n2O3p4Q5r6S7t8U9v0W1x2Y3z4A5b6', 'admin', 'company', 3, '2026-03-08 16:21:07'),
(4, 'Mateo Rodriguez', 'mateo.rodriguez@moocdemo.com', '$2b$10$D1e2F3g4H5i6J7k8L9m0N1o2P3q4R5s6T7u8V9w0X1y2Z3a4B5c6', 'student', 'student', 1, '2026-03-08 16:21:07'),
(5, 'Valentina Quispe', 'valentina.quispe@moocdemo.com', '$2b$10$E1f2G3h4I5j6K7l8M9n0O1p2Q3r4S5t6U7v8W9x0Y1z2A3b4C5d6', 'student', 'professional', 2, '2026-03-08 16:21:07'),
(6, 'Youssef Benali', 'youssef.benali@moocdemo.com', '$2b$10$F1g2H3i4J5k6L7m8N9o0P1q2R3s4T5u6V7w8X9y0Z1a2B3c4D5e6', 'student', 'company', 3, '2026-03-08 16:21:07');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `courses`
--
CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `short_description` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `required_plan_id` int(11) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `duration_hours` int(11) DEFAULT 0,
  `lessons_count` int(11) DEFAULT 0,
  `instructor_name` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `courses`
--
INSERT INTO `courses`
(`id`, `title`, `slug`, `short_description`, `description`, `level`, `category_id`, `required_plan_id`, `cover_image`, `duration_hours`, `lessons_count`, `instructor_name`, `created_at`) VALUES
(1, 'Python Fundamentals', 'python-fundamentals', 'Learn Python from scratch and build a solid programming foundation.', 'This course introduces Python programming through practical examples and core programming concepts. You will learn variables, conditionals, loops, functions and clean problem-solving practices.', 'beginner', 1, 1, 'assets/images/courses/python.png', 18, 42, 'Laura Bennett', '2026-03-08 16:21:07'),
(2, 'Java OOP Essentials', 'java-oop-essentials', 'Master object-oriented programming concepts with Java.', 'This course focuses on classes, objects, inheritance, encapsulation and polymorphism using Java. It is designed to help learners understand how to structure maintainable applications.', 'beginner', 1, 1, 'assets/images/courses/java.png', 20, 46, 'Daniel Carter', '2026-03-08 16:21:07'),
(3, 'Angular from Scratch', 'angular-from-scratch', 'Build modern frontend applications with Angular.', 'This course covers Angular components, templates, routing, services and state organization. It is ideal for learners who want to create scalable frontend applications.', 'intermediate', 1, 2, 'assets/images/courses/angular.png', 22, 50, 'Sophie Turner', '2026-03-08 16:21:07'),
(4, 'React Fundamentals', 'react-fundamentals', 'Create dynamic user interfaces with React.', 'This course introduces component-based architecture, hooks, props, state and frontend best practices with React.', 'intermediate', 1, 3, 'assets/images/courses/react.png', 21, 48, 'Michael Reed', '2026-03-08 16:21:07'),

(5, 'SQL Fundamentals', 'sql-fundamentals', 'Understand relational databases and write effective SQL queries.', 'This course teaches the fundamentals of relational databases, querying, filtering, grouping and joining data with SQL.', 'beginner', 2, 1, 'assets/images/courses/sql.png', 16, 36, 'Emma Brooks', '2026-03-08 16:21:07'),
(6, 'MySQL Database Design', 'mysql-database-design', 'Design structured databases with MySQL.', 'This course covers relational design, normalization, constraints and practical data modeling using MySQL.', 'beginner', 2, 1, 'assets/images/courses/mysql.png', 17, 38, 'Chris Palmer', '2026-03-08 16:21:07'),
(7, 'PostgreSQL Essentials', 'postgresql-essentials', 'Learn PostgreSQL for robust and scalable database development.', 'This course introduces PostgreSQL fundamentals, advanced querying, indexes and real-world database workflows.', 'intermediate', 2, 2, 'assets/images/courses/postgresql.png', 19, 41, 'Natalie Stone', '2026-03-08 16:21:07'),
(8, 'MongoDB Basics', 'mongodb-basics', 'Get started with document databases using MongoDB.', 'This course explores NoSQL concepts, collections, documents, querying and application-oriented modeling with MongoDB.', 'intermediate', 2, 3, 'assets/images/courses/mongodb.png', 18, 39, 'Ryan Cooper', '2026-03-08 16:21:07'),

(9, 'AWS Cloud Foundations', 'aws-cloud-foundations', 'Understand the core concepts of cloud computing with AWS.', 'This course presents cloud fundamentals, AWS core services, pricing basics and deployment concepts for beginners.', 'beginner', 3, 1, 'assets/images/courses/aws.png', 15, 34, 'Olivia Harper', '2026-03-08 16:21:07'),
(10, 'Azure for Beginners', 'azure-for-beginners', 'Start your cloud journey with Microsoft Azure.', 'This course introduces Azure services, cloud architecture basics and common deployment scenarios for new learners.', 'beginner', 3, 1, 'assets/images/courses/azure.png', 15, 33, 'Jacob Evans', '2026-03-08 16:21:07'),
(11, 'Docker Deployment Basics', 'docker-deployment-basics', 'Containerize and deploy applications with Docker.', 'This course teaches Docker images, containers, compose workflows and deployment-oriented practices.', 'intermediate', 3, 2, 'assets/images/courses/docker.png', 18, 40, 'Ethan Moore', '2026-03-08 16:21:07'),
(12, 'Kubernetes Essentials', 'kubernetes-essentials', 'Learn orchestration basics with Kubernetes.', 'This course introduces pods, deployments, services, scaling and cluster-oriented application management.', 'advanced', 3, 3, 'assets/images/courses/kubernetes.png', 22, 47, 'Amelia Ross', '2026-03-08 16:21:07'),

(13, 'Python for Data Analysis', 'python-for-data-analysis', 'Use Python to clean, process and analyze data.', 'This course focuses on practical data workflows with Python for exploration, cleaning and transformation.', 'beginner', 4, 1, 'assets/images/courses/python-data-analysis.png', 18, 42, 'Isabella Ward', '2026-03-08 16:21:07'),
(14, 'Pandas and NumPy Essentials', 'pandas-and-numpy-essentials', 'Work efficiently with tabular and numerical data.', 'This course teaches the foundations of data manipulation with Pandas and numerical computing with NumPy.', 'beginner', 4, 1, 'assets/images/courses/pandas-numpy.png', 17, 39, 'Noah Hayes', '2026-03-08 16:21:07'),
(15, 'Machine Learning Basics', 'machine-learning-basics', 'Discover core machine learning concepts and workflows.', 'This course introduces supervised learning, model evaluation and practical ML concepts for beginners.', 'intermediate', 4, 2, 'assets/images/courses/machine-learning.png', 20, 44, 'Grace Mitchell', '2026-03-08 16:21:07'),
(16, 'Power BI for Data Visualization', 'power-bi-for-data-visualization', 'Build clear and interactive dashboards with Power BI.', 'This course teaches data visualization, dashboard design and reporting practices with Power BI.', 'intermediate', 4, 3, 'assets/images/courses/powerbi.png', 16, 35, 'Lucas Perry', '2026-03-08 16:21:07'),

(17, 'Git and GitHub Workflow', 'git-and-github-workflow', 'Learn version control and collaboration with Git and GitHub.', 'This course covers commits, branches, pull requests and collaborative workflows using Git and GitHub.', 'beginner', 5, 1, 'assets/images/courses/github.png', 14, 31, 'Mia Foster', '2026-03-08 16:21:07'),
(18, 'Linux for Deployment', 'linux-for-deployment', 'Understand the Linux basics needed for deployment environments.', 'This course introduces terminal usage, file permissions, common commands and server-oriented Linux fundamentals.', 'beginner', 5, 1, 'assets/images/courses/linux.png', 15, 34, 'Henry Simmons', '2026-03-08 16:21:07'),
(19, 'CI/CD Essentials', 'cicd-essentials', 'Automate software delivery with CI/CD pipelines.', 'This course explains continuous integration, continuous delivery, pipeline design and deployment automation concepts.', 'intermediate', 5, 2, 'assets/images/courses/cicd.png', 18, 38, 'Chloe Murphy', '2026-03-08 16:21:07'),
(20, 'Docker for DevOps', 'docker-for-devops', 'Use Docker in modern DevOps workflows.', 'This course applies containerization concepts specifically to DevOps practices, automation and environment consistency.', 'intermediate', 5, 3, 'assets/images/courses/docker-devops.png', 19, 41, 'Liam Parker', '2026-03-08 16:21:07');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `course_outcomes`
--
CREATE TABLE `course_outcomes` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `outcome_text` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `course_outcomes`
--
INSERT INTO `course_outcomes` (`id`, `course_id`, `outcome_text`, `display_order`) VALUES
(1, 1, 'Write basic Python programs using variables, loops and functions.', 1),
(2, 1, 'Understand core programming logic and syntax.', 2),
(3, 1, 'Solve beginner-friendly coding exercises.', 3),
(4, 1, 'Build confidence to continue into more advanced Python topics.', 4),

(5, 2, 'Understand the principles of object-oriented programming.', 1),
(6, 2, 'Create Java classes and objects correctly.', 2),
(7, 2, 'Apply inheritance and polymorphism in simple projects.', 3),
(8, 2, 'Structure Java code in a more maintainable way.', 4),

(9, 3, 'Build Angular applications using components and templates.', 1),
(10, 3, 'Configure routing and navigation flows.', 2),
(11, 3, 'Use services to organize application logic.', 3),
(12, 3, 'Create scalable frontend project structures.', 4),

(13, 4, 'Understand component-based development with React.', 1),
(14, 4, 'Manage state and props effectively.', 2),
(15, 4, 'Work with hooks in practical examples.', 3),
(16, 4, 'Build modern frontend interfaces with reusable components.', 4),

(17, 5, 'Write SQL queries to retrieve filtered data.', 1),
(18, 5, 'Use joins, grouping and aggregation correctly.', 2),
(19, 5, 'Understand relational database concepts.', 3),
(20, 5, 'Work with practical SQL exercises and datasets.', 4),

(21, 6, 'Design structured relational schemas in MySQL.', 1),
(22, 6, 'Apply normalization principles correctly.', 2),
(23, 6, 'Use primary and foreign keys effectively.', 3),
(24, 6, 'Model databases for real application scenarios.', 4),

(25, 7, 'Understand PostgreSQL core features and workflows.', 1),
(26, 7, 'Write more advanced PostgreSQL queries.', 2),
(27, 7, 'Use indexes and optimization basics.', 3),
(28, 7, 'Build more robust data solutions with PostgreSQL.', 4),

(29, 8, 'Understand the basics of NoSQL databases.', 1),
(30, 8, 'Work with collections and documents in MongoDB.', 2),
(31, 8, 'Query document-based data effectively.', 3),
(32, 8, 'Choose MongoDB appropriately for application scenarios.', 4),

(33, 9, 'Understand the main concepts behind cloud computing.', 1),
(34, 9, 'Identify key AWS services and their purpose.', 2),
(35, 9, 'Understand the basics of AWS architecture.', 3),
(36, 9, 'Build confidence for further cloud learning paths.', 4),

(37, 10, 'Get familiar with Microsoft Azure core services.', 1),
(38, 10, 'Understand basic cloud deployment ideas.', 2),
(39, 10, 'Explore Azure from a beginner-friendly perspective.', 3),
(40, 10, 'Develop a foundation for more advanced Azure learning.', 4),

(41, 11, 'Create and manage Docker images and containers.', 1),
(42, 11, 'Use Docker Compose in local workflows.', 2),
(43, 11, 'Prepare applications for container-based deployment.', 3),
(44, 11, 'Understand the role of Docker in cloud workflows.', 4),

(45, 12, 'Understand the role of Kubernetes in orchestration.', 1),
(46, 12, 'Work with pods, deployments and services.', 2),
(47, 12, 'Understand scaling and cluster basics.', 3),
(48, 12, 'Deploy containerized apps in a more advanced environment.', 4),

(49, 13, 'Use Python to inspect and transform datasets.', 1),
(50, 13, 'Clean and prepare data for analysis.', 2),
(51, 13, 'Apply practical exploratory data analysis steps.', 3),
(52, 13, 'Build a strong base for analytics workflows.', 4),

(53, 14, 'Manipulate structured data with Pandas.', 1),
(54, 14, 'Use NumPy for numerical operations.', 2),
(55, 14, 'Combine tabular and numerical workflows effectively.', 3),
(56, 14, 'Prepare datasets for later analysis or modeling.', 4),

(57, 15, 'Understand the foundations of machine learning.', 1),
(58, 15, 'Differentiate supervised learning concepts.', 2),
(59, 15, 'Evaluate simple models with basic metrics.', 3),
(60, 15, 'Recognize common ML workflows and terminology.', 4),

(61, 16, 'Create reports and dashboards with Power BI.', 1),
(62, 16, 'Visualize business and analytical data clearly.', 2),
(63, 16, 'Build interactive visual reporting experiences.', 3),
(64, 16, 'Communicate insights through well-structured dashboards.', 4),

(65, 17, 'Use Git for version control in real projects.', 1),
(66, 17, 'Work with repositories, branches and merges.', 2),
(67, 17, 'Understand pull request workflows on GitHub.', 3),
(68, 17, 'Collaborate more effectively in software teams.', 4),

(69, 18, 'Navigate Linux systems using the terminal.', 1),
(70, 18, 'Understand common deployment-related commands.', 2),
(71, 18, 'Manage files, permissions and basic processes.', 3),
(72, 18, 'Build confidence in Linux-based deployment environments.', 4),

(73, 19, 'Understand CI/CD principles and pipeline stages.', 1),
(74, 19, 'Identify how automation improves software delivery.', 2),
(75, 19, 'Design basic integration and deployment workflows.', 3),
(76, 19, 'Connect DevOps practices with modern delivery pipelines.', 4),

(77, 20, 'Use Docker as part of DevOps workflows.', 1),
(78, 20, 'Improve consistency across development environments.', 2),
(79, 20, 'Understand container-based automation practices.', 3),
(80, 20, 'Apply Docker concepts to modern delivery pipelines.', 4);

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `course_tags`
--
CREATE TABLE `course_tags` (
  `course_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `course_tags`
--
INSERT INTO `course_tags` (`course_id`, `tag_id`) VALUES
(1, 1), (1, 22),
(2, 2), (2, 22),
(3, 3), (3, 21), (3, 23),
(4, 4), (4, 21),

(5, 5),
(6, 6), (6, 5),
(7, 7), (7, 5),
(8, 8),

(9, 9),
(10, 10),
(11, 11),
(12, 12), (12, 11),

(13, 1), (13, 24),
(14, 19), (14, 20), (14, 24),
(15, 18), (15, 1),
(16, 17), (16, 24),

(17, 13), (17, 14),
(18, 16),
(19, 15),
(20, 11), (20, 15);

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `user_interests`
--
CREATE TABLE `user_interests` (
  `user_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_interests`
--
INSERT INTO `user_interests` (`user_id`, `tag_id`) VALUES
(4, 2),
(4, 3),
(4, 13),
(5, 1),
(5, 5),
(5, 18),
(6, 9),
(6, 11),
(6, 15),
(6, 16);

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `enrollments`
--
CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `enrollments`
--
INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `progress`, `enrolled_at`) VALUES
(1, 4, 1, 35, '2026-03-08 16:21:07'),
(2, 4, 3, 60, '2026-03-08 16:21:07'),
(3, 4, 17, 20, '2026-03-08 16:21:07'),
(4, 5, 5, 80, '2026-03-08 16:21:07'),
(5, 5, 13, 45, '2026-03-08 16:21:07'),
(6, 5, 14, 15, '2026-03-08 16:21:07'),
(7, 5, 15, 10, '2026-03-08 16:21:07'),
(8, 6, 11, 50, '2026-03-08 16:21:07'),
(9, 6, 9, 30, '2026-03-08 16:21:07'),
(10, 6, 20, 70, '2026-03-08 16:21:07'),
(11, 6, 19, 25, '2026-03-08 16:21:07');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indices de la tabla `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `required_plan_id` (`required_plan_id`);

--
-- Indices de la tabla `course_outcomes`
--
ALTER TABLE `course_outcomes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indices de la tabla `course_tags`
--
ALTER TABLE `course_tags`
  ADD PRIMARY KEY (`course_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indices de la tabla `user_interests`
--
ALTER TABLE `user_interests`
  ADD PRIMARY KEY (`user_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indices de la tabla `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

ALTER TABLE `course_outcomes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`);

ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`required_plan_id`) REFERENCES `plans` (`id`);

ALTER TABLE `course_outcomes`
  ADD CONSTRAINT `course_outcomes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

ALTER TABLE `course_tags`
  ADD CONSTRAINT `course_tags_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

ALTER TABLE `user_interests`
  ADD CONSTRAINT `user_interests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_interests_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;