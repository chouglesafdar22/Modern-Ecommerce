"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    TbLayoutDashboard,
    TbPackages,
    TbShoppingBag,
    TbUsers,
    TbTags,
    TbStars,
    TbTagStarred,
    TbSettings
} from "react-icons/tb";

export function Sidebar() {
    const path = usePathname();
    const menu = [
        { name: "Dashboard", icon: <TbLayoutDashboard size={18} />, href: "/admin" },
        { name: "Products", icon: <TbPackages size={18} />, href: "/admin/products" },
        { name: "Orders", icon: <TbShoppingBag size={18} />, href: "/admin/orders" },
        { name: "Customers", icon: <TbUsers size={18} />, href: "/admin/customers" },
        { name: "Categories", icon: <TbTags size={18} />, href: "/admin/categories" },
        { name: "Reviews", icon: <TbStars size={18} />, href: "/admin/reviews" },
        // { name: "Coupons", icon: <TbTagStarred size={18} />, href: "/admin/coupons" },
        // { name: "Setting", icon: <TbSettings size={18} />, href: "/admin/setting" },
    ];

    return (
        <aside className="md:w-64 w-24 bg-white border-r shadow-r-sm px-1 md:px-4 md:py-6 py-2.5 h-full overflow-y-auto">
            <h1 className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold mb-6 text-center pb-4 border-b">Admin Panel</h1>
            <nav className="md:py-2 py-0.5 flex flex-col gap-2.5">
                {menu.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={`flex flex-col justify-center items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition ${path === item.href ? "bg-black text-white" : "hover:bg-gray-200 text-gray-600"}`}>
                            {item.icon}
                            <span className="hidden md:block">{item.name}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};