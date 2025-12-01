"use client"
import React, { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

interface FormValues {
    name: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    stock: number;
    discountPrice: number;
    shippingFee: number;
    taxPrice: number;
};

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [oldImage, setOldImage] = useState<string>("");
    const [newImage, setNewImage] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<FormValues>({ mode: "onChange" });

    useEffect(() => {
        const load = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    api.get("/categories"),
                    api.get(`/products/${id}`),
                ]);
                setCategories(catRes.data);
                const prod = prodRes.data;
                setOldImage(prod.image);

                reset({
                    name: prod.name,
                    description: prod.description,
                    price: prod.price,
                    discountPrice: prod.discountPrice,
                    shippingFee: prod.shippingFee,
                    taxPrice: prod.taxPrice,
                    brand: prod.brand,
                    category:
                        typeof prod.category === "object" ? prod.category._id : prod.category,
                    stock: prod.stock,
                });
            } catch (err: any) {
                toast.error(err.response?.data?.message || "Failed to load product");
            }
        };
        load();
    }, [id, reset]);

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");
            formData.append("price", values.price.toString());
            formData.append("discountPrice", values.discountPrice.toString());
            formData.append("shippingFee", values.shippingFee.toString());
            formData.append("taxPrice", values.taxPrice.toString());
            formData.append("stock", values.stock.toString());
            formData.append("brand", values.brand);
            formData.append("category", values.category);

            if (newImage) {
                formData.append("image", newImage);
            } else {
                formData.append("image", oldImage);
            }

            const res = await api.put(`/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(res.data)

            toast.success("Product updated successfully!");
            router.push("/admin/products");

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="light"
            />
            <div className="py-2 px-8 overflow-x-auto">
                <h2 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold pb-5">Edit Product:</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 md:max-w-3xl max-w-xl bg-gray-100 p-4 rounded drop-shadow-sm drop-shadow-black"
                >
                    <div>
                        <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Name</label>
                        <input
                            {...register("name", { required: true })}
                            className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                        />
                        {errors.name && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Name required</p>}
                    </div>
                    <div>
                        <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Description</label>
                        <textarea
                            {...register("description")}
                            className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                            rows={4}
                        />
                        {errors.description && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Description required</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("price", { required: true, valueAsNumber: true })}
                                className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                            />
                            {errors.price && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Price required</p>}
                        </div>
                        <div>
                            <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Discount Price</label>
                            <input
                                type="number"
                                {...register("discountPrice", { required: true, valueAsNumber: true })}
                                className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                            />
                            {errors.discountPrice && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Discount Price required</p>}
                        </div>
                        <div>
                            <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Shipping Fee</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("shippingFee", { required: true, valueAsNumber: true })}
                                className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                            />
                            {errors.price && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">shippingFee required</p>}
                        </div>
                        <div>
                            <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Tax Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("taxPrice", { required: true, valueAsNumber: true })}
                                className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                            />
                            {errors.price && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Tax price required</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Stock</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("stock", { required: true, valueAsNumber: true })}
                            className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                        />
                        {errors.price && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Stock required</p>}
                    </div>
                    <div>
                        <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Brand</label>
                        <input
                            {...register("brand", { required: true })}
                            className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                        />
                        {errors.brand && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Brand required</p>}
                    </div>
                    <div>
                        <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Image</label>
                        {oldImage && (
                            <img
                                src={oldImage}
                                alt="old"
                                className="w-24 h-24 object-cover rounded mb-2 border"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black cursor-pointer"
                            onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                        />
                    </div>
                    <div>
                        <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Category</label>
                        <select
                            {...register("category", { required: true })}
                            className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black cursor-pointer"
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Category required</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            type="submit"
                            disabled={!isValid || loading}
                            className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition
                        ${isValid && !loading
                                    ? "bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"
                                    : "bg-gray-700 pointer-events-none cursor-not-allowed"
                                }
                        `}
                        >
                            {loading ? "Saving..." : "Update Product"}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            type="button"
                            onClick={() => router.back()}
                            className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-white cursor-pointer hover:rounded-lg hover:bg-gray-400`}>
                            Cancel
                        </motion.button>
                    </div>
                </form >
            </div >
        </>
    )
};