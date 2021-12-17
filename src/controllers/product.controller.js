const express = require("express");

const fs = require("fs");

const router = express.Router();

const Product = require("../models/product.model");

const upload = require("../middlewares/upload");

const authenticate = require("../middlewares/authenticate");

const authorise = require("../middlewares/authorise");

router.get("/", authenticate, async(req, res) => {
    try {
        const products = await Product.find().populate("executive").lean().exec();
        res.send({products});
    } catch(e) {
        res.send({message: e.message});
    }
});

router.post("/", authenticate, authorise(["admin", "seller"]), upload.single("image_urls"), async(req, res) => {
    try {
        const product = await Product.create({
            name : req.body.name,
            price : req.body.price,
            image : req.file.path,
            executive : req.body.executive
        });
        res.status(201).send({product});
    } catch(e) {
        res.send({message: e.message});
    }
})

router.delete("/:id", authenticate, authorise(["admin", "seller"]), async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        fs.unlink(product.image, (err) => {
            if(err)
            console.log(err);
            else
            console.log(`${product.image} deleted`);
        });
        const productDel = await Product.findByIdAndDelete(req.params.id);
        res.send({productDel});
    } catch(e) {
        res.send({message: e.message});
    }
})

router.patch("/:id", authenticate, authorise(["admin", "seller"]), upload.single("image_urls"), async(req, res) => {
    try {
        const productUpdated = await Product.findById(req.params.id);
        const product = {};
        if(req.file)
        {
            fs.unlink(productUpdated.image, (err) => {
                if(err)
                console.log(err);
                else
                console.log(`${productUpdated.image} deleted`);
            });
            product.profile_pic = await Product.findByIdAndUpdate(req.params.id, {$set: {profile_pic: req.file.path}}, {new: true});
        }
        if(req.body.name)
        {
            product.name = await Product.findByIdAndUpdate(req.params.id, {$set: {name: req.body.name}}, {new: true});
        }
        if(req.body.price)
        {
            product.price = await Product.findByIdAndUpdate(req.params.id, {$set: {price: req.body.price}}, {new: true});
        }
        if(req.body.executive)
        {
            product.executive = await Product.findByIdAndUpdate(req.params.id, {$set: {executive: req.body.executive}}, {new: true});
        }
        res.status(201).send({product});
    } catch(e) {
        res.send({message: e.message});
    }
})

module.exports = router;