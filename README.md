## 安装依赖

```bash
cnpm install --registry=http://nexus.jiucaiyun.cn:8081/repository/npm-public/
```

```next(证件打印组件)
cnpm install vue-print-nb --save
```

## 本地运行

```bash
npm run serve
---
npm run dev
```

## 线上发布

```bash
# 构建开发环境
npm run build:dev1

# 构建测试环境
npm run build:qa

# 构建生产环境
npm run build:pr

```
