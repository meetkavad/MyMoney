import { UserModel } from "../Model/UserModel.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user profile excluding password and __v fields
    const user = await UserModel.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { name: name },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
