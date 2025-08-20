//create jsonwebtoken create
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../utils/catchAsyncError");


const createToken = async(user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
}

const validateJsonWebToken = catchAsyncError(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token; 
    
    //   //console.log(req.cookies.token);
    // const token2 = req.cookies.token;
    //   //console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
});

module.exports = {
    createToken,
    validateJsonWebToken
};