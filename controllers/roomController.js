import Room from '../models/Room.js';
import Student from '../models/Student.js';
import cloudinary from '../utils/cloudinaryConfig.js';

// Add Room (by PG Owner)
export const addRoom = async (req, res) => {
    const { roomNumber, totalBeds, pgOwnerId } = req.body;

    try {
        const room = new Room({
            roomNumber,
            totalBeds,
            pgOwnerId,
        });

        await room.save();
        res.status(201).json({ message: 'Room added successfully', room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Rooms (for PG Owner)
export const getAllRooms = async (req, res) => {
    try {
        // Find all rooms for the authenticated PG owner
        const rooms = await Room.find({ pgOwnerId: req.userId }).populate('students', 'name email phone');

        if (rooms.length > 0) {
            res.status(200).json(rooms);
        } else {
            res.status(404).json({ message: 'No rooms found for this PG Owner' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Room Details with Students (for PG Owner)
export const getRoomDetails = async (req, res) => {
    const { roomId } = req.params;

    try {
        // Find the room by ID and populate student details
        const room = await Room.findById(roomId).populate('students', 'name email phone fatherName fatherPhone');

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
