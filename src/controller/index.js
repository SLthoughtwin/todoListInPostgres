const {
  signUPUser,
  loginUser,
  showUser,
  deleteUPUser,
  showUserById,
} = require("./user.controller");

const {
  createTask,
  showTask,
  deleteTask,
  showTaskById,
  updateTask,
  completeTask
} = require("./task.controller");

module.exports = {
  signUPUser,
  loginUser,
  showUser,
  deleteUPUser,
  showUserById,
  createTask,
  showTask,
  deleteTask,
  showTaskById,
  updateTask,
  completeTask
}
