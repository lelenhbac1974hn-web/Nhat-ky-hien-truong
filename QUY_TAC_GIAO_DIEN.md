# Quy tắc giao diện – Nhật ký hiện trường An Phú V2.0

Khóa ngày 12/11/2026 theo chỉ đạo anh Lê Bắc. Áp dụng cho mọi phân hệ và mọi tài liệu làm sau (nghiệm thu cọc, bệ, thân trụ, dầm, mặt cầu, nhận hàng, báo cáo ngày, báo cáo ảnh).

## 1. Màn và trang nhập
1. Màn của 4 tab chính chỉ là danh sách hoặc menu để chọn, không có ô nhập.
2. Nhập dữ liệu chỉ ở trang nhập: đầu trang có nút quay lại và tiêu đề; cuối trang có thanh thao tác cố định.
3. Thao tác xóa nằm trong "Vùng nguy hiểm" và luôn hỏi xác nhận.

## 2. Nút và ô nhập
1. Nút luôn có biểu tượng + chữ; nền trong suốt hòa vào nền trang, không khối đặc, không viền; chạm chỉ hiện lớp tô nhạt.
2. Màu chữ phân loại: navy là thao tác chính, mực đen là thao tác phụ, đỏ là xóa.
3. Ô nhập cao 44 px, nhãn ở trên, gợi ý ở dưới.
4. Thông báo nổi nền trắng có biểu tượng; ẩn khi mở hộp thoại.

## 3. Menu chức năng
1. Lưới 4 ô vuông một hàng; biểu tượng trong khối màu nhạt; tên tối đa 2 dòng.
2. Màu khối theo phân hệ: xanh lá nghiệm thu, vàng nâu hàng hóa, xanh dương báo cáo, tím dữ liệu, navy thiết lập.
3. Chức năng chưa làm: viền nét đứt, nhãn "Sắp có".

## 4. Dải phím (thanh dưới, dải tab)
1. Luôn 5 ô bằng nhau; phím hòa vào dải; phím đang dùng sáng lên (khối nền nhạt sau biểu tượng, chữ đậm).

## 5. Tài liệu nhiều bước (QUY TẮC KHÓA)
Vai trò: CBKT lập hồ sơ. App chỉ kiểm soát hồ sơ đủ và đúng, rồi xuất PDF. App không có bước duyệt, không khóa, không phân quyền; việc soát và ký làm trên bản giấy.

1. Dải bước luôn hiện 5 ô hình mũi tên chỉ chiều quy trình. Trên ô ghi mã bước + tên ngắn (tối đa khoảng 9 ký tự); tên đầy đủ ở tiêu đề tài liệu bên dưới.
2. Bước ngoài 5 ô dồn về hai đầu thành chồng mỏng, ghi số bước đang ẩn mỗi bên.
3. Vuốt dải để lướt, dừng đúng mép ô; vuốt không đổi bước đang nhập. Chạm ô mới mở bước; ô đang mở được đưa vào giữa. Chạm chồng hai đầu để lùi/tiến 1 ô (dùng khi đeo găng, tay ướt).
4. Chỉ vuốt trên dải bước, không vuốt trên phần nhập và biên bản.
5. Màu trạng thái do app tự tính từ số liệu, không ai bấm duyệt:
   - xanh lá có ✓: đủ và đúng (đủ ô bắt buộc, không chỉ tiêu nào vượt ngưỡng);
   - vàng: đang nhập, còn thiếu ô bắt buộc;
   - đỏ nhạt có dấu !: có chỉ tiêu vượt ngưỡng hoặc mâu thuẫn;
   - xám: chưa nhập;
   - ô đang mở: xanh dương nhạt, sẫm hơn.
6. Bước đủ và đúng thì app gợi ý chuyển sang bước kế tiếp; CBKT vẫn sửa được mọi bước bất cứ lúc nào.
7. Bố cục mỗi bước: phần nhập ở trên, biên bản xem trước ngay bên dưới, cập nhật theo từng ký tự gõ; chạm ô nào thì dòng tương ứng trên biên bản tô vàng.
8. Chỉ tiêu vượt ngưỡng hiện đỏ trên biên bản; kết luận tự chuyển "Không đạt". App không tự sửa số, không tự đánh "Đạt" cho mục chưa kiểm.
9. Số liệu cùng tính chất nhập một lần ở bước gốc, các bước sau tự điền (nhãn "từ Bx", tô xanh nhạt trên biên bản); muốn sửa thì sửa ở bước gốc.
10. Thao tác cuối bước: Xem thử PDF · Xuất PDF · Lưu. Không có nút Khóa, Duyệt, Mở khóa.
11. Xuất PDF theo từng biên bản hoặc cả bộ hồ sơ cọc. Còn thiếu hoặc vượt ngưỡng thì vẫn cho xuất nhưng báo rõ thiếu gì, sai gì trước khi xuất; ô thiếu để trống trên bản in để ghi tay.
12. Mỗi lần xuất PDF, app ghi vào hồ sơ: thời điểm, người lập, phạm vi (biên bản nào), tình trạng đủ/đúng lúc xuất — để đối chiếu với bản giấy đã ký.

Mã dùng chung: `stepStrip()` và `wireStepStrip()` trong js/ui.js; kiểu `.sstrip` trong css/app.css.
