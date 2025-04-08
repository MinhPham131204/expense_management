import { Home, LineChart, CreditCard, Wallet, LogOut, Menu, X } from "lucide-react";
import {
    Sidebar,
    SidebarProvider,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";


import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useSidebar } from "@/context/SidebarContext";
interface MenuItem {
    title: string;
    url: string;
    icon: React.ElementType;
}

const items: MenuItem[] = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Giao dịch", url: "/history", icon: CreditCard },
    { title: "Thống kê", url: "/statistic", icon: LineChart },
    { title: "Ngân sách", url: "/budget", icon: Wallet },
];

const SideBar: React.FC = () => {
    const { username, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);
    const { isCollapsed, toggleSidebar } = useSidebar()

    useEffect(() => {
        setActive(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                toggleSidebar()
            };
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (!isConfirmed) return;
        try {
            sessionStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            navigate("/login");
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Đăng xuất thất bại. Vui lòng thử lại!");
        }
    };

    const sidebarWidth = isCollapsed ? 100 : 280;

    return (
      <div className="fixed top-0 left-10 z-50">
        <div className="relative">
            <SidebarProvider>
                <motion.div
                    style={{ width: sidebarWidth }}
                    className={`shadow-xl flex flex-col justify-between border-r
                         bg-white text-gray-800 border-gray-200 dark:bg-[#1E1E2D] dark:text-gray-300 dark:border-gray-700
                         transition-all duration-300 ease-in-out overflow-hidden
                         ${isCollapsed ? '' : 'hover:w-[290px]'}
                    `}
                >
                    {/* Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className={`absolute top-5 ${isCollapsed ? 'right-[16px]' : 'right-[-25px]'} bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 z-10 outline-0`}
                    >
                        {isCollapsed ? <Menu className="w-6 h-6 text-black" /> : <X className="w-6 h-6 text-black" />}
                    </button>

                    {/* --- LOGO / BRAND --- */}
                    <div className={`flex flex-col items-center justify-center py-6 transition-all duration-300 ${isCollapsed ? 'gap-0' : 'gap-2'}`}>
                        <motion.h1
                            initial={{ opacity: isCollapsed ? 0 : 1, y: isCollapsed ? -10 : 0 }} // Animate opacity and position
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`${isCollapsed ? "hidden" : "block"} text-3xl h-16 font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-300 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent`}
                        >
                            Uynex
                        </motion.h1>
                        <motion.h2
                            initial={{ opacity: isCollapsed ? 0 : 1, y: isCollapsed ? -10 : 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`${isCollapsed ? "hidden" : "block"} relative text-lg text-emerald-600 dark:text-emerald-400 font-bold px-4 py-1 rounded-md transition-all duration-300 
                              hover:scale-105 hover:text-white dark:hover:text-gray-900 
                              hover:bg-gradient-to-r from-emerald-500 to-green-400 dark:from-emerald-400 dark:to-green-300`}
                        >
                            {username}
                        </motion.h2>
                    </div>

                    {/* --- MAIN MENU --- */}
                    <SidebarContent className="flex-1">
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu className={`space-y-2 px-4 h-10 py-10 gap-6 ${isCollapsed ? 'py-20' : ''}`}>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                className={`flex items-center justify-start h-16 gap-4 w-full px-10 py-3 rounded-lg text-lg font-bl transition-all duration-200
                                                    ${active === item.url ? "bg-gradient-to-r rounded-full dark:from-blue-300 dark:to-blue-900 text-white shadow-sm from-[#588ec5] to-[#475f8b] dark:text-white" : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-[#2C2C3A] dark:hover:text-white"}
                                                    active:scale-[0.98] 
                                                    ${isCollapsed ? 'justify-center h-12 w-full px-4' : ''} /* Center items when collapsed */
                                                `}
                                                asChild
                                            >
                                                <Link to={item.url} className="flex items-center w-full gap-3">
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <item.icon className={`${isCollapsed ? 'w-10 h-10' : 'w-6 h-6'} text-rose-600 dark:text-rose-400`} />
                                                    </TooltipTrigger>
                                                    {isCollapsed && (
                                                      <TooltipContent>
                                                        <span className="text-sm font-medium ">{item.title}</span>
                                                      </TooltipContent>
                                                    )}
                                                  </Tooltip>
                                                  {!isCollapsed && <span className="text-rose-800 dark:text-slate-200">{item.title}</span>}
                                              </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    {/* --- FOOTER --- */}
                      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 flex flex-col gap-4 items-center">
                        <div className="flex items-center justify-center h-16 w-full">
                          <ThemeToggle isCollapsed={isCollapsed}/>
                        </div>

                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={handleLogout}
                                    className={`relative flex items-center gap-3 w-full px-6 py-4 text-lg font-semibold rounded-xl text-white h-12
                                      bg-gradient-to-r from-red-400 to-red-500
                                      transition-all duration-300
                                      hover:brightness-125 hover:scale-[1.04] hover:shadow-lg
                                      active:scale-[1] active:brightness-95
                                    ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                >
                                    <LogOut className="w-7 h-7 drop-shadow-md" />
                                    {!isCollapsed && <span>Đăng xuất</span>}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                </motion.div>
            </SidebarProvider>
        </div>
      </div>
    );
};

export default SideBar;