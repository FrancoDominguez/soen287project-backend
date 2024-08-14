import jwt from 'jsonwebtoken';
import User from './userModel.js';

const jwtSecret = process.env.JWT_SECRET;

export async function authorize(request, response, next) {
  try {
    const headers = request.headers.authorization;
    if (!headers) {
      console.log('Authentication required');
      return response.status(401).json({
        message: 'Authentication required token required in the header',
      });
    }
    const token = headers.split(' ')[1];

    const decodedToken = jwt.verify(token, jwtSecret);
    console.log('Token is valid:', decodedToken);

    if (!decodedToken || decodedToken.secret !== jwtSecret) {
      throw new Error('Invalid token');
    }

    const _id = decodedToken._id;
    console.log('Successfully validated token');
    request._id = _id;
    next();
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Invalid JWT token' });
  }
}

export async function findUserWithID(request, response, next) {
  try {
    const _id = request._id;
    const user = await User.findById(_id);
    if (user === null) {
      console.log('User not found');
      return response.status(404).json({ message: 'User not found' });
    }
    console.log('User successfully found in the database');
    request.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ message: error.message });
    } else {
      console.error(error);
      return response.status(500).json({ message: error.message });
    }
  }
}
