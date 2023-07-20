# vueAdmin

> 这是一个极简的 vue admin 管理后台。

## 特色功能

1. 新建相关组件可自动创建路由
2. 封装公用查询，表格，翻页组件。
3. 集成添加修改组件，传递接口，以及相关数据。
4. 封装弹窗功能，传递接口，以及相关条件。
5. 接口与mockjs共存，无后端情况可调用mockjs.
6. 权限菜单按钮级别 v-permission="['自定义字段']"，树形结构显示。
7. 前端路由一件同步数据库菜单，开发模式下，开发阶段展示所有菜单，线上功能路由与后端权限匹配显示。
9. 后端springboot mybatisplus Mysql
10. 后端兼容 php+mysql
11. 开发阶段配置.env.development文件配置连接后端地址。
12. 打包部署配置NGINX
13. 实现拖拽排序功能
14. 导入，导出文件

## 项目启动

1. 安装依赖

    ```bash
    npm install
    ```

2. 启动运行

    ```bash
    npm run dev
    ```



## 发布
生成的静态文件位于项目根目录 `dist` 文件夹下

```bash
# 构建测试环境
npm run build
```

## 访问

```bash
# 访问地址
http://localhost:9528
```
```bash
# 访问用户名
admin
```
```bash
# 访问密码
admin
```

## 接口配置

```bash
# 修改文件
.env.development
```


# 接口访问
访问端口根据实际调整

java接口访问
```bash
# 图片转换后的真实地址  java转换地址
VUE_APP_UPLOAD_URL = 'http://localhost:8088/public'
# 需要映射到的后台接口地址
VUE_APP_BASE_URL = 'http://localhost:8088'
```
php接口访问
```bash
# 图片转换后的真实地址  php转换地址
 VUE_APP_UPLOAD_URL = 'http://localhost:80/public'
# 需要映射到的后台接口地址
 VUE_APP_BASE_URL = 'http://localhost:80/index.php'
```

