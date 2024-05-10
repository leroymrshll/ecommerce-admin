import mongoose, {Schema, model, models} from "mongoose";

//Product database data model. Includes the different variables and constants of the objects.
const ProductSchema = new Schema ({
    title: {type: String, required:true},
    description: String,
    price: {type: Number, required: true},
    images: [{type:String}],
    category: {type:mongoose.Types.ObjectId, ref:"Category"},
    properties: {type:Object},
} , {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);