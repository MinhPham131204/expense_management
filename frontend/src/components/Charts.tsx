import { getDaysInMonth, getWeekRange } from "@/lib/helper"
import { Timeframe } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, TooltipProps } from "recharts";


    const year = 2025
    const week = 12
    const startDate = getWeekRange(year, week).Monday
    const endDate = getWeekRange(year, week).Sunday

    const month = 3 // tháng 3 thật
    
    const weekBarData = {
        days: Array.from({ length: 7 }, (_, i) => ({
            day: i + 2,
            expense: Math.floor(Math.random() * (350 - 50 + 1)) + 50, 
            income: Math.floor(Math.random() * (500 - 100 + 1)) + 100 
        }))
    };

    const monthBarData = {
        days: Array.from({ length: getDaysInMonth(year, month) }, (_, i) => ({
            year: 2025,
            month: 3,
            date: i + 1,
            expense: Math.floor(Math.random() * (500 - 50 + 1)) + 50,  
            income: Math.floor(Math.random() * (1000 - 100 + 1)) + 100 
        }))
    };

    const yearBarData = {
        months: Array.from({ length: 12 }, (_, i) => ({
            year: 2025,
            month: i + 1,
            expense: Math.floor(Math.random() * (5000 - 50 + 1)) + 50, 
            income: Math.floor(Math.random() * (10000 - 100 + 1)) + 100
        }))
    };

export const BarCharts: React.FC = () => {
    const [timeframe, setTimeframe] = useState<Timeframe> ("year");

    const data = timeframe === 'year' ? yearBarData.months : timeframe === 'month' ? monthBarData.days : weekBarData.days
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
                        const { year, month, date, day } = data;
                        console.log(data);
                        
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
    
                        if (timeframe === "week") {
                            const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
                            return weekDays[day - 2];
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


const weekPieData = {
    categories: [
        { name: "Ăn uống", value: 100, type: "expense" },
        { name: "Giải trí", value: 50, type: "expense" },
        { name: "Mua sắm", value: 200, type: "expense" },
        { name: "Đi lại", value: 80, type: "expense" },
        { name: "Hóa đơn & Dịch vụ", value: 150, type: "expense" },
        { name: "Sức khỏe", value: 120, type: "expense" },
        { name: "Giáo dục", value: 300, type: "expense" },
    
        { name: "Lương", value: 2000, type: "income" },
        { name: "Thưởng", value: 500, type: "income" },
        { name: "Đầu tư", value: 700, type: "income" },
        { name: "Bán hàng", value: 400, type: "income" },
        { name: "Khác", value: 100, type: "income" }
    ]
}

const COLORS = [
    "#ef4444", "#f97316", "#facc15", // Expense: Đỏ, Cam, Vàng
    "#10b981", "#3b82f6", "#22c55e", // Income: Xanh lá, Xanh dương
];

export const PieWeekChart = () => {
    return (
        <div className="w-[400px] flex items-center justify-center p-4 bg-white shadow-md rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={weekPieData.categories}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {weekPieData.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} VND`, name]} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

