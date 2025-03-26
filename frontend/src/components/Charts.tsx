import { getDaysInMonth, getWeekRange } from "@/lib/helper"
import { Timeframe, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, TooltipProps } from "recharts";
    const formattedBarData = (transactions: Transaction[], timeframe: Timeframe) => {
        switch (timeframe) {
            case "latest": {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Đặt về 00:00 để so sánh chính xác
            
                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(today.getDate() - 6); // Lùi về 6 ngày trước (tính cả hôm nay là 7 ngày)
                sevenDaysAgo.setHours(0,0,0,0)
                // Tạo mảng mặc định cho 7 ngày
                const result = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(sevenDaysAgo.getDate() + i);
            
                    return {
                        date: date.toISOString().split("T")[0], // Lưu YYYY-MM-DD
                        expense: 0,
                        income: 0,
                    };
                });
            
                // Gộp dữ liệu từ transactions vào mảng 7 ngày gần nhất
                
                transactions.forEach((t) => {
                    const transDate = new Date(t.datetime);
                    transDate.setHours(0, 0, 0, 0); // Chuẩn hóa về 00:00 để so sánh
                    
            
                    if (transDate >= sevenDaysAgo && transDate <= today) {
                        const index = Math.floor((transDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)); // Tính vị trí trong mảng
                        
                        if (index >= 0 && index < 7) {
                            if (t.type === "Thu nhập") {
                                result[index].income += Number(t.money);
                            } else {
                                result[index].expense += Number(t.money);
                            }
                        }
                    }
                });
            
                return result;
            }
            
    
            case "month": {
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                
                // Tạo danh sách ngày trong tháng
                const daysInMonth = new Date(year, month, 0).getDate();
                const result = Array.from({ length: daysInMonth }, (_, i) => ({
                    year,
                    month,
                    date: i + 1,
                    expense: 0,
                    income: 0,
                }));
    
                // Duyệt qua transactions để gán vào từng ngày tương ứng
                transactions.forEach((t) => {
                    const transDate = new Date(t.datetime);
                    const transDay = transDate.getDate();
    
                    const index = transDay - 1;
                    if (index >= 0 && index < daysInMonth) {
                        if (t.type === "Thu nhập") {
                            result[index].income += Number(t.money);
                        } else {
                            result[index].expense += Number(t.money);
                        }
                    }
                });
    
                return result;
            }
    
            case "year": {
                const year = new Date().getFullYear();
                const result = Array.from({ length: 12 }, (_, i) => ({
                    year,
                    month: i + 1,
                    expense: 0,
                    income: 0,
                }));
    
                transactions.forEach((t) => {
                    const transDate = new Date(t.datetime);
                    const transMonth = transDate.getMonth();
    
                    if (transDate.getFullYear() === year) {
                        if (t.type === "Thu nhập") {
                            result[transMonth].income += Number(t.money);
                        } else {
                            result[transMonth].expense += Number(t.money);
                        }
                    }
                });
    
                return result;
            }
    
            default:
                return [];
        }
    };
    

