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
            const { id } = req.params
            const [rows, field] = await pool.query("select * from chat where chatId = ? order by id desc limit 1 ", [id])
            const { maxId } = rows
            const [rows1, field1] = await pool.query("select * from chat where id = ?", [maxId])
            console.log(rows);
            res.json({
                result: rows[0]
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    create: async (req, res) => {
        try {
            const { chatId, descrip, fromId, toId, createdAt } = req.body;
            const insertSql = "INSERT INTO chat (chatId, descrip, fromId, toId, createdAt) VALUES (?, ?, ?, ?, ?)";
            await pool.query(insertSql, [chatId, descrip, fromId, toId, createdAt]);
    
            const selectSql = "SELECT * FROM chat WHERE chatId = ? AND descrip = ? AND fromId = ? AND toId = ? AND createdAt = ?";
            const [rows, fields] = await pool.query(selectSql, [chatId, descrip, fromId, toId, createdAt]);
    
            res.status(201).json({
                result: rows[0]
            });
        } catch (error) {
            console.log(error);
            res.status(401).json({ status: "error" });
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