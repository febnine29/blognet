const pool = require("../database/index")
const likesController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from likes')
            res.status(201).json({
                data: rows
            })
        } catch (error){
            res.status(400).json({ status: "error" })
        }
    },
    getLikeById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from likes where id = ?", [id])
            res.status(201).json({
                data: rows
            })
        } catch (error) {
            res.status(400).json({ status: "error" })
        }
    },
    create: async (req, res) => {
        try {
            const { descrip, createdAt, userId, postId } = req.body
            const sql = "insert into likes (descrip, createdAt, userId, postId) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [descrip, createdAt, userId, postId])
            res.status(201).json({
                data: {
                    result: "likeed!",
                    rows
                }
            })
        } catch (error) {
            res.status(400).json({ status: "error" })
        }
    },
    update: async (req, res) => {
        try {
            const { descrip, createdAt, userId, postId } = req.body
            const {id} = req.params
            const sql = "update likes set descrip = ?, createdAt = ?, userId = ?, postId = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [descrip, createdAt, userId, postId, id]) 
            res.status(201).json({
                data: `updated like ${id}!`
            })
        } catch (error) {
            res.status(400).json({ status: "error" })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from likes where id = ?", [id])
            res.status(200).json({
                data: `deleted like!`
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: "error" })
        }
    }
}
module.exports = likesController