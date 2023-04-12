const pool = require("../database/index")
const postsController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from posts')
            res.json({
                data: rows
            })
        } catch (error){
            res.status(401).json({status: "error" })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from posts where id = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            res.status(401).json({status: "error" })
        }
    },
    create: async (req, res) => {
        try {
            const { descrip, img, userId, createdAt } = req.body
            const sql = "insert into posts (descrip, img, userId, createdAt) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [descrip, img, userId, createdAt])
            res.status(201).json({
                data: "Created new post!"
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({ status: "error" })
        }
    },
    update: async (req, res) => {
        try {
            const { descrip, img, userId, createdAt } = req.body
            const {id} = req.params
            const sql = "update posts set descrip = ?, img = ?, userId = ?, createdAt = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [descrip, img, userId, createdAt, id]) 
            res.status(201).json({
                title: `updated post ${id}!`
            })
        } catch (error) {
            res.status(401).json({ status: "error" })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from posts where id = ?", [id])
            res.json({
                data: `delete post ${id} successfully!`
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: "error"
            })
        }
    }
}

module.exports = postsController