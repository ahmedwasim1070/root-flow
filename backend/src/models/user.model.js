import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
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
      minlength: [8, "Password should be at least 8 Characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["root", "sudo", "user", "guest"],
      default: "guest",
    },
    acessLevels: {
      type: Number,
      default: function () {
        const acessLevel = {
          root: 1000,
          sudo: 500,
          user: 250,
          guest: 100,
        };
        return acessLevel[this.role] || 100;
      },
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended", "inactive"],
      default: "pending",
    },
    permissions: {
      type: Array,
      default: function () {
        const permission = {
          root: ["sudo", "user", "guest"],
          sudo: ["user", "guest"],
          user: ["guest"],
          guest: [],
        };
        return permission[this.role] || [];
      },
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
UserSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

UserSchema.methods.canCreateUser = function (targetRole) {
  const creationRules = {
    root: ["sudo", "user", "guest"],
    sudo: ["user", "guest"],
    user: ["guest"],
    guest: [],
  };

  return creationRules[this.role]?.includes(targetRole) || false;
};

UserSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempt += 1;
  return this.save();
};

UserSchema.methods.resetLoginAttempts = function () {
  this.loginAttempt = 0;
  return this.save();
};

// Middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
