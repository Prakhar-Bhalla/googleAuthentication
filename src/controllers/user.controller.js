const User = require("../models/user.model");

const express = require("express");

const router = express.Router();

router.patch("/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {$set : {roles : req.body.roles}}, {new : true}).lean().exec();
        res.status(201).json({user});
    } catch (e) {
        res.status(500).send({status : "failed"});
    }
})

module.exports = router;