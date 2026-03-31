// 🔐 LOGIN FUNCTION
function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);  // 🔥 check console

        if (data.status === "success") {
            window.location.href = "dashboard.html";  // ✅ redirect to dashboard
        } else {
            alert("Invalid Login ❌");
        }
    })
    .catch(err => console.log("Error:", err));
}

// 📅 TIMETABLE GENERATOR
function generateTimetable() {
    let table = document.getElementById("timetable");

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"];
    let staff = ["Dr. A Kumar", "Prof. B Sharma", "Dr. C Patel", "Prof. D Singh", "Dr. E Reddy"];

    // Clear old data
    table.innerHTML = `
    <tr>
        <th>Day</th>
        <th>9:00 - 10:00</th>
        <th>10:00 - 10:50</th>
        <th>10:50 - 11:05<br><small>Break</small></th>
        <th>11:05 - 12:00</th>
        <th>12:00 - 1:00</th>
        <th>1:00 - 2:00<br><small>Lunch</small></th>
        <th>2:00 - 2:50</th>
        <th>2:50 - 3:05<br><small>Break</small></th>
        <th>3:05 - 4:00</th>
    </tr>`;

    for (let i = 0; i < days.length; i++) {
        let row = table.insertRow();
        
        // Day column with styling
        let dayCell = row.insertCell(0);
        dayCell.innerHTML = `<strong style="color: #667eea;">${days[i]}</strong>`;

        for (let j = 0; j < 9; j++) {
            if (j == 2 || j == 5 || j == 7) { // Break & Lunch
                let breakCell = row.insertCell(j + 1);
                breakCell.innerHTML = `<span style="color: #f5576c; font-weight: 600;">☕ Break</span>`;
                breakCell.style.background = "#fff5f5";
            } else {
                let sub = subjects[Math.floor(Math.random() * subjects.length)];
                let teacher = staff[Math.floor(Math.random() * staff.length)];
                let cell = row.insertCell(j + 1);
                cell.innerHTML = `<div style="text-align: center;"><span style="display: block; color: #667eea; font-weight: 700; font-size: 14px;">${sub}</span><span style="display: block; color: #888; font-size: 12px; margin-top: 4px;">${teacher}</span></div>`;
            }
        }
    }
    
    alert("✅ Timetable generated successfully!");
}

// 📝 MARK ATTENDANCE
function markAttendance() {
    let name = document.getElementById("name").value.trim();
    
    if (!name) {
        alert("Please enter student name! ⚠️");
        return;
    }

    fetch("http://localhost:3000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, status: "Present" })
    })
    .then(res => res.text())
    .then(data => {
        alert("✅ Attendance marked for " + name);
        document.getElementById("name").value = "";
        loadAttendance(); // Refresh the table
    })
    .catch(err => console.log("Error:", err));
}

// 📊 LOAD ATTENDANCE
function loadAttendance() {
    fetch("http://localhost:3000/attendance")
        .then(res => res.json())
        .then(data => {
            let table = document.getElementById("attTable");

            table.innerHTML = `
            <tr>
                <th>Sl. No</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Login Time</th>
                <th>Date</th>
                <th>Timestamp</th>
            </tr>`;

            data.forEach((item, index) => {
                let row = table.insertRow();
                let slNo = index + 1;
                let timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
                let loginTimeDisplay = item.login_time || (item.status === 'Absent' ? '-' : 'N/A');
                let dateDisplay = item.date ? new Date(item.date).toLocaleDateString() : 'N/A';
                
                row.insertCell(0).innerHTML = `<strong>${slNo}</strong>`;
                row.insertCell(1).innerHTML = `<span style="color: #667eea; font-weight: 600;">${item.name}</span>`;
                
                // Status with color coding
                const statusColor = item.status === 'Present' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 
                                   item.status === 'Absent' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#888';
                row.insertCell(2).innerHTML = `<span style="background: ${statusColor}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">${item.status}</span>`;
                
                row.insertCell(3).innerHTML = `<small style="color: #555; font-weight: 600;">${loginTimeDisplay}</small>`;
                row.insertCell(4).innerHTML = `<small style="color: #666;">${dateDisplay}</small>`;
                row.insertCell(5).innerHTML = `<small style="color: #888;">${timestamp}</small>`;
            });
            
            if (data.length === 0) {
                let row = table.insertRow();
                row.innerHTML = `<td colspan="6" style="text-align: center; padding: 30px; color: #999; font-style: italic;">No attendance records found. Mark your first attendance! 📝</td>`;
            }
        })
        .catch(err => console.log("Error:", err));
}

