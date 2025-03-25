import { Home, LineChart, CreditCard, Wallet, Settings, LogOut } from "lucide-react";
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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const items: MenuItem[] = [
  { title: "Dashboard", url: "#", icon: Home },
  { title: "Giao dịch", url: "#", icon: CreditCard },
  { title: "Thống kê", url: "#", icon: LineChart },
  { title: "Ngân sách", url: "#", icon: Wallet },
  { title: "Cài đặt", url: "#", icon: Settings },
];

const SideBar: React.FC = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("Dashboard");

  const handleLogout = async () => {
    const isConfirmed = confirm("Are you sure you want to log out?");
    if (!isConfirmed) {
      return;
    }
    // await axios.post("http://localhost:3000/users/logout", {}, { withCredentials: true });
    setIsLoggedIn(false);
    navigate("/login");
  };

  const username = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/username", { withCredentials: true });
      return response.data.username
    }
    catch(error) {
      console.log('Error when get username for sidebar ', error);
    }
  }

  return (

    <div className="w-80">
      <SidebarProvider>
        <Sidebar
          className={`
            w-80 shadow-xl flex flex-col justify-between border-r 
            bg-white text-gray-800 border-gray-200
            dark:bg-[#1E1E2D] dark:text-gray-300 dark:border-gray-700
          `}
        >
          {/* --- LOGO / BRAND --- */}
          <div className="flex items-center justify-center py-6">
            <h1 className="text-2xl font-extrabold tracking-wide dark:text-white">
              Uynex
            </h1>
          </div>

          {/* --- MAIN MENU --- */}
          <SidebarContent className="flex-1">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-4 py-10 gap-4">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
  className={`
    flex items-center gap-4 w-full min-h-[60px] px-6 py-4 rounded-lg text-lg font-semibold 
    transition-all duration-200
    ${
      active === item.title
        ? `
          bg-gradient-to-r from-blue-500 to-blue-900 text-white shadow-sm
          dark:from-[#345678] dark:to-[#3c66b3] dark:text-white
        `
        : `
          hover:bg-blue-50 hover:text-blue-700 
          dark:hover:bg-[#2C2C3A] dark:hover:text-white
        `
    }
    active:scale-[0.98]
  `}
  onClick={() => setActive(item.title)}
  asChild
>
  <Link to={item.url} className="flex items-center w-full">
    <item.icon className="w-6 h-6" />
    <span>{item.title}</span>
  </Link>
</SidebarMenuButton>

                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* --- FOOTER --- */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <ThemeToggle />
            </div>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className={`
                    flex items-center gap-3 w-2/3 px-6 py-4 text-lg font-semibold rounded-lg 
                    text-white 
                    bg-gradient-to-r from-red-500 to-red-700
                    hover:brightness-110 hover:scale-[1.03]
                    transition-all duration-200
                    active:scale-[0.98]
                  `}
                >
                  <LogOut className="w-6 h-6" />
                  <span>Đăng xuất</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};

export default SideBar;
