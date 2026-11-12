# Nhật ký hiện trường An Phú — V2.0 (bản viết mới)

Khối 1 · Nền chung (2.0.0-nen2).

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
1. Màn của 4 tab chính (Hôm nay, Hồ sơ, Kho ảnh, Dự án) chỉ là danh sách để chọn, không có ô nhập.
2. Nhập dữ liệu chỉ ở trang nhập: đầu trang có nút quay lại và tiêu đề, cuối trang là thanh thao tác cố định (Hủy / Lưu).
3. Nút và ô nhập một kiểu cho toàn ứng dụng: nút chính nền xanh navy, nút phụ nền trắng viền mảnh, bo góc 10 px, cao 44 px; ô nhập có nhãn ở trên, gợi ý ở dưới.
4. Thao tác xóa nằm trong mục "Vùng nguy hiểm" và luôn hỏi xác nhận.

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
