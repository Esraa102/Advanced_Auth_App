import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateJWT.js";
import {
  sendRequestResetPassword,
  sendSuccessResetPassword,
  sendVerificationCode,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "User is already existed" });
    }
    //hash password
    const hashedPassword = bcryptjs.hashSync(password, 12);
    // generate a verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000,
    });
    await newUser.save();

    //jwt
    generateToken(newUser._id, res);
    //email verification
    await sendVerificationCode(email, verificationToken);
    res.status(201).json({
      message: "User Created Successfully",
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error form signUp()", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }, // still valid
    });
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Expired or incorrect verification code" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      message: "Your email has been verified",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail()", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const reSendVerifyCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const verificationToken = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationCode(email, verificationToken);
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;
    await user.save();
    res.status(201).json({
      message: "Verification code has been resent",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error form reSendVerifyCode()", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(password);
    if (!email || !password) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User is already existed" });
    }
    const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong Credentails" });
    }
    generateToken(user._id, res);
    user.lastLogin = Date.now();
    await sendWelcomeEmail(user.email, user.name);
    await user.save();
    res.status(200).json({
      message: "Welcome back to our website",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error form login()", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "We're sad to see you leave" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User is already existed" });
    }
    const resetToken = crypto.randomBytes(24).toString("hex");
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; // 1hour
    user.resetPasswordToken = resetToken;
    await user.save();
    console.log("link", resetToken);
    //send reset email
    await sendRequestResetPassword(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error form forgotPassword()", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPass } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // still valid
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Reset Link" });
    }
    const newHashedPass = bcryptjs.hashSync(newPass, 10);
    user.password = newHashedPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendSuccessResetPassword(user.email);
    res.status(200).json({
      message: "Password Reset Successfully",
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error form resetPassword()", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = async (req, res) => {
  console.log(req.userId);
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error form checkAuth()", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  signUp,
  reSendVerifyCode,
  login,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
};
