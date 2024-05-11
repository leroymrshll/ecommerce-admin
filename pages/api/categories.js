import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Categories";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    /* await isAdminRequest(req,res); */

    //Fetch all the existing datas (existing categories).
    if (method === "GET") {
        res.json(await Category.find().populate("parent"));
    }

    //Post the database from the input in categoreis page into MONGODB database.
    if (method === "POST") {
        const {name, parentCategory, properties} = req.body;
        const categoryDoc = await Category.create({
            name, 
            parent:parentCategory || undefined,
            properties,
        });
        res.json(categoryDoc);
    }

    //Puts the edits made to the categories into MongoDB database.
    if (method === "PUT") {
        const {name, parentCategory, properties, _id} = req.body;
        const categoryDoc = await Category.updateOne({_id}, {
            name, 
            parent:parentCategory || undefined,
            properties,
        });
        res.json(categoryDoc);
    }
    if (method === "DELETE") {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json("ok");
    }
}