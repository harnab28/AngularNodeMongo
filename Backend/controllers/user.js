const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser =  (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then( hash => {
            const user = new User ({
                email : req.body.email,
                password: hash
            });
            user.save()
                .then( result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'User Created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err,
                        message: 'User cannot be Created'
                    });
                })
        });

};

exports.userLogin = (req, res, next) => {
    let fetechedUser;
    User.findOne({email: req.body.email})
        .then( user => {
            if(!user){
                return res.status(401).json({
                    message: "User Doesnot Exist"
                });
            }
            fetechedUser = user;
            bcrypt.compare(req.body.password, user.password)
                .then(result => {
                    if(!result){
                        return res.status(401).json({
                            message: "Incorrect Username or Password"
                        });
                    }
                    const token = jwt.sign(
                                         { email: fetechedUser.email, userId: fetechedUser._id },
                                         'secret_this_should_be_longer', 
                                         { expiresIn: '1h' }
                                        );
                    res.status(200).json({
                        token: token,
                        expiresIn: 3600,
                        userId: fetechedUser._id
                    });

                })
                .catch( err => {
                    return res.status(401).json({
                        message: 'Login Failed'
                    });
                });
        });
};