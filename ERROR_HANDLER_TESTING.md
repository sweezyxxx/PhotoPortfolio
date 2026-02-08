# 🧪 Тестирование Error Handler

## Способы тестирования

### 1. ✅ Через страницу регистрации (САМЫЙ ПРОСТОЙ)

#### Тест: Validation Error
1. Откройте `http://localhost:3000/register.html`
2. Введите короткий username: `ab`
3. Email: `test@test.com`
4. Password: `123456`
5. Нажмите "Create account"

**Ожидаемый результат:**
```
❌ Username must be at least 3 characters long
```

#### Тест: Invalid Email
1. Username: `john`
2. Email: `notanemail`
3. Password: `123456`
4. Нажмите "Create account"

**Ожидаемый результат:**
```
❌ Please provide a valid email address
```

#### Тест: Short Password
1. Username: `john`
2. Email: `test@test.com`
3. Password: `123`
4. Нажмите "Create account"

**Ожидаемый результат:**
```
❌ Password must be at least 6 characters long
```

#### Тест: Duplicate Email (после успешной регистрации)
1. Зарегистрируйте пользователя с правильными данными
2. Попробуйте зарегистрироваться снова с тем же email
3. **Ожидаемый результат:**
```
❌ Email already exists
```

---

### 2. 🔧 Через консоль браузера (F12)

Откройте консоль браузера (F12) и выполните:

#### Тест: Validation Error
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'ab',  // Слишком короткий
    email: 'test@test.com',
    password: '123456'
  })
})
.then(r => r.json())
.then(console.log);
```

**Ожидаемый ответ:**
```json
{
  "success": false,
  "message": "Username must be at least 3 characters long"
}
```

#### Тест: Invalid JSON (Server Error)
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: 'invalid json'
})
.then(r => r.json())
.then(console.log);
```

#### Тест: Invalid Token (JWT Error)
```javascript
fetch('http://localhost:5000/api/users/profile', {
  method: 'GET',
  headers: { 
    'Authorization': 'Bearer invalid_token_here'
  }
})
.then(r => r.json())
.then(console.log);
```

**Ожидаемый ответ:**
```json
{
  "success": false,
  "message": "Invalid token. Please log in again"
}
```

#### Тест: No Token (Unauthorized)
```javascript
fetch('http://localhost:5000/api/users/profile', {
  method: 'GET'
})
.then(r => r.json())
.then(console.log);
```

**Ожидаемый ответ:**
```json
{
  "message": "No token"
}
```

#### Тест: Invalid Photo ID (CastError)
```javascript
fetch('http://localhost:5000/api/photos/invalid-id-format')
.then(r => r.json())
.then(console.log);
```

**Ожидаемый ответ:**
```json
{
  "success": false,
  "message": "Invalid _id: invalid-id-format"
}
```

---

### 3. 📡 Через Postman (если установлен)

#### Тест 1: Validation Error
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Body (JSON):**
```json
{
  "username": "ab",
  "email": "test@test.com",
  "password": "123456"
}
```

#### Тест 2: Invalid Email Format
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Body (JSON):**
```json
{
  "username": "john",
  "email": "notanemail",
  "password": "123456"
}
```

#### Тест 3: Unauthorized Access
- **Method:** GET
- **URL:** `http://localhost:5000/api/users/profile`
- **Headers:** (без Authorization)

#### Тест 4: Invalid Token
- **Method:** GET
- **URL:** `http://localhost:5000/api/users/profile`
- **Headers:**
  - `Authorization: Bearer fake_invalid_token`

---

### 4. 🖥️ Проверка в консоли сервера (Terminal)

Когда происходит ошибка, в терминале где запущен `node app.js` вы должны увидеть:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Error: ValidationError
📝 Message: Username must be at least 3 characters long
📍 Status: 400
📚 Stack trace:
Error: ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Это работает только если `NODE_ENV=development` (по умолчанию).

---

## Типы ошибок которые обрабатываются

| Тип ошибки | Status Code | Пример |
|------------|-------------|---------|
| ValidationError | 400 | Неправильные данные (короткий username) |
| Duplicate Key (11000) | 400 | Email уже существует |
| CastError | 400 | Неправильный формат MongoDB ID |
| JsonWebTokenError | 401 | Неправильный JWT токен |
| TokenExpiredError | 401 | Истекший JWT токен |
| General Error | 500 | Другие непредвиденные ошибки |

---

## ⚡ Быстрый тест (РЕКОМЕНДУЕТСЯ)

**Самый простой способ:**

1. Откройте `http://localhost:3000/register.html`
2. Введите: username=`ab`, email=`test@test.com`, password=`123`
3. Нажмите "Create account"
4. Вы должны увидеть красное сообщение: **"Username must be at least 3 characters long"**
5. Проверьте терминал сервера - там должен быть красивый лог ошибки с эмодзи

Готово! ✅
