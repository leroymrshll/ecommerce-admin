import mongoose, { Schema, model, models } from "mongoose";

//Create the model schema for "categories" database.
const CategorySchema = new Schema({
    name: {type:String, required:true},
    parent: {type:mongoose.Types.ObjectId, ref: "Category", required:false},
    properties: [{type:Object}]
});

export const Category = models?.Category || model("Category", CategorySchema);