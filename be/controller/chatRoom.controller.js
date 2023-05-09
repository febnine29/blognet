const pool = require("../database/index");
const { v4: uuidv4 } = require('uuid');
const chatController = {
    getAllChatRooms: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from chatroom order by id desc')
            const result = rows.map(row => {
                return {
                    ...row,
                    members: JSON.parse(row.members)
                    }
                })
            res.json({
                result
            })
        } catch (error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getChatRoomById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query('select * from chatroom where id = ?', [id])
            const result = rows.map(row => {
                return {
                    ...row,
                    members: JSON.parse(row.members)
                    }
                })
            res.json({
                result
            })
        } catch (error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    create: async (req, res) => {
        try {
            const { members, createdAt } = req.body
            const sql = "insert into chatroom (members, createdAt) values (?, ?)"
            const [rows, fields] = await pool.query(sql, [JSON.stringify(members), createdAt])
            res.status(201).json({
                result: "Created new chatroom!"
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({ status: "error" })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.body
            const [rows, fields] = await pool.query("delete from chatroom where id = ?", [id])
            res.json({
                result: `delete  chatroom${id} successfully!`
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