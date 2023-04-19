const pool = require("../database/index")
const likesController = {
    getLikes: async (req, res) => {
        try{
            const {id} = req.params
            const [rows, fields] = await pool.query('select * from likes where postId = ?',[id])
            res.status(201).json({
                result: rows
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
                result: "liked!",
                rows
            })
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    delete: async (req, res) => {
        try {
            const { postId, userId } = req.body
            // const [rows, fields] = 
            // const query = await pool.query("delete from likes where postId = ? and userId = ?", [userId, postId])
            const [rows, fields] = await pool.query("select id from likes where userId = ? and postId = ?", [userId,postId])
            const { id } = rows[0]
            const [delRow, delField] = await pool.query("delete from likes where id = ?", [id])
            // console.log(rows.id);
            res.status(200).json({
                result: `unliked!`
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: "error", message: error.message  })
        }
    }
}
module.exports = likesController