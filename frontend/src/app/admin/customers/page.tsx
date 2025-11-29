"use client"
import React, { useState, useEffect } from "react";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
    _id: string;
    name: string;
    email: string;
};

export default function Page() {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
            <div className="space-y-2 p-2 gap-2 font-sans overflow-y-auto">
                {loading ? (
                    <p className="px-4 py-6 text-center text-gray-500">Loading...</p>
                ) : (
                    <>
                        <div className="flex items-center">
                            <h1 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold">Users</h1>
                        </div>
                        <div className="overflow-auto rounded-lg shadow">
                            <table className="w-full divide-y ">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-center font-normal">Name</th>
                                        <th className="px-4 py-3 text-center font-normal">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((u) => (
                                        <tr key={u._id}>
                                            <td className="px-4 py-3 text-center">{u.name}</td>
                                            <td className="px-4 py-3 text-center">{u.email}</td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                                                No users yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    )
};