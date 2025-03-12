const userRepository = require("../repository/user.repository");
const baseResponse = require("../util/baseResponse.util");

exports.registerUser = async (req, res) => {
  const { email, password, name } = req.query;
  if (!email || !password || !name) {
    return baseResponse(
      res,
      false,
      400,
      "Email, password, and name are required",
      null
    );
  }
  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, "Email already used", null);
    }

    const user = await userRepository.createUser({ email, password, name });
    baseResponse(res, true, 201, "User created", user);
  } catch (error) {
    baseResponse(res, false, 500, "Error registering user", null);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    return baseResponse(
      res,
      false,
      400,
      "Email and password are required",
      null
    );
  }
  try {
    const user = await userRepository.authenticateUser(email, password);
    if (!user) {
      return baseResponse(res, false, 401, "Invalid email or password", null);
    }
    baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    baseResponse(res, false, 500, "Error logging in", null);
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userRepository.getUserByEmail(req.params.email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    baseResponse(res, false, 500, "Error getting user", null);
  }
};

exports.updateUser = async (req, res) => {
  const { id, name, email, password } = req.body;
  if (!id || !name || !email || !password) {
    return baseResponse(
      res,
      false,
      400,
      "ID, name, email, and password are required",
      null
    );
  }
  try {
    const updatedUser = await userRepository.updateUser({
      id,
      name,
      email,
      password,
    });
    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User updated", updatedUser);
  } catch (error) {
    baseResponse(res, false, 500, "Error updating user", null);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userRepository.deleteUser(req.params.id);
    if (!deletedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User deleted", deletedUser);
  } catch (error) {
    baseResponse(res, false, 500, "Error deleting user", null);
  }
};