// 👨‍🎓 STUDENT LOGIN FUNCTION
function studentLogin() {
    let roll_number = document.getElementById("roll_number").value.trim();
    let password = document.getElementById("student_password").value.trim();

    if(!roll_number || !password) {
        alert("Please enter both Roll Number and Password! ⚠️");
        return;
    }

    fetch("http://localhost:3000/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll_number, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.status === "success") {
            // Save student data to localStorage
            localStorage.setItem('currentStudent', JSON.stringify(data.student));
            
            // 🎯 AUTO-MARK ATTENDANCE on login
            markAutoAttendance(data.student);
            
            alert("✅ Login successful! Redirecting to portal...");
            window.location.href = "student-portal.html";
        } else {
            alert("Invalid Login ❌ - Please check your credentials");
        }
    })
    .catch(err => console.log("Error:", err));
}

// 🎯 AUTO-MARK ATTENDANCE WHEN STUDENT LOGINS
function markAutoAttendance(student) {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if already marked today
    fetch(`http://localhost:3000/attendance?student_id=${student.id}&date=${currentDate}`)
        .then(res => res.json())
        .then(existingRecords => {
            if (existingRecords.length === 0) {
                // Not marked yet, so mark present
                const loginTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                
                fetch("http://localhost:3000/attendance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        name: student.name,
                        status: "Present",
                        student_id: student.id,
                        login_time: loginTime,
                        date: currentDate
                    })
                })
                .then(res => res.text())
                .then(data => {
                    console.log("✅ Auto-attendance marked:", data);
                })
                .catch(err => console.log("Error marking attendance:", err));
            } else {
                console.log("Attendance already marked for today");
            }
        })
        .catch(err => console.log("Error checking existing attendance:", err));
}

// 📋 LOAD STUDENT TIMETABLE
function loadStudentTimetable(department, semester) {
    console.log('Loading timetable for:', department, 'Semester:', semester); // Debug log
    
    fetch(`http://localhost:3000/student-timetable/${department}/${semester}`)
        .then(res => res.json())
        .then(data => {
            console.log('Student timetable data:', data); // Debug log
            console.log('Number of classes found:', data.length);
            
            let table = document.getElementById("student-timetable");
            
            // Keep only the header row
            table.innerHTML = `
            <tr>
                <th>Day</th>
                <th>9:00 - 10:00</th>
                <th>10:00 - 10:50</th>
                <th>10:50 - 11:05<br><small>Break</small></th>
                <th>11:05 - 12:00</th>
                <th>12:00 - 13:00</th>
                <th>13:00 - 14:00<br><small>Lunch</small></th>
                <th>14:00 - 14:50</th>
                <th>14:50 - 15:05<br><small>Break</small></th>
                <th>15:05 - 16:00</th>
            </tr>`;
            
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            const timeSlots = [
                { start: '09:00', end: '10:00' }, 
                { start: '10:00', end: '10:50' }, 
                null, 
                { start: '11:05', end: '12:00' },
                { start: '12:00', end: '13:00' }, 
                null, 
                { start: '14:00', end: '14:50' }, 
                null, 
                { start: '15:05', end: '16:00' }
            ];
            
            days.forEach(day => {
                let row = table.insertRow();
                let dayCell = row.insertCell(0);
                dayCell.innerHTML = `<strong style="color: #667eea;">${day}</strong>`;
                
                timeSlots.forEach((slot, index) => {
                    let cell = row.insertCell(index + 1);
                    
                    if(slot === null) {
                        // Break/Lunch time
                        let breakText = index === 2 ? "☕ Break" : index === 5 ? "🍽️ Lunch" : "☕ Break";
                        cell.innerHTML = `<span style="color: #f5576c; font-weight: 600;">${breakText}</span>`;
                        cell.style.background = "#fff5f5";
                    } else {
                        // Find matching class for this day and time
                        let classData = data.find(item => 
                            item.day === day && 
                            item.start_time && 
                            item.start_time.substring(0, 5) === slot.start
                        );
                        
                        if(classData) {
                            cell.innerHTML = `<div style="text-align: center;">
                                <span style="display: block; color: #667eea; font-weight: 700; font-size: 14px;">${classData.subject}</span>
                                <span style="display: block; color: #888; font-size: 12px; margin-top: 4px;">👨‍🏫 ${classData.teacher}</span>
                            </div>`;
                        } else {
                            cell.innerHTML = `<span style="color: #ccc;">No Class</span>`;
                        }
                    }
                });
            });
        })
        .catch(err => console.error("Error loading timetable:", err));
}

