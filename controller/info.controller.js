const pool = require('../pool');

exports.addInfo = async (req,res,next) =>{
    if(req.user.role !== 'admin') return res.status(405).json({message:"not allowed"});

    const info = await pool.query(`
            INSERT INTO info (title,description)
            VALUES($1,$2)
            RETURNING *;
        `,[req.body.title,req.body.description])

    res.status(201).json({
        status:'success',
        info:info.rows[0]
    });
}


exports.updateInfo = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    const info = await pool.query(`
        UPDATE info
        SET title = COALESCE($1 ,title), description = COALESCE( $2, description)
        WHERE id = $3
        RETURNING *
    `, [req.body.title, req.body.description, req.params.id]);

    if (info.rows.length === 0) {
        return res.status(404).json({ message: "Info not found" });
    }

    res.status(200).json({
        status: 'success',
        info: info.rows[0]
    });
};


exports.deleteInfo = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    await pool.query(`
        DELETE FROM info
        WHERE id = $1;
    `, [req.params.id]);

    res.status(200).json({
        status: 'success',
        message: 'Info deleted successfully'
    });
}


exports.getAllInfo = async (req,res,next)=>{
    const info = await pool.query(`SELECT * FROM info`);
    res.status(200).json({
        status:'success',
        info:info.rows
    })
}