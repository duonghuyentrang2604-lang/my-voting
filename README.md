# Web app bình chọn (Vercel + Upstash Redis, miễn phí)

## Cấu trúc
- public/index.html   giao diện bình chọn
- public/results.html trang xem kết quả (cần ADMIN_KEY)
- api/_config.js      danh sách tiết mục / tài năng nhí (SỬA Ở ĐÂY)
- api/vote.js         kiểm tra User ID + ghi phiếu (mỗi ID 1 lần)
- api/results.js      trả kết quả cho quản trị viên

## Triển khai
1. Tạo repo GitHub, đẩy toàn bộ thư mục này lên.
2. vercel.com → Add New → Project → chọn repo → Deploy (Framework: Other).
3. Trong project: Storage → Create/Connect Database → Upstash Redis (gói Free) → Connect.
   Vercel tự thêm biến môi trường kết nối.
4. Settings → Environment Variables, thêm:
   - ADMIN_KEY  = một chuỗi bí mật do bạn đặt
   - VOTER_IDS  = mã1,mã2,mã3,...  (bỏ trống nếu chưa cần giới hạn mã)
5. Deployments → Redeploy để nhận biến mới.
6. Xem kết quả: https://TÊN-MIỀN/results.html?key=ADMIN_KEY

## Chạy thử trên máy
npm i -g vercel && vercel dev   (cần liên kết project để có biến môi trường)
