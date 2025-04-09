-- 创建数据库
CREATE DATABASE IF NOT EXISTS chat_box_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE chat_box_db;

-- 用户表
CREATE TABLE IF NOT EXISTS `user`
(
    `id`          int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username`    varchar(50)  NOT NULL COMMENT '用户名',
    `password`    varchar(100) NOT NULL COMMENT '密码',
    `create_time` timestamp       NOT NULL COMMENT '创建时间',
    `update_time` timestamp       NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_username` (`username`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='用户表';

-- 会话表
CREATE TABLE IF NOT EXISTS `conversation`
(
    `id`          int          NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`       varchar(100) NOT NULL COMMENT '会话标题',
    `user_id`     int          NOT NULL COMMENT '用户ID',
    `create_time` timestamp       NOT NULL COMMENT '创建时间',
    `update_time` timestamp       NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='会话表';

-- 消息表
CREATE TABLE IF NOT EXISTS `message`
(
    `id`              int    NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `conversation_id` int    NOT NULL COMMENT '会话ID',
    `parent_id`       int DEFAULT NULL COMMENT '父消息ID',
    `content`         text   NOT NULL COMMENT '消息内容',
    `role`            int    NOT NULL COMMENT '角色（用户/AI）',
    `create_time`     timestamp NOT NULL COMMENT '创建时间',
    `update_time`     timestamp NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_parent_id` (`parent_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='消息表';
