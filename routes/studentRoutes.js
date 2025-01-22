import express from 'express';
import { 
    registerAndAssignStudent, 
    updateStudent, 
    deleteStudent, 
    loginStudent, 
    getStudentDetails, 
    getAllStudents 
} from '../controllers/studentController.js';
import { verifyOwner } from '../middleware/authMiddleware.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

// Specific routes first
router.get('/all', verifyOwner, getAllStudents);
router.get('/:studentId', getStudentDetails);

// Register and Assign Student to Room
router.post('/register', verifyOwner, upload.single('profileImage'), registerAndAssignStudent);

// Student login
router.post('/login', loginStudent);

// Update Student (Switch Room)
router.put('/update/:studentId', verifyOwner, updateStudent);

// Delete Student
router.delete('/delete/:studentId', verifyOwner, deleteStudent);

export default router;
