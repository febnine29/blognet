const pool = require("../database/index")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authController = {
    register: async (req, res) => {
        try {
            const { username, password, fullname } = req.body
            // const [user, ] = await pool.query("select * from auth where username = ?", [username])
            // if (user[0]) return res.json({ error: "Username already exists!" })
            const hash = await bcrypt.hash(password, 10)

            const sql = "insert into auth (username, password, fullname) values (?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [username, hash, fullname])

            if (rows.affectedRows) {
                return res.status(200).json({ message: "Registered Successfully!" })
            } else {
                return res.status(401).json({ error: "Error" })
            }
            
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const [user ] = await pool.query("select * from auth where username = ?", [username])
            if (!user[0]) return res.status(401).json({ error: "Invalid username!" })
            
            const { password: hash, id, fullname } = user[0]

            const check = await bcrypt.compare(password, hash)

            if (check) {
                const accessToken = jwt.sign({ userId: id }, '3812932sjad34&*@', { expiresIn: '1h' });
                return res.json({ 
                    accessToken,
                    data: { 
                        userId: id,
                        fullname,
                        username
                    }
                })
            }
            return res.status(401).json({ error: "Wrong password!" })
            
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
}

module.exports = authController