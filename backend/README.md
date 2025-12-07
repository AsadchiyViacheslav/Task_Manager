# Документация на серверную часть (Backend)

---

## **Auth API**

### **POST /api/auth/register**

Создать нового пользователя.

**Request Body (JSON)**:

```json
{
  "username": "slava",
  "email": "test@test.ru",
  "password": "Password",
  "passwordConfirm": "Password"
}
```

**Validation**:

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

**Ошибка**:

```json
{
  "error": "Пользователь с текущим email уже существует",
  "timestamp": "2025-12-06T16:27:48.438702672",
  "status": 400,
  "path": "/api/auth/register"
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

**Ошибка**
```json
{
    "error": "Неправильная почта или пароль",
    "timestamp": "2025-12-06T16:25:29.972153096",
    "status": 401,
    "path": "/api/auth/login"
}
```
---

### **POST /api/auth/refresh**

Обновление токенов на основе refresh-токена.

**Cookies**:

* `refreshToken`: обязательный

**Response (200 OK)**:

* Пустое тело, но в `Set-Cookie` добавляются обновлённые `accessToken` и `refreshToken`.

**Ошибка**:

```json
{
  "error": "Время сессии закончилось",
  "status": 401,
  "timestamp": "2025-12-06T16:26:58.582147775"
}
```

---

### **POST /api/auth/logout**

Выход пользователя, удаление токенов из куки.

**Request**: не требует тела, токены берутся из текущего контекста SecurityContext.

**Response (200 OK)**:

* Пустое тело, куки `accessToken` и `refreshToken` очищаются.

---

## **Tasks API**

### **POST /api/tasks**

Создать новую задачу.

**Request Body (JSON)**:

```json
{
  "title": "Купить продукты",
  "description": "Список: молоко, хлеб, сыр",
  "deadline": "2025-12-10",
  "priority": "HIGH",
  "status": "TODO" // по умолчанию TODO
}
```

**Validation**:

* `title`: 3–100 символов, обязателен
* `description`: до 1000 символов
* `deadline`: формат `yyyy-MM-dd`, дата не в прошлом
* `priority`: обязателен (`LOW`, `MEDIUM`, `HIGH`)
* `status`: необязательно (`TODO`, `IN_PROGRESS`, `DONE`)

**Response (200 OK)**:

```json
{
  "id": 12,
  "title": "Купить продукты",
  "description": "Список: молоко, хлеб, сыр",
  "deadline": "2025-12-10",
  "priority": "HIGH",
  "status": "TODO",
  "createdAt": "2025-12-06T13:10:22.125481",
  "photoPath": null,
  "subTasks": []
}
```

**Ошибка**:

```json
{
  "error": "Данная дата уже прошла",
  "timestamp": "2025-12-07T07:14:57.386149877",
  "status": 400,
  "path": "/api/tasks"
}
```

---

### **PUT /api/tasks/{taskId}**

Обновить существующую задачу.

**Request Body (JSON)**:

```json
{
  "title": "Обновлённый заголовок",
  "description": "Новое описание",
  "deadline": "2025-12-20",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS"
}
```

**Response (200 OK)**:

```json
{
  "id": 12,
  "title": "Обновлённый заголовок",
  "description": "Новое описание",
  "deadline": "2025-12-20",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  "createdAt": "2025-12-06T13:10:22.125481",
  "photoPath": "/uploads/photo123.jpg",
  "subTasks": []
}
```

**Ошибка**:

```json
{
  "error": "Задача не найдена",
  "timestamp": "2025-12-06T17:06:11.228374",
  "status": 404,
  "path": "/api/tasks/12"
}
```

---

### **DELETE /api/tasks/{taskId}**

Удалить задачу пользователя.

**Response (200 OK)**:

Пустое тело.

**Ошибка**:

```json
{
  "error": "Доступ запрещён",
  "timestamp": "2025-12-06T17:08:42.772814",
  "status": 403,
  "path": "/api/tasks/12"
}
```

---

### **GET /api/tasks/{taskId}**

Получить задачу по её ID.

**Response (200 OK)**:

```json
{
  "id": 1,
  "title": "TASK2",
  "description": "Description",
  "deadline": "2026-01-10",
  "priority": "HIGH",
  "status": "TODO",
  "createdAt": "2025-12-06T08:42:33.210953",
  "photoPath": "/api/files/6f56949a-499f-48b5-afd3-8c888041232b_photo1.jpg",
  "subTasks": [
    {
      "id": 1,
      "description": "Пример подзадачи 2",
      "completed": false
    },
    {
      "id": 2,
      "description": "Пример подзадачи 2",
      "completed": false
    }
  ]
}
```

**Ошибка**:

```json
{
  "error": "Задача не найдена",
  "timestamp": "2025-12-06T17:09:32.125771",
  "status": 404,
  "path": "/api/tasks/12"
}
```

---

### **GET /api/tasks**

Получить все задачи пользователя.

**Response (200 OK)**:

```json
[
  {
    "id": 2,
    "title": "TASK2",
    "description": "Description",
    "deadline": "2026-01-10",
    "priority": "HIGH",
    "status": "TODO",
    "createdAt": "2025-12-06T08:42:34.297927",
    "photoPath": null,
    "subTasks": []
  },
  {
    "id": 1,
    "title": "Updated",
    "description": "Updated desc",
    "deadline": "2026-01-20",
    "priority": "LOW",
    "status": "IN_PROGRESS",
    "createdAt": "2025-12-06T08:42:33.210953",
    "photoPath": "/api/files/6f56949a-499f-48b5-afd3-8c888041232b_photo1.jpg",
    "subTasks": [
      {
        "id": 1,
        "description": "Пример подзадачи 2",
        "completed": false
      },
      {
        "id": 2,
        "description": "Пример подзадачи 2",
        "completed": false
      }
    ]
  }
]
```

---

## **SubTasks API**

### **POST /api/tasks/{taskId}/subtasks**

Создать подзадачу.

**Request Body (JSON)**:

```json
{
  "description": "Купить молоко"
}
```

**Response (200 OK)**:

```json
{
  "id": 5,
  "description": "Купить молоко",
  "completed": false
}
```

**Ошибка**:

```json
{
  "error": "Задача не найдена",
  "timestamp": "2025-12-07T07:21:07.329983994",
  "status": 404,
  "path": "/api/tasks/5/subtasks"
}
```

---

### **PUT /api/tasks/{taskId}/subtasks/{subTaskId}**

Обновить подзадачу.

**Request Body (JSON)**:

```json
{
  "description": "Купить молоко и хлеб",
  "completed": true
}
```

**Response (200 OK)**:

```json
{
  "id": 5,
  "description": "Купить молоко и хлеб",
  "completed": true
}
```

**Ошибка**:

```json
{
  "error": "Подзадача не найдена",
  "timestamp": "2025-12-06T17:12:31.177284",
  "status": 404,
  "path": "/api/tasks/12/subtasks/5"
}
```

---

### **DELETE /api/tasks/{taskId}/subtasks/{subTaskId}**

Удалить подзадачу.

**Response (200 OK)**:

Пустое тело.

**Ошибка**:

```json
{
  "error": "Доступ запрещён",
  "timestamp": "2025-12-06T17:13:52.882188",
  "status": 403,
  "path": "/api/tasks/12/subtasks/5"
}
```

---

### **GET /api/tasks/{taskId}/subtasks/{subTaskId}**

Получить подзадачу по ID.

**Response (200 OK)**:

```json
{
  "id": 5,
  "description": "Купить молоко",
  "completed": false
}
```

---

### **GET /api/tasks/{taskId}/subtasks**

Получить все подзадачи задачи.

**Response (200 OK)**:

```json
[
  {
    "id": 1,
    "description": "Пример подзадачи 2",
    "completed": false
  },
  {
    "id": 2,
    "description": "Пример подзадачи 2",
    "completed": false
  }
]
```

---

## **Photo API**

### **POST /api/tasks/{taskId}/photo**

Загрузить фотографию к задаче. Если у задачи уже есть фото оно удалится

**Request (multipart/form-data)**:

* `file`: обязательный

**Response (200 OK)**:

```json
"/uploads/task_12_photo.png"
```

**Ошибка (файл отсутствует)**:

```json
{
  "error": "Файл обязателен",
  "status": 400,
  "timestamp": "2025-12-06T17:20:48.124112"
}
```

---

### **DELETE /api/tasks/{taskId}/photo**

Удалить фотографию задачи.

**Response (200 OK)**:

Пустое тело.

**Ошибка**

```json
{
  "error": "Задача не найдена",
  "timestamp": "2025-12-06T17:12:31.177284",
  "status": 404,
  "path": "/api/tasks/12/photo"
}
```
---

### **GET /api/tasks/{taskId}/photo**

Получить url путь к фотографии, который можно подставить в фронт с адресом сервера и все отобразится.

**Response (200 OK)**:

```text
/api/files/6f56949a-499f-48b5-afd3-8c888041232b_photo1.jpg
```

---

## **Files API**

### **GET /api/files/{filename}**

Пример запроса
```text
http://localhost:8080/api/files/6f56949a-499f-48b5-afd3-8c888041232b_photo1.jpg
```

Получить файл с сервера.

**Response (200 OK)**:

* Контент файла
* `Content-Type` подбирается автоматически
* `Content-Disposition: inline; filename="имя"`


**Ошибка**

```json
{
    "error": "Файл не найден",
    "timestamp": "2025-12-07T07:26:52.87644076",
    "status": 500,
    "path": "/api/files/6f56949a-499f-48b5-afd3-8c888041232b_photo1.jpgs"
}
```
---



