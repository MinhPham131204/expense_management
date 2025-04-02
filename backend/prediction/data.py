import pandas as pd
import random

# -------------------------------
# Định nghĩa các template cho Expense và Income theo nhóm danh mục
# -------------------------------
def define_templates():
    return {
        "expense": {
            "Mua sắm": [
                "Mua {item} {amount} ngày {date}",
                "Đặt hàng {item} {amount} ngày {date}",
                "Thanh toán {item} {amount} ngày {date}",
                "Chi tiền mua {item} {amount} ngày {date}",
                "Mua {item} với giá {amount} ngày {date}"
            ],
            "Hóa đơn": [
                "Trả tiền {service} {amount} ngày {date}",
                "Thanh toán hóa đơn {service} {amount} ngày {date}",
                "Đóng phí {service} {amount} ngày {date}",
                "Chi phí {service} {amount} ngày {date}",
                "Trả hóa đơn {service} {amount} ngày {date}"
            ],
            "Ăn uống": [
                "{amount} cho {eating_activity} ngày {date}",
                "Trả tiền {eating_activity} {amount} ngày {date}",
                "Chi {amount} cho bữa {eating_activity} ngày {date}",
                "Ăn {eating_activity} với chi phí {amount} ngày {date}",
                "Bữa {eating_activity} ngày {date} giá {amount}",
                "Chi tiêu cho {eating_activity} {amount} ngày {date}"
            ],
            "Giải trí": [
                "Đi {entertainment_activity} {amount} ngày {date}",
                "Tham gia {entertainment_activity} {amount} ngày {date}",
                "Chi {amount} để {entertainment_activity} ngày {date}",
                "Trả tiền {entertainment_activity} {amount} ngày {date}",
                "Giải trí {entertainment_activity} với {amount} ngày {date}",
                "Vui chơi {entertainment_activity} {amount} ngày {date}",
                "Chi phí cho {entertainment_activity} {amount} ngày {date}"
            ],
            "Di chuyển": [
                "Đi {service} {amount} ngày {date}",
                "Di chuyển bằng {service} {amount} ngày {date}",
                "Trả tiền {service} {amount} ngày {date}",
                "Chi {amount} cho {service} {date}",
                "Thanh toán {service} {amount} ngày {date}",
                "Chi phí vận chuyển {amount} qua {service} ngày {date}",
                "Sử dụng {service} với chi phí {amount} ngày {date}"
            ],
            "Tiền thuê nhà": [
                "Trả tiền thuê nhà {amount} ngày {date}",
                "Đóng tiền thuê nhà {amount} ngày {date}",
                "Chi {amount} cho thuê nhà ngày {date}",
                "Thanh toán tiền thuê {amount} ngày {date}",
                "Trả cọc thuê nhà {amount} ngày {date}"
            ],
            "Sức khỏe": [
                "Mua thuốc {amount} ngày {date}",
                "Chi phí khám bệnh {amount} ngày {date}",
                "Thanh toán phí bác sĩ {amount} ngày {date}",
                "Trả tiền khám sức khỏe {amount} ngày {date}",
                "Chi {amount} cho dịch vụ y tế ngày {date}"
            ],
            "Làm đẹp": [
                "Trả tiền spa {amount} ngày {date}",
                "Chi {amount} cho làm đẹp {amount} ngày {date}",
                "Thanh toán {amount} cho trang điểm ngày {date}",
                "Trả tiền làm tóc {amount} ngày {date}",
                "Chi phí làm đẹp {amount} ngày {date}"
            ]
        },
        "income": {
            "Lương": [
                "Nhận lương {amount} ngày {date}",
                "Trả lương {amount} ngày {date}",
                "Tiền lương tháng {date} {amount}",
                "Lương cơ bản {amount} ngày {date}",
                "Lương làm thêm {amount} ngày {date}"
            ],
            "Thưởng": [
                "Nhận thưởng {amount} ngày {date}",
                "Thưởng hiệu suất {amount} ngày {date}",
                "Tiền thưởng cuối năm {amount}",
                "Thưởng quý {amount} ngày {date}",
                "Thưởng dự án {amount} ngày {date}",
                "Tiền thưởng {amount} ngày {date}"
            ],
            "Trợ cấp": [
                "Nhận trợ cấp {amount} ngày {date}",
                "Tiền trợ cấp {amount} từ chính phủ ngày {date}",
                "Hỗ trợ tài chính {amount} ngày {date}",
                "Trợ cấp thai sản {amount} ngày {date}",
                "Trợ cấp hưu trí {amount} ngày {date}"
            ],
            "Thu hồi nợ": [
                "Nhận tiền nợ {amount} ngày {date}",
                "Nhận trả nợ {amount} ngày {date}",
                "Thu hồi nợ {amount} ngày {date}",
                "Tiền lãi từ nợ {amount} ngày {date}",
                "Nhận tiền phạt {amount} ngày {date}"
            ],
            "Kinh doanh": [
                "Thu nhập từ kinh doanh {amount} ngày {date}",
                "Doanh thu {amount} ngày {date}",
                "Bán hàng {amount} ngày {date}",
                "Doanh thu dịch vụ {amount} ngày {date}",
                "Thu nhập từ shop {amount} ngày {date}",
                "Doanh thu cho thuê {amount} ngày {date}"
            ]
        }
    }


