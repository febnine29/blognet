const pool = require("../database/index")
const commentsController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from comments')
            res.json({
                data: rows
            })
        } catch (error){
            res.json({status: "error" })
        }
    },
    getCommentById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from comments where commentPostId = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            res.json({status: "error" })
        }
    },
    getLikeById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from comments where likePostId = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            res.json({status: "error" })
        }
    },
    create: async (req, res) => {
        try {
            const { likePostId, commentPostId, userId, content, attime } = req.body
            const sql = "insert into comments (likePostId, commentPostId, userId, content, attime) values (?, ?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [likePostId, commentPostId, userId, content, attime])
            res.json({
                data: {
                    result: "commented!",
                    rows
                }
            })
        } catch (error) {
            res.json({ status: "error" })
        }
    },
    update: async (req, res) => {
        try {
            const { likePostId, commentPostId, userId, content, attime } = req.body
            const {id} = req.params
            const sql = "update comments set likePostId = ?, commentPostId = ?, userId = ?, content = ?, attime = ? where cmtId = ?"
            const [rows, fields] = await pool.query(sql, [likePostId, commentPostId, userId, content, attime, id]) 
            res.json({
                data: `updated comment ${id}!`
            })
        } catch (error) {
            res.json({ status: "error" })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from comments where cmtId = ?", [id])
            res.json({
                data: `deleted comment!`
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }
}
module.exports = commentsController