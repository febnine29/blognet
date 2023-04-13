const pool = require("../database/index")
const commentsController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from comments')
            res.status(201).json({
                data: rows
            })
        } catch (error){
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    getCommentById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from comments where id = ?", [id])
            res.status(201).json({
                data: rows
            })
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    create: async (req, res) => {
        try {
            const { descrip, createdAt, userId, postId } = req.body
            const sql = "insert into comments (descrip, createdAt, userId, postId) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [descrip, createdAt, userId, postId])
            res.status(201).json({
                data: {
                    result: "commented!",
                    rows
                }
            })
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    update: async (req, res) => {
        try {
            const { descrip, createdAt, userId, postId } = req.body
            const {id} = req.params
            const sql = "update comments set descrip = ?, createdAt = ?, userId = ?, postId = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [descrip, createdAt, userId, postId, id]) 
            res.status(201).json({
                data: `updated comment ${id}!`
            })
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from comments where id = ?", [id])
            res.status(200).json({
                data: `deleted comment!`
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: "error", message: error.message  })
        }
    }
}
module.exports = commentsController