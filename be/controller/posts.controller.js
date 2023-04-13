const pool = require("../database/index")
const postsController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query('select * from posts')
            const datas = rows.map(row => {
                const imgArray = JSON.parse(row.img)
                const parsedImgArray = imgArray.map(img => JSON.parse(img))
                return {
                  ...row,
                  img: parsedImgArray
                }
              })
            res.json({
                datas
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
            res.status(401).json({status: "error" })
        }
    },
    create: async (req, res) => {
        try {
            const { descrip, img, userId, createdAt } = req.body
            const sql = "insert into posts (descrip, img, userId, createdAt) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [descrip, JSON.stringify(img), userId, createdAt])
            res.status(201).json({
                data: "Created new post!"
            })
        } catch (error) {
            console.log(error)
            res.status(401).json({ status: "error" })
        }
    },
    update: async (req, res) => {
        try {
            const { descrip, img, userId, createdAt } = req.body
            const {id} = req.params
            const sql = "update posts set descrip = ?, img = ?, userId = ?, createdAt = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [descrip, img, userId, createdAt, id]) 
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