const pool = require('../database/index')

const followController = {
    checkRelation: async (req, res) => {
        try{
            const {followerUserId, followedUserId} = req.body
            const [rows, fields] = await pool.query("select id from relationships where followerUserId = ? and followedUserId = ?", [followerUserId,followedUserId])
            if(rows.length > 0){
                res.status(400).json({status: "error", message: "Relationship already exists"})
            } else {
                res.status(200).json({
                    result: 'new relation'
                })
            }
        } catch(error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    setFollowed: async (req, res) => {
        try{
            const {followerUserId, followedUserId} = req.body
            const [rows, fields] = await pool.query("select id from relationships where followerUserId = ? and followedUserId = ?", [followerUserId,followedUserId])
            if(rows.length > 0){
                res.status(400).json({status: "error", message: "Relationship already exists"})
            } else {
                const sql = 'insert into relationships (followerUserId, followedUserId) value (?, ?)'
                const [insertRows, insertFields] = await pool.query(sql,[followerUserId, followedUserId])
                res.status(201).json({
                    result: 'Followed !'
                })
            }
        } catch(error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    unFollowed: async (req, res) => {
        try{
            const {followerUserId, followedUserId} = req.body
            const [rows, fields] = await pool.query("select id from relationships where followerUserId = ? and followedUserId = ?", [followerUserId,followedUserId])
            
            if (rows.length > 0) {
                const { id } = rows[0]
                // rest of the code
                const [delRow, delField] = await pool.query("delete from relationships where id = ?", [id])
                res.status(201).json({
                    result: 'Unfollowed!'
                })
              } else {
                res.status(400).json({status: "error", message: "Relationship does not exist"})
              }
        } catch(error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getFollowed: async (req, res) => {
        try{
            const { id } = req.body
            const [rows, fields] = await pool.query("select id, followedUserId from relationships where followerUserId = ?", [id])
            res.json({
                result: rows
            })
        } catch(error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getFollowers: async (req, res) => {
        try{
            const { id } = req.body
            const [rows, fields] = await pool.query("select id, followerUserId from relationships where followedUserId = ?", [id])
            res.json({
                result: rows
            })
        } catch(error){
            res.status(401).json({status: "error", message: error.message })
        }
    },
    getMostFollowed: async (req, res) => {
        try {
          const [rows, fields] = await pool.query(`
            SELECT followedUserId, COUNT(*) AS followersCount
            FROM relationships
            GROUP BY followedUserId
            ORDER BY followersCount DESC
          `);
          res.json({
            result: rows
          });
        } catch (error) {
          res.status(401).json({status: "error", message: error.message });
        }
    }
}
module.exports = followController