import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Products from "@/pages/products";

export default function ProductForm({
    _id, 
    title:exisitingTitle, 
    description:exisitingDescription, 
    price:exisitingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,
    }) {
    //Form input default values, if edit product form is being displayed in the edit product page, inputs fields will display existing values. If add new product form is being displayed the existing values will be displayed in each input fields.
    const [title,setTitle] = useState(exisitingTitle || "");
    const [description,setDescription] = useState(exisitingDescription || "");
    const [category,setCategory] = useState(assignedCategory || "");
    const [productProperties,setProductProperties] = useState(assignedProperties || {});
    const [price,setPrice] = useState(exisitingPrice || "");
    const [images,setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading,setIsUploading] = useState(false);
    const [categories,setCategories] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
        })
    }, []);

    //This function saves changes that is being made to the products database collection. Either it is from adding new products or editing existing products.
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,description,price,images,category,
            properties:productProperties,
        };
        if (_id) {
            //update
            await axios.put('/api/products', {...data, _id});
        } else {
            //create
            await axios.post("/api/products", data);
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push("/products");
    }

    //This function receives image files from local storage to be later uploaded into the database's array.
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file)
            }
            const res = await axios.post("/api/upload", data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    //React sortable function dependancy to update the image order after being sorted.
    function updateImagesOrder(images) {
        setImages(images);
    }
    function setProductProp (propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
            <form onSubmit={saveProduct}>
                <label>Product name</label>
                <input 
                    type="text" 
                    placeholder="product name" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)} />
                <label>Category</label>
                <select 
                    value={category}
                    onChange={ev => setCategory(ev.target.value)}>
                    <option value={""}>Uncategorized</option>
                    {categories.length > 0 && categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                    <div key={p._id}>
                        <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                        <select 
                        value={productProperties[p.name]}
                        onChange={ev => 
                            setProductProp(p.name, ev.target.value)
                        }>
                            {p.values.map(v => (
                                <option value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <label>
                    Photos
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable 
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-1 shadow-sm rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-sm" />
                        </div>
                    ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 w-24 p-2 flex items-center justify-center rounded-lg">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 cursor-pointer flex flex-col justify-center items-center text-sm text-gray-500 rounded-sm bg-white shadow-sm border border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <div>
                            Upload
                        </div>
                        <input type="file" onChange={uploadImages} className="hidden"/>
                    </label>
                </div>
                <label>Description</label>
                <textarea 
                    placeholder="description" 
                    value={description}
                    onChange={ev => setDescription(ev.target.value)} />
                <label>Price (USD)</label>
                <input 
                    type="number" 
                    placeholder="price"
                    value={price}
                    onChange={ev => setPrice(ev.target.value)} />
                <button 
                    type="submit" 
                    className="btn-primary">
                        Save
                </button>
            </form>
    );
}