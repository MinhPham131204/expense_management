import { useEffect, useState } from "react";
import { Send, ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import TransactionConfirmationPopup from "./TransactionConfirmationPopup";
import { TransactionType } from "@/lib/types";



const categoryMap: Record<string, { type: TransactionType; name: string }> = {
  // 💼 Công việc & Thu nhập (Income)
  "lương|thưởng|thu nhập|kinh doanh|cho thuê|làm thêm|part-time|freelance|hoa hồng|cộng tác viên|tiền công|tiền trợ cấp|trả lương|thanh toán hợp đồng|tiền quảng cáo": { type: "income", name: "Công việc & Thu nhập" },
  
  // 💰 Tiết kiệm & Ngân hàng (Income)
  "tiết kiệm|gửi ngân hàng|sổ tiết kiệm|lãi suất|tiền gửi có kỳ hạn|tiền gửi không kỳ hạn|quỹ dự phòng": { type: "expense", name: "Tiết kiệm & Ngân hàng" },
  "tiết kiệm|lãi suất": { type: "income", name: "Tiết kiệm & Ngân hàng" },

  // 🚗 Di chuyển
  "về|đổ xăng|xăng|taxi|grab|be|gojek|xe ôm|vé xe|phí cầu đường|bảo dưỡng xe|sửa xe|rửa xe|xe bus|metro|tàu điện|vé tàu|vé máy bay|bãi đỗ xe|gửi xe|về quê": { type: "expense", name: "Di chuyển" },
  "chạy xe ôm, chạy grab, chạy be, chạy gojek": { type: "income", name: "Di chuyển" },

  // 🍽️ Ăn uống
  "ăn|ăn sáng|ăn trưa|ăn tối|cafe|trà sữa|nhậu|buffet|nấu ăn|đi ăn|đặt đồ ăn|bánh mì|phở|bún|hủ tiếu|lẩu|nướng|gọi đồ|snack|đồ ăn vặt|bánh|gongcha|highlands|ngô gia|starbuck|pizza|mỳ|mì": { type: "expense", name: "Ăn uống" },

  // 👗 Mua sắm
  "mua áo|mua quần|giày dép|túi xách|đồng hồ|mỹ phẩm|phụ kiện|nước hoa|trang sức|son môi|kem dưỡng|điện thoại|laptop|tai nghe|máy ảnh|ipad|tablet|đồ điện tử": { type: "expense", name: "Mua sắm" },

  // 💡 Hóa đơn & Tiện ích
  "tiền điện|tiền nước|wifi|internet|truyền hình|nạp điện thoại|tiền mạng|gói cước|điện thoại trả trước|điện thoại trả sau|phí dịch vụ|phí ngân hàng|phí ATM": { type: "expense", name: "Hóa đơn & Tiện ích" },

  // 🏠 Nhà cửa
  "tiền nhà|thuê nhà|sửa nhà|nội thất|đồ gia dụng|bàn ghế|tủ lạnh|máy giặt|điều hòa|bếp gas|quạt điện|máy lọc nước|giường ngủ|đệm|trang trí nhà cửa": { type: "expense", name: "Nhà cửa" },

  // 🎉 Giải trí
  "xem phim|karaoke|du lịch|vé máy bay|thể thao|gym|spa|massage|quần vợt|bóng đá|cầu lông|bơi lội|câu cá|hát karaoke|rạp chiếu phim|game|mua game|twitch|steam|đi chơi": { type: "expense", name: "Giải trí" },

  // 🏥 Y tế & Sức khỏe
  "bệnh viện|khám bệnh|mua thuốc|bảo hiểm sức khỏe|tiêm vaccine|bác sĩ|dược phẩm|thực phẩm chức năng|khám nha khoa|mắt kính|kính áp tròng": { type: "expense", name: "Y tế & Sức khỏe" },

  // 📚 Giáo dục
  "học phí|sách vở|khóa học|luyện thi|chứng chỉ|học online|gia sư|đi học|đại học|cao học|thạc sĩ|tiến sĩ|học ngoại ngữ|toefl|ielts|toeic|du học|kỹ năng mềm": { type: "expense", name: "Giáo dục" },

  // 👨‍👩‍👧‍👦 Gia đình & Sự kiện
  "sinh nhật|tiền mừng|chăm con|quà lễ tết|mua bỉm|sữa bột|đám cưới|đám hỏi|đám giỗ|đám tang|quà tặng|chơi với con|đi chơi gia đình|trông trẻ|phí nhà trẻ": { type: "expense", name: "Gia đình & Sự kiện" },

  // 📈 Đầu tư & Kinh doanh
  "đầu tư|chứng khoán|bất động sản|coin|crypto|cổ phiếu|quỹ đầu tư|forex|mua vàng|bán vàng|lợi nhuận|chốt lời|tái đầu tư": { type: "expense", name: "Đầu tư & Kinh doanh" },

  // 🎗️ Từ thiện & Xã hội (Expense)
  "từ thiện|quyên góp|thiện nguyện|ủng hộ|tặng quà|trợ cấp|đóng góp|quỹ cộng đồng|quỹ học bổng|bảo trợ xã hội": { type: "expense", name: "Từ thiện & Xã hội" },

  // 🎮 Công nghệ & Dịch vụ số (Expense)
  "mua app|netflix|spotify|youtube|tiktok|amazon prime|mua phần mềm|mua hosting|tên miền|phần mềm bản quyền|cloud storage|mua nhạc|streaming": { type: "expense", name: "Công nghệ & Dịch vụ số" },

  // 🎁 Quà tặng & Đồ dùng cá nhân (Expense)
  "quà tặng|mua quà|hộp quà|hoa tươi|bánh kem|mua đồ handmade|mua quà cho người yêu|mua quà sinh nhật|mua quà tết|mua quà cưới": { type: "expense", name: "Quà tặng & Đồ dùng cá nhân" },

  // 🎯 Khác (Fallback)
  ".*": { type: "expense", name: "Khác" }
};

function getCategory(input: string): { type: TransactionType; name: string } {
  input = input.toLowerCase().trim();

  for (const pattern in categoryMap) {
    if (new RegExp(pattern, "i").test(input)) {
      return categoryMap[pattern];
    }
  }
  return { type: "expense" as TransactionType, name: "Khác" };
}

function parseTransaction(input: string) {
  const today = new Date();
  const regex = /(?:(hôm qua|hôm kia|ngày mai|ngày mốt|\d{1,2}\/\d{1,2})\s*)?([\d,.km]+)\s*(.+)/i;
  
  const match = input.match(regex);
  if (!match) return null;

  const [, datePart, amountStr, description] = match;
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
  const amountStrNew = amountStr.toLowerCase().replace(/[,vnđ]/g, "").trim();
  let amount = parseFloat(amountStrNew);
  if (amountStrNew.includes("k")) amount *= 1000;
  if (amountStrNew.includes("m")) amount *= 1000000;

  return { date: date, amount, description: description.trim() };
}


const UserInput = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [chose, setChose] = useState(false);

  const [popupData, setPopupData] = useState<{
    amount: number; 
    date: Date;
    description: string;
    category: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    if(!chose && text.trim()!=="") setValue(getCategory(text).name)
  }, [text, chose])

  const categories = [
    { name: "moving" },
    { name: "food" },
    { name: "entertainment" },
    { name: "other" },
  ];

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

    if(chose && value !== null) category.name = value
    

    setPopupData({
      ...transaction,
      category: category.name,
      type: category.type,
    });
      
  };

  const handleConfirmPopup = async () => {
    if (!popupData) return;

    const formData = {
      amount: popupData.amount,
      date: popupData.date,
      description: popupData.description,
      category: popupData.category,
      type: popupData.type as TransactionType,
    };
    
    try {
      setPopupData(null)
      setText('')
      console.log(formData); // api
      
    } catch (error) {
      console.error("Lỗi khi lưu giao dịch:", error);
    }
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  return (
    <div className="flex gap-4 flex-col items-center justify-center w-full h-[400px] z-10">
      <div className="w-[800px] flex flex-col gap-4">
        {/* Label */}
        <label htmlFor="inputField" className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Nhập văn bản
        </label>

        {/* Input Box */}
        <div className="relative">
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
            className="w-full px-4 py-10 placeholder:text-2xl border-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 transition-all pr-16"
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className="absolute scale-125 top-1/2 right-6 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Send />
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
            categories.map((category) => (
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
