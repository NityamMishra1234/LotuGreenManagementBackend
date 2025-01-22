import Student from '../models/Student.js';
import Room from '../models/Room.js';
import cloudinary from '../utils/cloudinaryConfig.js'; // Cloudinary configuration
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Payment from '../models/Payment.js';
// Register a new student and assign to a room
export const registerAndAssignStudent = async (req, res) => {
    const { 
        name, 
        email, 
        phone, 
        password, 
        fatherName, 
        fatherPhone, 
        fatherOccupation, 
        roomId, 
        bedNumber, 
        totalAmount,  // Total fee amount
        paymentType,   // Monthly or Yearly
        amountPaid     // Initial payment amount
    } = req.body;
    const file = req.file; // The file uploaded via multipart form-data
    
    try {
        // Fetch the room
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Ensure the room has available beds
        if (room.occupiedBeds >= room.totalBeds) {
            return res.status(400).json({ message: 'No available beds in this room' });
        }

        // Check if the student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this email already exists' });
        }

        // Upload profile image to Cloudinary if provided
        let profileImageUrl = '';
        if (file) {
            const result = await cloudinary.uploader.upload(file.path);
            profileImageUrl = result.secure_url;
        }

        // Create a new student instance
        const student = new Student({
            name,
            email,
            phone,
            password, // Ensure hashing is handled (e.g., pre-save hook)
            fatherName,
            fatherPhone,
            fatherOccupation,
            roomId,
            bedNumber,
            profileImage: profileImageUrl,
            totalAmount,
            paymentType
        });

        // Save the student record
        await student.save();

        // Create the payment record for the student
        const payment = new Payment({
            studentId: student._id,
            amountPaid: amountPaid || 0,
            remainingAmount: Math.max(totalAmount - (amountPaid || 0), 0),
            paymentDate: new Date(),
            status: amountPaid >= totalAmount ? 'Paid' : 'Pending',
            month: new Date().toLocaleString('default', { month: 'long' }),
            totalAmount,
            paymentType
          });
        

        // Save the payment record
        await payment.save();

        // Update the room's occupied beds count and assign the student
        room.occupiedBeds += 1;
        room.students.push(student._id); // Add the student to the room
        await room.save();

        // Response with student and payment details
        res.status(201).json({ 
            message: 'Student registered and assigned to room successfully', 
            student, 
            payment 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Update student (Switch to a different room)
export const updateStudent = async (req, res) => {
    const { studentId, newRoomId, newBedNumber } = req.body;

    try {
        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the new room exists
        const newRoom = await Room.findById(newRoomId);
        if (!newRoom) {
            return res.status(404).json({ message: 'New room not found' });
        }

        // Check if the bed is available in the new room
        if (newRoom.totalBeds - newRoom.occupiedBeds <= 0) {
            return res.status(400).json({ message: 'No available beds in this room' });
        }

        // Update the student's room and bed number
        student.roomId = newRoomId;
        student.bedNumber = newBedNumber;
        await student.save();

        // Update the rooms' occupied beds count
        // Update the old room
        const oldRoom = await Room.findById(student.roomId);
        oldRoom.occupiedBeds -= 1;
        await oldRoom.save();

        // Update the new room
        newRoom.occupiedBeds += 1;
        await newRoom.save();

        res.status(200).json({ message: 'Student switched to new room successfully', student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete student
export const deleteStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Remove the student from the room
        const room = await Room.findById(student.roomId);
        if (room) {
            room.occupiedBeds -= 1;
            await room.save();
        }

        // Delete the student
        await student.deleteOne();

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentDetails = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId).populate('roomId');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Log for debugging
        

        // Compare password
        const isMatch = await bcrypt.compare(password, student.password);
        

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            student
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('roomId', 'roomNumber totalBeds occupiedBeds');
        res.status(200).json({
            message: 'Fetched all students successfully',
            students,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
