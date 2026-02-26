import UserModal from "../../Model/UserModel.js";
import jwt from "jsonwebtoken";


//  Welcome Route
const welcometoDb = (req, res) => {
  return res.status(200).send({
    status: true,
    message: "Welcome to Node Js.",
  });
};


//  CREATE USER (SIGNUP)
const createUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    

    //  Validation
    if (!userName || !email || !password) {
      return res.status(400).send({
        status: false,
        message: "All fields are required",
      });
    }

    //  Check if user already exists
    const isUserExist = await UserModal.findOne({ email });

    if (isUserExist) {
      return res.status(409).send({
        status: false,
        message: "User with this email already exists",
      });
    }

    //  Simple encoding (for now - later use bcrypt)
    const hashPass = Buffer.from(password).toString("base64");

    const newUser = new UserModal({
      userName,
      email,
      password: hashPass,
    });

    const savedUser = await newUser.save();

    return res.status(201).send({
      status: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.log("Server Error (Create User): ", error);

    return res.status(500).send({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};


//  LOGIN USER (FIXED JWT VERSION)

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validation
    if (!email || !password) {
      return res.status(400).send({
        status: false,
        message: "Email and password are required",
      });
    }

    //  Find user
    const isUserExist = await UserModal.findOne({ email });

    if (!isUserExist) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    //  Decode password
    const decodedPass = Buffer.from(
      isUserExist.password,
      "base64"
    ).toString("utf-8");

    //  Check password
    if (decodedPass !== password) {
      return res.status(401).send({
        status: false,
        message: "Invalid password",
      });
    }

    //  GENERATE CORRECT JWT TOKEN (VERY IMPORTANT)
    const token = jwt.sign(
      {
        id: isUserExist._id, // 👈 MUST BE id (for middleware)
        userName: isUserExist.userName,
        email: isUserExist.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).send({
      status: true,
      message: "Login successful",
      token: token,
      user: {
        _id: isUserExist._id,
        userName: isUserExist.userName,
        email: isUserExist.email,
      },
    });
  } catch (error) {
    console.log("Server Error (Login): ", error);

    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//  FETCH ALL USERS COUNT

const fetchAllUser = async (req, res) => {
  try {
    const counts = await UserModal.countDocuments();

    if (counts < 1) {
      return res.status(404).send({
        status: false,
        message: "No users found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Users fetched successfully",
      totalUsers: counts,
    });
  } catch (error) {
    console.log("Server Error (Fetch Users): ", error);

    return res.status(500).send({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { welcometoDb, createUser, logInUser, fetchAllUser };