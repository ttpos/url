# 短链 Workers


### 路由定义
```
#用户端
[get]   /:page
[get]   /u/:url

#管理端
[post]  /api/url
[post]  /api/page
```

### 数据库
**links**
```
id:  自增ID
domain: 短链对应的域名
shortCode: 短链代码
url: 跳转url
expiresAt: 过期时间
isDelete: 是否软删除（0：有效，1：删除）
userId: 用户ID
```

**pages**
```
id:  自增ID
domain: 短链对应的域名
shortCode: 短链代码
userId: 用户ID
template: 页面模版
data: JSON页面数据
expiresAt: 过期时间
isDelete: 是否软删除（0：有效，1：删除）
```
**查询逻辑：**
判断 `domain` 和 `shortCode` 的组合唯一性, 检查短链接是否未过期且未被删除。
满足条件则实现跳转。

### 用户功能
- **跳转URL**
  - 用户访问短链接时，系统会根据数据库中的记录跳转到对应的 URL。
  - `t.a.app/u/url` - 跳转到指定 URL
- **展示页面**
  - 用户访问页面 ID 时，系统会展示对应的页面内容。
  - `t.a.app/id` - 访问指定页面。

### 管理功能
- **JWT 验证**
  - 管理端接口需要进行 JWT 验证，确保请求的合法性。
- **添加短码对应URL**
  - 管理员可以通过 `/api/url` 接口添加新的短链接。
- **添加页面数据**
  - 管理员可以通过 `/api/page` 接口添加新的页面数据。

### 示例请求

#### 添加短链接
```
POST /api/url
Authorization: Bearer <JWT_TOKEN>
{
  "domain": "t.a.app",
  "shortCode": "example",
  "url": "https://example.com",
  "expiresAt": "2023-12-31T23:59:59Z",
  "userId": 1
}
```
#### 添加页面数据
```
POST /api/page
Authorization: Bearer <JWT_TOKEN>
{
  "domain": "t.a.app",
  "shortCode": "example",
  "url": "https://example.com",
  "expiresAt": "2023-12-31T23:59:59Z",
  "userId": 1,
  "template": "tpl-default",
  "data": '{"name":"Your Name","age":25,"email":"yourname@example.com","website":{"github":"https://github.com/yourusername","personal":"https://yourwebsite.com"}}'
}
```
#### 安全性
 - 所有管理端接口都需要进行 JWT 验证，确保只有授权用户才能进行操作。
 - 数据库中的短链接和页面数据需要进行适当的验证和清理，防止 SQL 注入和 XSS 攻击。
