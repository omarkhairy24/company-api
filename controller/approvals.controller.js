const pool = require('../pool');
const fs = require('fs');
const path = require('path');


exports.addApproval = async (req,res,next) =>{
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    req.body.image = req.file.filename

    const approval = await pool.query(`
            INSERT INTO approvals (name,image,description)
            VALUES($1,$2,$3)
            RETURNING *;
        `,[req.body.name,req.body.image,req.body.description]);

    res.status(201).json({
        status:'success',
        approval:approval.rows[0]
    })
}

exports.getApprovals = async(req,res,next)=>{

    const approvals = await pool.query(`SELECT * FROM approvals`);
    res.status(200).json({
        status:'success',
        approvals:approvals.rows
    })
}

exports.updateApproval = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    let image = req.file ? req.file.filename : null;

    const result = await pool.query(`
        UPDATE approvals
        SET 
            name = COALESCE($1, name),
            image = COALESCE($2, image),
            description = COALESCE($3, description)
        WHERE id = $4
        RETURNING *;
    `, [req.body.name, image, req.body.description, req.params.id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ message: "Approval not found" });
    }

    res.status(200).json({
        status: 'success',
        approval: result.rows[0]
    });
};

exports.deleteApproval = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    const result = await pool.query(`
        DELETE FROM approvals
        WHERE id = $1
        RETURNING * ;
    `, [req.params.id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ message: "Approval not found" });
    }

    if (deletedApproval.image) {
        const filePath = path.join(__dirname, '../img', result.rows[0].image);

        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete image: ${err}`);
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Approval deleted successfully',
        deletedApproval:result.rows[0]
    });
};