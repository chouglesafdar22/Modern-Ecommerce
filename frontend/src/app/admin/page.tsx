"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [productCount, setProductCount] = useState(0);
    const [userCount,setUserCount]=useState(0);

    useEffect(() => {
        fetch("https://fakestoreapi.com/products").then(res => res.json()).then(productData => setProductCount(productData.length));
    })

    useEffect(() => {
        fetch("https://fakestoreapi.com/users").then(res => res.json()).then(userData => setUserCount(userData.length));
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 px-3 gap-5 h-full font-sans">
            <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                <CardHeader>
                    <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">$1500</p>
                </CardContent>
            </Card>

            <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                <CardHeader>
                    <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">50</p>
                </CardContent>
            </Card>

            <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                <CardHeader>
                    <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{userCount}</p>
                </CardContent>
            </Card>

            <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                <CardHeader>
                    <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">{productCount}</p>
                </CardContent>
            </Card>

            <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                <CardHeader>
                    <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Monthly Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">$5000</p>
                </CardContent>
            </Card>

            <Card className="bg-gray-300 drop-shadow-lg text-center drop-shadow-gray-500 gap-2">
                <CardHeader>
                    <CardTitle className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Low Stocks</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">10</p>
                </CardContent>
            </Card>
        </div>
    );
}
