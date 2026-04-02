# DreamSense AI - 运行指南

## 方式一：使用批处理脚本（推荐）

1. 打开**文件资源管理器**
2. 进入 `c:\Users\wei\WorkBuddy\20260331181336\dreamsense-ai\`
3. 双击 `start.bat` 文件
4. 等待安装完成，浏览器会自动打开 http://localhost:3000

---

## 方式二：手动命令行操作

### 第1步：打开CMD
- 按 `Win + R`
- 输入 `cmd`
- 按回车

### 第2步：进入项目目录
```cmd
cd c:\Users\wei\WorkBuddy\20260331181336\dreamsense-ai
```

### 第3步：安装依赖
```cmd
npm install
```

### 第4步：填入API Key
用记事本打开 `.env` 文件，把你的 DeepSeek API Key 填进去：
```
DEEPSEEK_API_KEY=sk-你的key
```

### 第5步：初始化数据库
```cmd
npx prisma generate
npx prisma db push
```

### 第6步：启动
```cmd
npm run dev
```

### 第7步：打开浏览器
访问 http://localhost:3000

---

## 常见问题

### Q: 双击start.bat没反应？
A: 右键 start.bat → "以管理员身份运行"

### Q: npm install 报错？
A: 确保电脑联网，如果还是不行，尝试：
```cmd
npm cache clean --force
npm install
```

### Q: 端口被占用？
A: 关闭其他使用3000端口的程序，或者修改 package.json 中的 dev 脚本为 `"dev": "next dev -p 3001"`

---

## 下一步

1. 网站运行后，先去注册一个账号
2. 体验免费解梦1次
3. 如果想接入真实支付，等个体户办好后再配置Stripe