import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is requried"],
      trim: true,
    },
    email: {
      unique: [true, "Email already exsist`s "],
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    contactNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      match: [/^\+?(\d{10,14})$/, "Please fill a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password should be alteast 8 characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["root", "sudo", "user", "guest"],
      default: "guest",
    },
    permissions: {
      type: Array,
      default: function () {
        const permission = {
          root: ["root", "sudo", "user", "guest"],
          sudo: ["sudo", "user", "guest"],
          user: ["user", "guest"],
          guest: [],
        };
        return permission[this.role] || [];
      },
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended", "inactive"],
      default: "pending",
    },
    loginAttempt: {
      type: Number,
      default: 0,
      max: 5,
    },
    lastLogin: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Methods
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.canCreateUser = function (targetRole) {
  const creationRules = {
    root: ["sudo", "user", "guest"],
    sudo: ["user", "guest"],
    user: ["guest"],
    guest: [],
  };

  return creationRules[this.role]?.includes(targetRole) || false;
};

userSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempt += 1;
  return this.save();
};

userSchema.methods.resetLoginAttempts = function () {
  this.loginAttempt = 0;
  return this.save();
};

// Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
