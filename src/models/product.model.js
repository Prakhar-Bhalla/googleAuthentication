const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    name : {type: String, required: true},
    price : {type: Number, required: true},
    image : {type: String, required: true},
    executive : {type: Schema.Types.ObjectId, ref: "user", required: true}
}, {versionKey: false, timestamps: true});

const Product = model("product", productSchema);

module.exports = Product;