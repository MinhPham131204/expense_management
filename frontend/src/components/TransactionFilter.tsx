import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TransactionType } from "../lib/types";
import CustomDateInput from './CustomDateInput'

type FilterState = {
  startDate: string;
  endDate: string;
  type: TransactionType[];
  minAmount: string;
  maxAmount: string;
  category: string;
  keyword: string;
};

const TransactionFilters = ({
  onApply,
  availableCategories,
  darkMode
}: {
  onApply: (filters: FilterState) => void;
  availableCategories: string[];
  darkMode: boolean
}) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: [] as TransactionType[],
    minAmount: "",
    maxAmount: "",
    category: "",
    keyword: "",
  });

  // Xử lý thay đổi lọc
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`flex flex-wrap gap-6 p-10 pt-6 border-solid border-4 backdrop-blur-2xl rounded-4xl shadow-lg bg-gradient-to-br from-slate-300 to-cyan-100 ${darkMode && 'border-slate-600 bg-gradient-to-tl from-slate-500 to-gray-300 '}`}>
      {/* Khoảng thời gian */}
      <div className="flex items-center justify-between py-3 gap-2">
        <CustomDateInput
          selected={filters.startDate ? new Date(filters.startDate) : null}
          onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date ? date.toISOString().split("T")[0] : "" }))}
          placeholder="Từ ngày"
        />

        <CustomDateInput
          selected={filters.endDate ? new Date(filters.endDate) : null}
          onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date ? date.toISOString().split("T")[0] : "" }))}
          placeholder="Đến ngày"
        />
      </div>


      {/* Loại giao dịch */}
      <Select
        value={filters.type.length > 0 ? filters.type[0] : "all"}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            type: value === "all" ? [] : [value as TransactionType],
          }))
        }
      >
        <SelectTrigger className="w-[180px] text-[#111111]">
          {filters.type.length > 0 ? filters.type[0] : <span className="">Tất cả</span>}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all"><span>Tất cả</span></SelectItem>
          <SelectItem value="Thu nhập"><span>Thu nhập</span></SelectItem>
          <SelectItem value="Chi tiêu"><span>Chi tiêu</span></SelectItem>
        </SelectContent>
      </Select>

      {/* Khoản tiền */}
      <div className="flex items-center justify-between py-2 gap-4">
        <Input
          type="number"
          name="minAmount"
          value={filters.minAmount}
          onChange={handleChange}
          placeholder="Tối thiểu"
          className={`px-3 py-2 border rounded-lg focus:ring-2 h-10 ${
            darkMode
              ? " placeholder:text-slate-600 bg-slate-400 text-4xl text-slate-900 border-slate-600 focus:ring-slate-500"
              : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
          }`}
          style={{ fontSize: '1rem' }}
        />
        <Input
          type="number"
          name="maxAmount"
          value={filters.maxAmount}
          onChange={handleChange}
          placeholder="Tối đa"
          className={`px-3 py-2 border rounded-lg focus:ring-2 h-10 ${
            darkMode
              ? " placeholder:text-slate-600 bg-slate-400 text-4xl text-slate-900 border-slate-600 focus:ring-slate-500"
              : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
          }`}
          style={{ fontSize: '1rem' }}
        />
      </div>

      {/* Danh mục */}
      <Select
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, category: value }))
        }
        value={filters.category || undefined}
      >
        <SelectTrigger className="w-[180px] text-[#111111]">
          {filters.category || "Chọn danh mục"}
        </SelectTrigger>
        <SelectContent>
          {availableCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mô tả giao dịch */}
      <Input
        type="text"
        name="keyword"
        value={filters.keyword}
        onChange={handleChange}
        placeholder="Tìm theo mô tả"
        className={`px-3 py-2 border rounded-lg focus:ring-2 h-10 ${
          darkMode
            ? " placeholder:text-slate-600 bg-slate-400 text-4xl text-slate-900 border-slate-600 focus:ring-slate-500"
            : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
        }`}
        style={{ fontSize: '1rem' }}
      />

      {/* Nút áp dụng và reset */}
      <Button onClick={() => onApply(filters)}> <span className={`px-2 py-1 font-bold rounded text-red-400`}>Áp dụng</span></Button>
      <Button
        variant="outline"
        onClick={() =>
          setFilters({
            startDate: "",
            endDate: "",
            type: [],
            minAmount: "",
            maxAmount: "",
            category: "",
            keyword: "",
          })
        }
      >
        <span className={`px-2 py-1 font-bold rounded text-pink-900`}>
          Xóa bộ lọc
        </span>
      </Button>
    </div>
  );
};

export default TransactionFilters;
