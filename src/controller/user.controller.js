const { Client } = require("pg");
const client = require("../config/db.connect");
const { responseHandler } = require("../config/");
const ApiError = require("../config/apiError");
const { accessToken } = require("../validation/");

exports.signUPUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const email1 = email.trim()
    const password1 = password.trim()
    const findUser = await client.query(
      `SELECT * FROM todo where email = '${email1}'`
    );
    if (findUser.rows.length > 0) {
      return next(new ApiError(400, "email id already exist"));
    }
    const query = `INSERT INTO todo (password,email)VALUES('${password1}','${email1}')RETURNING *`;
    client
      .query(query)
      .then((result) => {
        return responseHandler(200, "signup successfully", res, result.rows);
      })
      .catch((error) => {
        console.log(error);
        return next(new ApiError(400, error.message));
      });
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const findUser = await client.query(
      `SELECT * FROM todo where email = '${email}'`
    );
    if (findUser.rows.length === 0) {
      return next(new ApiError(400, "invalid user"));
    }
    const emailDB = findUser.rows[0].email;
    const passwordDB = findUser.rows[0].password;
    if (password === passwordDB && email === emailDB) {
      const token = await accessToken(req.body.email);
      return responseHandler(200, "login successfully", res, token);
    }
    return next(new ApiError(400, "invalid login details"));
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};

exports.showUser = async (req, res, next) => {
  try {
    const result = await client.query("SELECT * FROM todo");
    return responseHandler(200, "user found successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};

exports.deleteUPUser = async (req, res, next) => {
  try {
    const result = await client.query(
      `delete FROM todo where email = '${req.userId}' RETURNING *`
    );
    if (!result.rows.length > 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "user delete successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};

exports.showUserById = async (req, res, next) => {
  try {
    const result = await client.query(
      `select * FROM todo where email ='${req.userId}'`
    );
    if (!result.rows.length > 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "user find successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};
