const express = require('express');
const User = require('../models/user.model');
const passport = require('passport');


module.exports.postLogin = (req, res, next) =>  {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    } else {
        passport.authenticate('local-auth', (err, user, message) => {
            if (err) { return next(err) }
            else if (!user) {
                return res.status(401).json(message);
            } else {
                req.login(user, (err) => {
                    if (err) { return next(err) }
                    else {
                        return res.status(200).json(req.user);
                    }
                });
            }
        })(req, res, next);
    }
}

module.exports.postLogout = (req, res, next) => {
    req.logout();
    req.session.destroy(function (err) {
        if (err) { return next(err); }
        return res.status(204).send();
    });
}

module.exports.postRegister = (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    if (!user.email || !user.password) {
        return res.status(400).json({ message: 'Username and password are required' });
    } else {
        User.findOne({email: user.email}, (err, exist) => {
            if (err) { return next(err) }
            else if (exist) {
                return res.status(400).json({ message: 'Username unavailable' });
            } else {
                user.save((err) => {
                    if (err) { return next(err) }
                    else {
                        req.login(user, (err) => {
                            if (err) { return next(err) }
                            else {
                                return res.status(200).json(req.user);
                            }
                        });
                    }
                });
            }
        });
    }
}
