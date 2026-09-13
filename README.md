# 个人工具箱

纯前端开发者小工具站，适合 DOM Cloud 免费档静态托管。数据只在浏览器本地处理，不上传服务器。

## 内含工具

- JSON 格式化 / 压缩
- Base64 编码解码
- URL 编码解码
- UUID 生成
- 时间戳转换
- MD5 / SHA256
- JWT 解析
- 文本 Diff
- 正则测试
- Cron 表达式预览

## 本地预览

用任意静态服务器打开 `public_html`，例如：

```bash
npx --yes serve public_html
```

或直接用浏览器打开 `public_html/index.html`。

## 部署到 DOM Cloud（GitHub 推送）

### 1. 创建站点并关联仓库

1. 登录 [DOM Cloud](https://my.domcloud.co/user/)
2. 新建网站（Static / HTML）
3. 在站点 **Deploy** 里连接你的 GitHub 仓库（按提示添加 Deploy Key）
4. 首次部署可粘贴仓库根目录的 `domcloud.yml` 内容执行

仓库目录约定：站点文件在 `public_html/`，NGINX root 指向它。

### 2. 配置 GitHub Actions 自动部署

1. 在 DOM Cloud 站点 Deploy 页点击 **Setup Webhook**，复制给出的 Secret / Auth
2. 在 GitHub 仓库 → Settings → Secrets and variables → Actions 添加：
   - `WEBHOOK_SECRET`
   - `WEBHOOK_AUTH`
3. 推送 `main`（或 `master`）分支后，`.github/workflows/domcloud.yml` 会触发服务器 `git pull` 并应用 `domcloud.yml`

若控制台生成的 workflow 命令与本仓库不一致，以 DOM Cloud 弹窗里的 YAML 为准，替换本仓库 workflow 即可。

### 3. 日常更新

```bash
git add .
git commit -m "update tools"
git push
```

推送成功后站点会自动同步。

## 说明

- 免费档无 Docker、无常驻进程；本站纯静态，完全适配
- 记得每约 60 天登录一次 DOM Cloud，避免免费账号过期
- JWT 工具只解码，不校验签名
