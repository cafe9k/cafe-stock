# Railpack 部署指南

本项目已针对 Railpack 构建进行了优化配置。

## 什么是 Railpack

Railpack 是 Railway 开发的零配置应用构建工具，相比传统构建方式具有以下优势：
- 镜像体积减少高达 75%
- 构建速度提升高达 5 倍
- 更高的缓存命中率

## 项目配置

### 1. 配置文件

- `railpack.toml`: Railpack 主配置文件
- `.railpackignore`: 排除不需要的文件
- `Dockerfile`: 自定义容器化配置（可选）
- `.dockerignore`: Docker 构建优化

### 2. 环境变量

支持以下 Railpack 环境变量：

- `BUILD_CMD`: 自定义构建命令（默认：npm run build）
- `START_CMD`: 自定义启动命令（默认：npm start）
- `PACKAGES`: 安装额外的 Mise 包
- `BUILD_APT_PACKAGES`: 构建时安装额外的 Apt 包
- `DEPLOY_APT_PACKAGES`: 在最终镜像中安装额外的 Apt 包

### 3. Next.js 优化

项目已配置以下优化：
- `output: 'standalone'`: 容器化部署优化
- `compress: true`: 启用压缩
- `poweredByHeader: false`: 移除 X-Powered-By 头
- `generateEtags: false`: 禁用 ETag 生成
- `optimizeCss: true`: CSS 优化

## 部署方式

### 1. Railway 部署

1. 连接 GitHub 仓库到 Railway
2. 在服务设置中启用 Railpack
3. 部署将自动使用 Railpack 构建

### 2. 本地测试

```bash
# 安装 Railpack
curl -sSL https://railpack.com/install.sh | sh

# 构建镜像
railpack build .

# 运行容器
docker run -p 3000:3000 <image-name>
```

### 3. 使用 Docker

```bash
# 构建镜像
docker build -t foxsay-stock .

# 运行容器
docker run -p 3000:3000 foxsay-stock
```

## 健康检查

应用提供健康检查端点：`/api/health`

返回示例：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "0.1.0"
}
```

## 性能优化建议

1. **启用缓存**: Railpack 自动处理构建缓存
2. **镜像优化**: 使用多阶段构建减少镜像大小
3. **静态资源**: 考虑使用 CDN 托管静态资源
4. **监控**: 使用健康检查端点进行应用监控

## 故障排除

### 构建失败
- 检查 Node.js 版本是否满足要求（>=18.0.0）
- 确认所有依赖都在 package.json 中声明
- 查看构建日志中的错误信息

### 运行时问题
- 检查环境变量配置
- 确认端口 3000 未被占用
- 查看容器日志：`docker logs <container-id>`

## 更多信息

- [Railpack 官方文档](https://railpack.com)
- [Railway 部署指南](https://docs.railway.com)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)