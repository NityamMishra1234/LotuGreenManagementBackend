import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming token is passed as Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
export const verifyOwner = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming token is passed as Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.role = decoded.role;
        req.ownerId = decoded.userId; // Ensure ownerId is set correctly
        console.log(req.userId)
        console.log(req.role)
        console.log(req.ownerId)
        // Ensure that the user is an owner (PG owner)
        if (req.role !== 'owner') {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
