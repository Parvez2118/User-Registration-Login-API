const jwt = require("jsonwebtoken");
const user = require('../Model/UserSchema');


const Authenticate = async (req, res, next) => {
    console.log(req.cookies.jwttoken);
    try {

        // const token = req.cookies.jwttoken;
        const token = req.header("Authorization");
        const jwttoken = token.replace("Bearer", "").trim();

        //  console.log(token+"insidee authenticatee");
        const verifyToken = jwt.verify(jwttoken, "MYNAMEISLEAVEMANAGEMENTSYSTEMAPPLICATIONAUTHENTICATION");

        const rootUser = await user.findOne({ _id: verifyToken._id, "tokens.token": jwttoken });

        if (!rootUser) {
            throw new Error("User Not found");
        }

        req.token = jwttoken;
        req.rootUser = rootUser;
        console.log(req.rootUser);
        req.userID = rootUser._id;
        next();
    }
    catch (err) {
        res.status(401).send("Unauthorised Token");
        console.log(err);
    }
}
module.exports = Authenticate;