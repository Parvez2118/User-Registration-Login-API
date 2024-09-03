const user = require('../Model/UserSchema');
const bcrypt = require('bcrypt');

exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;

    console.log(req.body);
    if (!username || !email || !password) {

        return res.status(400).json({ error: "Please fill field" });
    }
    user.findOne({ email: email }).then((userexists) => {

        if (userexists) {

            return res.status(404).json({ err: "email already exists" });
        }
        const userdata = new user({ username, email, password });///passing data to the schema and then send to db
        userdata.save().then(() => {

            return res.status(200).json({ Message: req.body });

        }).catch((err) => {
            return res.status(500).json({ err: "failed to register" });
        });
    }).catch((err) => {
        console.log(err);
    })
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

