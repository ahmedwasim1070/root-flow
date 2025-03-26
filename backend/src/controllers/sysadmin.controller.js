import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const devUser = await User.findOne({ role: "developer" });

    if (!devUser) {
      const defautlDeveloper = new User({
        fullName: "David Snowden",
        email: "davidsnowden911@gmail.com",
        contactNumber: "19182283675",
        password: "lasdjkflasj123",
        role: "developer",
        status: "active",
        permissions: {
          canCreateUsers: {
            developer: true,
            principle: true,
            admin: true,
            student: true,
          },
        },
      });

      defautlDeveloper.save();
      return res.status(200).json({ message: "Root user created sucessfully" });
    }

    res.status(200).json({ message: "Root user already exsists" });
  } catch (error) {
    res.status(500).json({ message: "Internel Server Error" });
    console.log("Error in Sys-Admin signup Controller : ", { error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials check your Email or Password" });
    }
  } catch (error) {}
};
