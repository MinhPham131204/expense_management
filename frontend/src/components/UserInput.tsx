import { useEffect, useState } from "react";
import { Send, ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import TransactionConfirmationPopup from "./TransactionConfirmationPopup";
import { SubCategory, TransactionType } from "@/lib/types";
import axios from "axios";
import { toast } from "sonner";

const categoryMap: Record<string, { type: TransactionType; name: string }> = {
  // 🍽️ Ăn uống
  "ăn|ăn sáng|ăn trưa|ăn tối|cafe|trà sữa|nhậu|buffet|đặt đồ ăn|snack|bánh|pizza|mì|hủ tiếu": { type: "Chi tiêu", name: "Ăn uống" },

  // 🏬 Chợ - Siêu thị
  "chợ|siêu thị|mua thực phẩm|mua rau|mua thịt|đi chợ|mua đồ tươi sống": { type: "Chi tiêu", name: "Chợ - Siêu thị" },

  // 🚗 Di chuyển
  "về|taxi|grab|be|gojek|xe ôm|vé xe|bảo dưỡng xe|sửa xe|rửa xe|xe bus|metro|tàu điện|vé tàu|vé máy bay|bãi đỗ xe|gửi xe|xăng": { type: "Chi tiêu", name: "Di chuyển" },

  // 💡 Hóa đơn
  "tiền điện|tiền nước|wifi|internet|truyền hình|điện thoại trả trước|điện thoại trả sau|phí dịch vụ": { type: "Chi tiêu", name: "Hóa đơn" },

  // 🏠 Tiền thuê nhà
  "tiền nhà|thuê nhà|trả tiền thuê nhà": { type: "Chi tiêu", name: "Tiền thuê nhà" },

  // 🛍️ Mua sắm
  "mua|mua áo|mua quần|giày dép|túi xách|đồng hồ|mỹ phẩm|phụ kiện|điện thoại|laptop|máy ảnh|tablet|đồ điện tử": { type: "Chi tiêu", name: "Mua sắm" },

  // 🏥 Sức khỏe
  "bệnh viện|khám bệnh|mua thuốc|bảo hiểm sức khỏe|tiêm vaccine|bác sĩ|dược phẩm|khám nha khoa|mắt kính|kính áp tròng": { type: "Chi tiêu", name: "Sức khỏe" },

  // 💆‍♀️ Làm đẹp
  "đẹp|làm tóc|trang điểm|mua mỹ phẩm|chăm sóc da|spa|massage|phẫu thuật thẩm mỹ": { type: "Chi tiêu", name: "Làm đẹp" },

  // 🎉 Giải trí
  "xem phim|karaoke|du lịch|thể thao|gym|bơi lội|câu cá|hát karaoke|game|mua game|steam|đi chơi": { type: "Chi tiêu", name: "Giải trí" },

  // 💰 Lương (Income)
  "lương|lương tháng|thu nhập chính|trả lương": { type: "Thu nhập", name: "Lương" },

  // 🎁 Thưởng (Income)
  "thưởng|bonus|thưởng lễ|thưởng tết|thưởng hiệu suất|thưởng doanh số": { type: "Thu nhập", name: "Thưởng" },

  // 💸 Trợ cấp (Income)
  "trợ cấp|hỗ trợ tài chính|trợ cấp thất nghiệp|tiền trợ cấp chính phủ": { type: "Thu nhập", name: "Trợ cấp" },

  // 🏦 Thu hồi nợ (Income)
  "thu hồi nợ|trả nợ|nhận tiền nợ|đòi nợ thành công": { type: "Thu nhập", name: "Thu hồi nợ" },

  // 📈 Kinh doanh (Income)
  "kinh doanh|bán hàng|doanh thu|thu nhập từ kinh doanh|bán hàng online|bán sản phẩm|thu nhập từ shop": { type: "Thu nhập", name: "Kinh doanh" },

  // 🎯 Not found (Fallback)
  ".*": { type: "Chi tiêu", name: "Chưa rõ" }
};


function getCategory(input: string): { type: TransactionType; name: string } {
  input = input.toLowerCase().trim();

  for (const pattern in categoryMap) {
    if (new RegExp(pattern, "i").test(input)) {
      return categoryMap[pattern];
    }
  }
  return { type: "Chi tiêu" as TransactionType, name: "Chưa rõ" };
}

function parseTransaction(input: string) {
  const today = new Date();
  const regex = /(?:(hôm qua|hôm kia|ngày mai|ngày mốt|\d{1,2}\/\d{1,2})\s*)?([\d,.km]+)\s*(.+)/i;
  
  const match = input.match(regex);
  if (!match) return null;

  const [, datePart, moneyStr, description] = match;
  let date = new Date(today); // Mặc định là hôm nay

  //console.log(datePart);
  
  if (datePart) {
    if (datePart === "hôm qua") date.setDate(today.getDate() - 1);
    else if (datePart === "hôm kia") date.setDate(today.getDate() - 2);
    else if (datePart === "ngày mai") date.setDate(today.getDate() + 1);
    else if (datePart === "ngày mốt") date.setDate(today.getDate() + 2);
    else if (datePart.includes("/")) {
      
      const parts = datePart.split("/").map(Number);
      if (parts.length === 2) {
        const [day, month] = parts;
        date = new Date(today.getFullYear(), month - 1, day);
      }
    }
  }
  
  
  // Chuyển về định dạng YYYY-MM-DD
  // Xử lý số tiền
  
  const moneyStrNew = moneyStr.toLowerCase().replace(/[,vnđ]/g, "").trim();
  let money = parseFloat(moneyStrNew);
  
  if (moneyStrNew.includes("k")) money *= 1000;
  if (moneyStrNew.includes("m")) money *= 1000000;

  return { date: date, money, description: description.trim() };
}

const UserInput: React.FC<{categories: SubCategory[]}> = ({categories}) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [chose, setChose] = useState(false);
   
  const [popupData, setPopupData] = useState<{
    money: number; 
    date: Date;
    description: string;
    category: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    if(!chose && text.trim()!=="") setValue(getCategory(text).name)
  }, [text, chose])

  const handleSubmit = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const input = text.trim();
    
    if (!input) return;

    const transaction = parseTransaction(input);
    if (!transaction) return;

    const category = getCategory(transaction.description);

    // console.log(category);
    

    if(chose && value !== null) category.name = value


    
    // console.log(category.name, category.type);
    
    setPopupData({
      ...transaction,
      category: category.name,
      type: category.type,
    });
      
  };

  const handleConfirmPopup = async () => {
    if (!popupData) return;

    if (popupData.category === "Chưa rõ") {
      toast.warning("Không thể xác định danh mục giao dịch hiện tại! Vui lòng chọn thủ công");
      return;
    }

    const formData = {
      money: popupData.money.toString(),
      datetime: popupData.date,
      description: popupData.description,
      categoryID: categories.find((category) => category.name === popupData.category)?._id,
      type: popupData.type,
    };
    
    try {
      setPopupData(null)
      setText('')
      console.log(formData);
      await axios.post("http://localhost:3000/transaction", formData, {withCredentials: true,})
      .then((response) => console.log(response))
      .catch((error) => console.log(error))

      toast.success("Giao dịch thực hiện thành công!!")
      
    } catch (error) {
      toast.error("Lỗi khi lưu giao dịch:" + error);
    }
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  return (
    <div className="flex gap-4 flex-col items-center justify-center w-full z-10">
      <div className="w-[800px] flex flex-col gap-4">
        {/* Label */}
        <label htmlFor="inputField" className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Nhập văn bản
        </label>

        {/* Input Box */}
        <div className="relative ">
          <input
            id="inputField"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
            placeholder="Nhập nội dung... Eg. 10/6 106k về quê"
            style={{ fontSize: "1.5rem" }}
            className="w-full px-4 py-6 placeholder:text-2xl border-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 transition-all pr-16"
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className="absolute scale-125 top-1/2 right-6 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Send color="#3eaef4" />
          </button>
        </div>
      </div>

      {/* Popover Select Category */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-[200px]  justify-between border rounded-lg px-4 py-2 flex items-center">
            <span className="text-black">{value ? value : "Select category"}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 bg-white shadow-lg rounded-md">
          {categories.length > 0 ? (
            categories.map((category: SubCategory) => (
              <div
                key={category.name}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setChose(true);
                  setValue(category.name);
                  setOpen(false);
                }}
              >
                <span className="text-gray-800">{category.name}</span>
                {value === category.name && <Check className="w-4 h-4 text-blue-500" />}
              </div>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </PopoverContent>
      </Popover>

      {/* Transaction Confirmation Popup */}
      {popupData && (
        <TransactionConfirmationPopup
          popupData={popupData}
          onConfirm={handleConfirmPopup}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default UserInput;
