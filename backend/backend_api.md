# 后端接口文档

## 用户认证模块

### 1. 用户登录

- **功能描述**: 通过账号密码登录，获取用户基本信息
- **请求路径**: `/api/login`
- **请求方法**: POST
- **请求参数**:
    - `username` (表单参数, 必填)
    - `password` (表单参数, 必填)
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": {
    "userId": 1,
    "userName": "admin"
  }
}
```

### 2. 用户登出

- **功能描述**: 退出登录状态
- **请求路径**: `/api/logout`
- **请求方法**: GET
- **请求参数**: 无
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": "ok"
}
```

### 3. 用户注册

- **功能描述**: 注册新用户
- **请求路径**: `/api/register`
- **请求方法**: POST
- **请求参数**:
    - `username` (表单参数, 必填)
    - `password` (表单参数, 必填)
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": 1 // 注册成功的用户ID
}
```

---

## 聊天管理模块

### 1. 创建新对话

- **功能描述**: 创建一个新的空白对话
- **请求路径**: `/api/conversation/new`
- **请求方法**: POST
- **请求参数**: 无
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": {
    "id": 1,
    "title": "新建对话"
  }
}
```

### 2. 获取对话详情

- **功能描述**: 获取指定对话的详细信息
- **请求路径**: `/api/conversation/detail/{chatId}`
- **请求方法**: GET
- **请求参数**:
    - `chatId` (路径参数, 必填) - 对话ID
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": {
    "id": 1,
    "title": "对话标题",
    "messages": [
      {
        "role": "user",
        "content": "用户消息内容"
      },
      {
        "role": "assistant",
        "content": "AI回复内容"
      }
    ]
  }
}
```

### 3. 获取对话列表

- **功能描述**: 获取当前用户的所有对话概要
- **请求路径**: `/api/conversation/list`
- **请求方法**: GET
- **请求参数**: 无
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": [
    {
      "id": 1690337288,
      "title": "对话标题"
    }
  ]
}
```

### 4. 更新对话信息

- **功能描述**: 修改对话标题等基本信息
- **请求路径**: `/api/conversation/update/info`
- **请求方法**: POST
- **请求参数** (请求体):

```JSON
{
  "id": 1690337288,  // 必填，要修改的对话ID
  "title": "新标题"  // 新标题
}
```
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": "ok"
}
```

### 5. 更新对话消息

- **功能描述**: 保存对话的消息内容
- **请求路径**: `/api/conversation/update`
- **请求方法**: POST
- **请求参数** (请求体):
    - 对话更新请求对象 (ChatUpdateReq)
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": "ok"
}
```

### 6. 删除对话

- **功能描述**: 删除指定对话记录
- **请求路径**: `/api/conversation/delete/{id}`
- **请求方法**: GET
- **请求参数**:
    - `id` (路径参数, 必填) - 要删除的对话ID
- **响应体**:

```JSON
{
  "status": {
    "code": 0,
    "msg": "OK"
  },
  "data": "ok"
}
```

---

## AI 对话模块

### 1. 流式多轮对话

- **功能描述**: 进行流式响应的多轮对话
- **请求路径**: `/api/agent/conversation`
- **请求方法**: POST
- **请求参数** (请求体):

```JSON
{
  "chatId": 1690337288,  // 必填，关联的对话ID
  "messageList": [
    {"role": "user", "content": "如何学习React？"},
    {"role": "assistant", "content": "建议从官方文档开始..."}
  ],  // 当前会话所有消息
  "modelConfig": {
    "apiUrl": "https://api.openai.com/v1",
    "apiKey": "sk-xxxx",
    "modelName": "gpt-3.5-turbo",
    "modelParams": {
      "temperature": 0.7,
      "topP": 0.9,
      "maxTokens": 2000
    }
  },
  "toolList": ["web_search", "code_interpreter"] // 可选，使用的工具列表
}
```
- **返回值**: SSE流式响应 (`SseEmitter`)

### 2. 记忆对话接口

- **功能描述**: 带记忆上下文的持续对话
- **请求路径**: `/api/agent/conversation/memory/{sessionId}`
- **请求方法**: POST
- **请求参数**:
    - `sessionId` (路径参数) - 会话ID
- **请求体**:

```JSON
{
  "chatId": 1690337288,  // 必填，关联的对话ID
  "message": "你好，请问如何使用React Hooks?", // 单条用户消息
  "modelConfig": {
    "apiUrl": "https://api.openai.com/v1",
    "apiKey": "sk-xxxx",
    "modelName": "gpt-3.5-turbo",
    "modelParams": {
      "temperature": 0.7,
      "topP": 0.9,
      "maxTokens": 2000
    }
  },
  "toolList": ["web_search"] // 可选，使用的工具列表
}
```
- **返回值**: SSE流式响应 (`SseEmitter`)

### 3. 文件对话接口

- **功能描述**: 支持文件上传的对话接口
- **请求路径**: `/api/agent/conversation/file`
- **请求方法**: POST
- **请求参数**:

```JSON
{
  // 同流式对话参数
  "file": "base64string" // 文件内容（根据实现可能不同）
}
```
- **返回值**: SSE流式响应 (`SseEmitter`)

---

## 通用说明

1. **响应格式**:

    所有接口统一返回 `ResVo<T>` 格式：

```JSON
{
  "code": 0,     // 状态码 (0=成功)
  "msg": "string", 
  "data": T      // 业务数据
}
```
2. **时间字段处理**:
    - `createTime`/`updateTime` 字段均由后端自动生成，请求时不需要传递
    - 新建操作不需要传 `id`，更新操作必须传 `id`
3. **错误处理**:
    - 非200的code值表示操作失败，msg字段会包含错误详情
4. **安全要求**:
    - 除登录/注册接口外，其他接口需要携带有效的身份验证Token