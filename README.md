# 村长实验室 / Cunzhang Lab

> 探索 AI 工具、开源项目与互联网技术实践，记录真实测试、部署过程和数字生产力探索。

个人技术实验基地和项目展示中心。

## 技术栈

- **框架**: [Astro](https://astro.build) v6
- **UI**: React 19 + Tailwind CSS
- **动画**: Three.js
- **部署**: Cloudflare Pages / Vercel

## 项目结构

```
src/
├── content/
│   └── projects/        # 项目数据 (Markdown)
├── components/          # 页面组件
├── layouts/             # 布局模板
├── React/               # React 交互组件
└── pages/               # 页面入口
```

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## 部署

### Vercel

1. 打开 [Vercel](https://vercel.com)，用 GitHub 账号登录
2. 点击 **Add New → Project**，导入本仓库
3. **Framework Preset** 选择 **Astro**
4. **Root Directory** 保持默认 `./`
5. **Build and Output Settings** 无需修改（默认值自动适配 Astro）
6. 点击 **Deploy**，等待部署完成
7. 部署完成后可在 Vercel 仪表盘绑定自定义域名

### Cloudflare Pages

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 **Workers & Pages**
2. 点击 **Create → Pages → Connect to Git**，授权 GitHub 并选择本仓库
3. **Framework preset** 选择 **Astro**
4. **Build command**: `pnpm build`
5. **Build output directory**: `dist`
6. 点击 **Save and Deploy**，等待部署完成
7. 部署完成后可在 Pages 项目设置中绑定自定义域名

---

## 赞助

如果你觉得这个项目有用，欢迎赞助支持：

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="public/assets/wx_icon.png" width="24" height="24" alt="微信"/><br/>
        <strong>微信赞赏</strong><br/>
        <img src="public/assets/wechat.png" width="200" alt="微信收款码"/>
      </td>
      <td align="center">
        <img src="public/assets/bep_icon.png" width="24" height="24" alt="USDT"/><br/>
        <strong>USDT (BEP20)</strong><br/>
        <img src="public/assets/bep20.png" width="200" alt="USDT BEP20收款码"/>
      </td>
    </tr>
  </table>
</div>

## 开源协议

本项目基于 [MIT License](LICENSE) 开源。

Copyright © 2026 Web3村长
