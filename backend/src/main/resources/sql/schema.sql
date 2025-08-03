-- 创建数据库
CREATE DATABASE IF NOT EXISTS chat_box_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE chat_box_db;

-- 用户表
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user`
(
    `id`          int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username`    varchar(50)  NOT NULL COMMENT '用户名',
    `password`    varchar(100) NOT NULL COMMENT '密码',
    `role`        int          NOT NULL DEFAULT 0 COMMENT '角色',
    `avatar`      varchar(500)          DEFAULT '' COMMENT '头像',
    `create_time` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_username` (`username`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='用户表';

-- 会话表（对应 Conversation 实体）
DROP TABLE IF EXISTS conversation;
CREATE TABLE IF NOT EXISTS `conversation`
(
    `id`             int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`          varchar(100) NOT NULL COMMENT '会话标题',
    `uuid`           varchar(50)  NOT NULL COMMENT '会话UUID',
    `user_id`        int          NOT NULL COMMENT '用户ID',
    `system_message` text                  DEFAULT '' COMMENT '系统提示词',
    `model_params`   varchar(200) NOT NULL DEFAULT '' comment '模型参数',
    `create_time`    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_uuid` (`uuid`),
    KEY `idx_user_id` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='会话表';

-- 消息表
DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message`
(
    `id`                int         NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `conversation_uuid` varchar(50) NOT NULL COMMENT '会话UUID',
    `user_id`           int         NOT NULL COMMENT '用户ID',
    `role`              int         NOT NULL COMMENT '角色（用户/AI）',
    `model_id`          int                  DEFAULT NULL COMMENT 'AI模型ID',
    `content`           text        NOT NULL COMMENT '消息内容',
    `tokens`            int                  DEFAULT NULL COMMENT 'token数量',
    `create_time`       timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`       timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_conversation_uuid` (`conversation_uuid`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_model_id` (`model_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='消息表';

-- 平台表
DROP TABLE IF EXISTS `platform`;
CREATE TABLE IF NOT EXISTS `platform`
(
    `id`            int         NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name`          varchar(50) NOT NULL COMMENT '平台名称',
    `platform_type` int         NOT NULL COMMENT '平台类型',
    `user_id`       int         NOT NULL COMMENT '用户ID',
    `api_key`       varchar(200)         DEFAULT NULL COMMENT 'API密钥',
    `base_url`      varchar(200)         DEFAULT NULL COMMENT '基础URL',
    `enable`        tinyint(1)  NOT NULL DEFAULT 1 COMMENT '是否启用',
    `create_time`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='平台表';

-- AI模型表
DROP TABLE IF EXISTS model;
CREATE TABLE IF NOT EXISTS `model`
(
    `id`          int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `type`        varchar(50)  NULL COMMENT '模型类型',
    `platform_id` int          NOT NULL COMMENT '平台ID',
    `name`        varchar(100) NOT NULL COMMENT '模型名称',
    `description` varchar(500)          DEFAULT '' COMMENT '描述',
    `create_time` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_platform_id` (`platform_id`),
    KEY `idx_type` (`type`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='AI模型表';

-- 知识库表
DROP TABLE IF EXISTS `knowledge_base`;
CREATE TABLE IF NOT EXISTS `knowledge_base`
(
    `id`                   int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`                varchar(100) NOT NULL COMMENT '知识库标题',
    `remark`               varchar(500)          DEFAULT NULL COMMENT '描述',
    `is_public`            tinyint(1)            DEFAULT 0 COMMENT '是否公开',
    `owner_id`             bigint       NOT NULL COMMENT '拥有者ID',
    `embedding_model_id`   bigint                DEFAULT NULL COMMENT '嵌入模型ID',
    `qa_model_id`          int                   DEFAULT NULL COMMENT '问答模型ID',
    `process_type`         varchar(50)           DEFAULT NULL COMMENT '处理方式',
    `block_size`           int                   DEFAULT 1000 COMMENT '分块大小(100-3000)',
    `max_overlap`          varchar(50)           DEFAULT '200' COMMENT '文档切割时重叠数量(按token计)',
    `qa_prompt`            text                  DEFAULT NULL COMMENT '问答提示词',
    `retrieve_max_results` int                   DEFAULT 10 COMMENT '文档召回最大数量',
    `retrieve_min_score`   double                DEFAULT 0.0 COMMENT '文档召回最小分数',
    `create_time`          timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`          timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_owner_id` (`owner_id`),
    KEY `idx_title` (`title`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='知识库表';

-- 知识库条目表
DROP TABLE IF EXISTS knowledge_base_item;
CREATE TABLE IF NOT EXISTS `kb_item`
(
    `id`                           int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `kb_id`                        bigint       NOT NULL COMMENT '所属知识库ID',
    `title`                        varchar(200) NOT NULL COMMENT '条目标题',
    `brief`                        varchar(500)          DEFAULT NULL COMMENT '内容摘要',
    `remark`                       text                  DEFAULT NULL COMMENT '完整内容',
    `is_enable`                    tinyint(1)   NOT NULL DEFAULT 1 COMMENT '是否启用',
    `embedding_status`             int          NOT NULL DEFAULT 0 COMMENT '向量化状态：0-待处理，1-切分中，2-已索引，3-失败',
    `embedding_status_change_time` timestamp             DEFAULT NULL COMMENT '向量化状态变更时间',
    `create_time`                  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`                  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_kb_id` (`kb_id`),
    KEY `idx_title` (`title`),
    KEY `idx_embedding_status` (`embedding_status`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='知识库条目表';

CREATE TABLE `base_file`
(
    `id`          INT          NOT NULL AUTO_INCREMENT  COMMENT '主键ID',
    `user_id`     INT          NOT NULL                 COMMENT '用户ID',
    `uuid`        VARCHAR(64)  NOT NULL                 COMMENT '文件唯一标识符',
    `file_name`   VARCHAR(255) NOT NULL                 COMMENT '原始文件名',
    `file_size`   INT                   DEFAULT NULL    COMMENT '文件大小（字节）',
    `path`        VARCHAR(512) NOT NULL                 COMMENT '文件存储路径',
    `ext`         VARCHAR(32)           DEFAULT NULL    COMMENT '文件扩展名',
    `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_uuid` (`uuid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='文件信息表';
