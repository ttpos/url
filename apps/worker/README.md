# 短链 Workers

简单且高效的URL短链接生成器。

### 路由定义

```
#用户端
[get]   /:shortCode
[get]   /:page

#管理端
[post]  /api/url
[post]  /api/page
```

### 数据库

- **links**

```
id:         自增ID
url:        短链对应的URL
userId:     用户ID
expiresAt:  过期时间
isDelete:   是否软删除 (0：有效，1：删除)
hash:       短链的唯一哈希值
attribute:  其他属性（可选）
```

- **pages**

```
id:         自增ID
userId:     用户ID
template:   页面模板
data:       JSON页面数据
expiresAt:  过期时间
isDelete:   是否软删除 (0：有效，1：删除)
hash:       页面内容的唯一哈希值
attribute:  其他属性（可选）
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

#### 获取短链接

```
# 新增查询条件，`isDelete === 1` 查询软删除短链，反之则查询未删除的短链，不传则查询全部短链
GET /api/url?isDelete=0
Authorization: Bearer <JWT_TOKEN>

```

#### 添加短链接

```
POST /api/url
Authorization: Bearer <JWT_TOKEN>
{
  "records": [
    {
      "url": "https://github.com/WuChenDi",
      "expiresAt": null,
      "hash": "9f107092ed964425905f8988d0c6c91a527b1208949d767127f9b9aef43b39f8", // abc123
      "userId": "",
      "attribute": null
    },
    {
      "url": "https://bit.ly/m/wuchendi",
      "expiresAt": null,
      "hash": "9408302e74814cd63eba18ff04fcdd98400649bb472f4db854552f60acc09bed", // def456
      "userId": "",
      "attribute": null
    }
  ]
}

```

#### 更新短链接

```
PUT /api/url
Authorization: Bearer <JWT_TOKEN>
{
  "records": [
    {
      "hash": "00d0cd517ab6c87a7b762e20277bcad757ba77c99ede7bf125efacbfd73a1437", // abc123
      "url": "https://github.com/WuChenDi",
      "expiresAt": 1725447858000,
      "userId": "wudi",
      "attribute": null
    },
    {
      "hash": "cfc7f4f37363737dce099da790020aa53c1ab3dcfa173971765c6000f9f9ec84", // def456
      "url": "https://bit.ly/m/wuchendi",
      "expiresAt": 1725534258000,
      "userId": "wudi",
      "attribute": null
    }
  ]
}

```

#### 删除短链接

```
DELETE /api/url
Authorization: Bearer <JWT_TOKEN>
{
  "hashList": [
    // "00d0cd517ab6c87a7b762e20277bcad757ba77c99ede7bf125efacbfd73a1437",
    "abc123"
  ]
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
