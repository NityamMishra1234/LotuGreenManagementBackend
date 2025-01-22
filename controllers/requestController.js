import Request from '../models/Request.js';
import Student from '../models/Student.js';

// @desc    Add a new request/complaint
// @route   POST /api/requests
export const addRequest = async (req, res) => {
    const { studentId, issueType, description } = req.body;
    try {
        const request = new Request({
            studentId,
            issueType,
            description,
        });

        await request.save();
        res.status(201).json({ message: 'Request submitted successfully', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests for a student
// @route   GET /api/requests/student/:studentId
export const getRequestsByStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const requests = await Request.find({ studentId }).populate('studentId');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests for a PG owner
// @route   GET /api/requests/owner/:pgOwnerId
export const getRequestsByOwner = async (req, res) => {
    const { pgOwnerId } = req.params;
    try {
        // Find students belonging to the owner
        const students = await Student.find({ pgOwnerId }).select('_id');
        const studentIds = students.map(student => student._id);

        // Find requests for those students
        const requests = await Request.find({ studentId: { $in: studentIds } }).populate('studentId');
        
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:requestId
export const updateRequestStatus = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;
    try {
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        await request.save();
        res.status(200).json({ message: 'Request status updated successfully', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
