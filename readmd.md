# Bundle Rocket CLI tool

## 配置

1. 全局配置

    全局配置中包括基础信息和敏感的用户登陆信息

    基础信息包括：

    1. user name
    2. user email

    登录信息：

    以 <registry-url>: <access-token> 的格式储存在 `servers` 字段中

    示例：

    ```json
    {
        "name": "leon",
        "email": "ludafa@outlook.com",
        "servers": {
            "http://localhost:8080": "asdlfkjadlkfjl"
        }
    }
    ```

2. 项目配置

    项目配置中包括项目的基本信息，比如

    1. name
    2. author
    3. email

## 命令

### 用户相关

+ br register

    在服务器端生成一个账号

+ br login

    在本地的全局配置中添加 access token

+ br logout

    清除本地全局配置中的 access token

### 配置

+ br config set <config-name> <config-value>
+ br config get <config-name>
+ br config delete <key>
+ br config list

### 项目相关

+ br init

    生成一个标准的项目配置

+ br publish

    将项目的一个版本发布到服务器

    > 此时 bundle 并没有被推送到用户；如果需要推送，请使用 br deploy

+ br unpublish

    将项目的一个版本从服务器删除

    > 如果一个版本被删除了，那么这个版本不再可用。同时，也不能重新发布相同的版本；必须新增一个 SemVer 版本号

+ br download <app-name>@<version>

    下载项目的一个版本

+ br view <name>[@version]

    显示项目的详情

+ br deploy <version>

    将项目版本推送给用户
