-- Create database if not exists
CREATE DATABASE IF NOT EXISTS patient_data;
USE patient_data;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient records table
CREATE TABLE IF NOT EXISTS patient_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  age INT,
  gender VARCHAR(20),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  date_of_sample_collection DATE,
  referral_doctor VARCHAR(255),
  pre_counselor VARCHAR(255),
  address TEXT,
  test_names JSON,
  other_test VARCHAR(255),
  indications_for_testing TEXT,
  specific_genes TEXT,
  sample_types JSON,
  other_sample VARCHAR(255),
  complaints JSON,
  genetic_testing_reasons JSON,
  past_medical_history JSON,
  past_surgical_history JSON,
  family_history JSON,
  consanguineous_marriage VARCHAR(10),
  mental_health_history JSON,
  menstrual_cycles VARCHAR(50),
  infertility_history TEXT,
  erectile_dysfunction VARCHAR(10),
  medicines JSON,
  review_of_systems JSON,
  expandedSystems JSON,
  alcohol VARCHAR(50),
  smoking VARCHAR(50),
  wake_up_time TIME,
  bed_time TIME,
  workout VARCHAR(50),
  workout_frequency VARCHAR(50),
  active_sport_young VARCHAR(10),
  sleep VARCHAR(50),
  preferred_workout VARCHAR(100),
  meals_per_day INT,
  processed_foods VARCHAR(50),
  outside_food VARCHAR(50),
  carbonated_drinks VARCHAR(50),
  cuisine_preference JSON,
  other_cuisine_preference VARCHAR(255),
  blood_pressure VARCHAR(20),
  pulse_rate VARCHAR(20),
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  BMI DECIMAL(5,2),
  mandatory_tests JSON,
  dosha_v JSON,
  dosha_p JSON,
  dosha_k JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, password, role) 
VALUES ('admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Display results
SELECT 'Tables created successfully!' AS status;
SHOW TABLES;