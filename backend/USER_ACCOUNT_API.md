# 📄 API Quản Lý Tài Khoản Cá Nhân

## 1. Lấy thông tin user
- **Endpoint:**  
  `GET /api/users/<user_id>`
- **Mô tả:**  
  Lấy thông tin tài khoản của user (không trả về password).
- **Request:**  
  - Không cần body.
  - `<user_id>` là `_id` của user hiện tại (lấy từ AuthContext hoặc sau khi login).
- **Response:**
  ```json
  {
    "_id": "64a1b2c3d4e5f6...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "settings": {
      "theme": "light",
      "notifications": true
    },
    "created_at": "2024-06-27T10:00:00.000Z"
  }
  ```

---

## 2. Cập nhật thông tin user
- **Endpoint:**  
  `PUT /api/users/<user_id>`
- **Mô tả:**  
  Cập nhật username, email, password, settings.
- **Request:**  
  - Body (chỉ gửi trường cần đổi, không cần gửi hết):
    ```json
    {
      "username": "newname",
      "email": "newemail@example.com",
      "password": "newpassword",
      "settings": {
        "theme": "dark"
      }
    }
    ```
- **Response (thành công):**
  ```json
  {
    "_id": "64a1b2c3d4e5f6...",
    "username": "newname",
    "email": "newemail@example.com",
    "role": "user",
    "settings": {
      "theme": "dark",
      "notifications": true
    },
    "created_at": "2024-06-27T10:00:00.000Z"
  }
  ```
- **Response (lỗi):**
  ```json
  { "error": "No fields to update" }
  ```
  hoặc
  ```json
  { "error": "User not found or no change" }
  ```

---

## 3. Xóa tài khoản
- **Endpoint:**  
  `DELETE /api/users/<user_id>`
- **Mô tả:**  
  Xóa tài khoản user hiện tại.
- **Request:**  
  - Không cần body.
- **Response (thành công):**  
  - HTTP 204 No Content
- **Response (lỗi):**
  ```json
  { "error": "User not found" }
  ```

---

## Lưu ý cho frontend
- **user_id** lấy từ AuthContext sau khi login/register.
- Khi đổi password, chỉ cần gửi trường `"password"` mới.
- Không cần gửi các trường không đổi.
- Sau khi xóa tài khoản, nên logout user khỏi app. 