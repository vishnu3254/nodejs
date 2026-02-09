const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcryptjs");

const signUp = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const err = new Error("username and password are required");
      err.statusCode = 400;
      return next(err);
    }
    const passwordHash = await bcrypt.hash(password, 5);
    const user = await prisma.user.create({
      data: { username, password: passwordHash },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
    res.json({
      message: "user signed up successfully",
      user,
    });
  } catch (err) {
    err.statusCode = 500;
    return next(err);
  }
};

const listUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

const createUser = async (req, res, next) => {
  const user = req.body;
  if (!user.id || !user.name) {
    const err = new Error("id and name are required");
    err.statusCode = 400;
    return next(err);
  }
  const createdUser = await prisma.user.create({
    data: { name: user.name },
  });
  res.json({ user: createdUser });
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!user) {
    res.status(404).json({ error: "user not found" });
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name: req.body.name,
    },
  });
  res.json({
    message: "user updated successfully",
    user: updatedUser,
  });
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.sendStatus(204);
    }

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
    res.clearCookie("refreshToken");

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  signUp,
  logout,
};
