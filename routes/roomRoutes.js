import express from 'express';
import { 
    addRoom, 
    getAllRooms, 
    getRoomDetails, 
    
} from '../controllers/roomController.js';
import { verifyOwner } from '../middleware/authMiddleware.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

// Add Room (by PG Owner)
router.post('/room', verifyOwner, addRoom);

// Get All Rooms (by PG Owner)
router.get('/rooms', verifyOwner, getAllRooms);

// Get Room Details (by PG Owner)
router.get('/room/:roomId', verifyOwner, getRoomDetails);

// Assign Student to Room (by PG Owner)
// router.post('/room/:roomId/assign-student', verifyOwner, upload.single('profileImage'), registerAndAssignStudent);

export default router;
