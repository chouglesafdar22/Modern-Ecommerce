"use client"
import { Sidebar } from "../components/admin/Sidebar";
import ScrollWrapper from "../components/ScrollWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ScrollWrapper direction="fade" delay={0.2}>
            <div className="flex flex-rowlg:pt-[70px] font-sans md:pt-16 sm:pt-12 pt-12 pb-6 min-h-screen ">
                <Sidebar />
                <div className="flex-1 flex flex-col py-6">
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </ScrollWrapper>
    )
}