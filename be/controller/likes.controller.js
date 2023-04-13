const pool = require("../database/index")
const likesController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from likes')
            res.status(201).json({
                data: rows
            })
        } catch (error){
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    create: async (req, res) => {
        try {
            const { userId, postId } = req.body
            const sql = "insert into likes (userId, postId) values (?, ?)"
            const [rows, fields] = await pool.query(sql, [userId, postId])
            res.status(201).json({
                data: {
                    result: "liked!",
                    rows
                }
            })
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from likes where postId = ?", [id])
            res.status(200).json({
                data: `unliked!`
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: "error", message: error.message  })
        }
    }
}
module.exports = likesController