import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    /* await isAdminRequest(req,res); */

    //Get products from MongoDB database to display on products page.
    if (method === "GET") {
        //To check if id exists inside the URL
        if(req.query?.id) {
            res.json(await Product.findOne({_id:req.query.id}));
        } else {
            res.json(await Product.find());
        }
        res.json(await Product.find());
    }

    //Post new products to MongoDB database from the new products page.
    if (method === "POST") {
        const {title,description,price,images,category,properties} = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties,
        })
        res.json(productDoc);
    }

    //Put the new edited information of products into MongoDB database.
    if (method === "PUT") {
        const {title,description,price,images,category,properties,_id} = req.body;
        await Product.updateOne({_id}, {title, description, price, images, category, properties
        });
        res.json(true);
    }

    //Delete the product...
    if (method === "DELETE") {
        if(req.query?.id) {
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}