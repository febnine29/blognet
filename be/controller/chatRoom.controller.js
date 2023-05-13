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
    checkMembersExist: async (fromId, toId) => {
        const [rows, fields] = await pool.query("select * from chatroom where members like ?", [`%${fromId}%`])
        const chatrooms = rows.filter(row => {
            const members = JSON.parse(row.members)
            return members.includes(fromId) && members.includes(toId)
        })
        return chatrooms
    },
    checkMessageExist: async (req, res) => {
        try {
            const { fromId, toId } = req.body
            const membersExist = await chatController.checkMembersExist(fromId, toId)
            if(membersExist.length !== 0){
                const result = membersExist.map(row => {
                    return {
                        ...row,
                        members: JSON.parse(row.members)
                        }
                    })
                res.json({
                    result
                })
            } else {
                res.json({
                   result: 'not found'
                })
            }
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    create: async (req, res) => {
        try {
            const { members, createdAt } = req.body
            if (!members || members.includes(0)) {
                res.status(400).json({ status: "error", message: "Invalid member ID" })
            } else {
                const isDuplicate = await chatController.checkMembersExist(members[0], members[1])
                if (isDuplicate.length !== 0) {
                    const result = isDuplicate.map(row => {
                        return {
                            ...row,
                            members: JSON.parse(row.members)
                            }
                        })
                    res.status(400).json({ 
                        status: "error", 
                        message: "Chatroom with these members already exists",
                        result
                    })
                    
                } else {
                    const sql = "insert into chatroom (members, createdAt) values (?, ?)"
                    const [result] = await pool.query(sql, [JSON.stringify(members), createdAt])
                    const [chatroom] = await pool.query("select * from chatroom where id = ?", [result.insertId])
                    const newResult = chatroom.map(row => {
                        return {
                            ...row,
                            members: JSON.parse(row.members)
                            }
                        })
                    res.status(201).json({
                        result: "New chatroom created successfully!",
                        newResult
                    })
                }
            }
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