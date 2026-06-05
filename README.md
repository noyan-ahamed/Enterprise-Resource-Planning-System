# Enterprise Resource Planning (ERP) System for Small Businesses

A full-stack Enterprise Resource Planning (ERP) system designed to streamline and automate business operations for small and medium-sized enterprises (SMEs).

The system centralizes Inventory, Purchase, Sales, Human Resources, Payroll, Accounting, and Reporting into a single platform, improving operational efficiency, data accuracy, and workflow transparency.

---

## Features

### Authentication & Security

* Secure login and authentication
* Role-based access control (Admin, HR, Employee)
* First-time password change functionality
* Auto-generated credentials for newly created HR and Employee accounts
* Email-based credential delivery

### Human Resource Management

* Employee management
* Attendance tracking
* Leave request submission
* Leave approval/rejection workflow
* Payroll processing and management

### Inventory & Purchase Management

* Supplier management
* Purchase management
* Inventory tracking
* Stock monitoring
* Product return management
* Automatic stock adjustment

### Accounting & Ledger

* Supplier ledger management
* Due and payment tracking
* Automated ledger updates
* Customer due collection workflow

### Sales Management

* Customer management
* Sales entry and tracking
* Customer due management

### Reporting & Dashboard

* Dashboard analytics
* Real-time dashboard updates using WebSocket
* Employee active/inactive status monitoring
* JasperReports integration
* Business reporting

### Email Notification System

* Welcome email for new users
* Auto-generated password delivery
* Business workflow notifications

---

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* REST API
* WebSocket

### Frontend

* Angular 21
* TypeScript
* Angular Material

### Database

* PostgreSQL

### Tools & Technologies

* Git
* GitHub
* Postman
* JasperReports
* Maven

---

## Project Structure

ERP-System

├── ERP-API (Spring Boot Backend)

└── ERP-UI (Angular Frontend)

---

## Default Admin Credentials

The system automatically creates a default administrator account on startup.

Email:

noyan@gmail.com

Password:

123456

After login, the administrator can create HR and Employee accounts.

When a new user is created:

* A system-generated password is created automatically
* Credentials are sent to the user's email
* The user can log in and change their password

---

## How to Run

### Backend

1. Open ERP-API project
2. Configure PostgreSQL database
3. Configure Gmail App Password
4. Run Spring Boot application

### Frontend

1. Open ERP-UI project
2. Install dependencies

npm install

3. Start Angular application

ng serve

4. Open browser

http://localhost:4200

---

## Future Enhancements

* Advanced analytics dashboard
* Multi-branch support
* Mobile application integration
* Export reports to PDF and Excel
* Audit logs and activity tracking

---

## Author

Noyon Ahamed

Full Stack Developer

### Connect With Me

Portfolio:
noyanahamed.netlify.app

LinkedIn:
linkedin.com/in/noyan-ahamed

GitHub:
github.com/noyan-ahamed
