const { User } = require('../models/userSchema');

exports.getUser = async (req, res) => {
    try {
    const filter = req.query.filter || "";
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 12; // Default to 10 items per page

    // Calculate the number of users to skip
    const skip = (page - 1) * limit;

    // Fetch filtered users with pagination
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(limit);

    // Get the total count of filtered users for pagination
    const totalUsers = await User.countDocuments({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Respond with users, total pages, and current page
    res.json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