export const BarCharts: React.FC<{transactions: Transaction[], tf: Timeframe}> = ({transactions, tf}) => {
    const [timeframe, setTimeframe] = useState<Timeframe> (tf);

    const data = formattedBarData(transactions, 'latest')
    
    
    
  return (
    <div className={cn("flex items-center justify-center p-4 bg-white shadow-md rounded-lg", 
    timeframe === "year" ? "w-[1000px]" : 
    timeframe === "month" ? "w-[1200px]" : "w-[600px]")}>
        <ResponsiveContainer width={"100%"} height={300}>
            <BarChart 
                data={data}
                height={300}
                barCategoryGap={5}
            >
                <defs> 
                  <linearGradient 
                      id="incomeBar" 
                      x1="0" y1="0" 
                      x2="0" y2="1"
                  > 
                      <stop 
                          offset={"0"} 
                          stopColor="#10b981" 
                          stopOpacity={"1"} 
                      /> 
                      <stop 
                          offset={"1"} 
                          stopColor="#10b981" 
                          stopOpacity={"0"} 
                      /> 
                  </linearGradient>

                  <linearGradient 
                      id="expenseBar" 
                      x1="0" y1="0" 
                      x2="0" y2="1"
                  > 
                      <stop 
                          offset={"0"} 
                          stopColor="#ef4444" 
                          stopOpacity={"1"} 
                      /> 
                      <stop 
                          offset={"1"} 
                          stopColor="#ef4444" 
                          stopOpacity={"0"} 
                      /> 
                  </linearGradient>
              </defs> 
                <CartesianGrid 
                    strokeDasharray="5 5" 
                    strokeOpacity={"0.3"} 
                    vertical={false}/>
                <XAxis 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }} 
                    dataKey={(data) => {
                        const { year, month, date } = data;
                        // console.log(data);
                        
                        if (timeframe === "year") {
                            return new Date(year, month - 1, 1).toLocaleDateString("default", {
                                month: "long",
                            });
                        }
    
                        if (timeframe === "month") {
                            return new Date(year, month - 1, date || 1).toLocaleDateString("default", {
                                day: "2-digit",
                            });
                        }
    
                        if (timeframe === "latest") {
                            return new Date(data.date).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                            });
                        }
                        return "";
                    }}
                />
                <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Bar 
                    dataKey={"income"} 
                    label="Income" 
                    fill="url(#incomeBar)" 
                    radius={4} 
                    className="cursor-pointer" 
                />
                <Bar
                    dataKey={"expense"} 
                    label="Expense" 
                    fill="url(#expenseBar)" 
                    radius={4} 
                    className="cursor-pointer"
                />
                <Tooltip content={<CustomTooltip />} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (!active || !payload || payload.length < 2) return null;

    return (
        <div className="bg-white p-2 rounded shadow-md border">
            <p className="text-green-500">💰 Income: {payload[0].value}</p>
            <p className="text-red-500">💸 Expense: {payload[1].value}</p>
        </div>
    );
};

import { PieChart, Pie, Cell } from "recharts";



const formattedPieData = (transactions: Transaction[], timeframe: Timeframe) => {
    // Lọc giao dịch theo timeframe nếu cần
    let filteredTransactions = transactions;
    
    if (timeframe === "latest") {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 6);
        lastWeek.setHours(0,0,0,0)

        filteredTransactions = transactions.filter((t) => {
            const transDate = new Date(t.datetime);
            return transDate >= lastWeek && transDate <= today;
        });
    }

    if (timeframe === "month") {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        filteredTransactions = transactions.filter((t) => {
            const transDate = new Date(t.datetime);
            return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
        });
    }

    // Gom nhóm theo danh mục (ăn uống, giải trí, ...)
    const categoryMap = new Map<string, { name: string; money: number; type: string }>();

    filteredTransactions.forEach(({ categoryID, money, type }) => {
        if (!categoryMap.has(categoryID.name)) {
            categoryMap.set(categoryID.name, {
                name: categoryID.name,
                money: 0,
                type: type,
            });
        }
        categoryMap.get(categoryID.name)!.money += Number(money);
    });

    return Array.from(categoryMap.values());
};

const COLORS = [
    "#ef4444", "#f97316", "#facc15", // Expense: Đỏ, Cam, Vàng
    "#10b981", "#3b82f6", "#22c55e", // Income: Xanh lá, Xanh dương
];

export const PieCharts: React.FC<{transactions: Transaction[], tf: Timeframe}> = ({transactions, tf}) => {

    const [timeframe, setTimeframe] = useState(tf);
    const data = formattedPieData(transactions, timeframe);
    // console.log(data);

    return (
        <div className="w-[400px] flex items-center justify-center p-4 bg-white shadow-md rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="money"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} VND`, name]} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

