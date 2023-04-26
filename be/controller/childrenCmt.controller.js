const pool = require("../database/index")
const childrenCmtController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from commentchildren order by id desc')
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
            const [rows, fields] = await pool.query("select * from commentchildren where cmtId = ?", [id])
            res.status(201).json({
                comment: rows
            })
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    create: async (req, res) => {
        try {
            const { descrip, createdAt, userId, postId, isLiked } = req.body
            const sql = "insert into commentchildren (descrip, createdAt, userId, postId, isLiked) values (?, ?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [descrip, createdAt, userId, postId, isLiked])
            res.status(201).json({
                comment: {
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
            const sql = "update commentchildren set descrip = ?, createdAt = ?, userId = ?, postId = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [descrip, createdAt, userId, postId, id]) 
            res.status(201).json({
                comment: `updated comment ${id}!`
            })
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message  })
        }
    },
    delete: async (req, res) => {
        try {
          const { postId, userId } = req.body;
          const [rows, fields] = await pool.query(
            "delete from commentchildren where postId = ? and userId = ?",
            [postId, userId]
          );
          res.status(200).json({
            data: `deleted comment!`,
          });
        } catch (error) {
          console.log(error);
          res.status(400).json({ status: "error", message: error.message });
        }
      }
}
module.exports = childrenCmtController