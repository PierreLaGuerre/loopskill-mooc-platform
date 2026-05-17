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
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 999
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--
INSERT INTO `categories` (`id`, `name`, `description`, `display_order`) VALUES
(1, 'Programming', 'Build strong coding foundations with modern development skills.', 1),
(2, 'Databases', 'Learn to design, query and manage structured data efficiently.', 2),
(3, 'Cloud', 'Explore cloud platforms, deployment basics and scalable services.', 3),
(4, 'Data Science', 'Work with data, discover patterns and create useful analytical insights.', 4),
(5, 'DevOps', 'Understand automation, delivery workflows and infrastructure practices.', 5);

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
-- Estructura de tabla para la tabla `plan_features`
--
CREATE TABLE `plan_features` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `feature_text` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plan_features`
--
INSERT INTO `plan_features` (`id`, `plan_id`, `feature_text`, `display_order`) VALUES
(1, 1, 'Access to beginner courses', 1),
(2, 1, 'Personalized recommendations', 2),
(3, 1, 'Progress tracking', 3),
(4, 1, 'Learning dashboard', 4),

(5, 2, 'Everything in Free', 1),
(6, 2, 'Access to intermediate courses', 2),
(7, 2, 'Expanded course catalog', 3),
(8, 2, 'Priority access to new content', 4),
(9, 2, 'More advanced learning paths', 5),

(10, 3, 'Everything in Pro', 1),
(11, 3, 'Access to advanced courses', 2),
(12, 3, 'Full catalog access', 3),
(13, 3, 'Premium learning experience', 4),
(14, 3, 'Priority support', 5);

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
(21, 'Java Basics', 'java-basics', 'Start programming with Java syntax, variables, methods and control structures.', 'This course introduces Java from the beginning, focusing on syntax, variables, conditionals, loops, methods and simple console-based programs.', 'beginner', 1, 1, 'assets/images/courses/java.png', 16, 34, 'Nora Collins', '2026-03-08 16:21:07'),
(22, 'Advanced Java', 'advanced-java', 'Take Java further with collections, interfaces, exceptions and clean architecture.', 'This advanced Java course explores collections, interfaces, exceptions, generics and structured application design for more maintainable software.', 'advanced', 1, 3, 'assets/images/courses/java-advanced.png', 26, 58, 'Daniel Carter', '2026-03-08 16:21:07'),
(23, 'Advanced Python', 'advanced-python', 'Improve your Python skills with advanced functions, modules and application structure.', 'This course is designed for learners who already know Python basics and want to work with modules, file handling, errors, reusable functions and cleaner project organization.', 'advanced', 1, 3, 'assets/images/courses/python-advanced.png', 24, 54, 'Laura Bennett', '2026-03-08 16:21:07'),
(24, 'Angular Advanced Patterns', 'angular-advanced-patterns', 'Build more scalable Angular applications using advanced component and service patterns.', 'This course covers advanced Angular patterns, reusable components, state organization, route strategies and maintainable frontend architecture.', 'advanced', 1, 3, 'assets/images/courses/angular-advanced.png', 25, 56, 'Sophie Turner', '2026-03-08 16:21:07'),
(5, 'SQL Fundamentals', 'sql-fundamentals', 'Understand relational databases and write effective SQL queries.', 'This course teaches the fundamentals of relational databases, querying, filtering, grouping and joining data with SQL.', 'beginner', 2, 1, 'assets/images/courses/sql.png', 16, 36, 'Emma Brooks', '2026-03-08 16:21:07'),
(6, 'MySQL Database Design', 'mysql-database-design', 'Design structured databases with MySQL.', 'This course covers relational design, normalization, constraints and practical data modeling using MySQL.', 'beginner', 2, 1, 'assets/images/courses/mysql.png', 17, 38, 'Chris Palmer', '2026-03-08 16:21:07'),
(7, 'PostgreSQL Essentials', 'postgresql-essentials', 'Learn PostgreSQL for robust and scalable database development.', 'This course introduces PostgreSQL fundamentals, advanced querying, indexes and real-world database workflows.', 'intermediate', 2, 2, 'assets/images/courses/postgresql.png', 19, 41, 'Natalie Stone', '2026-03-08 16:21:07'),
(8, 'MongoDB Basics', 'mongodb-basics', 'Get started with document databases using MongoDB.', 'This course explores NoSQL concepts, collections, documents, querying and application-oriented modeling with MongoDB.', 'intermediate', 2, 3, 'assets/images/courses/mongodb.png', 18, 39, 'Ryan Cooper', '2026-03-08 16:21:07'),
(25, 'Advanced SQL Queries', 'advanced-sql-queries', 'Write complex SQL queries using subqueries, joins, grouping and analytical logic.', 'This course expands SQL knowledge with advanced joins, subqueries, grouping, filtering, set operations and query reasoning for realistic datasets.', 'advanced', 2, 3, 'assets/images/courses/sql-advanced.png', 24, 52, 'Emma Brooks', '2026-03-08 16:21:07'),
(26, 'Advanced MySQL', 'advanced-mysql', 'Go beyond basic MySQL with procedures, functions, indexes and optimization.', 'This course focuses on stored procedures, functions, indexing strategies, constraints and performance-aware database design using MySQL.', 'advanced', 2, 3, 'assets/images/courses/mysql-advanced.png', 25, 55, 'Chris Palmer', '2026-03-08 16:21:07'),
(27, 'PostgreSQL Advanced Features', 'postgresql-advanced-features', 'Use PostgreSQL advanced features for stronger data solutions.', 'This course explores PostgreSQL views, indexes, transactions, advanced data types and query optimization techniques.', 'advanced', 2, 3, 'assets/images/courses/postgresql-advanced.png', 23, 50, 'Natalie Stone', '2026-03-08 16:21:07'),
(28, 'MongoDB Aggregation and Performance', 'mongodb-aggregation-and-performance', 'Learn aggregation pipelines, indexing and performance practices in MongoDB.', 'This course teaches aggregation pipelines, schema design decisions, indexing and performance improvements for document databases.', 'advanced', 2, 3, 'assets/images/courses/mongodb-advanced.png', 22, 48, 'Ryan Cooper', '2026-03-08 16:21:07'),
(9, 'AWS Cloud Foundations', 'aws-cloud-foundations', 'Understand the core concepts of cloud computing with AWS.', 'This course presents cloud fundamentals, AWS core services, pricing basics and deployment concepts for beginners.', 'beginner', 3, 1, 'assets/images/courses/aws.png', 15, 34, 'Olivia Harper', '2026-03-08 16:21:07'),
(10, 'Azure for Beginners', 'azure-for-beginners', 'Start your cloud journey with Microsoft Azure.', 'This course introduces Azure services, cloud architecture basics and common deployment scenarios for new learners.', 'beginner', 3, 1, 'assets/images/courses/azure.png', 15, 33, 'Jacob Evans', '2026-03-08 16:21:07'),
(11, 'Docker Deployment Basics', 'docker-deployment-basics', 'Containerize and deploy applications with Docker.', 'This course teaches Docker images, containers, compose workflows and deployment-oriented practices.', 'intermediate', 3, 2, 'assets/images/courses/docker.png', 18, 40, 'Ethan Moore', '2026-03-08 16:21:07'),
(12, 'Kubernetes Essentials', 'kubernetes-essentials', 'Learn orchestration basics with Kubernetes.', 'This course introduces pods, deployments, services, scaling and cluster-oriented application management.', 'advanced', 3, 3, 'assets/images/courses/kubernetes.png', 22, 47, 'Amelia Ross', '2026-03-08 16:21:07'),
(29, 'AWS Advanced Architecture', 'aws-advanced-architecture', 'Design more resilient and scalable architectures on AWS.', 'This course covers advanced AWS architecture ideas, including availability, scalability, storage choices, networking and deployment strategies.', 'advanced', 3, 3, 'assets/images/courses/aws-advanced.png', 26, 58, 'Olivia Harper', '2026-03-08 16:21:07'),
(30, 'Azure Advanced Services', 'azure-advanced-services', 'Work with advanced Azure services for deployment and cloud architecture.', 'This course explores Azure compute, storage, networking, monitoring and application deployment services for more complete cloud solutions.', 'advanced', 3, 3, 'assets/images/courses/azure-advanced.png', 25, 54, 'Jacob Evans', '2026-03-08 16:21:07'),
(31, 'Docker Advanced', 'docker-advanced', 'Master advanced Docker workflows for production-oriented deployments.', 'This advanced Docker course explores multi-stage builds, networking, volumes, security, image optimization and deployment workflows.', 'advanced', 3, 3, 'assets/images/courses/docker-advanced.png', 23, 51, 'Ethan Moore', '2026-03-08 16:21:07'),
(32, 'Kubernetes Advanced Operations', 'kubernetes-advanced-operations', 'Operate Kubernetes workloads with scaling, configuration and monitoring strategies.', 'This course focuses on Kubernetes operations, workload management, configuration, scaling, monitoring and deployment reliability.', 'advanced', 3, 3, 'assets/images/courses/kubernetes-advanced.png', 27, 60, 'Amelia Ross', '2026-03-08 16:21:07'),
(13, 'Python for Data Analysis', 'python-for-data-analysis', 'Use Python to clean, process and analyze data.', 'This course focuses on practical data workflows with Python for exploration, cleaning and transformation.', 'beginner', 4, 1, 'assets/images/courses/python-data-analysis.png', 18, 42, 'Isabella Ward', '2026-03-08 16:21:07'),
(14, 'Pandas and NumPy Essentials', 'pandas-and-numpy-essentials', 'Work efficiently with tabular and numerical data.', 'This course teaches the foundations of data manipulation with Pandas and numerical computing with NumPy.', 'beginner', 4, 1, 'assets/images/courses/pandas-numpy.png', 17, 39, 'Noah Hayes', '2026-03-08 16:21:07'),
(15, 'Machine Learning Basics', 'machine-learning-basics', 'Discover core machine learning concepts and workflows.', 'This course introduces supervised learning, model evaluation and practical ML concepts for beginners.', 'intermediate', 4, 2, 'assets/images/courses/machine-learning.png', 20, 44, 'Grace Mitchell', '2026-03-08 16:21:07'),
(16, 'Power BI for Data Visualization', 'power-bi-for-data-visualization', 'Build clear and interactive dashboards with Power BI.', 'This course teaches data visualization, dashboard design and reporting practices with Power BI.', 'intermediate', 4, 3, 'assets/images/courses/powerbi.png', 16, 35, 'Lucas Perry', '2026-03-08 16:21:07'),
(33, 'Advanced Python for Data Analysis', 'advanced-python-for-data-analysis', 'Apply advanced Python techniques to real analytical workflows.', 'This course expands Python data analysis with advanced cleaning, transformation, grouping, visualization preparation and reusable analysis workflows.', 'advanced', 4, 3, 'assets/images/courses/python-data-advanced.png', 24, 52, 'Isabella Ward', '2026-03-08 16:21:07'),
(34, 'Advanced Pandas and NumPy', 'advanced-pandas-and-numpy', 'Use advanced Pandas and NumPy features for complex data processing.', 'This course covers advanced DataFrame operations, vectorized computation, data reshaping, performance-aware workflows and numerical analysis patterns.', 'advanced', 4, 3, 'assets/images/courses/pandas-numpy-advanced.png', 23, 50, 'Noah Hayes', '2026-03-08 16:21:07'),
(35, 'Advanced Machine Learning', 'advanced-machine-learning', 'Move beyond ML basics into model tuning, validation and applied workflows.', 'This course focuses on model validation, feature preparation, tuning, evaluation and applied machine learning workflows.', 'advanced', 4, 3, 'assets/images/courses/machine-learning-advanced.png', 28, 62, 'Grace Mitchell', '2026-03-08 16:21:07'),
(36, 'Power BI Advanced Dashboards', 'power-bi-advanced-dashboards', 'Design advanced Power BI dashboards for professional analytics reporting.', 'This course teaches advanced dashboard layout, data modeling ideas, report interactions, visual storytelling and business-oriented metrics.', 'advanced', 4, 3, 'assets/images/courses/powerbi-advanced.png', 22, 48, 'Lucas Perry', '2026-03-08 16:21:07'),
(17, 'Git and GitHub Workflow', 'git-and-github-workflow', 'Learn version control and collaboration with Git and GitHub.', 'This course covers commits, branches, pull requests and collaborative workflows using Git and GitHub.', 'beginner', 5, 1, 'assets/images/courses/github.png', 14, 31, 'Mia Foster', '2026-03-08 16:21:07'),
(18, 'Linux for Deployment', 'linux-for-deployment', 'Understand the Linux basics needed for deployment environments.', 'This course introduces terminal usage, file permissions, common commands and server-oriented Linux fundamentals.', 'beginner', 5, 1, 'assets/images/courses/linux.png', 15, 34, 'Henry Simmons', '2026-03-08 16:21:07'),
(19, 'CI/CD Essentials', 'cicd-essentials', 'Automate software delivery with CI/CD pipelines.', 'This course explains continuous integration, continuous delivery, pipeline design and deployment automation concepts.', 'intermediate', 5, 2, 'assets/images/courses/cicd.png', 18, 38, 'Chloe Murphy', '2026-03-08 16:21:07'),
(20, 'Docker for DevOps', 'docker-for-devops', 'Use Docker in modern DevOps workflows.', 'This course applies containerization concepts specifically to DevOps practices, automation and environment consistency.', 'intermediate', 5, 3, 'assets/images/courses/docker-devops.png', 19, 41, 'Liam Parker', '2026-03-08 16:21:07'),
(37, 'Advanced GitHub Actions', 'advanced-github-actions', 'Automate professional workflows with advanced GitHub Actions pipelines.', 'This course explores advanced GitHub Actions workflows, secrets, environments, reusable actions and deployment automation.', 'advanced', 5, 3, 'assets/images/courses/github-actions-advanced.png', 22, 49, 'Mia Foster', '2026-03-08 16:21:07'),
(38, 'Advanced Linux Administration', 'advanced-linux-administration', 'Manage Linux systems with users, services, permissions and deployment practices.', 'This course goes beyond basic Linux commands and focuses on users, services, processes, permissions, scripting and server administration.', 'advanced', 5, 3, 'assets/images/courses/linux-advanced.png', 24, 53, 'Henry Simmons', '2026-03-08 16:21:07'),
(39, 'Advanced CI/CD Pipelines', 'advanced-cicd-pipelines', 'Design robust CI/CD pipelines for testing, building and deployment.', 'This course teaches advanced pipeline design, quality gates, deployment stages, environment management and delivery automation.', 'advanced', 5, 3, 'assets/images/courses/cicd-advanced.png', 24, 52, 'Chloe Murphy', '2026-03-08 16:21:07'),
(40, 'Advanced Docker for DevOps', 'advanced-docker-for-devops', 'Use Docker deeply inside DevOps automation and deployment pipelines.', 'This course applies advanced Docker practices to DevOps workflows, including image optimization, compose strategies, registries and deployment automation.', 'advanced', 5, 3, 'assets/images/courses/docker-devops-advanced.png', 23, 50, 'Liam Parker', '2026-03-08 16:21:07');

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

--
-- Volcado adicional de datos para la tabla `course_outcomes`
--
INSERT INTO `course_outcomes` (`id`, `course_id`, `outcome_text`, `display_order`) VALUES
(81, 21, 'Write simple Java programs using variables, methods and conditions.', 1),
(82, 21, 'Understand beginner Java syntax and console workflows.', 2),
(83, 21, 'Use loops and arrays in small exercises.', 3),
(84, 21, 'Prepare for object-oriented Java topics.', 4),
(85, 22, 'Apply Java collections and generics in practical scenarios.', 1),
(86, 22, 'Use interfaces and exceptions to structure robust applications.', 2),
(87, 22, 'Organize Java code using cleaner architectural practices.', 3),
(88, 22, 'Build confidence with advanced object-oriented Java design.', 4),
(89, 23, 'Use Python modules, packages and reusable scripts.', 1),
(90, 23, 'Handle files and exceptions in practical applications.', 2),
(91, 23, 'Structure Python projects more cleanly.', 3),
(92, 23, 'Apply advanced functions to solve larger problems.', 4),
(93, 24, 'Design reusable Angular components and services.', 1),
(94, 24, 'Organize state and routes in scalable applications.', 2),
(95, 24, 'Apply advanced patterns to improve maintainability.', 3),
(96, 24, 'Prepare Angular projects for larger frontend systems.', 4),
(97, 25, 'Write advanced joins and subqueries confidently.', 1),
(98, 25, 'Use grouping and filtering for analytical queries.', 2),
(99, 25, 'Apply set operations and nested logic.', 3),
(100, 25, 'Reason through complex SQL query execution.', 4),
(101, 26, 'Create stored procedures and functions in MySQL.', 1),
(102, 26, 'Use indexes and constraints effectively.', 2),
(103, 26, 'Apply MySQL optimization basics.', 3),
(104, 26, 'Design stronger database workflows.', 4),
(105, 27, 'Use PostgreSQL views, indexes and transactions.', 1),
(106, 27, 'Apply advanced data types in practical schemas.', 2),
(107, 27, 'Improve query performance with PostgreSQL features.', 3),
(108, 27, 'Build more reliable PostgreSQL solutions.', 4),
(109, 28, 'Build MongoDB aggregation pipelines.', 1),
(110, 28, 'Design document schemas for performance.', 2),
(111, 28, 'Use indexes to improve query speed.', 3),
(112, 28, 'Evaluate MongoDB choices in real scenarios.', 4),
(113, 29, 'Design scalable AWS architectures.', 1),
(114, 29, 'Choose AWS services for availability and resilience.', 2),
(115, 29, 'Plan storage, networking and deployment strategies.', 3),
(116, 29, 'Evaluate cloud architecture trade-offs.', 4),
(117, 30, 'Use advanced Azure compute and storage services.', 1),
(118, 30, 'Understand Azure networking and monitoring concepts.', 2),
(119, 30, 'Plan deployment architectures in Azure.', 3),
(120, 30, 'Connect Azure services in practical scenarios.', 4),
(121, 31, 'Create optimized Docker images.', 1),
(122, 31, 'Use Docker networking and volumes effectively.', 2),
(123, 31, 'Apply Docker security and build strategies.', 3),
(124, 31, 'Prepare containers for production deployment.', 4),
(125, 32, 'Operate Kubernetes workloads reliably.', 1),
(126, 32, 'Use configuration, scaling and monitoring strategies.', 2),
(127, 32, 'Understand advanced deployment patterns.', 3),
(128, 32, 'Improve Kubernetes application reliability.', 4),
(129, 33, 'Apply advanced Python analysis workflows.', 1),
(130, 33, 'Clean and transform complex datasets.', 2),
(131, 33, 'Create reusable analytical steps.', 3),
(132, 33, 'Prepare data for reporting and modeling.', 4),
(133, 34, 'Use advanced Pandas transformations.', 1),
(134, 34, 'Apply NumPy vectorized operations effectively.', 2),
(135, 34, 'Reshape and combine datasets efficiently.', 3),
(136, 34, 'Improve performance in data processing workflows.', 4),
(137, 35, 'Validate and tune machine learning models.', 1),
(138, 35, 'Prepare features for applied ML workflows.', 2),
(139, 35, 'Evaluate models with suitable metrics.', 3),
(140, 35, 'Build stronger end-to-end ML experiments.', 4),
(141, 36, 'Design advanced Power BI dashboards.', 1),
(142, 36, 'Use report interactions effectively.', 2),
(143, 36, 'Apply visual storytelling to business metrics.', 3),
(144, 36, 'Prepare professional reporting experiences.', 4),
(145, 37, 'Create advanced GitHub Actions workflows.', 1),
(146, 37, 'Use secrets, environments and reusable actions.', 2),
(147, 37, 'Automate testing and deployment stages.', 3),
(148, 37, 'Improve delivery workflows with GitHub automation.', 4),
(149, 38, 'Manage Linux users, permissions and services.', 1),
(150, 38, 'Use processes and logs for administration tasks.', 2),
(151, 38, 'Apply scripting to server maintenance.', 3),
(152, 38, 'Prepare Linux environments for deployment.', 4),
(153, 39, 'Design multi-stage CI/CD pipelines.', 1),
(154, 39, 'Use quality gates and deployment environments.', 2),
(155, 39, 'Automate builds, tests and releases.', 3),
(156, 39, 'Improve reliability in software delivery.', 4),
(157, 40, 'Optimize Docker images for DevOps workflows.', 1),
(158, 40, 'Use registries and Compose strategies effectively.', 2),
(159, 40, 'Integrate Docker into delivery pipelines.', 3),
(160, 40, 'Apply advanced container practices in automation.', 4);

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `lessons`
--
CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lessons`
--
INSERT INTO `lessons` (`id`, `course_id`, `title`, `description`, `duration`, `video_url`, `display_order`) VALUES
(1, 1, 'Python Fundamentals: Course overview and learning goals', 'Introduce the purpose of Python Fundamentals, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(2, 1, 'Setting up for Python Fundamentals', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Python Fundamentals.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(3, 1, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to Python Fundamentals.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(4, 1, 'Working with data structures', 'Work through working with data structures using examples connected to Python Fundamentals.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(5, 1, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to Python Fundamentals.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(6, 1, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to Python Fundamentals.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(7, 1, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to Python Fundamentals.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(8, 1, 'Guided project in Python Fundamentals', 'Apply the main concepts of Python Fundamentals in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(9, 1, 'Review and best practices', 'Work through review and best practices using examples connected to Python Fundamentals.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(10, 1, 'Python Fundamentals: final review', 'Review the most important ideas from Python Fundamentals and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(11, 2, 'Java OOP Essentials: Course overview and learning goals', 'Introduce the purpose of Java OOP Essentials, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(12, 2, 'Setting up for Java OOP Essentials', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Java OOP Essentials.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(13, 2, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to Java OOP Essentials.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(14, 2, 'Working with data structures', 'Work through working with data structures using examples connected to Java OOP Essentials.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(15, 2, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to Java OOP Essentials.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(16, 2, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to Java OOP Essentials.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(17, 2, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to Java OOP Essentials.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(18, 2, 'Guided project in Java OOP Essentials', 'Apply the main concepts of Java OOP Essentials in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(19, 2, 'Review and best practices', 'Work through review and best practices using examples connected to Java OOP Essentials.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(20, 2, 'Java OOP Essentials: final review', 'Review the most important ideas from Java OOP Essentials and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(21, 3, 'Angular from Scratch: Course overview and learning goals', 'Introduce the purpose of Angular from Scratch, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(22, 3, 'Setting up for Angular from Scratch', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Angular from Scratch.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(23, 3, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to Angular from Scratch.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(24, 3, 'Working with data structures', 'Work through working with data structures using examples connected to Angular from Scratch.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(25, 3, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to Angular from Scratch.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(26, 3, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to Angular from Scratch.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(27, 3, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to Angular from Scratch.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(28, 3, 'Guided project in Angular from Scratch', 'Apply the main concepts of Angular from Scratch in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(29, 3, 'Review and best practices', 'Work through review and best practices using examples connected to Angular from Scratch.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(30, 3, 'Angular from Scratch: final review', 'Review the most important ideas from Angular from Scratch and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(31, 4, 'React Fundamentals: Course overview and learning goals', 'Introduce the purpose of React Fundamentals, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(32, 4, 'Setting up for React Fundamentals', 'Prepare the tools, resources and working environment needed to follow the practical lessons of React Fundamentals.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(33, 4, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to React Fundamentals.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(34, 4, 'Working with data structures', 'Work through working with data structures using examples connected to React Fundamentals.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(35, 4, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to React Fundamentals.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(36, 4, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to React Fundamentals.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(37, 4, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to React Fundamentals.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(38, 4, 'Guided project in React Fundamentals', 'Apply the main concepts of React Fundamentals in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(39, 4, 'Review and best practices', 'Work through review and best practices using examples connected to React Fundamentals.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(40, 4, 'React Fundamentals: final review', 'Review the most important ideas from React Fundamentals and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(41, 21, 'Java Basics: Course overview and learning goals', 'Introduce the purpose of Java Basics, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(42, 21, 'Setting up for Java Basics', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Java Basics.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(43, 21, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to Java Basics.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(44, 21, 'Working with data structures', 'Work through working with data structures using examples connected to Java Basics.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(45, 21, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to Java Basics.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(46, 21, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to Java Basics.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(47, 21, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to Java Basics.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(48, 21, 'Guided project in Java Basics', 'Apply the main concepts of Java Basics in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(49, 21, 'Review and best practices', 'Work through review and best practices using examples connected to Java Basics.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(50, 21, 'Java Basics: final review', 'Review the most important ideas from Java Basics and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(51, 22, 'Advanced Java: Course overview and learning goals', 'Introduce the purpose of Advanced Java, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(52, 22, 'Setting up for Advanced Java', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced Java.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(53, 22, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to Advanced Java.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(54, 22, 'Working with data structures', 'Work through working with data structures using examples connected to Advanced Java.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(55, 22, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to Advanced Java.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(56, 22, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to Advanced Java.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(57, 22, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to Advanced Java.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(58, 22, 'Guided project in Advanced Java', 'Apply the main concepts of Advanced Java in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(59, 22, 'Review and best practices', 'Work through review and best practices using examples connected to Advanced Java.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(60, 22, 'Advanced Java: final review', 'Review the most important ideas from Advanced Java and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(61, 23, 'Advanced Python: Course overview and learning goals', 'Introduce the purpose of Advanced Python, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(62, 23, 'Setting up for Advanced Python', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced Python.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(63, 23, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to Advanced Python.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(64, 23, 'Working with data structures', 'Work through working with data structures using examples connected to Advanced Python.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(65, 23, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to Advanced Python.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(66, 23, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to Advanced Python.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(67, 23, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to Advanced Python.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(68, 23, 'Guided project in Advanced Python', 'Apply the main concepts of Advanced Python in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(69, 23, 'Review and best practices', 'Work through review and best practices using examples connected to Advanced Python.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(70, 23, 'Advanced Python: final review', 'Review the most important ideas from Advanced Python and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(71, 24, 'Angular Advanced Patterns: Course overview and learning goals', 'Introduce the purpose of Angular Advanced Patterns, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(72, 24, 'Setting up for Angular Advanced Patterns', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Angular Advanced Patterns.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(73, 24, 'Core syntax and first exercise', 'Work through core syntax and first exercise using examples connected to Angular Advanced Patterns.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(74, 24, 'Working with data structures', 'Work through working with data structures using examples connected to Angular Advanced Patterns.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(75, 24, 'Control flow and reusable logic', 'Work through control flow and reusable logic using examples connected to Angular Advanced Patterns.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(76, 24, 'Organizing code in modules', 'Work through organizing code in modules using examples connected to Angular Advanced Patterns.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(77, 24, 'Debugging and common mistakes', 'Work through debugging and common mistakes using examples connected to Angular Advanced Patterns.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(78, 24, 'Guided project in Angular Advanced Patterns', 'Apply the main concepts of Angular Advanced Patterns in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(79, 24, 'Review and best practices', 'Work through review and best practices using examples connected to Angular Advanced Patterns.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(80, 24, 'Angular Advanced Patterns: final review', 'Review the most important ideas from Angular Advanced Patterns and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(81, 5, 'SQL Fundamentals: Database context and course goals', 'Introduce the purpose of SQL Fundamentals, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(82, 5, 'Setting up for SQL Fundamentals', 'Prepare the tools, resources and working environment needed to follow the practical lessons of SQL Fundamentals.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(83, 5, 'Creating the working environment', 'Work through creating the working environment using examples connected to SQL Fundamentals.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(84, 5, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to SQL Fundamentals.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(85, 5, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to SQL Fundamentals.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(86, 5, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to SQL Fundamentals.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(87, 5, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to SQL Fundamentals.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(88, 5, 'Guided project in SQL Fundamentals', 'Apply the main concepts of SQL Fundamentals in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(89, 5, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to SQL Fundamentals.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(90, 5, 'SQL Fundamentals: final review', 'Review the most important ideas from SQL Fundamentals and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(91, 6, 'MySQL Database Design: Database context and course goals', 'Introduce the purpose of MySQL Database Design, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(92, 6, 'Setting up for MySQL Database Design', 'Prepare the tools, resources and working environment needed to follow the practical lessons of MySQL Database Design.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(93, 6, 'Creating the working environment', 'Work through creating the working environment using examples connected to MySQL Database Design.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(94, 6, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to MySQL Database Design.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(95, 6, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to MySQL Database Design.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(96, 6, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to MySQL Database Design.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(97, 6, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to MySQL Database Design.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(98, 6, 'Guided project in MySQL Database Design', 'Apply the main concepts of MySQL Database Design in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(99, 6, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to MySQL Database Design.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(100, 6, 'MySQL Database Design: final review', 'Review the most important ideas from MySQL Database Design and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(101, 7, 'PostgreSQL Essentials: Database context and course goals', 'Introduce the purpose of PostgreSQL Essentials, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(102, 7, 'Setting up for PostgreSQL Essentials', 'Prepare the tools, resources and working environment needed to follow the practical lessons of PostgreSQL Essentials.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(103, 7, 'Creating the working environment', 'Work through creating the working environment using examples connected to PostgreSQL Essentials.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(104, 7, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to PostgreSQL Essentials.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(105, 7, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to PostgreSQL Essentials.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(106, 7, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to PostgreSQL Essentials.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(107, 7, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to PostgreSQL Essentials.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(108, 7, 'Guided project in PostgreSQL Essentials', 'Apply the main concepts of PostgreSQL Essentials in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(109, 7, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to PostgreSQL Essentials.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(110, 7, 'PostgreSQL Essentials: final review', 'Review the most important ideas from PostgreSQL Essentials and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(111, 8, 'MongoDB Basics: Database context and course goals', 'Introduce the purpose of MongoDB Basics, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(112, 8, 'Setting up for MongoDB Basics', 'Prepare the tools, resources and working environment needed to follow the practical lessons of MongoDB Basics.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(113, 8, 'Creating the working environment', 'Work through creating the working environment using examples connected to MongoDB Basics.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(114, 8, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to MongoDB Basics.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(115, 8, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to MongoDB Basics.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(116, 8, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to MongoDB Basics.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(117, 8, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to MongoDB Basics.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(118, 8, 'Guided project in MongoDB Basics', 'Apply the main concepts of MongoDB Basics in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(119, 8, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to MongoDB Basics.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(120, 8, 'MongoDB Basics: final review', 'Review the most important ideas from MongoDB Basics and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(121, 25, 'Advanced SQL Queries: Database context and course goals', 'Introduce the purpose of Advanced SQL Queries, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(122, 25, 'Setting up for Advanced SQL Queries', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced SQL Queries.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(123, 25, 'Creating the working environment', 'Work through creating the working environment using examples connected to Advanced SQL Queries.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(124, 25, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to Advanced SQL Queries.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(125, 25, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to Advanced SQL Queries.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(126, 25, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to Advanced SQL Queries.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(127, 25, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to Advanced SQL Queries.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(128, 25, 'Guided project in Advanced SQL Queries', 'Apply the main concepts of Advanced SQL Queries in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(129, 25, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to Advanced SQL Queries.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(130, 25, 'Advanced SQL Queries: final review', 'Review the most important ideas from Advanced SQL Queries and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(131, 26, 'Advanced MySQL: Database context and course goals', 'Introduce the purpose of Advanced MySQL, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(132, 26, 'Setting up for Advanced MySQL', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced MySQL.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(133, 26, 'Creating the working environment', 'Work through creating the working environment using examples connected to Advanced MySQL.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(134, 26, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to Advanced MySQL.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(135, 26, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to Advanced MySQL.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(136, 26, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to Advanced MySQL.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(137, 26, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to Advanced MySQL.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(138, 26, 'Guided project in Advanced MySQL', 'Apply the main concepts of Advanced MySQL in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(139, 26, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to Advanced MySQL.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(140, 26, 'Advanced MySQL: final review', 'Review the most important ideas from Advanced MySQL and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(141, 27, 'PostgreSQL Advanced Features: Database context and course goals', 'Introduce the purpose of PostgreSQL Advanced Features, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(142, 27, 'Setting up for PostgreSQL Advanced Features', 'Prepare the tools, resources and working environment needed to follow the practical lessons of PostgreSQL Advanced Features.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(143, 27, 'Creating the working environment', 'Work through creating the working environment using examples connected to PostgreSQL Advanced Features.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(144, 27, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to PostgreSQL Advanced Features.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(145, 27, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to PostgreSQL Advanced Features.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(146, 27, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to PostgreSQL Advanced Features.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(147, 27, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to PostgreSQL Advanced Features.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(148, 27, 'Guided project in PostgreSQL Advanced Features', 'Apply the main concepts of PostgreSQL Advanced Features in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(149, 27, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to PostgreSQL Advanced Features.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(150, 27, 'PostgreSQL Advanced Features: final review', 'Review the most important ideas from PostgreSQL Advanced Features and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(151, 28, 'MongoDB Aggregation and Performance: Database context and course goals', 'Introduce the purpose of MongoDB Aggregation and Performance, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(152, 28, 'Setting up for MongoDB Aggregation and Performance', 'Prepare the tools, resources and working environment needed to follow the practical lessons of MongoDB Aggregation and Performance.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(153, 28, 'Creating the working environment', 'Work through creating the working environment using examples connected to MongoDB Aggregation and Performance.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(154, 28, 'Core query or modeling concepts', 'Work through core query or modeling concepts using examples connected to MongoDB Aggregation and Performance.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(155, 28, 'Filtering and retrieving data', 'Work through filtering and retrieving data using examples connected to MongoDB Aggregation and Performance.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(156, 28, 'Relationships, indexes and performance', 'Work through relationships, indexes and performance using examples connected to MongoDB Aggregation and Performance.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(157, 28, 'Advanced operations in context', 'Work through advanced operations in context using examples connected to MongoDB Aggregation and Performance.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(158, 28, 'Guided project in MongoDB Aggregation and Performance', 'Apply the main concepts of MongoDB Aggregation and Performance in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(159, 28, 'Common mistakes and troubleshooting', 'Work through common mistakes and troubleshooting using examples connected to MongoDB Aggregation and Performance.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(160, 28, 'MongoDB Aggregation and Performance: final review', 'Review the most important ideas from MongoDB Aggregation and Performance and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(161, 9, 'AWS Cloud Foundations: Cloud context and course goals', 'Introduce the purpose of AWS Cloud Foundations, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(162, 9, 'Setting up for AWS Cloud Foundations', 'Prepare the tools, resources and working environment needed to follow the practical lessons of AWS Cloud Foundations.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(163, 9, 'Core service concepts', 'Work through core service concepts using examples connected to AWS Cloud Foundations.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(164, 9, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to AWS Cloud Foundations.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(165, 9, 'Networking and access basics', 'Work through networking and access basics using examples connected to AWS Cloud Foundations.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(166, 9, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to AWS Cloud Foundations.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(167, 9, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to AWS Cloud Foundations.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(168, 9, 'Guided project in AWS Cloud Foundations', 'Apply the main concepts of AWS Cloud Foundations in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(169, 9, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to AWS Cloud Foundations.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(170, 9, 'AWS Cloud Foundations: final review', 'Review the most important ideas from AWS Cloud Foundations and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(171, 10, 'Azure for Beginners: Cloud context and course goals', 'Introduce the purpose of Azure for Beginners, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(172, 10, 'Setting up for Azure for Beginners', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Azure for Beginners.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(173, 10, 'Core service concepts', 'Work through core service concepts using examples connected to Azure for Beginners.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(174, 10, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to Azure for Beginners.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(175, 10, 'Networking and access basics', 'Work through networking and access basics using examples connected to Azure for Beginners.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(176, 10, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to Azure for Beginners.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(177, 10, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to Azure for Beginners.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(178, 10, 'Guided project in Azure for Beginners', 'Apply the main concepts of Azure for Beginners in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(179, 10, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to Azure for Beginners.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(180, 10, 'Azure for Beginners: final review', 'Review the most important ideas from Azure for Beginners and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(181, 11, 'Docker Deployment Basics: Cloud context and course goals', 'Introduce the purpose of Docker Deployment Basics, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(182, 11, 'Setting up for Docker Deployment Basics', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Docker Deployment Basics.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(183, 11, 'Core service concepts', 'Work through core service concepts using examples connected to Docker Deployment Basics.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(184, 11, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to Docker Deployment Basics.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(185, 11, 'Networking and access basics', 'Work through networking and access basics using examples connected to Docker Deployment Basics.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(186, 11, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to Docker Deployment Basics.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(187, 11, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to Docker Deployment Basics.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(188, 11, 'Guided project in Docker Deployment Basics', 'Apply the main concepts of Docker Deployment Basics in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(189, 11, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to Docker Deployment Basics.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(190, 11, 'Docker Deployment Basics: final review', 'Review the most important ideas from Docker Deployment Basics and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(191, 12, 'Kubernetes Essentials: Cloud context and course goals', 'Introduce the purpose of Kubernetes Essentials, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(192, 12, 'Setting up for Kubernetes Essentials', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Kubernetes Essentials.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(193, 12, 'Core service concepts', 'Work through core service concepts using examples connected to Kubernetes Essentials.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(194, 12, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to Kubernetes Essentials.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(195, 12, 'Networking and access basics', 'Work through networking and access basics using examples connected to Kubernetes Essentials.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(196, 12, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to Kubernetes Essentials.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(197, 12, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to Kubernetes Essentials.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(198, 12, 'Guided project in Kubernetes Essentials', 'Apply the main concepts of Kubernetes Essentials in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(199, 12, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to Kubernetes Essentials.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(200, 12, 'Kubernetes Essentials: final review', 'Review the most important ideas from Kubernetes Essentials and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(201, 29, 'AWS Advanced Architecture: Cloud context and course goals', 'Introduce the purpose of AWS Advanced Architecture, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(202, 29, 'Setting up for AWS Advanced Architecture', 'Prepare the tools, resources and working environment needed to follow the practical lessons of AWS Advanced Architecture.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(203, 29, 'Core service concepts', 'Work through core service concepts using examples connected to AWS Advanced Architecture.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(204, 29, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to AWS Advanced Architecture.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(205, 29, 'Networking and access basics', 'Work through networking and access basics using examples connected to AWS Advanced Architecture.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(206, 29, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to AWS Advanced Architecture.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(207, 29, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to AWS Advanced Architecture.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(208, 29, 'Guided project in AWS Advanced Architecture', 'Apply the main concepts of AWS Advanced Architecture in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(209, 29, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to AWS Advanced Architecture.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(210, 29, 'AWS Advanced Architecture: final review', 'Review the most important ideas from AWS Advanced Architecture and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(211, 30, 'Azure Advanced Services: Cloud context and course goals', 'Introduce the purpose of Azure Advanced Services, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(212, 30, 'Setting up for Azure Advanced Services', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Azure Advanced Services.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(213, 30, 'Core service concepts', 'Work through core service concepts using examples connected to Azure Advanced Services.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(214, 30, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to Azure Advanced Services.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(215, 30, 'Networking and access basics', 'Work through networking and access basics using examples connected to Azure Advanced Services.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(216, 30, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to Azure Advanced Services.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(217, 30, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to Azure Advanced Services.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(218, 30, 'Guided project in Azure Advanced Services', 'Apply the main concepts of Azure Advanced Services in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(219, 30, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to Azure Advanced Services.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(220, 30, 'Azure Advanced Services: final review', 'Review the most important ideas from Azure Advanced Services and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(221, 31, 'Docker Advanced: Cloud context and course goals', 'Introduce the purpose of Docker Advanced, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(222, 31, 'Setting up for Docker Advanced', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Docker Advanced.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(223, 31, 'Core service concepts', 'Work through core service concepts using examples connected to Docker Advanced.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(224, 31, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to Docker Advanced.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(225, 31, 'Networking and access basics', 'Work through networking and access basics using examples connected to Docker Advanced.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(226, 31, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to Docker Advanced.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(227, 31, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to Docker Advanced.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(228, 31, 'Guided project in Docker Advanced', 'Apply the main concepts of Docker Advanced in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(229, 31, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to Docker Advanced.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(230, 31, 'Docker Advanced: final review', 'Review the most important ideas from Docker Advanced and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(231, 32, 'Kubernetes Advanced Operations: Cloud context and course goals', 'Introduce the purpose of Kubernetes Advanced Operations, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(232, 32, 'Setting up for Kubernetes Advanced Operations', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Kubernetes Advanced Operations.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(233, 32, 'Core service concepts', 'Work through core service concepts using examples connected to Kubernetes Advanced Operations.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(234, 32, 'Deployment building blocks', 'Work through deployment building blocks using examples connected to Kubernetes Advanced Operations.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(235, 32, 'Networking and access basics', 'Work through networking and access basics using examples connected to Kubernetes Advanced Operations.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(236, 32, 'Storage and configuration options', 'Work through storage and configuration options using examples connected to Kubernetes Advanced Operations.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(237, 32, 'Monitoring and reliability ideas', 'Work through monitoring and reliability ideas using examples connected to Kubernetes Advanced Operations.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(238, 32, 'Guided project in Kubernetes Advanced Operations', 'Apply the main concepts of Kubernetes Advanced Operations in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(239, 32, 'Cost and security considerations', 'Work through cost and security considerations using examples connected to Kubernetes Advanced Operations.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(240, 32, 'Kubernetes Advanced Operations: final review', 'Review the most important ideas from Kubernetes Advanced Operations and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(241, 13, 'Python for Data Analysis: Analytics context and course goals', 'Introduce the purpose of Python for Data Analysis, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(242, 13, 'Setting up for Python for Data Analysis', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Python for Data Analysis.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(243, 13, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Python for Data Analysis.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(244, 13, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Python for Data Analysis.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(245, 13, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Python for Data Analysis.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(246, 13, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Python for Data Analysis.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(247, 13, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Python for Data Analysis.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(248, 13, 'Guided project in Python for Data Analysis', 'Apply the main concepts of Python for Data Analysis in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(249, 13, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Python for Data Analysis.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(250, 13, 'Python for Data Analysis: final review', 'Review the most important ideas from Python for Data Analysis and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(251, 14, 'Pandas and NumPy Essentials: Analytics context and course goals', 'Introduce the purpose of Pandas and NumPy Essentials, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(252, 14, 'Setting up for Pandas and NumPy Essentials', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Pandas and NumPy Essentials.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(253, 14, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Pandas and NumPy Essentials.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(254, 14, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Pandas and NumPy Essentials.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(255, 14, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Pandas and NumPy Essentials.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(256, 14, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Pandas and NumPy Essentials.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(257, 14, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Pandas and NumPy Essentials.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(258, 14, 'Guided project in Pandas and NumPy Essentials', 'Apply the main concepts of Pandas and NumPy Essentials in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(259, 14, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Pandas and NumPy Essentials.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(260, 14, 'Pandas and NumPy Essentials: final review', 'Review the most important ideas from Pandas and NumPy Essentials and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(261, 15, 'Machine Learning Basics: Analytics context and course goals', 'Introduce the purpose of Machine Learning Basics, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(262, 15, 'Setting up for Machine Learning Basics', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Machine Learning Basics.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(263, 15, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Machine Learning Basics.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(264, 15, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Machine Learning Basics.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(265, 15, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Machine Learning Basics.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(266, 15, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Machine Learning Basics.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(267, 15, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Machine Learning Basics.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(268, 15, 'Guided project in Machine Learning Basics', 'Apply the main concepts of Machine Learning Basics in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(269, 15, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Machine Learning Basics.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(270, 15, 'Machine Learning Basics: final review', 'Review the most important ideas from Machine Learning Basics and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(271, 16, 'Power BI for Data Visualization: Analytics context and course goals', 'Introduce the purpose of Power BI for Data Visualization, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(272, 16, 'Setting up for Power BI for Data Visualization', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Power BI for Data Visualization.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(273, 16, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Power BI for Data Visualization.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(274, 16, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Power BI for Data Visualization.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(275, 16, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Power BI for Data Visualization.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(276, 16, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Power BI for Data Visualization.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(277, 16, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Power BI for Data Visualization.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(278, 16, 'Guided project in Power BI for Data Visualization', 'Apply the main concepts of Power BI for Data Visualization in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(279, 16, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Power BI for Data Visualization.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(280, 16, 'Power BI for Data Visualization: final review', 'Review the most important ideas from Power BI for Data Visualization and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(281, 33, 'Advanced Python for Data Analysis: Analytics context and course goals', 'Introduce the purpose of Advanced Python for Data Analysis, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(282, 33, 'Setting up for Advanced Python for Data Analysis', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced Python for Data Analysis.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(283, 33, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Advanced Python for Data Analysis.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(284, 33, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Advanced Python for Data Analysis.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(285, 33, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Advanced Python for Data Analysis.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(286, 33, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Advanced Python for Data Analysis.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(287, 33, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Advanced Python for Data Analysis.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(288, 33, 'Guided project in Advanced Python for Data Analysis', 'Apply the main concepts of Advanced Python for Data Analysis in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(289, 33, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Advanced Python for Data Analysis.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(290, 33, 'Advanced Python for Data Analysis: final review', 'Review the most important ideas from Advanced Python for Data Analysis and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(291, 34, 'Advanced Pandas and NumPy: Analytics context and course goals', 'Introduce the purpose of Advanced Pandas and NumPy, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(292, 34, 'Setting up for Advanced Pandas and NumPy', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced Pandas and NumPy.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(293, 34, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Advanced Pandas and NumPy.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(294, 34, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Advanced Pandas and NumPy.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(295, 34, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Advanced Pandas and NumPy.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(296, 34, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Advanced Pandas and NumPy.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(297, 34, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Advanced Pandas and NumPy.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(298, 34, 'Guided project in Advanced Pandas and NumPy', 'Apply the main concepts of Advanced Pandas and NumPy in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(299, 34, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Advanced Pandas and NumPy.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(300, 34, 'Advanced Pandas and NumPy: final review', 'Review the most important ideas from Advanced Pandas and NumPy and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(301, 35, 'Advanced Machine Learning: Analytics context and course goals', 'Introduce the purpose of Advanced Machine Learning, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(302, 35, 'Setting up for Advanced Machine Learning', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced Machine Learning.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(303, 35, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Advanced Machine Learning.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(304, 35, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Advanced Machine Learning.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(305, 35, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Advanced Machine Learning.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(306, 35, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Advanced Machine Learning.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(307, 35, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Advanced Machine Learning.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(308, 35, 'Guided project in Advanced Machine Learning', 'Apply the main concepts of Advanced Machine Learning in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(309, 35, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Advanced Machine Learning.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(310, 35, 'Advanced Machine Learning: final review', 'Review the most important ideas from Advanced Machine Learning and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(311, 36, 'Power BI Advanced Dashboards: Analytics context and course goals', 'Introduce the purpose of Power BI Advanced Dashboards, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(312, 36, 'Setting up for Power BI Advanced Dashboards', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Power BI Advanced Dashboards.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(313, 36, 'Data loading and first inspection', 'Work through data loading and first inspection using examples connected to Power BI Advanced Dashboards.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(314, 36, 'Cleaning and transforming data', 'Work through cleaning and transforming data using examples connected to Power BI Advanced Dashboards.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(315, 36, 'Exploratory analysis workflow', 'Work through exploratory analysis workflow using examples connected to Power BI Advanced Dashboards.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(316, 36, 'Feature or metric preparation', 'Work through feature or metric preparation using examples connected to Power BI Advanced Dashboards.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(317, 36, 'Visualization and interpretation', 'Work through visualization and interpretation using examples connected to Power BI Advanced Dashboards.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(318, 36, 'Guided project in Power BI Advanced Dashboards', 'Apply the main concepts of Power BI Advanced Dashboards in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(319, 36, 'Common analysis mistakes', 'Work through common analysis mistakes using examples connected to Power BI Advanced Dashboards.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(320, 36, 'Power BI Advanced Dashboards: final review', 'Review the most important ideas from Power BI Advanced Dashboards and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(321, 17, 'Git and GitHub Workflow: DevOps context and course goals', 'Introduce the purpose of Git and GitHub Workflow, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(322, 17, 'Setting up for Git and GitHub Workflow', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Git and GitHub Workflow.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(323, 17, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to Git and GitHub Workflow.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(324, 17, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to Git and GitHub Workflow.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(325, 17, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to Git and GitHub Workflow.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(326, 17, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to Git and GitHub Workflow.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(327, 17, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to Git and GitHub Workflow.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(328, 17, 'Guided project in Git and GitHub Workflow', 'Apply the main concepts of Git and GitHub Workflow in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(329, 17, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to Git and GitHub Workflow.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(330, 17, 'Git and GitHub Workflow: final review', 'Review the most important ideas from Git and GitHub Workflow and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(331, 18, 'Linux for Deployment: DevOps context and course goals', 'Introduce the purpose of Linux for Deployment, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(332, 18, 'Setting up for Linux for Deployment', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Linux for Deployment.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(333, 18, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to Linux for Deployment.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(334, 18, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to Linux for Deployment.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(335, 18, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to Linux for Deployment.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(336, 18, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to Linux for Deployment.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(337, 18, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to Linux for Deployment.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(338, 18, 'Guided project in Linux for Deployment', 'Apply the main concepts of Linux for Deployment in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(339, 18, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to Linux for Deployment.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(340, 18, 'Linux for Deployment: final review', 'Review the most important ideas from Linux for Deployment and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(341, 19, 'CI/CD Essentials: DevOps context and course goals', 'Introduce the purpose of CI/CD Essentials, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(342, 19, 'Setting up for CI/CD Essentials', 'Prepare the tools, resources and working environment needed to follow the practical lessons of CI/CD Essentials.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(343, 19, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to CI/CD Essentials.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(344, 19, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to CI/CD Essentials.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(345, 19, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to CI/CD Essentials.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(346, 19, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to CI/CD Essentials.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(347, 19, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to CI/CD Essentials.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(348, 19, 'Guided project in CI/CD Essentials', 'Apply the main concepts of CI/CD Essentials in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(349, 19, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to CI/CD Essentials.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(350, 19, 'CI/CD Essentials: final review', 'Review the most important ideas from CI/CD Essentials and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(351, 20, 'Docker for DevOps: DevOps context and course goals', 'Introduce the purpose of Docker for DevOps, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(352, 20, 'Setting up for Docker for DevOps', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Docker for DevOps.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(353, 20, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to Docker for DevOps.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(354, 20, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to Docker for DevOps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(355, 20, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to Docker for DevOps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(356, 20, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to Docker for DevOps.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(357, 20, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to Docker for DevOps.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(358, 20, 'Guided project in Docker for DevOps', 'Apply the main concepts of Docker for DevOps in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(359, 20, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to Docker for DevOps.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(360, 20, 'Docker for DevOps: final review', 'Review the most important ideas from Docker for DevOps and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(361, 37, 'Advanced GitHub Actions: DevOps context and course goals', 'Introduce the purpose of Advanced GitHub Actions, the expected learning path and how the course is organized.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(362, 37, 'Setting up for Advanced GitHub Actions', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced GitHub Actions.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(363, 37, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to Advanced GitHub Actions.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(364, 37, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to Advanced GitHub Actions.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(365, 37, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to Advanced GitHub Actions.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(366, 37, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to Advanced GitHub Actions.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(367, 37, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to Advanced GitHub Actions.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(368, 37, 'Guided project in Advanced GitHub Actions', 'Apply the main concepts of Advanced GitHub Actions in a structured practical activity.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(369, 37, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to Advanced GitHub Actions.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(370, 37, 'Advanced GitHub Actions: final review', 'Review the most important ideas from Advanced GitHub Actions and define the next learning steps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(371, 38, 'Advanced Linux Administration: DevOps context and course goals', 'Introduce the purpose of Advanced Linux Administration, the expected learning path and how the course is organized.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(372, 38, 'Setting up for Advanced Linux Administration', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced Linux Administration.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(373, 38, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to Advanced Linux Administration.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(374, 38, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to Advanced Linux Administration.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(375, 38, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to Advanced Linux Administration.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(376, 38, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to Advanced Linux Administration.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(377, 38, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to Advanced Linux Administration.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(378, 38, 'Guided project in Advanced Linux Administration', 'Apply the main concepts of Advanced Linux Administration in a structured practical activity.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(379, 38, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to Advanced Linux Administration.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(380, 38, 'Advanced Linux Administration: final review', 'Review the most important ideas from Advanced Linux Administration and define the next learning steps.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(381, 39, 'Advanced CI/CD Pipelines: DevOps context and course goals', 'Introduce the purpose of Advanced CI/CD Pipelines, the expected learning path and how the course is organized.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(382, 39, 'Setting up for Advanced CI/CD Pipelines', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced CI/CD Pipelines.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(383, 39, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to Advanced CI/CD Pipelines.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(384, 39, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to Advanced CI/CD Pipelines.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(385, 39, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to Advanced CI/CD Pipelines.', '00:13:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(386, 39, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to Advanced CI/CD Pipelines.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(387, 39, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to Advanced CI/CD Pipelines.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(388, 39, 'Guided project in Advanced CI/CD Pipelines', 'Apply the main concepts of Advanced CI/CD Pipelines in a structured practical activity.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(389, 39, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to Advanced CI/CD Pipelines.', '00:11:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(390, 39, 'Advanced CI/CD Pipelines: final review', 'Review the most important ideas from Advanced CI/CD Pipelines and define the next learning steps.', '00:12:00', 'assets/videos/loopskill-class-placeholder.mp4', 10),
(391, 40, 'Advanced Docker for DevOps: DevOps context and course goals', 'Introduce the purpose of Advanced Docker for DevOps, the expected learning path and how the course is organized.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 1),
(392, 40, 'Setting up for Advanced Docker for DevOps', 'Prepare the tools, resources and working environment needed to follow the practical lessons of Advanced Docker for DevOps.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 2),
(393, 40, 'Core workflow concepts', 'Work through core workflow concepts using examples connected to Advanced Docker for DevOps.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 3),
(394, 40, 'Versioning or automation basics', 'Work through versioning or automation basics using examples connected to Advanced Docker for DevOps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 4),
(395, 40, 'Configuration and pipeline structure', 'Work through configuration and pipeline structure using examples connected to Advanced Docker for DevOps.', '00:10:00', 'assets/videos/loopskill-class-placeholder.mp4', 5),
(396, 40, 'Testing and validation steps', 'Work through testing and validation steps using examples connected to Advanced Docker for DevOps.', '00:05:00', 'assets/videos/loopskill-class-placeholder.mp4', 6),
(397, 40, 'Deployment-oriented practices', 'Work through deployment-oriented practices using examples connected to Advanced Docker for DevOps.', '00:06:00', 'assets/videos/loopskill-class-placeholder.mp4', 7),
(398, 40, 'Guided project in Advanced Docker for DevOps', 'Apply the main concepts of Advanced Docker for DevOps in a structured practical activity.', '00:07:00', 'assets/videos/loopskill-class-placeholder.mp4', 8),
(399, 40, 'Troubleshooting and common failures', 'Work through troubleshooting and common failures using examples connected to Advanced Docker for DevOps.', '00:08:00', 'assets/videos/loopskill-class-placeholder.mp4', 9),
(400, 40, 'Advanced Docker for DevOps: final review', 'Review the most important ideas from Advanced Docker for DevOps and define the next learning steps.', '00:09:00', 'assets/videos/loopskill-class-placeholder.mp4', 10);

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
(1, 1),
(1, 22),
(2, 2),
(2, 22),
(3, 3),
(3, 21),
(3, 23),
(4, 4),
(4, 21),
(5, 5),
(6, 6),
(6, 5),
(7, 7),
(7, 5),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(12, 11),
(13, 1),
(13, 24),
(14, 19),
(14, 20),
(14, 24),
(15, 18),
(15, 1),
(16, 17),
(16, 24),
(17, 13),
(17, 14),
(18, 16),
(19, 15),
(20, 11),
(20, 15),
(21, 2),
(21, 22),
(22, 2),
(22, 22),
(23, 1),
(23, 22),
(24, 3),
(24, 21),
(24, 23),
(25, 5),
(26, 6),
(26, 5),
(27, 7),
(27, 5),
(28, 8),
(29, 9),
(30, 10),
(31, 11),
(32, 12),
(32, 11),
(33, 1),
(33, 24),
(34, 19),
(34, 20),
(34, 24),
(35, 18),
(35, 1),
(36, 17),
(36, 24),
(37, 14),
(37, 15),
(38, 16),
(39, 15),
(40, 11),
(40, 15);

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
-- Indices de la tabla `plan_features`
--
ALTER TABLE `plan_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plan_id` (`plan_id`);

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
-- Indices de la tabla `lessons`
--
ALTER TABLE `lessons`
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

ALTER TABLE `plan_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

ALTER TABLE `course_outcomes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=401;

ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`);

ALTER TABLE `plan_features`
  ADD CONSTRAINT `plan_features_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`required_plan_id`) REFERENCES `plans` (`id`);

ALTER TABLE `course_outcomes`
  ADD CONSTRAINT `course_outcomes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

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
