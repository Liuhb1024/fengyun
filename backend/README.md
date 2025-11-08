# 潮汕英歌舞后端开发规划

> FastAPI + SQLAlchemy + MySQL + Redis + OSS（阿里云）为核心的服务端实现方案。

## 目标
- 覆盖 PRD 中 P0/P1 功能（认证、内容管理、门户查询、统计上报、文件上传占位）。
- 建立可扩展的服务架构（分层清晰、配置可控、易于测试部署）。
- 提供配套文档、脚本与测试，方便团队协作与后续迭代。

## 技术栈确认
- **运行环境**：Python 3.11、FastAPI 0.110+、SQLAlchemy 2.0（异步）、Alembic、Redis（可选）、阿里云 OSS SDK。
- **依赖管理**：Poetry（可切换 pip/uv）、pre-commit（ruff、black、isort、mypy）。
- **部署**：Dockerfile + docker-compose（App + MySQL + Redis + MinIO/OSS Mock）。
- **日志与监控**：loguru（结构化输出）、Sentry 占位。

## 目录规划
```
backend/
├─ pyproject.toml        # 依赖与工具链
├─ README.md             # 本文档
├─ .env.example          # 环境变量样例
├─ docker-compose.yml    # 本地开发编排
├─ Dockerfile            # 应用镜像
├─ scripts/              # dev/manage 脚本
├─ app/
│  ├─ core/              # 配置、日志、依赖注入、异常
│  ├─ db/                # 会话、模型、仓储、迁移
│  ├─ schemas/           # Pydantic 定义
│  ├─ services/          # 业务服务层
│  ├─ api/
│  │   ├─ deps.py        # 路由依赖
│  │   ├─ admin/         # 后台 API
│  │   └─ portal/        # 门户 API
│  ├─ workers/           # 异步任务（预留）
│  └─ main.py            # FastAPI 入口
└─ tests/
   ├─ conftest.py
   ├─ fixtures/
   └─ api/
```

## 配置策略
| 变量 | 说明 |
|------|------|
| `DB_URL` | MySQL 连接串（MySQL 8.0，utf8mb4） |
| `REDIS_URL` | Redis 连接（可选，默认禁用） |
| `OSS_ENDPOINT`,`OSS_KEY`,`OSS_SECRET`,`OSS_BUCKET` | 对象存储配置（可切换 MinIO） |
| `JWT_SECRET`,`JWT_EXPIRE_MINUTES` | 认证配置 |
| `LOG_LEVEL`,`SENTRY_DSN` | 日志 & 监控 |

使用 `pydantic-settings` 加载，支持 `.env` + 环境变量。

## 数据库映射清单
- `admin`、`operation_log`：认证与审计。
- `carousel`,`image`,`video`,`audio`,`article`,`member`：多媒体内容。
- `navigation`,`seo_config`,`system_config`：站点配置。
- `visit_log`：访问记录。

模型字段直接对标 `database/init.sql`，抽离基础 mixin（`TimestampMixin`,`SoftDeleteMixin` 等）。

## 路由与模块
1. **公共**：`/healthz`,`/metrics`（预留）。
2. **门户 (portal)**：首页聚合、内容列表、详情、成员、导航、SEO、访问统计写入。
3. **后台 (admin)**：
   - 认证：登录、刷新、改密、当前用户。
   - 内容：轮播/图片/视频/音频/文章/成员 CRUD + 批量操作。
   - 配置：导航、SEO、系统信息、文件上传。
   - 统计：访问/内容热度查询、导出占位。
   - 日志：操作日志列表。

## 里程碑（迭代顺序）
1. **M1**：应用骨架、配置、健康检查、Docker 运行。
2. **M2**：数据库模型 + DAO + Schema + 认证模块。
3. **M3**：内容管理 API（含分页/筛选/批量）。
4. **M4**：门户查询 API + 访问统计写入。
5. **M5**：文件上传占位、系统设置、日志/统计接口。
6. **M6**：测试覆盖、CI、文档完善。

每个里程碑完成后输出：接口清单、测试结果、部署/使用说明更新。

## 快速开始
1. **安装依赖**  
   ```bash
   cd backend
   poetry install
   cp .env.example .env
   ```
   若更习惯 `pip`，可使用 `requirements.txt`：`pip install -r backend/requirements.txt`。
2. **启动服务（本地）**  
   ```bash
   ./scripts/dev.sh
   # or
   poetry run uvicorn app.main:app --reload
   ```
3. **Docker 编排**  
   ```bash
   docker compose up -d
   ```
4. 访问接口文档：`http://localhost:8000/docs`

## 已完成功能
- ✅ FastAPI 应用骨架 + CORS/GZip/异常处理 + Loguru 日志  
- ✅ SQLAlchemy 2.0 异步模型（管理员、内容、配置、统计等 11 张表）  
- ✅ Pydantic Schema、通用 CRUD、系统配置 & OSS（Mock）上传能力  
- ✅ 后台 API：认证（含退出登录）、内容管理、导航/SEO/系统配置、统计、操作日志  
- ✅ 门户 API：首页聚合、图/文/视/成员列表、导航树、SEO、访问记录  
- ✅ Redis Token 黑名单、防止重复使用的退出登录接口  
- ✅ 单元测试样例（健康检查），`python -m compileall backend/app` 校验通过  
- ✅ Dockerfile + docker-compose + 脚本，`.env.example` 覆盖关键配置位

下一步可根据需要补充 Alembic 迁移、更多自动化测试或 CI/CD 流程。
