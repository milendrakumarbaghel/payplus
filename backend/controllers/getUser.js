const { prisma } = require('../prismaClient');

exports.getUser = async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 12; // Default to 10 items per page

    // Calculate the number of users to skip
    const skip = (page - 1) * limit;

    // Fetch filtered users with pagination
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.userId },
        OR: [
          { firstName: { contains: filter, mode: 'insensitive' } },
          { lastName: { contains: filter, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Get the total count of filtered users for pagination
    const totalUsers = await prisma.user.count({
      where: {
        id: { not: req.userId },
        OR: [
          { firstName: { contains: filter, mode: 'insensitive' } },
          { lastName: { contains: filter, mode: 'insensitive' } },
        ],
      },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Respond with users, total pages, and current page
    res.json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user.id,
      })),
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
