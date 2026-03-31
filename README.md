# 🎓 Smart Classroom & Timetable Scheduler - Complete Guide

## 📋 Table of Contents
1. [Features Overview](#features-overview)
2. [Getting Started](#getting-started)
3. [User Credentials](#user-credentials)
4. [How to Use Each Feature](#how-to-use-each-feature)
5. [API Endpoints](#api-endpoints)
6. [File Structure](#file-structure)

---

## ✨ Features Overview

### 1️⃣ **Admin Portal** 👨‍🏫
- ✅ Admin login system
- ✅ Generate automatic timetables
- ✅ Mark and view student attendance
- ✅ View all student records
- ✅ Professional dashboard UI

### 2️⃣ **Student Portal** 👨‍🎓
- ✅ Individual student login (Roll Number + Password)
- ✅ View personal timetable based on department & semester
- ✅ Check personal attendance with statistics
- ✅ Attendance percentage calculator
- ✅ Download timetable as PDF (feature ready)
- ✅ Professional student dashboard

### 3️⃣ **Timetable Management** 📅
- ✅ Automatic timetable generation
- ✅ Department-wise and semester-wise scheduling
- ✅ Room allocation
- ✅ Faculty assignment
- ✅ Break and lunch periods included

### 4️⃣ **Attendance System** 📝
- ✅ Mark attendance by name
- ✅ View all attendance records
- ✅ Timestamp tracking
- ✅ Student-specific attendance filtering
- ✅ Visual statistics display

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MySQL Server running
- Modern web browser (Chrome, Firefox, Edge)

### Installation Steps

1. **Install Dependencies**
```powershell
npm install
```

2. **Start MySQL and Create Database**
```sql
CREATE DATABASE smartclass;
```

3. **Run the Server**
```powershell
npm start
```

4. **Access the Application**
- Open browser and go to: `c:\Users\Admin\OneDrive\Desktop\smart-classroom\login.html`
- Or use Live Server in VS Code

---

## 🔐 User Credentials

### **Admin Login:**
- **Username:** `admin`
- **Password:** `1234`
- **Access:** Full admin dashboard with all controls

### **Student Logins (Pre-registered):**

#### Student 1:
- **Roll Number:** `STU001`
- **Password:** `student123`
- **Department:** Computer Science
- **Semester:** 3

#### Student 2:
- **Roll Number:** `STU002`
- **Password:** `student123`
- **Department:** Computer Science
- **Semester:** 3

#### Student 3:
- **Roll Number:** `STU003`
- **Password:** `student123`
- **Department:** Electronics
- **Semester:** 2

---

## 📖 How to Use Each Feature

### **For Admin:**

#### 1. Login as Admin
1. Open `login.html`
2. Enter Username: `admin`, Password: `1234`
3. Click "Login as Admin"

#### 2. Generate Timetable
1. From Dashboard, click "Generate Now" button
2. Timetable will be automatically generated
3. Shows subjects, faculty, and room numbers

#### 3. Mark Attendance
1. Click "Manage Attendance" or go to Attendance page
2. Enter student name in the input field
3. Click "Mark Present ✓" button
4. Attendance is saved with timestamp

#### 4. View All Attendance
1. On Attendance page, click "View All 📊" button
2. See complete attendance records with:
   - Serial number
   - Student name
   - Status (Present badge)
   - Timestamp

### **For Students:**

#### 1. Student Login
1. Open `login.html`
2. Click "👨‍🎓 Student Login" button
3. OR directly open `student-login.html`
4. Enter Roll Number and Password
5. Click "Login"

#### 2. View Personal Information
1. After login, your info card shows:
   - Name
   - Roll Number
   - Department
   - Semester
   - Email

#### 3. View Personal Timetable
1. Your timetable automatically loads based on your department & semester
2. Shows all your classes for the week
3. Includes subject names, faculty, and room numbers
4. Breaks and lunch periods marked clearly

#### 4. Check Attendance Statistics
1. Scroll to "My Attendance" section
2. View statistics cards showing:
   - Total days attended
   - Days present
   - Days absent
   - Attendance percentage (color-coded)
      - Green: ≥75%
      - Yellow: ≥60%
      - Red: <60%

#### 5. Download Timetable PDF
1. Click "📄 Download PDF" button on timetable section
2. (Feature placeholder - can be implemented with html2pdf.js library)

---

## 🔌 API Endpoints

### Authentication
- `POST /login` - Admin login
- `POST /student-login` - Student login

### Attendance
- `POST /attendance` - Mark attendance
- `GET /attendance` - Get all attendance records

### Timetable
- `GET /student-timetable/:department/:semester` - Get student's timetable
- `GET /admin/timetable` - Get all timetables (Admin)
- `POST /admin/timetable` - Add/Update timetable slot (Admin)
- `DELETE /admin/timetable/:id` - Delete timetable slot (Admin)

### Students (Admin)
- `POST /admin/register-student` - Register new student
- `GET /admin/students` - Get all students

---

## 📁 File Structure

```
smart-classroom/
│
├── login.html              # Main login page (Admin & Student link)
├── student-login.html      # Student login portal
├── student-portal.html     # Student dashboard
├── dashboard.html          # Admin dashboard
├── attendance.html         # Attendance management page
│
├── script.js               # All JavaScript functions
├── style.css               # Professional styling
├── server.js               # Express backend server
│
├── package.json            # Dependencies
└── README.md              # This file
```

---

## 🎨 Professional Features

### UI/UX Enhancements:
- ✨ Glass-morphism effects
- ✨ Smooth animations and transitions
- ✨ Gradient backgrounds (Purple theme)
- ✨ Hover effects on all interactive elements
- ✨ Responsive design for mobile/tablet
- ✨ Professional color scheme
- ✨ Clean typography hierarchy

### Color Palette:
- Primary: Purple gradient (#667eea → #764ba2)
- Secondary: Pink gradient (#f093fb → #f5576c)
- Success: Green (#22c55e)
- Warning: Orange (#f59e0b)
- Danger: Red (#ef4444)

---

## 🛠️ Troubleshooting

### Server Not Starting?
1. Check if Node.js is installed: `node --version`
2. Run `npm install` to install dependencies
3. Ensure MySQL is running
4. Check port 3000 is not in use

### Database Connection Error?
1. Verify MySQL credentials in `server.js`
2. Ensure database `smartclass` exists
3. Check MySQL service is running

### Student Login Not Working?
1. Ensure students table is created (auto-created on server start)
2. Use correct roll number format: `STU001`, `STU002`, etc.
3. Password is case-sensitive: `student123`

### Timetable Not Showing?
1. For students: Ensure department and semester match database
2. For admin: Click "Generate Now" to create timetable
3. Check console for errors (F12 → Console)

---

## 🎯 Future Enhancements (Ready to Implement)

1. **Drag & Drop Timetable Editor** - Advanced UI for easy scheduling
2. **PDF Export** - Using html2pdf.js library
3. **Email Notifications** - Send timetable to students via email
4. **QR Code Attendance** - Quick attendance marking
5. **Mobile App** - React Native version
6. **Video Integration** - Online class links in timetable
7. **Holiday Management** - Mark holidays and auto-adjust timetable
8. **Substitution Management** - Handle teacher substitutions
9. **Analytics Dashboard** - Charts and graphs for attendance trends
10. **Notification System** - Alerts for low attendance

---

## 📞 Support

For any issues or questions:
1. Check console logs (F12 in browser)
2. Review server terminal output
3. Verify database connection
4. Check network tab for API errors

---

## 📄 License

This project is created for educational purposes.

---

## 🙏 Acknowledgments

Built with:
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Design:** Custom professional UI

---

**Happy Teaching & Learning! 🎓✨**
