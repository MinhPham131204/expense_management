import { Timeframe, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { log } from "console";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, TooltipProps, Rectangle, Legend } from "recharts";
    
interface BarChartsProps {
    date?: Date | number;
    expense?: number;
    income?: number;
    year?: number;
    month?: number;
}
    

export const BarCharts: React.FC<{ data: BarChartsProps[], timeframe: Timeframe }> = ({ data, timeframe }) => {

    
    return (
        <div className={
            "flex items-center justify-center p-4 bg-cyan-50 shadow-lg rounded-lg h-full w-full"
        }>
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
                fontSize={18}
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
                    // console.log(data);                    
                    return new Date(data.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
                }
                return "";
                }}
            />
    
            {/* Y-Axis */}
            <YAxis 
                stroke="#555555" 
                strokeWidth={2} 
                fontSize={18}
                fontWeight="bold"
                tickLine={false} 
                // axisLine={{ strokeWidth: 2, markerEnd: "url(#arrowUp)" }}
            />
    
            {/* Bars */}
            <Bar dataKey="income" fill="url(#incomeBar)" radius={[4, 4, 0, 0]} fillOpacity={1}>
                {/* Hiển thị số tiền trên từng cột */}
                {data.map((entry, index) => (
                <text key={index} x={index * 50 + 10} y={entry.income - 10} fill="#10b981" fontSize="18" fontWeight="bold">
                    {entry.income} VNĐ
                </text>
                ))}
            </Bar>
            <Bar dataKey="expense" fill="url(#expenseBar)" radius={[4, 4, 0, 0]} fillOpacity={1}>
                {data.map((entry, index) => (
                <text key={index} x={index * 50 + 10} y={entry.expense - 10} fill="#ef4444" fontSize="18" fontWeight="bold">
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
    if (!active || !payload || payload.length < 2) { return null; }

    return (
        <div className="bg-teal-50 p-2 rounded-2xl shadow-md border">
            <p className="text-green-500 font-semibold">💰 Income: {payload[0].value}</p>
            <p className="text-red-500 font-semibold">💸 Expense: {payload[1].value}</p>
        </div>
    );
};


import { PieChart, Pie, Cell } from "recharts";




const COLORS = [
    // Expenses: Đỏ, Cam, Vàng, Hồng, Tím
    "#ef4444", "#f97316", "#faaa15", "#ec4899", "#8b5cf6",

    // Income: Xanh lá, Xanh dương, Ngọc lam, Xanh lục đậm, Xanh cyan
    "#10b981", "#3b82f6", "#06b6d4", "#22c55e", "#0ea5e9",

];

interface PieChartsProps {
    name: string;
    money: number;
    type: string;
}

export const PieCharts: React.FC<{ data: PieChartsProps[]  }> = ({data}) => { 

    // console.log(data);
    

    return (
        <div className="w-full flex flex-col items-center gap-4 justify-center p-4 bg-white shadow-lg rounded-lg">

            <h3 className="text-2xl font-semibold text-gray-700 mb-2">📊 Phân bổ thu nhập & chi tiêu</h3>
            
            <ResponsiveContainer width="100%" height={360}>
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
                                onMouseLeave={(e) => {
                                    const target = e.currentTarget as SVGElement | null;
                                    if (target) {
                                        target.style.filter = "brightness(1.2)";
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    const target = e.currentTarget as SVGElement | null;
                                    if (target) {
                                        target.style.filter = "brightness(1.0)";
                                    }
                                }}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value.toLocaleString()} VND`, name]} />
                    <Legend
                        verticalAlign="bottom"
                        iconSize={18}
                        content={({ payload }) => (
                            <ul className="flex flex-wrap justify-center gap-4 mt-4 text-base">
                            {payload?.map((entry, index) => (
                                <li key={`legend-${index}`} className="flex items-center space-x-2">
                                <div
                                    style={{ backgroundColor: entry.color }}
                                    className="w-4 h-4 rounded"
                                />
                                <span>{entry.value}</span>
                                </li>
                            ))}
                            </ul>
                        )}
                        />

                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
