const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dharani@29",
    database: "smartclass"
});

db.connect(err => {
    if(err){
        console.log("❌ DB Error:", err);
    } else {
        console.log("✅ Database connected");
        // Create students table if not exists
        db.query(`CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            roll_number VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            department VARCHAR(50),
            semester INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if(err) console.log("Error creating students table:", err);
            else console.log("✅ Students table ready");
        });
        
        // Create timetable table if not exists
        db.query(`CREATE TABLE IF NOT EXISTS timetable (
            id INT AUTO_INCREMENT PRIMARY KEY,
            day VARCHAR(20) NOT NULL,
            start_time TIME,
            end_time TIME,
            subject VARCHAR(100) NOT NULL,
            teacher VARCHAR(100) NOT NULL,
            department VARCHAR(50),
            semester INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if(err) console.log("Error creating timetable table:", err);
            else console.log("✅ Timetable table ready");
        });
        
        // Create attendance table if not exists with new columns
        db.query(`CREATE TABLE IF NOT EXISTS attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            status VARCHAR(20) NOT NULL,
            student_id INT,
            login_time VARCHAR(20),
            date DATE,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if(err) console.log("Error creating attendance table:", err);
            else console.log("✅ Attendance table ready");
        });
    }
});

// 🎯 FUNCTION TO MARK ABSENT FOR STUDENTS WHO DIDN'T LOGIN
function markAbsentForNonLogin() {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get all students
    db.query("SELECT * FROM students", (err, students) => {
        if(err) {
            console.log("Error getting students:", err);
            return;
        }
        
        // Get students who already have attendance today
        db.query("SELECT student_id FROM attendance WHERE date = ?", [currentDate], (err, attendedStudents) => {
            if(err) {
                console.log("Error getting attended students:", err);
                return;
            }
            
            const attendedIds = attendedStudents.map(s => s.student_id);
            
            // Find students who didn't login (not in attended list)
            const absentStudents = students.filter(s => !attendedIds.includes(s.id));
            
            if(absentStudents.length === 0) {
                console.log("All students are present today!");
                return;
            }
            
            // Mark absent for remaining students
            const absentPromises = absentStudents.map(student => {
                return new Promise((resolve, reject) => {
                    const sql = "INSERT INTO attendance (name, status, student_id, date) VALUES (?, 'Absent', ?, ?)";
                    db.query(sql, [student.name, student.id, currentDate], (err) => {
                        if(err) {
                            console.log(`Error marking absent for ${student.name}:`, err);
                            reject(err);
                        } else {
                            console.log(`Marked ${student.name} as Absent`);
                            resolve();
                        }
                    });
                });
            });
            
            Promise.all(absentPromises)
                .then(() => {
                    console.log(`✅ Auto-marked ${absentStudents.length} students as Absent`);
                })
                .catch(err => {
                    console.log("Error in batch absent marking:", err);
                });
        });
    });
}

app.listen(3000, () => {
    console.log("Server running 🚀");
    
    // 🎯 AUTO-MARK ABSENT at end of day (4:30 PM)
    const schedule = require('node-cron');
    
    // Schedule job to run at 4:30 PM every day
    schedule.schedule('30 16 * * *', () => {
        console.log('Running auto-absent marking job...');
        markAbsentForNonLogin();
    });
});
app.post("/login", (req, res) => {

    const {username, password} = req.body;

    const sql = "SELECT * FROM users WHERE username=? AND password=?";

    db.query(sql, [username, password], (err, result) => {

        if(err) throw err;

        if(result.length > 0){
            res.json({status: "success"});
        } else {
            res.json({status: "fail"});
        }

    });
});

// 📝 ATTENDANCE ENDPOINTS
app.post("/attendance", (req, res) => {
    const { name, status, student_id, login_time, date } = req.body;
    
    const sql = "INSERT INTO attendance (name, status, student_id, login_time, date) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [name, status, student_id || null, login_time || null, date || null], (err, result) => {
        if(err) {
            console.log("Error:", err);
            res.status(500).send("Error saving attendance");
        } else {
            res.send("Attendance saved successfully");
        }
    });
});

// Get attendance with filters
app.get("/attendance", (req, res) => {
    const { student_id, date } = req.query;
    
    let sql = "SELECT * FROM attendance WHERE 1=1";
    const params = [];
    
    if (student_id) {
        sql += " AND student_id = ?";
        params.push(student_id);
    }
    
    if (date) {
        sql += " AND date = ?";
        params.push(date);
    }
    
    sql += " ORDER BY timestamp DESC";
    
    db.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error:", err);
            res.status(500).json([]);
        } else {
            res.json(result);
        }
    });
});

// 👨‍🎓 STUDENT LOGIN
app.post("/student-login", (req, res) => {
    const { roll_number, password } = req.body;
    
    const sql = "SELECT * FROM students WHERE roll_number=? AND password=?";
    
    db.query(sql, [roll_number, password], (err, result) => {
        if(err) {
            console.log("Error:", err);
            res.json({ status: "error", message: "Database error" });
        } else if(result.length > 0) {
            res.json({ 
                status: "success", 
                student: result[0]
            });
        } else {
            res.json({ status: "fail", message: "Invalid credentials" });
        }
    });
});

// 📋 GET STUDENT TIMETABLE
app.get("/student-timetable/:department/:semester", (req, res) => {
    const { department, semester } = req.params;
    
    // Filter by department and semester
    const sql = "SELECT * FROM timetable WHERE department=? AND semester=? ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), start_time";
    
    db.query(sql, [department, parseInt(semester)], (err, result) => {
        if(err) {
            console.log("Error:", err);
            res.status(500).json([]);
        } else {
            res.json(result);
        }
    });
});

// 👨‍🏫 ADMIN - GET ALL TIMETABLES
app.get("/admin/timetable", (req, res) => {
    const sql = "SELECT * FROM timetable ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), start_time";
    
    db.query(sql, (err, result) => {
        if(err) {
            console.log("Error:", err);
            res.status(500).json([]);
        } else {
            res.json(result);
        }
    });
});

// 👨‍🏫 ADMIN - ADD/UPDATE TIMETABLE SLOT
app.post("/admin/timetable", (req, res) => {
    const { day, start_time, end_time, subject, teacher, department, semester, id } = req.body;
    
    if(id) {
        // Update existing
        const sql = "UPDATE timetable SET day=?, start_time=?, end_time=?, subject=?, teacher=?, department=?, semester=? WHERE id=?";
        db.query(sql, [day, start_time, end_time, subject, teacher, department, parseInt(semester), id], (err) => {
            if(err) {
                console.log("Error:", err);
                res.status(500).json({ status: "error", message: "Failed to update" });
            } else {
                res.json({ status: "success", message: "Timetable updated successfully" });
            }
        });
    } else {
        // Insert new
        const sql = "INSERT INTO timetable (day, start_time, end_time, subject, teacher, department, semester) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [day, start_time, end_time, subject, teacher, department, parseInt(semester)], (err) => {
            if(err) {
                console.log("Error:", err);
                res.status(500).json({ status: "error", message: "Failed to add" });
            } else {
                res.json({ status: "success", message: "Timetable slot added successfully" });
            }
        });
    }
});

// 👨‍🏫 ADMIN - DELETE TIMETABLE SLOT
app.delete("/admin/timetable/:id", (req, res) => {
    const { id } = req.params;
    
    const sql = "DELETE FROM timetable WHERE id=?";
    
    db.query(sql, [id], (err) => {
        if(err) {
            console.log("Error:", err);
            res.status(500).json({ status: "error", message: "Failed to delete" });
        } else {
            res.json({ status: "success", message: "Timetable slot deleted successfully" });
        }
    });
});

// 👨‍🏫 ADMIN - REGISTER STUDENT
app.post("/admin/register-student", (req, res) => {
    const { roll_number, name, email, password, department, semester } = req.body;
    
    const sql = "INSERT INTO students (roll_number, name, email, password, department, semester) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [roll_number, name, email, password, department, parseInt(semester)], (err) => {
        if(err) {
            console.log("Error:", err);
            if(err.code === 'ER_DUP_ENTRY') {
                res.json({ status: "error", message: "Roll number or email already exists" });
            } else {
                res.status(500).json({ status: "error", message: "Failed to register student" });
            }
        } else {
            res.json({ status: "success", message: "Student registered successfully" });
        }
    });
});

// 👨‍🏫 ADMIN - GET ALL STUDENTS
app.get("/admin/students", (req, res) => {
    const sql = "SELECT * FROM students ORDER BY created_at DESC";
    
    db.query(sql, (err, result) => {
        if(err) {
            console.log("Error:", err);
            res.status(500).json([]);
        } else {
            res.json(result);
        }
    });
});