// 📊 LOAD MY ATTENDANCE (Student specific)
function loadMyAttendance() {
    const student = JSON.parse(localStorage.getItem('currentStudent'));
    if(!student) return;
    
    fetch("http://localhost:3000/attendance")
        .then(res => res.json())
        .then(data => {
            // Filter attendance for this student
            let myAttendance = data.filter(item => 
                item.name.toLowerCase().includes(student.name.toLowerCase()) || 
                item.student_id === student.id
            );
            
            // Calculate statistics
            let total = myAttendance.length;
            let present = myAttendance.filter(item => item.status === "Present").length;
            let absent = myAttendance.filter(item => item.status === "Absent").length;
            let percentage = total > 0 ? Math.round((present / total) * 100) : 0;
            
            // Update stats display
            document.getElementById('total-days').textContent = total;
            document.getElementById('present-days').textContent = present;
            document.getElementById('absent-days').textContent = absent;
            document.getElementById('attendance-percent').textContent = percentage + '%';
            
            // Color code percentage
            let percentElem = document.getElementById('attendance-percent');
            if(percentage >= 75) {
                percentElem.style.color = '#22c55e';
            } else if(percentage >= 60) {
                percentElem.style.color = '#f59e0b';
            } else {
                percentElem.style.color = '#ef4444';
            }
            
            console.log(`📊 Attendance Stats - Total: ${total}, Present: ${present}, Absent: ${absent}, Percentage: ${percentage}%`);
        })
        .catch(err => console.log("Error:", err));
}

