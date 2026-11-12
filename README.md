# Nhật ký hiện trường An Phú — V2.0 (bản viết mới)

Khối 1 · Nền chung (2.0.0-nen3).

- Dùng trên điện thoại: https://lelenhbac1974hn-web.github.io/nhat-ky-hien-truong/ (Safari → Chia sẻ → Thêm vào MH chính).
- Chạy thử trên máy: `node serve.cjs`, mở http://127.0.0.1:4173/. Không cần cài đặt hay build.

## Sơ đồ chức năng
```
Nhật ký hiện trường V2.0
├─ Nền chung (khối 1 — đã có)
│  ├─ Hôm nay: việc đang dở, việc cần lập, lối tắt lập mới
│  ├─ Camera: chụp trong app, gắn ngày giờ, địa danh, GPS
│  ├─ Kho ảnh: xem theo ngày, lọc, nhập từ máy, ghi chú, xóa
│  ├─ Hồ sơ: danh sách nháp, đã phát hành, thùng rác
│  └─ Dự án: thông tin, người lập, sao lưu, khôi phục, xóa dữ liệu
├─ Nghiệm thu công việc (khối 2)
│  ├─ Khung chung: cấu kiện → các bước → số đo, ngưỡng, ảnh bắt buộc → phát hành và khóa
│  ├─ Cọc khoan nhồi: 11 bước (quy trình đầu tiên)
│  └─ Bệ, thân trụ, dầm, mặt cầu, công việc khác: nạp dần
├─ Nhận hàng (khối 3): có hoặc không hợp đồng, chứng từ, ảnh chứng cứ
├─ Báo cáo ngày (khối 4)
└─ Báo cáo ảnh (khối 5)
```

## Nguyên tắc giao diện
Khóa ngày 12/11/2026 theo chỉ đạo anh Lê Bắc. Áp dụng cho mọi phân hệ và mọi tài liệu làm sau (nghiệm thu cọc, bệ, thân trụ, dầm, mặt cầu, nhận hàng, báo cáo ngày, báo cáo ảnh).

### 1. Màn và trang nhập
1. Màn của 4 tab chính chỉ là danh sách hoặc menu để chọn, không có ô nhập.
2. Nhập dữ liệu chỉ ở trang nhập: đầu trang có nút quay lại và tiêu đề; cuối trang có thanh thao tác cố định.
3. Thao tác xóa nằm trong "Vùng nguy hiểm" và luôn hỏi xác nhận.

### 2. Nút và ô nhập
1. Nút luôn có biểu tượng + chữ; nền trong suốt hòa vào nền trang, không khối đặc, không viền; chạm chỉ hiện lớp tô nhạt.
2. Màu chữ phân loại: navy là thao tác chính, mực đen là thao tác phụ, đỏ là xóa.
3. Ô nhập cao 44 px, nhãn ở trên, gợi ý ở dưới.
4. Thông báo nổi nền trắng có biểu tượng; ẩn khi mở hộp thoại.

### 3. Menu chức năng
1. Lưới 4 ô vuông một hàng; biểu tượng trong khối màu nhạt; tên tối đa 2 dòng.
2. Màu khối theo phân hệ: xanh lá nghiệm thu, vàng nâu hàng hóa, xanh dương báo cáo, tím dữ liệu, navy thiết lập.
3. Chức năng chưa làm: viền nét đứt, nhãn "Sắp có".

### 4. Dải phím (thanh dưới, dải tab)
1. Luôn 5 ô bằng nhau; phím hòa vào dải; phím đang dùng sáng lên (khối nền nhạt sau biểu tượng, chữ đậm).

### 5. Tài liệu nhiều bước (QUY TẮC KHÓA)
1. Dải bước luôn hiện 5 ô hình mũi tên chỉ chiều quy trình. Trên ô ghi mã bước + tên ngắn (tối đa khoảng 9 ký tự); tên đầy đủ ở tiêu đề tài liệu bên dưới.
2. Bước ngoài 5 ô dồn về hai đầu thành chồng mỏng, ghi số bước đang ẩn mỗi bên.
3. Vuốt dải để lướt, dừng đúng mép ô; vuốt không đổi bước đang nhập. Chạm ô mới mở bước; ô đang mở được đưa vào giữa. Chạm chồng hai đầu để lùi/tiến 1 ô (dùng khi đeo găng, tay ướt).
4. Chỉ vuốt trên dải bước, không vuốt trên phần nhập và biên bản.
5. Màu: đã khóa xanh lá có ✓; đang làm vàng; chưa làm xám; ô đang mở xanh dương nhạt, sẫm hơn.
6. Khóa bước xong tự mở bước kế tiếp và trượt dải cho bước đó ở giữa.
7. Bố cục mỗi bước: phần nhập ở trên, biên bản xem trước ngay bên dưới, cập nhật theo từng ký tự gõ; chạm ô nào thì dòng tương ứng trên biên bản tô vàng.
8. Chỉ tiêu vượt ngưỡng hiện đỏ trên biên bản; kết luận tự chuyển "Không đạt".
9. Số liệu cùng tính chất nhập một lần ở bước gốc, các bước sau tự điền (nhãn "từ Bx", tô xanh nhạt trên biên bản).
10. Thao tác cuối bước: Xem thử PDF · Xuất PDF · Lưu · Khóa bước. Bước đã khóa: Mở khóa · Xem biên bản.

Mã dùng chung: `stepStrip()` và `wireStepStrip()` trong js/ui.js; kiểu `.sstrip` trong css/app.css.

## Sơ đồ lưu trữ
Một kho duy nhất trong trình duyệt: IndexedDB `anphu_nkht`. Không dùng localStorage.
```
anphu_nkht
├─ meta       cài đặt chung, dự án đang dùng, lần sao lưu gần nhất
├─ projects   dự án
├─ records    mọi hồ sơ (nghiệm thu, nhận hàng, báo cáo ngày, báo cáo ảnh): nháp / đã phát hành / thùng rác
├─ photos     thông tin ảnh: thời gian, GPS, địa danh, người chụp, mã kiểm tra, hồ sơ đang dùng
├─ blobs      nội dung tệp: ảnh gốc, ảnh thu nhỏ, PDF đã phát hành
├─ catalogs   dữ liệu dự án: cấu kiện, quy trình nghiệm thu, BOQ, vật tư, hợp đồng
└─ issues     bản phát hành đã khóa (số phiên bản, mã kiểm tra)
```
Gói sao lưu `.zip`: `du-lieu.json` + `anh/` + `anh-nho/` + `pdf/`.

## Mã nguồn
| Tệp | Việc |
|---|---|
| index.html, css/app.css | Khung trang và kiểu dáng |
| js/app.js | Khởi động, điều hướng |
| js/db.js | Kho dữ liệu |
| js/state.js | Dự án đang dùng, cài đặt, GPS |
| js/photos.js | Lưu và đọc ảnh |
| js/views.js | Các màn hình nền chung |
| js/zip.js | Đóng, mở gói sao lưu |
| js/ui.js | Thông báo, hộp thoại, biểu tượng |
| sw.js | Chạy khi mất mạng |

## Kiểm thử
`kiem-thu/kiem_thu_nen_chung.py` (Python + Playwright): 14 luồng.
