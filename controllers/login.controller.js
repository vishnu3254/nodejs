const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/prismaClient");

//login controller
const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const err = new Error("username and password are required");
    err.statusCode = 400;
    return next(err);
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    const err = new Error("user not found");
    err.statusCode = 404;
    return next(err);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const err = new Error("password is incorrect");
    err.statusCode = 401;
    return next(err);
  }

  const accessToken = jwt.sign(
    { username, role: "admin" },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );
  const refreshToken = jwt.sign(
    { username, role: "admin" },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" },
  );
  res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //true in production "https"
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
  res.json({ accessToken });
};

const refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies.refreshToken;
  if (!refreshToken) {
    const err = new Error("refresh token is required");
    err.statusCode = 400;
    return next(err);
  }
  try {
    // Check token exists in DB
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored) {
      return res.status(401).json({ error: "refresh token not recognized" });
    }
    if (stored.revoked) {
      return res.status(401).json({ error: "refresh token revoked" });
    }

    if (stored.expiredAt < new Date()) {
      return res.status(401).json({ error: "refresh token expired" });
    }


    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
    );
     // revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });


    const accessToken = jwt.sign(
      { username: decodedUser.username, role: decodedUser.role },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );
    const newRefreshToken = jwt.sign(
      { username: decodedUser.username, role: decodedUser.role },
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: stored.user.id,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, //true in production "https"
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ accessToken });
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
};

module.exports = {
  login,
  refresh,
};
