# 📊 API Nâng Cao cho Trang Todo

---

## 1. Thống kê số task theo priority
- **Endpoint:**  
  `GET /api/tasks/stats/priority`
- **Mô tả:**  
  Trả về số lượng task cho từng priority (high, medium, low).
- **Request:**  
  - Không cần body, không cần query.
- **Response:**
  ```json
  [
    { "_id": "high", "count": 5 },
    { "_id": "medium", "count": 10 },
    { "_id": "low", "count": 3 }
  ]
  ```

---

## 2. Lấy task kèm tên category (lookup)
- **Endpoint:**  
  `GET /api/tasks/with-category?user_id=<user_id>`
- **Mô tả:**  
  Trả về danh sách task của user, mỗi task kèm thông tin category (nếu có).
- **Request:**  
  - Query: `user_id` (bắt buộc)
- **Response:**
  ```json
  [
    {
      "_id": "taskid1",
      "title": "Làm bài tập",
      "category_id": "catid1",
      "category": {
        "_id": "catid1",
        "name": "Work",
        "color": "#1976d2"
      },
      ...
    },
    ...
  ]
  ```

---

## 3. Tìm kiếm task theo từ khóa (text search)
- **Endpoint:**  
  `GET /api/tasks/search?user_id=<user_id>&q=<keyword>`
- **Mô tả:**  
  Tìm kiếm task theo từ khóa trong title hoặc description.
- **Request:**  
  - Query: `user_id` (bắt buộc), `q` (từ khóa, bắt buộc)
- **Response:**
  ```json
  [
    {
      "_id": "taskid1",
      "title": "Làm bài tập toán",
      "description": "Giải phương trình"
    },
    ...
  ]
  ```

---

## 4. Thống kê số task theo từng category
- **Endpoint:**  
  `GET /api/tasks/stats/category?user_id=<user_id>`
- **Mô tả:**  
  Trả về số lượng task cho từng category của user.
- **Request:**  
  - Query: `user_id` (bắt buộc)
- **Response:**
  ```json
  [
    {
      "_id": "catid1",
      "count": 5,
      "category": {
        "_id": "catid1",
        "name": "Work"
      }
    },
    ...
  ]
  ```

---

## 5. Thống kê số task theo trạng thái (status)
- **Endpoint:**  
  `GET /api/tasks/stats/status?user_id=<user_id>`
- **Mô tả:**  
  Trả về số lượng task theo trạng thái (pending, completed) của user.
- **Request:**  
  - Query: `user_id` (bắt buộc)
- **Response:**
  ```json
  [
    { "_id": "pending", "count": 7 },
    { "_id": "completed", "count": 4 }
  ]
  ```

---

## Lưu ý cho frontend
- **user_id** lấy từ AuthContext sau khi login/register.
- Các API trả về mảng, mỗi phần tử là một object thống kê hoặc task.
- Khi dùng API `/api/tasks/with-category`, bạn sẽ nhận được thông tin category lồng trong mỗi task. 