# -------------------------------
# Dữ liệu mẫu cho các placeholder
# -------------------------------
items = ["laptop", "điện thoại", "sách", "quần áo", "đồ dùng gia đình", "mỹ phẩm", "đồ chơi", "thực phẩm",
         "đồ nội thất", "xe đạp", "máy giặt", "máy tính bảng", "máy ảnh"]
services = ["điện", "nước", "internet", "thuê nhà", "bảo hiểm", "học phí", "bảo trì xe", "học ngoại ngữ", "đăng ký thi"]
eating_activities = ["ăn sáng", "ăn trưa", "ăn tối"]
entertainment_activities = ["xem phim", "du lịch", "tập gym", "xem bóng đá"]
amounts = ["50k", "100k", "200k", "500k", "1tr", "2tr", "5tr", "10tr", "15tr", "20tr"]
dates = [f"{day}/{month}" for month in range(1, 13) for day in range(1, 29)]


# -------------------------------
# Sinh dữ liệu tổng hợp và lưu ra file CSV
# -------------------------------
def generate_data(num_samples=100000):

    templates = define_templates()
    data = []

    # Tính số mẫu cần cho mỗi danh mục theo tỷ lệ đều (cho expense và income riêng biệt)
    expense_categories = list(templates["expense"].keys())
    income_categories = list(templates["income"].keys())
    samples_per_expense = num_samples // (len(expense_categories) + len(income_categories))

    # Sinh dữ liệu cho Expense
    for category in expense_categories:
        for _ in range(samples_per_expense):
            template = random.choice(templates["expense"][category])
            input_str = template.format(
                item=random.choice(items) if "{item}" in template else "",
                service=random.choice(services) if "{service}" in template else "",
                eating_activity=random.choice(eating_activities) if "{eating_activity}" in template else "",
                entertainment_activity=random.choice(
                    entertainment_activities) if "{entertainment_activity}" in template else "",
                amount=random.choice(amounts),
                date=random.choice(dates)
            ).strip()
            label = f"expense @ {category}"
            data.append({'input': input_str, 'label': label})

    # Sinh dữ liệu cho Income
    for category in income_categories:
        for _ in range(samples_per_expense):
            template = random.choice(templates["income"][category])
            input_str = template.format(
                item=random.choice(items) if "{item}" in template else "",
                service=random.choice(services) if "{service}" in template else "",
                eating_activity=random.choice(eating_activities) if "{eating_activity}" in template else "",
                entertainment_activity=random.choice(
                    entertainment_activities) if "{entertainment_activity}" in template else "",
                amount=random.choice(amounts),
                date=random.choice(dates)
            ).strip()
            label = f"income @ {category}"
            data.append({'input': input_str, 'label': label})

    # Nếu số dòng chưa đạt num_samples, bổ sung thêm ngẫu nhiên từ tất cả các danh mục
    all_categories = expense_categories + income_categories
    while len(data) < num_samples:
        category = random.choice(all_categories)
        is_expense = category in expense_categories
        cat_templates = templates["expense"][category] if is_expense else templates["income"][category]
        template = random.choice(cat_templates)
        input_str = template.format(
            item=random.choice(items) if "{item}" in template else "",
            service=random.choice(services) if "{service}" in template else "",
            eating_activity=random.choice(eating_activities) if "{eating_activity}" in template else "",
            entertainment_activity=random.choice(
                entertainment_activities) if "{entertainment_activity}" in template else "",
            amount=random.choice(amounts),
            date=random.choice(dates)
        ).strip()
        label = f"{'expense' if is_expense else 'income'} @ {category}"
        data.append({'input': input_str, 'label': label})

    # Xáo trộn dữ liệu và lưu ra CSV
    df = pd.DataFrame(data)
    df = df.sample(frac=1).reset_index(drop=True)
    df.to_csv('data.csv', index=False)
    print(f"Đã tạo file 'data.csv' với {len(df)} dòng dữ liệu.")


# Chạy hàm sinh dữ liệu
generate_data()
