# 后台功能复盘

## 1. 认证与权限

- **登录 / 退出**  
  - 登录成功后根据角色跳转仪表盘并缓存用户信息。  
  - 退出会清除 token、记录操作日志并返回 `/user/login`，支持携带 `redirect` 回到之前页面。

- **角色限制**  
  - `super_admin`：可访问全部菜单（仪表盘、内容管理、配置管理、统计等），拥有管理员账号 CRUD、重置密码等高级能力。  
  - `admin`：仅可访问“仪表盘”和“内容管理”下的子页面，其他菜单会被过滤，同时路由守卫会强制跳回仪表盘，保证权限一致。

- **修改密码**  
  - 任何登录用户都可通过右上角头像 → “修改密码”进入 `/account/change-password`，提交后强制退出重新登录。

## 2. 管理员账号管理

- **后端接口**  
  - `GET /admin/users`：列表 + 关键词搜索。  
  - `POST /admin/users`：新增，校验重复用户名，密码会进行 hash。  
  - `PUT /admin/users/{id}`：编辑昵称 / 角色 / 启用状态 / 新密码。编辑时无需重新输入用户名。  
  - `POST /admin/users/{id}/reset-password`：可传自定义新密码，留空则后端随机生成安全字符串并返回一次明文。  
  - 所有操作都会记录 operation log，并保证始终至少有一名启用的 `super_admin`。

- **前端页面（配置管理 → 管理员账号）**  
  - 支持搜索、分页、编辑、启用/禁用、上传头像。  
  - “重置/查看密码”弹窗可生成随机密码或手动输入，再次显示明文供复制。  
  - “是否启用”开关会立即生效，禁用账号无法登录。

## 3. 文件上传 & COS

- **上传接口**：`POST /admin/upload` 接受 `file` + `category`，区分模块存储（如 `avatars/`、`articles/` 等）。  
- **COS 配置**：后端 `.env` 中提供以下变量即可启用腾讯云 COS；缺失时自动回退到本地 `storage/<category>/`：  
```
COS_SECRET_ID=<your-secret-id>
COS_SECRET_KEY=<your-secret-key>
COS_REGION=<e.g. ap-guangzhou>
COS_BUCKET=<bucket-name>
COS_PUBLIC_DOMAIN=https://<bucket>.cos.<region>.myqcloud.com
```
- **上传组件**：前端 `Uploader` 自带分类、格式限制和 10MB 大小提示；管理员头像已经使用 `category="avatars"`，返回 URL 可直接保存数据库。

## 4. 其他交互细节

- 侧边栏所有菜单提供问号提示（`Tooltip`），解释该模块用途。  
- 普通管理员看不到配置、统计等菜单，避免误操作。  
- 所有页面在 `pnpm tsc --noEmit`、`python -m compileall app` 下通过校验，确保类型与语法正确。

## 5. 后续可选事项

- 如需将内容模块（轮播图、文章封面等）也迁移到 COS，只需在相应表单中复用 `Uploader` 并设定 `category`。  
- 若计划使用 CDN 或临时密钥（STS）进行前端直传，可在现有上传接口基础上扩展。

## 6. 前端实现要点

- **技术栈**：Umi Max + Ant Design Pro，`requestErrorConfig` 统一处理 token/401。  
- **状态管理**：`getInitialState` 加载当前用户并写入 token，`layout.onPageChange` + `menuDataRender` 控制权限与菜单过滤。  
- **组件**：  
  - `components/Uploader` 封装上传交互（分类、多格式、提示语），所有头像/封面可复用；支持 `accept`、`category`、`disabled`。  
  - `RightContent/AvatarDropdown` 负责修改密码、退出逻辑，并展示当前用户信息。  
- **页面**：  
  - `pages/config/Admins`：管理员账户管理，集成 `ProTable + ModalForm`、重置密码弹窗、头像上传。  
  - `pages/account/ChangePassword`：自助修改密码，提交后清理 token 强制重新登录。  
- **体验细节**：  
  - 侧边栏菜单 `menuHelpMap` 对应问号提示，帮助用户快速了解模块用途。  
  - 普通管理员看不到配置/统计等菜单，点击其它路径时自动跳回仪表盘。  
- **构建检查**：使用 `pnpm tsc --noEmit` 保障类型安全，前端依赖 `UMI_APP_API_URL` 指向后端 API。
