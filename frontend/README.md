# Git Workflow and Commit Convention

## Commit Message Convention

### Format:
```
<type>(<scope>): <message>
```

### Types:
- **feat**: Thêm tính năng mới (e.g., `feat(scope): add file/folder to ...`)
- **fix**: Sửa lỗi trong mã nguồn (e.g., `fix(): fix ? to ?`)
- **docs**: Cập nhật tài liệu (e.g., `docs: add instruction in README.md`)
- **style**: Thay đổi liên quan đến style
- **refactor**: Sửa đổi cấu trúc mã nguồn
- **perf**: Tăng hiệu suất
- **build**: Thay đổi, thêm, xoá thư viện, dependencies
- **chore**: Cập nhật không liên quan tới tính năng
- **revert**: Hoàn tác một thay đổi trước đó

---

## Git Branching Model

Tham khảo: [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)

### Branches(skipped):
- **master**: Chứa từng phiên bản chính hoặc phụ
- **dev**: Nhánh chính dùng để merge code
- **feature**: Nhánh phát triển tính năng
- **hotfixes**: Sửa lỗi khẩn cấp trên `master`
- **release**: Chứa phiên bản sản phẩm từ `develop`, được merge vào `master`

---

## Git Workflow

### 1. Tạo issue
- **Example:**
  ```
  issues: khoahotran - create login.tsx file
  assignees: khoahotran
  labels: ...(feature)
  (#1)
  ```

### 2. Tạo branch local
```
git checkout -b feature/1-index.js-file dev
git add .
git commit -m '#1 - khoahotran create index.js file'
git push
```

### 3. Tạo pull request
- Comment PR với nội dung `<message> #1`
