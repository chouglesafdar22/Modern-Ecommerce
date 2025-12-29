"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/stats");
            setStats(res.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load admin stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
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
            <div className="grid grid-cols-1 md:grid-cols-2 px-3 gap-5 h-full font-sans">
                {loading ? (
                    <p>Loading...</p>
                ) : !stats ? (
                    <p>No data found</p>
                ) : (
                    <>
                        <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                            <CardHeader>
                                <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{stats.totalUser}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                            <CardHeader>
                                <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{stats.totalOrders}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                            <CardHeader>
                                <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{stats.totalProducts}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-1.5">
                            <CardHeader>
                                <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Revenues</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{stats.totalRevenues}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                            <CardHeader>
                                <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Monthly Sales Record</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{stats.monthlySales}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                            <CardHeader>
                                <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Low Stocks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{stats.lowStocks.length}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                            <CardHeader>
                                <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">New Users (last 7 days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{stats.newUsers}</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}
