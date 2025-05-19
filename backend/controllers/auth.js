const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const createError = require('http-errors');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

const signToken = id => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(400, 'User already exists with this email');
    }
    
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role
    });
    
    // Generate token
    const token = signToken(newUser._id);
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      throw createError(400, 'Please provide email and password');
    }
    
    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw createError(401, 'Incorrect email or password');
    }
    
    // Generate token
    const token = signToken(user._id);
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw createError(401, 'You are not logged in! Please log in to get access');
    }
    
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw createError(401, 'The user belonging to this token does no longer exist');
    }
    
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(403, 'You do not have permission to perform this action')
      );
    }
    next();
  };
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
};