const pool = require('../pool');
const fs = require('fs');
const path = require('path');


exports.getServices = async(req,res,next)=>{
    const services = await pool.query(`SELECT * FROM services`);
    res.status(200).json({
        status:'success',
        services:services.rows
    })
}

exports.getService = async(req,res,next)=>{
    const service = await pool.query(`
            SELECT * FROM services
            JOIN service_info ON service_info.service_id = services.id
            WHERE services.id = $1
        `,[req.params.serviceId]);

    res.status(200).json({
        status:'success',
        service:service.rows
    })
}

exports.addService = async (req,res,next)=>{
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    const service = await pool.query(`
            INSERT INTO services (name)
            VALUES ($1)
            RETURNING *;
        `,[req.body.name]);

    res.status(201).json({
        status:'success',
        service:service.rows[0]
    })
}

exports.updateService = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    const result = await pool.query(`
        UPDATE services
        SET name = COALESCE($1, name)
        WHERE id = $2
        RETURNING *;
    `, [req.body.name, req.params.id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
        status: 'success',
        service: result.rows[0]
    });
};


exports.deleteService = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    const result = await pool.query(`
        DELETE FROM services
        WHERE id = $1
        RETURNING *;
    `, [req.params.id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
        status: 'success',
        message: 'Service deleted successfully',
        deletedService: result.rows[0]
    });
};


exports.addServiceInfo = async (req,res,next)=>{
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    const service = await pool.query(`SELECT * FROM services WHERE id = $1`,[req.params.serviceId])
    if(service.rows.lenght === 0) return res.status(404).json({message:'service not found'});

    const images = [];

    req.files.images.map(file=> images.push(file.filename) )

    const serviceInfo = await pool.query(`
            INSERT INTO service_info (service_id , image,description)
            VALUES ($1,$2,$3)
            RETURNING *;
        `,[req.params.serviceId,images,req.body.description]);

    res.status(201).json({
        status:'success',
        serviceInfo:serviceInfo.rows[0]
    })
}



exports.updateServiceInfo = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    let images = [];

    if (req.files && req.files.images) {
        images = req.files.images.map(file => images.push(file.filename));
    }

    if(req.body.oldImages){
        const oldImages = await pool.query(`
                SELECT image FROM service_info WHERE id = $1
            `,[req.params.infoId]);
        
        images.push(oldImages);
    }

    const serviceInfo = await pool.query(`
        UPDATE service_info
        SET 
            description = COALESCE($1, description),
            image = COALESCE($2, image)
        WHERE id = $3
        RETURNING *;
    `, [req.body.description, images, req.params.infoId]);

    if (serviceInfo.rowCount === 0) {
        return res.status(404).json({ message: "Service info not found" });
    }

    res.status(200).json({
        status: 'success',
        serviceInfo: serviceInfo.rows[0]
    });
};


exports.deleteServiceInfo = async (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(405).json({ message: "Not allowed" });

    const serviceInfo = await pool.query(`
        DELETE FROM service_info
        WHERE id = $1
        RETURNING *;
    `, [req.params.infoId]);

    if (serviceInfo.rowCount === 0) {
        return res.status(404).json({ message: "Service info not found" });
    }

    const deletedInfo = serviceInfo.rows[0];
    if (deletedInfo.image) {
        const imagePaths = Array.isArray(deletedInfo.image)
            ? deletedInfo.image.map(img => path.join(__dirname, '../img', img))
            : [path.join(__dirname, '../img', deletedInfo.image)];

        imagePaths.forEach(filePath => {
            fs.unlink(filePath, err => {
                if (err) console.error(`Failed to delete image: ${err}`);
            });
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Service info deleted successfully',
        deletedServiceInfo: deletedInfo
    });
};