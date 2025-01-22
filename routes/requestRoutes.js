import express from 'express';
import { addRequest, getRequestsByStudent, updateRequestStatus,getRequestsByOwner } from '../controllers/requestController.js';

const router = express.Router();

router.post('/', addRequest);
router.get('/:studentId', getRequestsByStudent);
router.put('/:requestId', updateRequestStatus);
router.get('/owner/:requestId',getRequestsByOwner)

export default router;
