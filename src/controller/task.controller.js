const client = require("../config/db.connect");
const { responseHandler } = require("../config/");
const ApiError = require("../config/apiError");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userEmail = req.userId;
    const findTask = await client.query(
      `SELECT * FROM task WHERE title = '${title}'`
    );
    if (findTask.rows.length > 0) {
      return next(new ApiError(400, `this ${title} already exist`));
    }
    const query = `INSERT INTO task (title,description,useremail)VALUES('${title}','${description}','${userEmail}')RETURNING *`;
    client
      .query(query)
      .then((result) => {
        return responseHandler(
          200,
          "create task successfully",
          res,
          result.rows
        );
      })
      .catch((error) => {
        console.log(error);
        return next(new ApiError(400, error.message));
      });
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};
exports.showTask = async (req, res, next) => {
  try {
    const query1 = ` SELECT task.useremail,task.title,task.description FROM task
      LEFT JOIN todo
      ON todo.email='task.${req.userId}'`;
    const query = `SELECT * FROM task WHERE useremail='${req.userId}'`;
    const result = await client.query(query1);
    if (!result) {
      return next(new ApiError(400, "task not found"));
    }
    return responseHandler(200, "task found successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let { id } = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }
    const query = `UPDATE task SET title = '${title}',description = '${description}' WHERE id = ${id}RETURNING *`;
    const result = await client.query(query);
    if (!result.rows.length > 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "task update successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};
exports.deleteTask = async (req, res, next) => {
  try {
    let { id } = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }
    const query = `DELETE FROM task WHERE id = ${id}RETURNING *`;
    const result = await client.query(query);
    if (!result.rows.length > 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "task delete successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};
exports.showTaskById = async (req, res, next) => {
  try {
    let { id } = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }
    const query = `SELECT * FROM task WHERE id= ${id}`;
    const result = await client.query(query);
    if (!result.rows.length > 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "task find successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};
exports.completeTask = async (req, res, next) => {
  try {
    let { id } = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }

    const findTask = `SELECT * FROM task WHERE id=${id}`;
    const result1 = await client.query(findTask);
    console.log(result1.rows.length);
    if (result1.rows.length === 0) {
      return next(new ApiError(400, "invalid id"));
    }
    if (result1.rows[0].ischeck === true) {
      const query = `UPDATE task SET ischeck = '${false}' WHERE id = ${id}RETURNING *`;
      const result = await client.query(query);
      return responseHandler(200, "task update successfully", res, result.rows);
    }
    const query = `UPDATE task SET ischeck = '${true}' WHERE id = ${id}RETURNING *`;
    const result = await client.query(query);
    return responseHandler(200, "task update successfully", res, result.rows);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
};
