const userModel = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
async function registerUser(req,res){
    try {
        const {username , email , password ,role="user"} = req.body;
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            const field = existingUser.username === username ? "Username" : "Email";
            return res.status(409).json({ message: `${field} is already registered` });
        }

        const hash = await bcrypt.hash(password ,10);
        const user = await userModel.create({ username, email, password: hash, role });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        res.cookie("token", token);
        return res.status(201).json({
            message: "User is registered successfully ",
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || "Account detail";
            return res.status(409).json({ message: `${field[0].toUpperCase()}${field.slice(1)} is already registered` });
        }

        console.error("registerUser error:", err);
        return res.status(500).json({ message: "Unable to create your account. Please try again." });
    }
}

async function loginUser(req,res){
    const {username ,email ,password } = req.body;

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({message : "Invalid Credentials"});
    }

    const isPassowordValid = await bcrypt.compare(password , user.password);

    if (!isPassowordValid){
        return res.status(401).json({message : "Invalid Credentials"});
    }

    const token = jwt.sign({
        id: user._id ,
        role: user.role
    },process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
        message: "Login Successful ",
        id: user._id,
        user: user.username ,
        emial: user.email ,
        role: user.role
    })



}

async function logoutUser(req,res){
    res.clearCookies("token");
    res.status(200).json({message: "User logout successfully "})

}


module.exports = {registerUser, loginUser, logoutUser};
