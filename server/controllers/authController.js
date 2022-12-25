const User = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { cookie } = require("express-validator");

const handleLogin = async (req, res, next) => {
  const cookies = req.cookies;
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const foundUser = await User.findOne({ username: user });
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken });

      if (!foundToken) {
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", { httpOnly: true });
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    try {
      await foundUser.save();
    } catch (error) {
      return next(error);
    }
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

const handleNewUser = async (req, res, next) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // check for duplicate usernames in the db
  try {
    const duplicate = await User.findOne({ username: user });
    if (duplicate) return res.sendStatus(409); //Conflict
  } catch (error) {
    return next(error);
  }
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the new user
    const newUser = new User({
      username: user,
      password: hashedPwd,
    });
    try {
      await newUser.save();
    } catch (error) {
      return next(error);
    }
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    return next(err);
  }
};

const handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true });

  const foundUser = await User.findOne({ refreshToken: refreshToken });

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findOne({ username: decoded.username });
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      },
    );
    return res.sendStatus(403);
  } //Forbidden

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken,
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);

      // Refresh token was still valid
      const accessToken = jwt.sign(
        { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" },
      );

      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      try {
        await foundUser.save();
      } catch (error) {
        return next(error);
      }
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    },
  );
};

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken: refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken,
  );
  try {
    await foundUser.save();
  } catch (error) {
    return next(error);
  }
  res.clearCookie("jwt", { httpOnly: true }); // secure : true - only serves on https
  res.sendStatus(204);
};

module.exports = {
  handleLogin,
  handleNewUser,
  handleRefreshToken,
  handleLogout,
};
