import { Transaction, TransactionType } from "./types";

export function getWeekRange(year: number, week: number) {
	const d = new Date(year, 0, 4);
	d.setDate(d.getDate() - (d.getDay() || 7) + 1 + (week - 1) * 7);

	const Monday = new Date(d);
	Monday.setDate(d.getDate() + 1);

	const Sunday = new Date(Monday);
	Sunday.setDate(Monday.getDate() + 6);

	return {
			Monday: Monday.toISOString().split("T")[0], // YYYY-MM-DD
			Sunday: Sunday.toISOString().split("T")[0], // YYYY-MM-DD
	};
}


export const getDaysInMonth = (year: number, month: number) => {
	return new Date(year, month, 0).getDate();
};

export const TRANSACTION_FIELDS: Record<string, keyof Transaction> = {
	"Category": "categoryID",
	"Description": "description",
	"Date": "datetime",
	"Type": "type",
	"Amount": "money",
  };

export const typeMap: Record<string, TransactionType> = {
  "Ăn uống": "Chi tiêu",
  "Chợ - Siêu thị": "Chi tiêu",
  "Hóa đơn": "Chi tiêu",
  "Tiền thuê nhà": "Chi tiêu",
  "Mua sắm": "Chi tiêu",
  "Sức khỏe": "Chi tiêu",
  "Làm đẹp": "Chi tiêu",
  "Giải trí": "Chi tiêu",
  "Di chuyển": "Chi tiêu",
  "Lương": "Thu nhập",
  "Thưởng": "Thu nhập",
  "Trợ cấp": "Thu nhập",
  "Thu hồi nợ": "Thu nhập",
  "Kinh doanh": "Thu nhập",
  "Chưa rõ": "Chi tiêu"
};