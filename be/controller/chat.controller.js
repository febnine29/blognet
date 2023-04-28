const pool = require("../database/index")
const chatController = {
    getChatList: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select distinct fromId, toId from chat where fromId = ?", [id])
            res.json({
                rows
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getById: async (req, res) => {
        try {
            const { fromId, toId } = req.body
            const [rows, fields] = await pool.query("select * from chat where fromId = ? and toId = ?", [fromId,toId])
            res.json({
                rows
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getLastestMessage: async (req, res) => {
        try {
            const { fromId, toId } = req.body
            const [rows, fields] = await pool.query("select * from chat where id = (select max(id) from chat where fromId = ? and toId = ?)", [fromId,toId])
            res.json({
                rows
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    create: async (req, res) => {
        try {
            const { descrip, fromId, toId, createdAt } = req.body
            const sql = "insert into chat (descrip, fromId, toId, createdAt) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [descrip, fromId, toId, createdAt])
            res.status(201).json({
                result: "New message !"
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({ status: "error" })
        }
    },
    delete: async (req, res) => {
        try {
            const { fromId, toId } = req.body
            const [rows, fields] = await pool.query("delete from chat where fromId = ? and toId = ?", [fromId,toId])
            res.json({
                data: `delete  ${id} successfully!`
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: "error"
            })
        }
    }
}

module.exports = chatController