const pool = require("../database/index")
const postsController = {
    getAll: async (req, res) => {
        try{
            // const [rows, fields] = await pool.query('select * from posts LEFT JOIN likes ON posts.id = likes.postId ')
            const [rows, fields] = await pool.query('select * from posts order by id desc')
            const data = rows.map(row => {
                return {
                    ...row,
                    img: JSON.parse(row.img)
                    }
                })
            res.json({
                data
            })
        } catch (error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from posts where id = ?", [id])
            const data = rows.map(row => {
            return {
                ...row,
                img: JSON.parse(row.img)
                }
            })
            res.json({
                data
            })
        } catch (error) {
            res.status(401).json({status: "error", message: error.message })
        }
    },
    create: async (req, res) => {
        try {
            const { descrip, img, userId, createdAt, isLiked } = req.body
            const sql = "insert into posts (descrip, img, userId, createdAt, isLiked) values (?, ?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [descrip, JSON.stringify(img), userId, createdAt, isLiked])
            res.status(201).json({
                data: "Created new post!"
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({ status: "error" })
        }
    },
    updateIsLiked: async (req, res) => {
        try {
            const { isLiked } = req.body
            const {id} = req.params
            const sql = "update posts set isLiked = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [isLiked, id]) 
            res.status(201).json({
                title: `Successful!`
            })
        } catch (error) {
            res.status(401).json({ status: "error" })
        }
    },
    update: async (req, res) => {
        try {
            const { descrip, img, userId, createdAt, isLiked } = req.body
            const {id} = req.params
            const sql = "update posts set descrip = ?, img = ?, userId = ?, createdAt = ?, isLiked = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [descrip, JSON.stringify(img), userId, createdAt, isLiked, id]) 
            res.status(201).json({
                title: `updated post ${id}!`
            })
        } catch (error) {
            res.status(401).json({ status: "error" })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from posts where id = ?", [id])
            res.json({
                data: `delete post ${id} successfully!`
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: "error"
            })
        }
    }
}

module.exports = postsController