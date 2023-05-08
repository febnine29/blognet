const pool = require("../database/index");
const { v4: uuidv4 } = require('uuid');
const chatController = {
    getChatList: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select distinct fromId, toId from chat where fromId = ?", [id])
            res.json({
                chatList: rows
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    createChatRoom: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select distinct fromId, toId from chat where fromId = ?", [id])
            res.json({
                chatList: rows
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getConversation: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from chat where chatId = ?", [id])
            res.json({
                result: rows
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    checkMessageExist: async (req, res) => {
        try {
            const { fromId, toId } = req.body
            const [rows, fields] = await pool.query("select * from chat where fromId = ? and toId = ?", [fromId,toId])
            res.json({ 
                result: rows.length !== 0,
                chatData: rows
            });
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getLastestMessage: async (req, res) => {
        try {
            const { fromId, toId } = req.body
            const [rows, fields] = await pool.query("select * from chat where id = (select max(id) from chat where fromId = ? and toId = ?)", [fromId,toId])
            res.json({
                message: rows
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    create: async (req, res) => {
        try {
            const { chatId,descrip, fromId, toId, createdAt } = req.body
            const sql = "insert into chat (chatId,descrip, fromId, toId, createdAt) values (?, ?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [chatId,descrip, fromId, toId, createdAt])
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
            const { chatId } = req.body
            const [rows, fields] = await pool.query("delete from chat where chatId = ?", [chatId])
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