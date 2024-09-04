const user = require('../Model/UserSchema');
const bcrypt = require('bcrypt');

const Joi = require('joi');


exports.registerUser = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = req.body;

    try {
        const userExists = await user.findOne({ email });
        if (userExists) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ username, email, password });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to register" });
    }
};



exports.loginUser = async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill field" });
        }
        const userLogin = await user.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();

            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            });

            if (!isMatch) {
                return res.status(422).json({ error: "Invalid password" });
            }
            else {
                return res.json({ message: "Logged in", token: await userLogin.generateAuthToken() });
            }

        }
        else {
            return res.status(422).json({ error: "Invalid email" });
        }

    }
    catch (err) {
        console.log(err);
    }
};

