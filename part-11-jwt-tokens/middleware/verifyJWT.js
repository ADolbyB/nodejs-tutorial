const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.sendStatus(401);
    }
    console.log(authHeader); // Displays Bearer (token id)
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) { // if we have an invalid token
                return res.sendStatus(403); // 403 Forbidden Status (invalid token)
            }
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = verifyJWT;