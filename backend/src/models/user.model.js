import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";

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
      enum: ["developer", "principle", "admin", "student"],
      default: "student",
    },
    acessLevels: {
      type: Number,
      default: function () {
        const acessLevel = {
          developer: 1000,
          principle: 500,
          admin: 250,
          student: 100,
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
      type: {
        canCreateUsers: {
          developer: { type: Boolean, default: false },
          principle: { type: Boolean, default: false },
          admin: { type: Boolean, default: false },
          student: { type: Boolean, default: false },
        },
      },
      default: {},
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
  {
    timestamps: true,
    methods: {
      async comparePassword() {
        return bcrypt.compare(userPassword, this.password);
      },
    },

    canCreateUser(tagetRole) {
      const creationRules = {
        developer: ["principle", "admin", "student"],
        principle: ["admin", "student"],
        admin: ["student"],
        student: [],
      };

      return creationRules(this.role)?.includes(tagetRole) || false;
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempt += 1;
  return this.save();
};

UserSchema.methods.resetLoginAttempts = function () {
  this.loginAttempt = 0;
  return this.save();
};

const User = mongoose.model("User", UserSchema);

export default User;