// 📄 DOWNLOAD TIMETABLE AS PDF
function downloadTimetablePDF() {
    const element = document.getElementById('student-timetable');
    
    // Get student info for filename
    const student = JSON.parse(localStorage.getItem('currentStudent'));
    const studentName = student ? student.name.replace(/\s+/g, '_') : 'Student';
    const date = new Date().toISOString().split('T')[0];
    
    // PDF options
    const opt = {
        margin:       [10, 10, 10, 10], // top, left, bottom, right
        filename:     `Timetable_${studentName}_${date}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    // Show loading message
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '⏳ Generating PDF...';
    btn.disabled = true;
    
    // Generate PDF
    html2pdf().set(opt).from(element).save().then(() => {
        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error('Error generating PDF:', err);
        alert('❌ Error generating PDF. Please try again.');
        btn.textContent = originalText;
        btn.disabled = false;
    });
}

// 👨‍🏫 ADMIN PANEL FUNCTIONS

// Open Admin Panel
function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    loadAllTimetableSlots();
}

// Close Admin Panel
function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('adminPanel');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Show/Hide Tabs
function showTab(tabName) {
    // Hide all tabs
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }
    
    // Remove active class from all buttons
    const tabButtons = document.getElementsByClassName('tab-btn');
    for (let btn of tabButtons) {
        btn.classList.remove('active');
    }
    
    // Show selected tab and activate button
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load draggable timetable if drag & drop tab is selected
    if (tabName === 'dragDrop') {
        loadDraggableTimetable();
    }
}

// Load all timetable slots for editing
function loadAllTimetableSlots() {
    fetch('http://localhost:3000/admin/timetable')
        .then(res => res.json())
        .then(data => {
            console.log('Loaded timetable slots:', data); // Debug log
            const slotsList = document.getElementById('slotsList');
            slotsList.innerHTML = '';
            
            if (data.length === 0) {
                slotsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No timetable slots found. Add your first slot! 📅</p>';
                return;
            }
            
            data.forEach(slot => {
                const slotItem = document.createElement('div');
                slotItem.className = 'slot-item';
                // Format time from HH:MM:SS to HH:MM
                const startTime = slot.start_time ? slot.start_time.substring(0, 5) : 'N/A';
                const endTime = slot.end_time ? slot.end_time.substring(0, 5) : 'N/A';
                const timeSlot = `${startTime}-${endTime}`;
                
                slotItem.innerHTML = `
                    <div class="slot-info">
                        <h4>${slot.subject} - ${slot.day} (${timeSlot})</h4>
                        <div class="slot-details">
                            👨‍🏫 Teacher: ${slot.teacher}
                        </div>
                    </div>
                    <div class="slot-actions">
                        <button class="btn-edit" onclick="editSlot(${slot.id})">✏️ Edit</button>
                        <button class="btn-delete" onclick="deleteSlot(${slot.id})">🗑️ Delete</button>
                    </div>
                `;
                slotsList.appendChild(slotItem);
            });
        })
        .catch(err => {
            console.error('Error loading slots:', err);
            document.getElementById('slotsList').innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 40px;">❌ Error loading slots. Check console for details.</p>';
        });
}

// Edit existing slot
function editSlot(slotId) {
    fetch(`http://localhost:3000/admin/timetable`)
        .then(res => res.json())
        .then(data => {
            const slot = data.find(s => s.id === slotId);
            if (!slot) return;
            
            // Switch to add slot tab and populate form
            showTab('addSlot');
            
            // Populate form with existing data
            document.getElementById('dayOfWeek').value = slot.day;
            // Convert time to format matching select options
            const startTime = slot.start_time ? slot.start_time.substring(0, 5) : '9:00';
            const endTime = slot.end_time ? slot.end_time.substring(0, 5) : '10:00';
            const timeSlot = `${startTime}-${endTime}`;
            document.getElementById('timeSlot').value = timeSlot;
            document.getElementById('subject').value = slot.subject;
            document.getElementById('faculty').value = slot.teacher;
            document.getElementById('department').value = slot.department || '';
            document.getElementById('semester').value = slot.semester || '';
            
            // Store the ID for update
            document.getElementById('addSlotForm').dataset.editId = slotId;
            
            // Change button text
            const submitBtn = document.querySelector('#addSlotForm button[type="submit"]');
            submitBtn.textContent = 'Update Slot';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-edit');
        })
        .catch(err => console.log('Error:', err));
}

// Delete slot
function deleteSlot(slotId) {
    if (!confirm('Are you sure you want to delete this timetable slot? ⚠️')) {
        return;
    }
    
    fetch(`http://localhost:3000/admin/timetable/${slotId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert('✅ Timetable slot deleted successfully!');
            loadAllTimetableSlots();
        } else {
            alert('❌ Failed to delete slot');
        }
    })
    .catch(err => console.log('Error:', err));
}

// Add new slot form submission
document.addEventListener('DOMContentLoaded', function() {
    const addSlotForm = document.getElementById('addSlotForm');
    if (addSlotForm) {
        addSlotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const timeSlot = document.getElementById('timeSlot').value;
            const [startTime, endTime] = timeSlot.split('-');
            
            const formData = {
                day: document.getElementById('dayOfWeek').value,
                start_time: startTime + ':00',
                end_time: endTime + ':00',
                subject: document.getElementById('subject').value,
                teacher: document.getElementById('faculty').value,
                department: document.getElementById('department').value,
                semester: parseInt(document.getElementById('semester').value)
            };
            
            // Check if we're editing an existing slot
            const editId = this.dataset.editId;
            if (editId) {
                formData.id = parseInt(editId);
            }
            
            fetch('http://localhost:3000/admin/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(editId ? '✅ Slot updated successfully!' : '✅ Slot added successfully!');
                    this.reset();
                    delete this.dataset.editId;
                    
                    // Reset button
                    const submitBtn = document.querySelector('#addSlotForm button[type="submit"]');
                    submitBtn.textContent = 'Add Slot';
                    submitBtn.classList.add('btn-primary');
                    submitBtn.classList.remove('btn-edit');
                    
                    loadAllTimetableSlots();
                    loadDraggableTimetable(); // Refresh draggable list
                } else {
                    alert('❌ ' + data.message);
                }
            })
            .catch(err => console.log('Error:', err));
        });
    }
});

// Load Draggable Timetable
function loadDraggableTimetable() {
    fetch('http://localhost:3000/admin/timetable')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('draggableTimetable');
            container.innerHTML = '';
            
            if (data.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No slots available. Add some slots first! 📅</p>';
                return;
            }
            
            data.forEach((slot, index) => {
                const draggableSlot = document.createElement('div');
                draggableSlot.className = 'draggable-slot';
                draggableSlot.draggable = true;
                draggableSlot.dataset.id = slot.id;
                draggableSlot.dataset.index = index;
                draggableSlot.innerHTML = `
                    <strong>${slot.subject}</strong><br>
                    <small>📅 ${slot.day_of_week} | ⏰ ${slot.time_slot}</small><br>
                    <small>👨‍🏫 ${slot.faculty} | 📍 ${slot.room_number || 'Room'}</small>
                `;
                
                // Drag events
                draggableSlot.addEventListener('dragstart', handleDragStart);
                draggableSlot.addEventListener('dragover', handleDragOver);
                draggableSlot.addEventListener('drop', handleDrop);
                draggableSlot.addEventListener('dragend', handleDragEnd);
                
                container.appendChild(draggableSlot);
            });
        })
        .catch(err => console.log('Error loading draggable timetable:', err));
}

// Drag and Drop handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('over');
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        // Get all draggable slots
        const slots = document.querySelectorAll('.draggable-slot');
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // Swap the slots in the UI
        const temp = slots[draggedIndex].outerHTML;
        slots[draggedIndex].outerHTML = slots[targetIndex].outerHTML;
        slots[targetIndex].outerHTML = temp;
        
        // Update indices
        const newSlots = document.querySelectorAll('.draggable-slot');
        newSlots.forEach((slot, idx) => {
            slot.dataset.index = idx;
        });
        
        // Here you would typically send the new order to the server
        // For now, we'll just show a success message
        alert('✅ Slots reordered! (Note: Backend reordering logic can be added)');
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    const slots = document.querySelectorAll('.draggable-slot');
    slots.forEach(slot => slot.classList.remove('over'));
}
