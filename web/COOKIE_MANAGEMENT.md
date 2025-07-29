# Cookie 管理功能说明

## 功能概述

本应用实现了自动化的 cookie 管理功能，主要解决以下问题：

1. **登录成功后自动保存 session cookie 到 localStorage**
2. **退出时自动删除 localStorage 中的 session cookie**
3. **所有 API 请求自动携带 session cookie**
4. **解决跨域 cookie 传递问题**

## 实现原理

### 1. 跨域 Cookie 处理

由于前端运行在 `http://localhost:5173`，后端在 `http://10.126.126.2:8080`，存在跨域问题。解决方案：

- **Vite 代理配置**：通过代理将 cookie 的 domain 和 path 修改为适用于前端域名
- **Fetch API**：使用 fetch 而不是 axios，以便获取响应头中的 Set-Cookie
- **credentials: 'include'**：确保跨域请求包含 cookie

### 2. Cookie 获取和存储

当用户登录成功后：

- 从响应头的`Set-Cookie`中提取`box-session`的值
- 如果响应头中没有，则从`document.cookie`中获取
- 将该值存储到 localStorage 中，键名为`chat-box-session`
- 同时保存用户信息和登录状态

### 3. 自动请求头添加

所有通过 axios 发送的请求都会自动：

- 从 localStorage 中读取`chat-box-session`的值
- 将该值添加到请求头的`Cookie`字段中
- 格式：`Cookie: box-session=<session_value>`

### 4. 退出时清理

当用户退出时，应用会：

- 调用服务器的登出接口
- 清除 localStorage 中的所有相关数据：
  - `chat-box-userInfo`
  - `chat-box-isLoggedIn`
  - `chat-box-session`

## 核心文件

### 1. `src/utils/api.ts`

包含 cookie 管理的工具函数：

```typescript
// 获取普通cookie
export const getCookie = (name: string): string | null

// 设置普通cookie
export const setCookie = (name: string, value: string, days?: number): void

// 删除普通cookie
export const removeCookie = (name: string): void

// 获取session cookie (从localStorage)
export const getSessionCookie = (): string | null

// 设置session cookie (到localStorage)
export const setSessionCookie = (value: string): void

// 删除session cookie (从localStorage)
export const removeSessionCookie = (): void
```

### 2. `src/store/userSlice.ts`

处理登录和登出逻辑：

- **登录成功时**：从响应头或 document.cookie 中获取并保存 session cookie
- **登出时**：清除所有本地存储的 cookie 和用户信息
- **初始状态检查**：确保只有同时存在用户信息和 session cookie 时才认为用户已登录

### 3. `vite.config.ts`

代理配置，解决跨域 cookie 问题：

```typescript
configure: (proxy) => {
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }
  });

  proxy.on('proxyRes', (proxyRes) => {
    if (proxyRes.headers['set-cookie']) {
      const cookies = proxyRes.headers['set-cookie'];
      if (Array.isArray(cookies)) {
        proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
          cookie
            .replace(/Domain=[^;]+;?/gi, 'Domain=localhost;')
            .replace(/Path=[^;]+;?/gi, 'Path=/;')
        );
      }
    }
  });
};
```

## 使用示例

### 1. 登录流程

```typescript
// 用户登录
const result = await dispatch(login({ username, password }));

// 登录成功后，session cookie会自动保存到localStorage
// 后续所有请求都会自动携带这个cookie
```

### 2. 手动管理 cookie

```typescript
import {
  getSessionCookie,
  setSessionCookie,
  removeSessionCookie,
} from '../utils/api';

// 获取session cookie
const session = getSessionCookie();

// 设置session cookie
setSessionCookie('your-session-value');

// 删除session cookie
removeSessionCookie();
```

### 3. 查看 cookie 状态

使用`CookieStatus`组件可以实时查看 cookie 状态：

```typescript
import CookieStatus from '../components/common/CookieStatus';

// 在页面中使用
<CookieStatus />;
```

## 调试方法

### 1. 浏览器开发者工具

1. 打开开发者工具的 Console 标签
2. 登录后查看控制台输出的调试信息
3. 在 Application 标签中查看 localStorage 和 cookie

### 2. 网络请求检查

1. 打开开发者工具的 Network 标签
2. 登录时查看请求和响应头
3. 检查 Set-Cookie 头是否正确传递
4. 检查后续请求是否包含 Cookie 头

### 3. 代码调试

登录成功后，控制台会输出详细的 cookie 状态信息：

```
=== 登录成功，Cookie状态检查 ===
localStorage中的session cookie: [session值]
document.cookie: [所有cookie]
用户信息: [用户信息JSON]
登录状态: true
```

## 注意事项

1. **跨域问题**：确保 vite 代理配置正确，解决跨域 cookie 传递
2. **安全性**：session cookie 存储在 localStorage 中，确保在 HTTPS 环境下使用
3. **兼容性**：所有现代浏览器都支持 localStorage
4. **清理**：退出时会自动清理所有相关数据，无需手动处理
5. **错误处理**：即使登出请求失败，本地存储也会被清理

## 故障排除

### 1. 登录后 cookie 没有保存

检查：

- 浏览器控制台的调试信息
- 网络请求的响应头中是否包含 Set-Cookie
- vite 代理配置是否正确
- 后端是否正确设置了 cookie

### 2. 请求没有携带 cookie

检查：

- localStorage 中是否存在`chat-box-session`
- 请求拦截器是否正常工作
- 网络请求的请求头中是否包含 Cookie 字段

### 3. 跨域问题

检查：

- vite.config.ts 中的代理配置
- 后端是否设置了正确的 CORS 头
- cookie 的 domain 和 path 设置

## 测试步骤

1. 启动开发服务器：`npm run dev`
2. 打开浏览器开发者工具
3. 访问登录页面并登录
4. 查看控制台的调试信息
5. 检查 localStorage 中是否有`chat-box-session`
6. 发送一个 API 请求，检查请求头中是否包含 Cookie
7. 退出登录，检查 localStorage 中的数据是否被清除
