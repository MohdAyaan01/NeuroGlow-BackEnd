import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User Not Authenticated...", success: false });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({ message: "Invalid Token...", success: false });
        }
        req.id = decode.userId;
        next();
    }
    catch (err) {
        console.log("Auth Error:", err.message);
        if (err.name === 'JsonWebTokenError') {
            res.clearCookie('token');
        }
        return res.status(401).json({ message: "Authentication failed...", success: false });
    }
};
export default isAuthenticated;
