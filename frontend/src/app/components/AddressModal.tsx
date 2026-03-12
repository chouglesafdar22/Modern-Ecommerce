"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface AddressFormData {
    address: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pinCode: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AddressFormData) => void;
    initialData?: AddressFormData;
    title: string;
}

export default function AddressModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title
}: Props) {
    const [form, setForm] = useState<AddressFormData>(
        initialData || {
            address: "",
            city: "",
            pinCode: "",
            district: "",
            state: "",
            country: ""
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white w-full md:max-w-md max-w-xs rounded-xl p-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{title}</h3>
                            <button className="cursor-pointer" onClick={onClose}><IoClose /></button>
                        </div>
                        <div className="space-y-3">
                            {["address", "city", "pinCode", "district", "state", "country"].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    placeholder={field.toUpperCase()}
                                    value={(form as any)[field]}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                                type="button"
                                onClick={onClose}
                                className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-white cursor-pointer hover:rounded-lg hover:bg-gray-400`}>
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                                type="button"
                                onClick={() => onSubmit(form)}
                                className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900`}>
                                Save
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};