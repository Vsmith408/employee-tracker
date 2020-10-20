DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30),
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee
(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    roles_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (id, name) VALUES (1, "Product");
INSERT INTO department (id, name) VALUES (2, "Engineering");
INSERT INTO department (id, name) VALUES (3, "Design");

INSERT INTO roles (id, title, salary, department_id) VALUES (1, "SWE", 100000.00, 2);
INSERT INTO roles (id, title, salary, department_id) VALUES (2, "PO", 50000.00, 1);
INSERT INTO roles (id, title, salary, department_id) VALUES (3, "UX Designer", 75000.00, 3);

INSERT INTO employee (id, first_name, last_name, roles_id, manager_id) VALUES (1, "Jane", "Doe", 1, null);
INSERT INTO employee (id, first_name, last_name, roles_id, manager_id) VALUES (2, "John", "Doe", 1, 1);
