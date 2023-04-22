# vueAdmin

> 这是一个极简的 vue admin 管理后台。

## 特色功能

1. 新建相关组件可自动创建路由
2. 封装公用查询，表格，翻页组件。
3. 集成添加修改组件，传递接口，以及相关数据。
4. 封装弹窗功能，传递接口，以及相关条件。
5. 接口与mockjs共存，无后端情况可调用mockjs.
6. 权限菜单按钮级别，树形结构显示。
7. 前端路由一件同步数据库菜单，开发模式下，开发阶段展示所有菜单，线上功能路由与后端权限匹配显示。
8. 微前端，兼容vue2,vue3,angular。
9. 后端springboot mybatisplus Mysql ,
10. 后端兼容 php+mysql
11. 开发阶段配置.env.development文件配置连接后端地址。
12. 打包部署配置NGINX



## Build Setup

```bash
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来
npm install

# 启动服务
npm run dev
```

http://localhost:9528

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
