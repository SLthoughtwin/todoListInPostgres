const Joi = require('joi');
const jwt = require('jsonwebtoken')
const { access } = require('../config/');
const ApiError = require('../config/apiError');
const client = require('../config/db.connect')

exports.signupValidation = (req, res, next) => {
    const loginUser = (user) => {
      const JoiSchema = Joi.object({
        email: Joi.string().email().min(5).max(50).trim(),
        password: Joi.string().min(5).max(30).trim(),
      }).or('phone', 'email');
      return JoiSchema.validate(user);
    };
    const response = loginUser(req.body);
    if (response.error) {
      const msg = response.error.details[0].message.replace(/[^a-zA-Z0-9]/g, ' ');
      return next(new ApiError(400, msg));
    } else {
      next();
    }
};

exports.taskValidation = (req, res, next) => {
  const task = (user) => {
    const JoiSchema = Joi.object({
      title: Joi.string().min(3).max(50).required().trim(),
      description: Joi.string().min(5).max(200).trim(),
    });
    return JoiSchema.validate(user);
  };
  const response = task(req.body);
  if (response.error) {
    const msg = response.error.details[0].message.replace(/[^a-zA-Z0-9]/g, ' ');
    return next(new ApiError(400, msg));
  } else {
    next();
  }
};

exports.accessTokenVerify = (req, res, next) => {
    const chickToken = (req) => {
      if (req.query.token) {
        return req.query.token;
      } else if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.split(' ');
        return bearerToken[1];
      } else {
        return false;
      }
    };
    const token = chickToken(req);
    if (token === false) {
        return next(new ApiError(400, 'A token is required for authentication'));
    } else {
      jwt.verify(token, access, async (error, payload) => {
        if (error) {
          return next(new ApiError(400, 'invalid token'));
        } else {
          const userId = payload.aud;
          const result = await client.query(`SELECT * FROM todo where email = '${userId}'`);
          if (!result) {
            return next(new ApiError(400, 'no user found this token'));
          }
          req.user = result;
          req.userId = payload.aud;
          next();
        }
      });
    }
}

exports.accessToken = async (getId) => {
  const userId = getId;
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: '24h',
      issuer: 'sourabh@gmail.com',
      audience: userId,
    };
    const payload = {};
    jwt.sign(payload, access, options, (err, token) => {
      if (err) {
        return reject({ message: 'Invalid operation!' });
      } else {
        resolve(token);
      }
    });
  });
}