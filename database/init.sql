-- 潮汕英歌舞非遗文化展示系统 - 数据库初始化脚本
-- MySQL 8.0+

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `yingge_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `yingge_db`;

-- 1. 管理员表
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `role` VARCHAR(20) DEFAULT 'admin' COMMENT '角色: super_admin, admin',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '是否启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 2. 轮播图表
CREATE TABLE IF NOT EXISTS `carousel` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `title_zh` VARCHAR(100) DEFAULT NULL COMMENT '中文标题',
  `title_en` VARCHAR(100) DEFAULT NULL COMMENT '英文标题',
  `link_url` VARCHAR(500) DEFAULT NULL COMMENT '跳转链接',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '是否启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sort_active` (`sort_order`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 3. 图片表
CREATE TABLE IF NOT EXISTS `image` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '缩略图URL',
  `title_zh` VARCHAR(200) DEFAULT NULL COMMENT '中文标题',
  `title_en` VARCHAR(200) DEFAULT NULL COMMENT '英文标题',
  `description_zh` TEXT COMMENT '中文描述',
  `description_en` TEXT COMMENT '英文描述',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `shot_date` DATE DEFAULT NULL COMMENT '拍摄日期',
  `view_count` INT DEFAULT 0 COMMENT '浏览次数',
  `is_homepage` TINYINT(1) DEFAULT 0 COMMENT '是否首页展示',
  `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_homepage` (`is_homepage`),
  KEY `idx_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图片表';

-- 4. 视频表
CREATE TABLE IF NOT EXISTS `video` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `url` VARCHAR(500) NOT NULL COMMENT '视频URL',
  `cover_url` VARCHAR(500) DEFAULT NULL COMMENT '封面URL',
  `title_zh` VARCHAR(200) NOT NULL COMMENT '中文标题',
  `title_en` VARCHAR(200) DEFAULT NULL COMMENT '英文标题',
  `description_zh` TEXT COMMENT '中文描述',
  `description_en` TEXT COMMENT '英文描述',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `duration` INT DEFAULT 0 COMMENT '时长(秒)',
  `file_size` BIGINT DEFAULT 0 COMMENT '文件大小(字节)',
  `play_count` INT DEFAULT 0 COMMENT '播放次数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频表';

-- 5. 音频表
CREATE TABLE IF NOT EXISTS `audio` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `url` VARCHAR(500) NOT NULL COMMENT '音频URL',
  `cover_url` VARCHAR(500) DEFAULT NULL COMMENT '封面URL',
  `title_zh` VARCHAR(200) NOT NULL COMMENT '中文标题',
  `title_en` VARCHAR(200) DEFAULT NULL COMMENT '英文标题',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `duration` INT DEFAULT 0 COMMENT '时长(秒)',
  `play_count` INT DEFAULT 0 COMMENT '播放次数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='音频表';

-- 6. 文章表
CREATE TABLE IF NOT EXISTS `article` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title_zh` VARCHAR(200) NOT NULL COMMENT '中文标题',
  `title_en` VARCHAR(200) DEFAULT NULL COMMENT '英文标题',
  `content_zh` LONGTEXT NOT NULL COMMENT '中文内容',
  `content_en` LONGTEXT COMMENT '英文内容',
  `cover_url` VARCHAR(500) DEFAULT NULL COMMENT '封面图',
  `summary_zh` VARCHAR(500) DEFAULT NULL COMMENT '中文摘要',
  `summary_en` VARCHAR(500) DEFAULT NULL COMMENT '英文摘要',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `view_count` INT DEFAULT 0 COMMENT '阅读量',
  `seo_keywords` VARCHAR(200) DEFAULT NULL COMMENT 'SEO关键词',
  `publish_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `is_published` TINYINT(1) DEFAULT 0 COMMENT '是否发布',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_publish` (`is_published`, `publish_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 7. 成员表
CREATE TABLE IF NOT EXISTS `member` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `name_zh` VARCHAR(50) NOT NULL COMMENT '中文姓名',
  `name_en` VARCHAR(100) DEFAULT NULL COMMENT '英文姓名',
  `position_zh` VARCHAR(50) DEFAULT NULL COMMENT '中文职位',
  `position_en` VARCHAR(100) DEFAULT NULL COMMENT '英文职位',
  `bio_zh` TEXT COMMENT '中文简介',
  `bio_en` TEXT COMMENT '英文简介',
  `join_date` DATE DEFAULT NULL COMMENT '入队时间',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `is_homepage` TINYINT(1) DEFAULT 0 COMMENT '是否首页展示',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成员表';

-- 8. 导航表
CREATE TABLE IF NOT EXISTS `navigation` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name_zh` VARCHAR(50) NOT NULL COMMENT '中文名称',
  `name_en` VARCHAR(100) DEFAULT NULL COMMENT '英文名称',
  `link_url` VARCHAR(200) NOT NULL COMMENT '链接地址',
  `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父级ID',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `is_visible` TINYINT(1) DEFAULT 1 COMMENT '是否显示',
  `is_external` TINYINT(1) DEFAULT 0 COMMENT '是否外链',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='导航表';

-- 9. SEO配置表
CREATE TABLE IF NOT EXISTS `seo_config` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `page_key` VARCHAR(50) NOT NULL COMMENT '页面标识',
  `title_zh` VARCHAR(200) DEFAULT NULL COMMENT '中文标题',
  `title_en` VARCHAR(200) DEFAULT NULL COMMENT '英文标题',
  `description_zh` VARCHAR(500) DEFAULT NULL COMMENT '中文描述',
  `description_en` VARCHAR(500) DEFAULT NULL COMMENT '英文描述',
  `keywords_zh` VARCHAR(200) DEFAULT NULL COMMENT '中文关键词',
  `keywords_en` VARCHAR(200) DEFAULT NULL COMMENT '英文关键词',
  `og_image` VARCHAR(500) DEFAULT NULL COMMENT 'OG图片',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_page_key` (`page_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SEO配置表';

-- 10. 系统配置表
CREATE TABLE IF NOT EXISTS `system_config` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
  `config_value` TEXT COMMENT '配置值(JSON)',
  `description` VARCHAR(200) DEFAULT NULL COMMENT '描述',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 11. 操作日志表
CREATE TABLE IF NOT EXISTS `operation_log` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `admin_id` INT UNSIGNED NOT NULL COMMENT '管理员ID',
  `module` VARCHAR(50) NOT NULL COMMENT '模块',
  `action` VARCHAR(50) NOT NULL COMMENT '操作',
  `content` TEXT COMMENT '操作内容(JSON)',
  `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 12. 访问日志表
CREATE TABLE IF NOT EXISTS `visit_log` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `page_url` VARCHAR(500) NOT NULL COMMENT '页面URL',
  `referer` VARCHAR(500) DEFAULT NULL COMMENT '来源页面',
  `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT 'User Agent',
  `device_type` VARCHAR(20) DEFAULT NULL COMMENT '设备类型',
  `browser` VARCHAR(50) DEFAULT NULL COMMENT '浏览器',
  `os` VARCHAR(50) DEFAULT NULL COMMENT '操作系统',
  `region` VARCHAR(100) DEFAULT NULL COMMENT '地域',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created_at`),
  KEY `idx_page` (`page_url`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='访问日志表';

-- 插入初始数据

-- 插入超级管理员 (密码: admin123456)
INSERT INTO `admin` (`username`, `password_hash`, `nickname`, `role`) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS5MRIeXO', '超级管理员', 'super_admin');

-- 插入初始导航
INSERT INTO `navigation` (`name_zh`, `name_en`, `link_url`, `parent_id`, `sort_order`) VALUES
('首页', 'Home', '/', 0, 1),
('文化溯源', 'Culture', '/culture', 0, 2),
('队伍风采', 'Team', '/team', 0, 3),
('精彩瞬间', 'Gallery', '/gallery', 0, 4),
('动态资讯', 'News', '/news', 0, 5),
('联系我们', 'Contact', '/contact', 0, 6);

-- 插入SEO配置
INSERT INTO `seo_config` (`page_key`, `title_zh`, `title_en`, `description_zh`, `description_en`, `keywords_zh`, `keywords_en`) VALUES
('home', '潮汕英歌舞 - 非遗文化展示', 'Chaoshan Yingge Dance - Intangible Cultural Heritage', '潮汕英歌舞是国家级非物质文化遗产，展示传统文化魅力', 'Chaoshan Yingge Dance is a national intangible cultural heritage', '潮汕英歌舞,非遗,传统文化', 'Yingge Dance, Intangible Cultural Heritage, Traditional Culture'),
('culture', '文化溯源 - 潮汕英歌舞', 'Culture - Chaoshan Yingge Dance', '了解潮汕英歌舞的历史渊源和文化内涵', 'Learn about the history and cultural connotation of Chaoshan Yingge Dance', '历史,文化,传承', 'History, Culture, Heritage'),
('team', '队伍风采 - 潮汕英歌舞', 'Team - Chaoshan Yingge Dance', '潮汕英歌舞队伍成员介绍', 'Introduction to Chaoshan Yingge Dance team members', '队伍,成员,风采', 'Team, Members, Style'),
('gallery', '精彩瞬间 - 潮汕英歌舞', 'Gallery - Chaoshan Yingge Dance', '精彩的英歌舞表演瞬间', 'Wonderful moments of Yingge Dance performance', '图片,视频,精彩瞬间', 'Photos, Videos, Moments'),
('news', '动态资讯 - 潮汕英歌舞', 'News - Chaoshan Yingge Dance', '最新的演出动态和活动资讯', 'Latest performance news and event information', '新闻,动态,活动', 'News, Updates, Events'),
('contact', '联系我们 - 潮汕英歌舞', 'Contact - Chaoshan Yingge Dance', '联系潮汕英歌舞队伍', 'Contact Chaoshan Yingge Dance team', '联系,合作', 'Contact, Cooperation');

-- 插入系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `description`) VALUES
('site_info', '{"name_zh":"潮汕英歌舞","name_en":"Chaoshan Yingge Dance","logo":"","favicon":""}', '网站基本信息'),
('contact', '{"phone":"","email":"","address_zh":"","address_en":"","latitude":"","longitude":""}', '联系方式'),
('analytics', '{"baidu":"","google":""}', '统计代码'),
('filing', '{"icp":""}', '备案信息');

-- 完成
SELECT '数据库初始化完成！' AS message;
SELECT '默认管理员账号: admin' AS info;
SELECT '默认管理员密码: admin123456' AS info;
