# 潮汕英歌舞非遗文化展示系统

## 项目结构

```
fengyun/
├── backend/     # FastAPI 后端 API
├── admin/       # Ant Design Pro 管理后台
├── portal/      # Vite + React 门户网站
└── database/    # 数据库初始化脚本
```

## 技术栈

| 模块 | 技术 |
|------|------|
| Backend | Python 3.11 + FastAPI + SQLAlchemy 2.0 + MySQL 8.0 + Redis |
| Admin | React 19 + Umi Max + Ant Design Pro + TypeScript |
| Portal | React 19 + Vite + Tailwind CSS + Framer Motion |

## 快速启动

### 1. Backend

```bash
cd backend

# 安装依赖
poetry install
# 或
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env

# 启动开发服务器
./scripts/dev.sh
# 或
poetry run uvicorn app.main:app --reload

# Docker 方式（含 MySQL/Redis/MinIO）
docker compose up -d
```

访问 http://localhost:8000/docs 查看 API 文档

### 2. Admin

```bash
cd admin

# 安装依赖（推荐 Node 20+）
pnpm install

# 启动开发服务器
pnpm start
# 或
pnpm dev
```

访问 http://localhost:8000

默认账号：`admin` / `admin123456`

### 3. Portal

```bash
cd portal

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:5173

## 环境变量

Backend 核心配置（`.env`）：

| 变量 | 说明 |
|------|------|
| `DB_URL` | MySQL 连接串 |
| `REDIS_URL` | Redis 连接（可选） |
| `JWT_SECRET` | JWT 密钥 |
| `COS_*` | 腾讯云 COS 配置（可选，无配置时使用本地存储） |

## 数据库初始化

```bash
mysql -u root -p < database/init.sql
```

或使用 Docker Compose 自动初始化。

## 构建生产版本

```bash
# Backend
docker build -t yingge-backend ./backend

# Admin
cd admin && pnpm build

# Portal
cd portal && pnpm build
```
