# Документация на серверную часть (Backend)

---

## **Auth API**

### **POST /api/auth/register**

Создать нового пользователя.

**Request Body (JSON)**:

```json
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "Password123",
  "passwordConfirm": "Password123"
}
```

**Validations**:

* `username`: 3–50 символов
* `email`: корректный email
* `password`: 8–50 символов, минимум одна заглавная и одна строчная буква
* `passwordConfirm`: обязателен, должен совпадать с `password`

**Response (200 OK)**:

```json
{
  "userId": 1,
  "username": "JohnDoe",
  "email": "john@example.com"
}
```

---

### **POST /api/auth/login**

Авторизация пользователя и установка токенов в куки.

**Request Body (JSON)**:

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200 OK)**:

* Пустое тело, но в `Set-Cookie` добавляются:

    * `accessToken` (JWT, срок 15 минут)
    * `refreshToken` (JWT, срок 7 дней)

---

### **POST /api/auth/refresh**

Обновление токенов на основе refresh-токена.

**Cookies**:

* `refreshToken`: обязательный

**Response (200 OK)**:

* Пустое тело, но в `Set-Cookie` добавляются обновлённые `accessToken` и `refreshToken`.

**Response (401 Unauthorized)**:

```text
Refresh token is missing
```

---

### **POST /api/auth/logout**

Выход пользователя, удаление токенов из куки.

**Request**: не требует тела, токены берутся из текущего контекста SecurityContext.

**Response (200 OK)**:

* Пустое тело, куки `accessToken` и `refreshToken` очищаются.

---

## **Tasks API**

> Все эндпоинты Tasks требуют авторизации. JWT `accessToken` берётся из куки.

### **POST /api/tasks**

Создание задачи.

**Request Body (JSON)**:

```json
{
  "title": "New Task",
  "description": "Описание задачи",
  "deadline": "2025-12-31",
  "priority": "HIGH",
  "status": "TODO" // необязательный, по умолчанию TODO
}
```

**Validations**:

* `title`: 3–100 символов
* `description`: максимум 1000 символов
* `deadline`: не может быть в прошлом
* `priority`: обязательный (`LOW`, `MEDIUM`, `HIGH`)
* `status`: `TODO`, `IN_PROGRESS`, `DONE` (по умолчанию `TODO`)

**Response (200 OK)**:

```json
{
  "id": 1,
  "title": "New Task",
  "description": "Описание задачи",
  "deadline": "2025-12-31",
  "priority": "HIGH",
  "status": "TODO",
  "createdAt": "2025-11-25T14:35:00"
}
```

---

### **PUT /api/tasks/{taskId}**

Обновление задачи.

**Request Body (JSON)**:

```json
{
  "title": "Updated Task",
  "description": "Новое описание",
  "deadline": "2026-01-15",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS"
}
```

* Все поля необязательны, отправляйте только изменяемые.

**Response (200 OK)**:

```json
{
  "id": 1,
  "title": "Updated Task",
  "description": "Новое описание",
  "deadline": "2026-01-15",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  "createdAt": "2025-11-25T14:35:00"
}
```

---

### **DELETE /api/tasks/{taskId}**

Удаление задачи.

**Response (200 OK)**:

* Пустое тело

---

### **GET /api/tasks/{taskId}**

Получить задачу по ID.

**Response (200 OK)**:

```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Описание задачи",
  "deadline": "2025-12-31",
  "priority": "HIGH",
  "status": "TODO",
  "createdAt": "2025-11-25T14:35:00"
}
```

---

### **GET /api/tasks**

Получить все задачи текущего пользователя.

**Response (200 OK)**:

```json
[
  {
    "id": 1,
    "title": "Task 1",
    "description": "Описание 1",
    "deadline": "2025-12-31",
    "priority": "HIGH",
    "status": "TODO",
    "createdAt": "2025-11-25T14:35:00"
  },
  {
    "id": 2,
    "title": "Task 2",
    "description": "Описание 2",
    "deadline": "2026-01-05",
    "priority": "MEDIUM",
    "status": "IN_PROGRESS",
    "createdAt": "2025-11-26T09:12:00"
  }
]
```

---

Если хочешь, я могу сразу оформить это в готовый **Markdown-блок для `README.md`** с разделами, код-блоками и подсветкой синтаксиса. Это будет удобно скопировать прямо в репозиторий.

Хочешь, чтобы я так сделал?
