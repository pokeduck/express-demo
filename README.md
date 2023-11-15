# Express User CRUD

- 此專案為利用 express 與 node js
  以 RESTful API 實現會員系統的 CRUD 操作。
- 會員資料處存在 mysql 。
- refresh token 儲存在 redis ，利用 TTL 自動刪除 token。

- 每一支 API 的 Response 都會包固定格式的 JSON 中，當成功 `success` 會是 `true` ，反之亦然， `data` 欄位則是 nullable。
- API Success JSON：

```json
{
  "success": true,
  "data": {
    "accessToken": "new token",
    "refreshToken": "new token"
  }
}
```

- 當 API 失敗會回傳一組自定義的 error object 在 response body 之中，包含 `code` 與 `message`
- API Fail JSON:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "999",
    "message": "/api/v2/user/apiapi not found"
  }
}
```

## Feature

#### 1. 會員登入

- Request:

```http
POST /api/v2/user/signIn
Accept: application/json

{
    "email":"033@test.com",
    "password": "password"
}
```

- Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "data": {
        "id": 185,
        "uid": "20231025100185",
        "userName": "u21",
        "email": "033@test.com",
        "accessToken": "new access token",
        "refreshToken": "new refresh token",
        "isEmailVerified": false
    }
}

```

#### 2. 會員註冊

- Request:

```http
POST /api/v2/user/signUp
Accept: application/json

{
    "userName": "u40",
    "email": "040@test.com",
    "password": "123"
}
```

- Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "data": {
        "id": 192,
        "uid": "20231116100192",
        "userName": "u40",
        "email": "040@test.com",
        "accessToken": "new token",
        "isEmailVerified": false
    }
}

```

#### 3. 會員資料

- Request:

```http
GET /api/v2/user/profile
Host: example.com
Accept: application/json
Authorization: Bearer your_access_token

```

- Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "data": {
        "id": 192,
        "uid": "20231116100192",
        "userName": "u40",
        "email": "040@test.com",
        "accessToken": "new token",
        "isEmailVerified": false
    }
}

```

#### 4. 修改會員資料

#### 5. 更新 Access Token

- Request:

```http
POST /api/v2/user/token
Accept: application/json
Authorization: Bearer your_access_token

{
    "refreshToken":"{{refresh_token}}"
}
```

- Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "data": {
        "accessToken": "new access token",
        "refreshToken": "new refresh token"
    }
}

```

#### 6. 發送會員驗證信

由於此專案沒有串接 SMTP 服務，模擬發送信件功能是利用 Ethereal，Resposne 會包含一組 Ethereal 的連結，代表模擬的一封信，信件內文就是驗證 email 的連結。

- Request:

```http
POST /api/v2/user/sendVerifyEmail
Accept: application/json
Authorization: Bearer your_access_token

```

- Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "data": {
        "etherealLink": "https://ethereal.email/message/newLink"
    }
}
```

- 若是已驗證過的會員，Response 則會失敗

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "data": null,
    "error": {
        "code": "ERROR_MAIL_01",
        "message": "The email has previously been successfully validated."
    }
}
```

#### 7. 驗證會員驗證信

- Request:

```http
GET /api/v2/user/verifyEmailToken?token=token_from_email_link
Accept: application/json

```

- Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "data": null
}

```

#### 8. 發送重設密碼信

#### 9. 驗證重設密碼信

#### 10. 更改密碼

## 相依套件

1. bcrypt
1. cookie
1. cookie-parser
1. cors
1. csrf-csrf"
1. dotenv
1. ejs
1. express
1. express-jwt
1. express-session
1. express-validator
1. jsonwebtoken
1. lodash-es
1. mysql2
1. nodemailer
1. redis
1. sequelize
1. uuid
