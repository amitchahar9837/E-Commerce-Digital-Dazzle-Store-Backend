const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userModel = require('../model/user');
const emailUser = process.env.emailUser;
const emailPassword = process.env.emailPassword;
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const randmonstring = require('randomstring');
const JWT_SECRET = process.env.JWT_SECRET;
const sendResetPasswordMail = async (name, email, token) => {
    try {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user : emailUser,
                pass: emailPassword,
            }
        });

        let mailOptions = {
            from: emailUser,
            to: email,
            subject: 'Reset Digtal Dazzle Store Password',
            html: "<p>Hello " + name + ", here is your token <strong>" + token + "</strong> to reset your password.</p>"
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error.message)
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
router.post('/signup', async (req, res) => {
    const { name, email, password, profilePic } = req.body;
    if (!name || !email || !password || !profilePic) {
        return res.status(422).json({ err: "Please add all the fields" })
    }
    userModel.findOne({ email: email })
        .then((exist) => {
            if (exist) {
                return res.status(406).json({ err: "user already exist with this email" })
            }
            else {
                bcrypt.hash(password, 10)
                    .then(hashedPassword => {
                        const userData = new userModel({
                            name,
                            email,
                            password: hashedPassword,
                            profilePic,
                            role: 'GENERAL',
                        })
                        userData.save().then(user => res.status(201).json({ msg: "SignUp Successfully" }))
                            .catch((error) => console.log(error));
                    })
            }
        }).catch((error) => {
            console.log(error)
        })
})
router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ err: "Please provide email or password" })
    }
    userModel.findOne({ email: email })
        .then((exist) => {
            if (!exist) {
                return res.status(422).json({ err: "Invalid email or password" })
            } else {
                bcrypt.compare(password, exist.password)
                    .then((match) => {
                        if (match) {
                            const token = jwt.sign({ _id: exist._id }, JWT_SECRET);
                            const { _id, name, email, profilePic, role } = exist
                            res.json({ token, user: { _id, name, email, profilePic, role }, msg: "Login Successfully" });
                        } else {
                            return res.status(422).json({ err: "Invalid email or password" })
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
            }
        }).catch((error) => {
            console.log(error)
        })
})

router.post('/forgot-passsword', async (req, res) => {
    try {
        const email = req.body.email;
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("email does not exists!");
        } else {
            const token = randmonstring.generate();
            const data = await userModel.updateOne({ email }, { $set: { token } })
            sendResetPasswordMail(user.name, user.email, token)
            res.status(200).json({ success: true, error: false, msg: "token has been sent to your email." })
        }
    } catch (error) {
        res.status(401).json({
            err: error.message,
            success: false,
            error: true,
        })
    }
})
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        const tokenData = await userModel.findOne({ token })
        if (tokenData) {
            const newPassword = await bcrypt.hash(password, 10);
            const resetUser = await userModel.findByIdAndUpdate({ _id: tokenData._id }, { $set: { token: '', password: newPassword } });

            res.status(201).json({ success: true, error: false, msg: 'your password has been reset' });
        } else {
            throw new Error("token has been expired");
        }

    } catch (error) {
        res.status(401).json({
            err: error.message,
            success: false,
            error: true,
        })
    }
})
module.exports = router;