# Chat Box - AI聊天应用

这是一个基于React + Spring Boot的AI聊天应用，支持流式响应和丰富的Markdown渲染。

## ✨ 主要功能

- 🤖 **智能对话**：支持多轮对话，流式响应
- 📝 **Markdown渲染**：支持代码高亮、数学公式、表格等
- 🌓 **主题切换**：支持明暗主题
- 💾 **会话管理**：保存和管理聊天历史
- 🔧 **配置管理**：灵活的API配置

## 🛠️ Markdown支持功能

### ✅ 已支持的功能

- **标题** (H1-H6)
- **文本格式** (粗体、斜体、删除线)
- **代码块** (支持语法高亮)
- **内联代码**
- **引用块**
- **列表** (有序、无序)
- **链接**
- **数学公式** (KaTeX)
- **表格** ✨ (新修复)

### 📊 表格示例

您现在可以在聊天中使用Markdown表格：

```markdown
| 功能     | 状态      | 描述                       |
| -------- | --------- | -------------------------- |
| 表格渲染 | ✅ 已修复 | 支持完整的Markdown表格语法 |
| 代码高亮 | ✅ 正常   | 支持多种编程语言           |
| 数学公式 | ✅ 正常   | 支持LaTeX语法              |
```

### 🔧 技术实现

表格渲染使用以下技术栈：

- `react-markdown`: Markdown解析和渲染
- `remark-gfm`: GitHub风格Markdown支持
- `remark-math`: 数学公式支持
- `rehype-katex`: 数学公式渲染
- Tailwind CSS: 样式系统

## 🚀 快速开始

### 前端开发

```bash
cd web
npm install
npm run dev
```

### 后端开发

```bash
cd backend
mvn spring-boot:run
```

## 📁 项目结构

```
chat-box/
├── backend/          # Spring Boot后端
├── web/             # React前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/     # 聊天组件
│   │   │   └── demo/     # 演示组件
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🎯 演示页面

访问以下页面查看功能演示：

- `/demo` - Markdown渲染演示 (包含表格示例)
- `/sse-test` - 流式响应测试

## 📝 更新日志

### 最新更新 (v1.1.0)

- ✅ 修复Markdown表格渲染问题
- ✅ 添加`remark-gfm`插件支持
- ✅ 优化表格样式和响应式设计
- ✅ 同时支持流式渲染和常规渲染中的表格
- ✅ 添加表格hover效果和更好的视觉样式
