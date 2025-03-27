import { Timeframe, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, TooltipProps, Rectangle, Legend } from "recharts";
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
    

export const BarCharts: React.FC<{ transactions: Transaction[]; tf: Timeframe }> = ({ transactions, tf }) => {
    const [timeframe, setTimeframe] = useState<Timeframe>(tf);
    const data = formattedBarData(transactions, 'latest');
    
    return (
        <div className={cn(
        "flex items-center justify-center p-4 bg-cyan-50 shadow-lg rounded-lg",
        timeframe === "year" ? "w-[1000px]" :
        timeframe === "month" ? "w-[1200px]" : "w-[600px]"
        )}>
        <ResponsiveContainer width="100%" height={350}>
            <BarChart 
            data={data}
            height={350}
            barCategoryGap={10}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
            {/* Gradient for Bars */}
            <defs>
                <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10b981" stopOpacity="1" />
                <stop offset="1" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ef4444" stopOpacity="1" />
                <stop offset="1" stopColor="#ef4444" stopOpacity="0.3" />
                </linearGradient>
            </defs>
    
            {/* Grid */}
            <CartesianGrid strokeDasharray="4 4" strokeOpacity="0.4" vertical={false} />

            <defs>
                {/* Định nghĩa mũi tên cho X-Axis và Y-Axis */}
                <marker id="arrowRight" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#4b5563" /> 
                </marker>
                <marker id="arrowUp" markerWidth="8" markerHeight="8" refX="150" refY="5" orient="auto" >
                    <polygon points="6 0, 0 0, 3 6" fill="#4b5563" />
                </marker>
            </defs>

            {/* X-Axis */}
            <XAxis 
                stroke="#555555"
                fontSize={12}
                fontWeight="bold"
                tickLine={false}
                padding={{ left: 5, right: 5 }}
                axisLine={{ strokeWidth: 2, markerEnd: "url(#arrowRight)" }}
                dataKey={(data) => {
                const { year, month, date } = data;
                if (timeframe === "year") {
                    return new Date(year, month - 1, 1).toLocaleDateString("default", { month: "long" });
                }
                if (timeframe === "month") {
                    return new Date(year, month - 1, date || 1).toLocaleDateString("default", { day: "2-digit" });
                }
                if (timeframe === "latest") {
                    return new Date(data.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
                }
                return "";
                }}
            />
    
            {/* Y-Axis */}
            <YAxis 
                stroke="#555555" 
                strokeWidth={2} 
                fontSize={12}
                fontWeight="bold"
                tickLine={false} 
                // axisLine={{ strokeWidth: 2, markerEnd: "url(#arrowUp)" }}
            />
    
            {/* Bars */}
            <Bar dataKey="income" fill="url(#incomeBar)" radius={[4, 4, 0, 0]} fillOpacity={1}>
                {/* Hiển thị số tiền trên từng cột */}
                {data.map((entry, index) => (
                <text key={index} x={index * 50 + 10} y={entry.income - 10} fill="#10b981" fontSize="12" fontWeight="bold">
                    {entry.income} VNĐ
                </text>
                ))}
            </Bar>
            <Bar dataKey="expense" fill="url(#expenseBar)" radius={[4, 4, 0, 0]} fillOpacity={1}>
                {data.map((entry, index) => (
                <text key={index} x={index * 50 + 10} y={entry.expense - 10} fill="#ef4444" fontSize="12" fontWeight="bold">
                    {entry.expense} VNĐ
                </text>
                ))}
            </Bar>
    
            {/* Tooltip */}
            {/* <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} /> */}
            <defs>
                <linearGradient id="customCursor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            <Tooltip content={<CustomTooltip />} cursor={<Rectangle fill="url(#customCursor)" />} />
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (!active || !payload || payload.length < 2) return null;

    return (
        <div className="bg-teal-50 p-2 rounded-2xl shadow-md border">
            <p className="text-green-500 font-semibold">💰 Income: {payload[0].value}</p>
            <p className="text-red-500 font-semibold">💸 Expense: {payload[1].value}</p>
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
    // Expenses: Đỏ, Cam, Vàng, Hồng, Tím
    "#ef4444", "#f97316", "#faaa15", "#ec4899", "#8b5cf6",

    // Income: Xanh lá, Xanh dương, Ngọc lam, Xanh lục đậm, Xanh cyan
    "#10b981", "#3b82f6", "#06b6d4", "#22c55e", "#0ea5e9",

];

export const PieCharts: React.FC<{ transactions: Transaction[]; tf: Timeframe }> = ({ transactions, tf }) => { 
    const [timeframe, setTimeframe] = useState(tf);
    const data = formattedPieData(transactions, timeframe);

    return (
        <div className="w-1/2 flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📊 Phân bổ thu nhập & chi tiêu</h3>
            
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="money"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50} // Tạo dạng "doughnut"
                        paddingAngle={5}  // Tạo khoảng cách giữa các phần
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        stroke="white"
                        strokeWidth={2}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                style={{ filter: "brightness(1)" }}
                                onMouseEnter={(e) => ((e.currentTarget as unknown) as SVGElement).style.filter = "brightness(1.2)"}
                                onMouseLeave={(e) => ((e.currentTarget as unknown) as SVGElement).style.filter = "brightness(1)"}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value.toLocaleString()} VND`, name]} />
                    <Legend verticalAlign="bottom" iconSize={12} wrapperStyle={{ marginTop: 10 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
