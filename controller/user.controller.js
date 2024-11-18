const {promisify} = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../pool');


const signToken = id =>{
    return jwt.sign({id} , 'jwtsecret',{
        expiresIn:'90d'
    })
};

const createSendToken = (user,statusCode,res) =>{
    const token = signToken(user.id);
    const cookieOption = {
        expires : new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
    };

    res.cookie('jwt',token,cookieOption);
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

const signup = async(req,res,next,role)=>{
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = await pool.query(`
            INSERT INTO users (name,email,password,role)
            VALUES($1,$2,$3,$4)
            RETURNING name,email,role,created_at
        `,[req.body.name,req.body.email,hash,role]);

    res.status(201).json({
        status:'success',
        user:user.rows[0]
    }) 
}


exports.userSignup = async(req,res,next)=>{
    await signup(req,res,next,'customer');
}

exports.adminSignup = async(req,res,next)=>{
    await signup(req,res,next,'admin');
}


exports.login = async(req,res,next) =>{
    const user = await pool.query(`
            SELECT id,name,password,role FROM users 
            WHERE email = $1;
        `,[req.body.email]);

    const compare = await bcrypt.compare(req.body.password , user.rows[0].password);
    if(!compare){
        return res.status(400).json({
            message:'incorrect email or password'
        })
    }

    createSendToken({
        "id":user.rows[0].id,
        "name":user.rows[0].name,
        "role":user.rows[0].role
    },200,res);
}

exports.protect = async(req,res,next)=>{
    let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }else if(req.cookies.jwt){
            token = req.cookies.jwt
        }
        if(!token){
            return next(new AppError('no token provided',498))
        }
        const decoded = await promisify(jwt.verify)(token,'jwtsecret');
        const user = await pool.query(`
                SELECT id,name,role FROM users
                WHERE id = $1
            `,[decoded.id]);
        req.user = user.rows[0];
        res.locals.user = user.rows[0];
        next();
};

