const pool = require("../database/index")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

const authController = {
    register: async (req, res) => {
        try {
            const { username, password, name, email } = req.body
            // const [user, ] = await pool.query("select * from auth where username = ?", [username])
            // if (user[0]) return res.json({ error: "Username already exists!" })
            const hash = await bcrypt.hash(password, 10)

            const sql = "insert into users (username, password, name, email) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [username, hash, name, email])

            if (rows.affectedRows) {
                return res.status(200).json({ message: "Registered Successfully!" })
            } else {
                return res.status(401).json({ error: "Error", message: error.message  })
            }
            
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const [user ] = await pool.query("select * from users where username = ?", [username])
            if (!user[0]) return res.status(401).json({ error: "Invalid username!" })
            
            const { password: hash, id, fullname } = user[0]

            const check = await bcrypt.compare(password, hash)

            if (check) {
                const accessToken = jwt.sign({ userId: id }, '3812932sjad34&*@', { expiresIn: '1h' });
                return res.json({ 
                    accessToken,
                    infor: user
                })
            }
            return res.status(401).json({ error: "Wrong password!" })
            
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    getAllUsersId: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select id from users")
            
            res.json({
                result: rows
            })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    getUserById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from users where id = ?", [id])
            
            res.json({
                info: rows[0]
            })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    updateAva: async (req, res) => {
        try {
            const { id } = req.params
            const { profilePic } = req.body
            const [rows, fields] = await pool.query("update users set profilePic = ? where id = ?", [profilePic, id])
                
            res.json({
                result: profilePic
            })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    updateCover: async (req, res) => {
        try {
            const { id } = req.params
            const { coverPic } = req.body
            const [rows, fields] = await pool.query("update users set coverPic = ? where id = ?", [coverPic, id])
                
            res.json({
                result: coverPic
            })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    sendEmail: async (req, res) => {
        try {
            const { email, subject, message } = req.body;

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail', // true for 465, false for other ports
                auth: {
                    user: "tranducmanh2902@gmail.com", // your email address
                    pass: "Ntpa0801", // your email password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'tranducmanh2902@gmail.com', // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                text: message, // plain text body
                html: `<b>${message}</b>`, // html body
            });

            console.log("Message sent: %s", info.messageId);
            res.status(200).json({ message: "Email sent successfully!" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    },
}

module.exports = authController