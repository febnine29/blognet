const pool = require("../database/index")
const postsController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from posts')
            res.json({
                data: rows
            })
        } catch (error){
            res.json({status: "error" })
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
            res.json({status: "error" })
        }
    },
    create: async (req, res) => {
        try {
            const { title, content, attime, userId } = req.body
            const sql = "insert into posts (title, content, attime, userId) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [title, content, attime, userId])
            res.json({
                data: "Created new post!"
            })
        } catch (error) {
            console.log(error)
            res.json({ status: "error" })
        }
    },
    update: async (req, res) => {
        try {
            const { title, content, attime, userId } = req.body
            const {id} = req.params
            const sql = "update posts set title = ?, content = ?, attime = ?, userId = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [title, content, attime, userId, id]) 
            res.json({
                title: `updated post ${id}!`
            })
        } catch (error) {
            res.json({ status: "error" })
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
            res.json({
                status: "error"
            })
        }
    }
}

module.exports = postsController