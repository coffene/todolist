# Git Commands Cheat Sheet

## 1. Checkout Branch
```bash
# Tạo và chuyển sang branch mới
git checkout -b feature/new-feature

# Chuyển sang branch đã tồn tại
git checkout main

# Chuyển sang branch và cập nhật code mới nhất
git checkout main && git pull origin main
```

## 2. Add và Commit
```bash
# Xem trạng thái các file
git status

# Add một file cụ thể
git add filename.js

# Add tất cả file đã thay đổi
git add .

# Commit với message
git commit -m "Add new feature: edit task and deadline"

# Add và commit trong một lệnh
git commit -am "Update task functionality"
```

## 3. Push Code
```bash
# Push branch hiện tại lên remote
git push origin feature/new-feature

# Push và set upstream branch
git push -u origin feature/new-feature

# Force push (cẩn thận khi dùng)
git push -f origin feature/new-feature
```

## 4. Pull Code
```bash
# Pull code mới nhất từ remote
git pull origin main

# Pull và rebase
git pull --rebase origin main

# Pull một branch cụ thể
git pull origin feature/new-feature
```

## 5. Merge Branch
```bash
# Chuyển về branch main
git checkout main

# Merge branch feature vào main
git merge feature/new-feature

# Merge với message
git merge feature/new-feature -m "Merge feature: edit task"

# Merge và giữ lại commit history
git merge --no-ff feature/new-feature
```

## 6. Delete Branch
```bash
# Xóa branch local
git branch -d feature/new-feature

# Xóa branch local (force)
git branch -D feature/new-feature

# Xóa branch remote
git push origin --delete feature/new-feature
```

## 7. Quy trình làm việc với branch
```bash
# 1. Cập nhật main branch
git checkout main
git pull origin main

# 2. Tạo branch mới cho tính năng
git checkout -b feature/edit-task

# 3. Làm việc trên branch
# ... code changes ...

# 4. Add và commit changes
git add .
git commit -m "Add edit task functionality"

# 5. Push branch lên remote
git push -u origin feature/edit-task

# 6. Tạo Pull Request trên GitHub

# 7. Sau khi PR được merge
git checkout main
git pull origin main
git branch -d feature/edit-task
```

## 8. Xử lý conflict
```bash
# Khi có conflict
git status  # Xem file có conflict
# Sửa conflict trong file
git add .   # Add file đã sửa
git commit -m "Resolve merge conflicts"
```

## 9. Best Practices
- Luôn pull code mới nhất trước khi tạo branch mới
- Đặt tên branch có ý nghĩa (feature/, bugfix/, hotfix/)
- Commit message rõ ràng, mô tả đúng thay đổi
- Không commit code chưa test
- Review code trước khi merge
- Xóa branch sau khi đã merge

## 10. Các lệnh hữu ích khác
```bash
# Xem lịch sử commit
git log

# Xem thay đổi trong file
git diff

# Xem danh sách branch
git branch

# Xem danh sách branch remote
git branch -r

# Stash changes
git stash
git stash pop

# Reset changes
git reset --hard HEAD
```

## 11. Workflow với team
```bash
# 1. Cập nhật main
git checkout main
git pull origin main

# 2. Tạo branch mới
git checkout -b feature/new-feature

# 3. Code và commit
git add .
git commit -m "Implement new feature"

# 4. Push và tạo PR
git push -u origin feature/new-feature

# 5. Code review và merge

# 6. Cleanup
git checkout main
git pull origin main
git branch -d feature/new-feature
```

## 12. Tips & Tricks
- Sử dụng `git status` thường xuyên
- Commit thường xuyên với message rõ ràng
- Không commit file nhạy cảm
- Sử dụng `.gitignore` đúng cách
- Backup code trước khi thực hiện thao tác nguy hiểm
- Sử dụng Git GUI tools nếu cần

## 13. Các lệnh Git cơ bản khác
```bash
# Khởi tạo repository
git init

# Clone repository
git clone <repository-url>

# Xem remote
git remote -v

# Thêm remote
git remote add origin <repository-url>

# Xem thông tin commit
git show <commit-hash>

# Xem thay đổi của một file
git diff <filename>

# Xem lịch sử của một file
git log <filename>

# Tạo tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tag
git push origin v1.0.0

# Xóa tag
git tag -d v1.0.0
git push origin --delete v1.0.0
```

## 14. Các lệnh Git nâng cao
```bash
# Rebase branch
git rebase main

# Interactive rebase
git rebase -i HEAD~3

# Cherry pick commit
git cherry-pick <commit-hash>

# Stash với message
git stash save "Work in progress"

# Stash list
git stash list

# Apply stash cụ thể
git stash apply stash@{0}

# Drop stash
git stash drop stash@{0}

# Clean untracked files
git clean -fd

# Reset to specific commit
git reset --hard <commit-hash>

# Revert commit
git revert <commit-hash>
```

## 15. Git Configuration
```bash
# Set user name
git config --global user.name "Your Name"

# Set user email
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "vim"

# Set default branch
git config --global init.defaultBranch main

# Set credential helper
git config --global credential.helper store

# List all config
git config --list
``` 