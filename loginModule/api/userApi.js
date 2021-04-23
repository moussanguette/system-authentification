const express = require('express');
const router = express.Router();

//const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

const webToken = require('jsonwebtoken');
const { Router } = require('express');
const models = require('../models');

require('dotenv').config();

//register API

router.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    if (username == undefined || username == '' || password == undefined || password == '' || email == undefined || email == '') {
        res.status(401).json({
            message: "fill all field",
            status: res.statusCode
        })
    } else {
        //verifier si le mail existe
        models.user.findOne({
            attributes: ["email"],
            where: {
                email
            }
        }).then((value) => {
            if (value === null) {
                //if not found create a new record i db with hashed password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, (err, hash) => {
                        //create record
                        models.user.create({
                            name: username,
                            email: email,
                            password: hash
                        }).then((value) => {
                            res.status(201).json({
                                message: "Account has created succefully",
                                status: res.statusCode
                            })
                        }).catch(err => res.status(404).json({
                            message: "something went wront"
                        }))
                    })
                })
            } else {
                res.status(401).json({
                    message: "email already taken",
                    status: res.statusCode
                })
            }
        })
    }
})

// router login
router.post('/login',(req,res)=>{
    const { password, email } = req.body;

    if (password == undefined || password == '' || email == undefined || email == '') {
        res.status(401).json({
            message: "fill all field",
            status: res.statusCode
        })
    } else {
        //verifier si le mail existe
        models.user.findOne({
            where: {
                email
            }
        }).then((value) => {
            //if mail not found ask user to register
            if (value === null) {
                res.status(401).json({
                    message:"Email is not register please please singUp",
                    status: res.statusCode,
                    token:''
                })
            } else {
                //if mail is there, check the password is correct or not
                const dbPassword = value.getDataValue('password');
                bcrypt.compare(password,dbPassword,(err, resultat)=>{
                    if(resultat){
                        //if password is correct sent json webtoken

                        const userDetail={
                            name: value.getDataValue('name'),
                            id: value.getDataValue('id')
                        }
                        const token=webToken.sign(userDetail, process.env.secret_key,{
                            expiresIn:"60s"
                        })

                        res.status(200).json({
                            message: "Logged in succeffully",
                            status: res.statusCode,
                            token

                        })
                    }else{
                        //if password not match sent error message
                        res.status(200).json({
                            message: "Invalid crendential given",
                            status: res.statusCode,
                            token:''
                        })

                    }
                })
                
            }
        })
    }
})

//get user profile
router.get('/profile',(req,res)=>{
    const authHeader = req.headers['authorization'];
    if(authHeader){
        //web token
        const token =authHeader.substr('bearer'.length,+1);
        if(user){
            res.status(200).json({
                message: "success",
                status: res.statusCode,
                data:user
            })
        }
    }else{
        res.status(401).json({
            message: "please login",
            status: res.statusCode,
            token:''
        })
    }
})

module.exports = router