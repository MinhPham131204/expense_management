import { Home, LineChart, CreditCard, Wallet, Settings, LogOut } from "lucide-react";
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";

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
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="w-80">
      <SidebarProvider>
        <Sidebar className="w-80 bg-[#1E1E2D] text-gray-300 shadow-lg shrink-0">
          {/* MENU */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={`flex items-center gap-4 px-6 py-4 rounded-md text-lg font-medium transition-all
                          ${
                            active === item.title
                              ? "bg-[#3c66b3] text-white"
                              : "hover:bg-[#66b798] hover:text-white"
                          }`}
                        onClick={() => setActive(item.title)}
                        asChild
                      >
                        <Link to={item.url} className="flex items-center w-full">
                          <item.icon className="w-6 h-6" />
                          <span>{item.title} </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* FOOTER */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="flex items-center gap-4 px-6 py-4 text-lg font-medium rounded-md transition-all"
              >
                <LogOut className="w-6 h-6" />
                <span>Đăng xuất</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};

export default SideBar;
