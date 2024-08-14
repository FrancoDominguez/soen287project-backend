import express from 'express';
import { SignJWT } from 'jose';
import User from './userModel.js';
import Pet from './petModel.js';
import { authorize, findUserWithID } from './middleware.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

async function register(request, response) {
  let user;
  let newUser;
  try {
    user = new User(request.body);
    newUser = await user.save();
    return response.status(201).json({
      message: `Successfully created user ${newUser.firstname} ${newUser.lastname}`,
      data: newUser._id,
    });
  } catch (error) {
    if (error.code == 11000) {
      console.log('Email already exists');
      response.status(400).json({
        message: `User with email ${user.email} already exists`,
      });
    } else if (error.name === 'ValidationError') {
      if (error.errors.password) {
        console.log('Invalid password format');
        response.status(400).json({
          message: 'Invalid password format',
        });
      } else {
        console.error(error);
        response.status(400).json({ message: error.message });
      }
    } else {
      response.status(500).json({ message: error.message });
    }
  }
}

async function login(request, response) {
  try {
    const email = request.body.email;
    const password = request.body.password;
    const user = await User.findOne({ email: email });
    if (!user || user == null) {
      return response.status(404).json({ message: 'Invalid email' });
    }
    if (password !== user.password) {
      console.log('Invalid password');
      return response.status(401).json({ message: 'Invalid password' });
    } else {
      const token = await new SignJWT({ _id: user._id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(jwtSecret);

      console.log(`Successfully authenticated ${user.firstname} ${user.lastname}`);
      return response.status(200).json({
        message: `Successfully authenticated user ${user.firstname} ${user.lastname}`,
        token: token,
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
}
async function giveAway(request, response) {
  let pet;
  let newPet;
  try {
    pet = new Pet(request.body);
    newPet = await pet.save();
    return response.status(201).json({
      message: `Successfully added ${newPet.name} to our give-away list`,
      data: newPet._id,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
}

async function adopt(request, response) {
  let pet;
  let newPet;
  try {
    pet = new Pet(request.body);
    newPet = await pet.save();
    return response.status(201).json({
      message: `Successfully added ${newPet.name} to our give-away list`,
      data: newPet._id,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
}

async function getPets() {}

router.post('/register', register);
router.post('/login', login);
router.post('/give-away', authorize, findUserWithID, giveAway);
router.post('/adopt', authorize, findUserWithID, adopt);
router.get('/pets', getPets);

export default router;
