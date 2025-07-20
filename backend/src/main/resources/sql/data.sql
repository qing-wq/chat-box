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
    `id`                    int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`                 varchar(100) NOT NULL COMMENT '知识库标题',
    `remark`                varchar(500)          DEFAULT NULL COMMENT '描述',
    `is_public`             tinyint(1)            DEFAULT 0 COMMENT '是否公开',
    `is_strict`             tinyint(1)            DEFAULT 0 COMMENT '严格模式',
    `item_count`            int                   DEFAULT 0 COMMENT '知识点数量',
    `embedding_count`       int                   DEFAULT 0 COMMENT '向量数',
    `owner_id`              bigint       NOT NULL COMMENT '拥有者ID',
    `owner_name`            varchar(50)  NOT NULL COMMENT '拥有者名称',
    `ingest_max_overlap`    int                   DEFAULT 200 COMMENT '文档切割时重叠数量',
    `ingest_model_name`     varchar(100)          DEFAULT NULL COMMENT '索引文档时使用的LLM名称',
    `ingest_model_id`       bigint                DEFAULT NULL COMMENT '索引文档时使用的LLM ID',
    `retrieve_max_results`  int                   DEFAULT 10 COMMENT '文档召回最大数量',
    `retrieve_min_score`    decimal(5, 4)         DEFAULT 0.0000 COMMENT '文档召回最小分数',
    `query_llm_temperature` decimal(3, 2)         DEFAULT 0.70 COMMENT '请求LLM时的temperature',
    `query_system_message`  text                  DEFAULT NULL COMMENT '请求LLM时的系统提示词',
    `create_time`           timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`           timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_owner_id` (`owner_id`),
    KEY `idx_title` (`title`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='知识库表';
