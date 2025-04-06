const userRepository = require("../repository/user.repository");
const baseResponse = require("../util/baseResponse.util");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.registerUser = async (req, res) => {
  const { email, password, name } = req.body; // Mengambil data dari body request

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!email || !password || !name) {
    return baseResponse(
      res,
      false,
      400,
      "Email, password, and name are required",
      null
    );
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(
      res,
      false,
      400,
      "Password must be at least 8 characters long, contain at least one number and one special character",
      null
    );
  }

  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, "Email already used", null);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });

    baseResponse(res, true, 201, "User created", user);
  } catch (error) {
    baseResponse(res, false, 500, "Error registering user", null);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return baseResponse(res, false, 400, "Email dan password wajib diisi");
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 400, "Email atau password salah", null);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return baseResponse(res, false, 400, "Email atau password salah", null);
    }

    return baseResponse(res, true, 200, "Login berhasil", {
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    return baseResponse(
      res,
      false,
      500,
      error.message || "Server Error",
      error
    );
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

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validasi input
  if (!id || !name || !email || !password) {
    return baseResponse(
      res,
      false,
      400,
      "ID, name, email, and password are required",
      null
    );
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(
      res,
      false,
      400,
      "Password must be at least 8 characters long, contain at least one number and one special character",
      null
    );
  }

  try {
    // Cek apakah user dengan ID tersebut ada di database
    const existingUser = await userRepository.getUserById(id);
    if (!existingUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    // Cek apakah email yang ingin digunakan sudah digunakan oleh user lain
    const emailExists = await userRepository.getUserByEmail(email);
    if (emailExists && emailExists.id !== id) {
      return baseResponse(
        res,
        false,
        400,
        "Email already used by another user",
        null
      );
    }

    // Hash password sebelum update
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user dengan password yang sudah di-hash
    const updatedUser = await userRepository.updateUser({
      id,
      name,
      email,
      password: hashedPassword,
    });

    return baseResponse(
      res,
      true,
      200,
      "User updated successfully",
      updatedUser
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return baseResponse(res, false, 500, "Error updating user", null);
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

exports.topUp = async (req, res) => {
  try {
    const { id, amount } = req.query;

    if (!id || !amount) {
      return baseResponse(
        res,
        false,
        400,
        "User ID and amount are required as query parameters",
        null
      );
    }

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return baseResponse(
        res,
        false,
        400,
        "Amount must be a number larger than 0",
        null
      );
    }

    const updatedUser = await userRepository.updateBalance(id, parsedAmount);

    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    return baseResponse(res, true, 200, "Top up successful", updatedUser);
  } catch (error) {
    console.error("Error in topUp:", error.message);
    res.status(500).json(baseResponse(false, "Failed to top up", null));
    console.log("Register User API Called");
    console.log("Login User API Called");
    console.log("Get User By Email API Called");
    console.log("Update User API Called");
    console.log("Delete User API Called");
    console.log("Top Up API Called");
  }
};
