# BÀN GIAO PHIÊN – Nhật ký hiện trường An Phú V2.0

Mốc lưu: 12/11/2026 – bản **2.0.0-nen3** (nền chung đã chốt giao diện).
Đọc file này đầu phiên mới để nối tiếp, không phải giải thích lại.

## 1. Đang ở đâu

| Hạng mục | Trạng thái |
|---|---|
| Khối 1 – Nền chung (dự án, camera, kho ảnh, sao lưu/khôi phục, chạy offline) | Xong, kiểm thử 14/14 đạt |
| Giao diện | Đã khóa bộ quy tắc (QUY_TAC_GIAO_DIEN.md) |
| Khối 2 – Nghiệm thu cọc khoan nhồi 11 bước | Chưa làm; màn chọn cọc đã có bản mẫu, chờ anh duyệt |
| Khối 3 Nhận hàng · Khối 4 Báo cáo ngày · Khối 5 Báo cáo ảnh | Chưa làm |

## 2. Nơi để mã và bản chạy

- Kho GitHub: github.com/lelenhbac1974hn-web/nhat-ky-hien-truong (nhánh main, commit cuối b4e303f).
- Mở trên iPhone: https://lelenhbac1974hn-web.github.io/Nhat-ky-hien-truong/ (GitHub Pages đã bật).
- Trang Claude: https://claude.ai/artifact/GM6Fci67yJuAiW6dy1eJMs
- Ổ D: D:\Projects\Dự án Nhật ký Hiện trường  An phú Đa Agent\02_Ma_nguon\AnPhu_NhatKyHienTruong_V2.0_Nen3.zip
- Bộ dữ liệu Hòn Khoai: 02_Ma_nguon\Claude outputs\BoDuLieu_HonKhoai_v1.json (KHÔNG đưa lên kho công khai).

## 3. Quyết định đã chốt (không bàn lại)

1. Viết mới V2.0, dữ liệu cũ là thử nghiệm, đã dọn. Không localStorage; một CSDL IndexedDB `anphu_nkht`.
2. Một khung "Nghiệm thu công việc": cọc khoan nhồi là loại đầu tiên; bệ, thân trụ, dầm, mặt cầu nạp dần; "Công việc khác" biên bản tự do.
3. Giao diện nền sáng; mỗi phân hệ một màu: nghiệm thu xanh lá, hàng hóa vàng nâu, báo cáo xanh dương, dữ liệu tím, chính navy.
4. Menu không bao giờ để nhập liệu; nhập ở trang riêng có thanh Hủy/Lưu.
5. Nút có biểu tượng + chữ, nền trong suốt (kiểu nút Claude).
6. Menu chức năng: 4 ô vuông một hàng (theo menu app cũ của anh).
7. Dải phím luôn 5 ô; phím đang dùng sáng lên.
8. **Tài liệu nhiều bước (KHÓA):** 5 ô mũi tên, bước dư dồn hai đầu có số, vuốt để lướt, chạm để mở, ô đang mở xanh dương nhạt; nhập ở trên – biên bản xem trước ở dưới; số liệu cùng tính chất tự điền từ bước gốc.
9. **Không duyệt, không khóa trong app.** CBKT lập hồ sơ; app chỉ kiểm đủ và đúng; xuất PDF để soát và ký giấy. Trạng thái bước app tự tính: đủ và đúng (xanh) / còn thiếu (vàng) / vượt ngưỡng (đỏ nhạt) / chưa nhập (xám). Cuối bước: Xem thử PDF · Xuất PDF · Lưu. Mỗi lần xuất ghi thời điểm, người lập, phạm vi, tình trạng.

## 4. Việc tiếp theo (Khối 2)

1. Dựng màn **Chọn cọc nghiệm thu**: danh sách 62 trụ (chấm màu 5 cọc), ô tìm "T00-24 C3", lưới 5 cọc, thẻ thông số đọc vào có nguồn, nút Mở hồ sơ. Cọc thiếu thông số vẫn mở, ô thiếu để trống.
2. Nạp đủ 310 cọc từ BoDuLieu_HonKhoai_v1.json (định dạng KCS-DULIEU-1: info, nguong, danhMuc, ongVach, thep, coc).
3. Làm mẫu Excel để Phòng KT bổ sung thông số; app nạp lại file là cập nhật cả 310 cọc.
4. Dựng 11 bước nhập trên khuôn stepStrip (js/ui.js) + biên bản xem trước; thử trên 15 cọc đủ dữ liệu.
5. Kiểm ngưỡng CDKT; xuất PDF từng biên bản và cả bộ (HTML A4 → PDF có chữ).
6. Gửi anh xem sau bước 1–2 rồi mới làm xuất PDF.

## 5. Tình trạng dữ liệu Hòn Khoai

| Thông số | Có | Thiếu |
|---|---|---|
| Tọa độ X, Y | 310 (T00-15 suy ra) | 0 |
| Dài ống vách | 305 | 5 (T00-15) |
| CĐ đỉnh vách, L, CĐ mũi | 21 | 289 |
| Bộ thép lồng | L = 92 m | L = 94 m (6 cọc) |
| Đủ lập trọn 11 biên bản | 15 | 295 |
| CĐ tự nhiên | — | đo hiện trường (B3) |

Việc của Phòng KT: bổ sung CĐ đỉnh vách, L, CĐ mũi cho 289 cọc; bảng thép L = 94 m; xác nhận lý trình đoạn T02-11…T02-19; BCH xác nhận vai trò An Phú trên biểu mẫu.

## 6. Kỹ thuật cần nhớ

- Mã ở thư mục gốc kho (index.html, css/, js/, sw.js, manifest); chạy thử: `node serve.cjs` → http://127.0.0.1:4173; kiểm thử: `python kiem-thu/kiem_thu_nen_chung.py` (Playwright).
- Mỗi lần đổi bản: tăng `window.AP_VERSION` trong js/app.js và tên cache trong sw.js.
- Hàm dùng chung (js/ui.js): subPage, field, menuGrid, menuRow, rowIc, bi (nút), strip (dải 5 phím), stepStrip + wireStepStrip (dải bước), toast, sheet, confirmSheet, saveFile.
- Commit kết thúc bằng 2 dòng ghi công (Co-Authored-By, Claude-Session).

## 7. Câu mở phiên mới (anh dán vào)

> Tiếp tục Nhật ký hiện trường An Phú V2.0 từ bản 2.0.0-nen3. Đọc BAN_GIAO_PHIEN_MOI.md trong Project (hoặc trong gói V2.0_Nen3 trên ổ D), rồi làm Khối 2: màn chọn cọc nghiệm thu và nạp 310 cọc Hòn Khoai.
