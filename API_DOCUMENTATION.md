# Goukies API — Documentación de endpoints

Nota: API construida con NestJS. ValidationPipe global (whitelist: true, forbidNonWhitelisted: true, transform: true). CORS habilitado. Puerto por defecto: env PORT o 3000.

---

## Resumen general

- Base URL: http://localhost:3000/
- Autenticación: /auth/login valida usuario/contraseña y devuelve { "mensaje": "Login exitoso" }.
- Errores: NestJS lanza excepciones estándar: Unauthorized (401), NotFound (404), Conflict (409), Validation errors (400).

---

## Endpoints (salidas exactas)

### GET /
- Descripción: health / welcome
- Request: ninguno
- Response (200): plain string
  Example: "Hello World!"

---

### POST /auth/login
- Descripción: autenticar por correo o nombre de usuario.
- Body (JSON):
  {
    "identificador": "string", // email o nombre de usuario (min 4)
    "password": "string" // min 4
  }
- Response (200):
  { "mensaje": "Login exitoso" }
- Errores: 401 Unauthorized con mensaje "Usuario incorrecto" o "Contraseña incorrecta"; 400 por validación

---

### POST /users/create
- Descripción: crear un nuevo usuario
- Body (JSON):
  {
    "password": "string",
    "nombre": "string",
    "correo_electronico": "string",
    "codigo_moneda": "string"
  }
- Response (200): objeto Usuario (devuelto directamente por Prisma, campos escalares). Ejemplo exacto:
  {
    "id": "<uuid>",
    "nombre": "usuario",
    "correo_electronico": "email@example.com",
    "contrasena_hash": "<hashed_password>",
    "moneda_codigo": "MXN"
  }
- Nota: la relación moneda NO se incluye (no se usa include), por eso se devuelve moneda_codigo.
- Errores: 401 con mensajes de unicidad si nombre o correo ya existen; 400 validación

---

### POST /users/delete
- Descripción: eliminar usuario por id
- Body (JSON): { "id": "<uuid>" }
- Response (200): no hay body (implementación no retorna payload). Status 200 OK.
- Errores: 404/500 si no existe

---

### GET /recipes/obtain-all
- Descripción: obtener todas las recetas con sus pasos e ingredientes
- Request: ninguno
- Response (200): array de objetos Receta con campos escalares de la tabla "receta" más arrays "pasos" y "ingredientes" extraídos de vistas.
  Ejemplo de un item:
  {
    "id": "<uuid>",
    "profit": "<decimal as string>",
    "nombre": "Nombre receta",
    "porciones_totales": 4,
    "imagen_url": null,
    "fecha_creacion": "2026-05-30T...Z",
    "fecha_modificacion": "2026-05-30T...Z",
    "id_usuario": "<uuid>",
    "descripcion": "...",
    "pasos": [
      { "id_receta": "<uuid>", "paso": "Precalentar el horno", "orden": 1 },
      { "id_receta": "<uuid>", "paso": "Mezclar ingredientes", "orden": 2 }
    ],
    "ingredientes": [
      { "ingrediente_nombre": "Harina", "marca_nombre": "MarcaX", "cantidad": 2, "id_receta": "<uuid>" }
    ]
  }
- Notas: profit viene como Decimal (Prisma) que puede serializarse como string.

---

### POST /recipes/create
- Descripción: crear receta + pasos + ingredientes en transacción
- Body (JSON): CreateOrUpdateRecipeDto (ver src/recipes/dto)
- Successful Response (200):
  { "message": "Receta creada correctamente", "id": "<uuid>" }
- Errores: 400 validación, 404/409 según fallo en relaciones

---

### PATCH /recipes/update/:id
- Descripción: actualizar receta existente
- Params: id (UUID)
- Body: CreateOrUpdateRecipeDto
- Response (200): { "message": "Receta actualizada correctamente", "id": "<uuid>" }

---

### POST /recipes/delete
- Descripción: eliminar receta por id
- Body: { "id": "<uuid>" }
- Response (200): no body
- Errores: 404 si no existe

---

### POST /ingredients/createOrUpdate
- Descripción: crear producto (ingrediente en inventario) o actualizar
- Body (JSON): CreateIngredientDto
- Successful Response (200):
  {
    "message": "Ingrediente creado correctamente",
    "ingrediente": {
      "id": "<uuid>",
      "id_ingrediente": 1,
      "id_marca": 1,
      "id_unidad": 1,
      "pzas": 12,
      "precio_medio": "12.50",
      "cantidad_inventario": 100,
      "cantidad_unitario": 1,
      "id_tipo": 2,
      "id_usuario": "<uuid>"
    }
  }
- Errores: 404 NotFound con mensaje "<Modelo> no encontrado" si FK falla; 409 Conflict si duplicado

---

### PATCH /ingredients/createOrUpdate/:id_producto
- Descripción: actualizar producto por id_producto (UUID)
- Params: id_producto (UUID)
- Body: CreateIngredientDto (se usan pzas, precio_medio, cantidad_inventario, cantidad_unitario)
- Response: mismo formato que create

---

### GET /ingredients/obtain-all
- Descripción: obtiene colecciones relacionadas para selects
- Response (200):
  {
    "producto": [
      { "id": "<uuid>", "ingrediente": "Harina", "marca": "MarcaX", "tipo": "TipoY", "unidad": "kg", "pzas": 12, "precio_medio": "12.50", "cantidad_inventario": 100, "cantidad_unitario": 1 }
    ],
    "ingredientes": [ { "id": 1, "nombre": "Harina" } ],
    "marca": [ { "id": 1, "nombre": "MarcaX" } ],
    "tipo": [ { "id": 2, "nombre": "TipoY" } ],
    "unidad": [ { "id": 1, "nombre": "kg", "cantidad_gramos": 1000 } ]
  }
- Notas: las vistas devuelven campos como se definen en schema.prisma

---

### POST /ingredients/delete
- Descripción: eliminar producto por id
- Body: { "id": "<uuid>" }
- Response (200): { "message": "Ingrediente eliminado correctamente" }

---

### POST /dashboards/principalDashboard
- Descripción: obtiene JSON de dashboard usando función SQL receta.get_dashboard_data
- Body (JSON):
  {
    "id_usuario": "<uuid>",
    "cantidad_ingredientes": 5,
    "cantidad_recetas": 10
  }
- Response (200): objeto con la propiedad get_dashboard_data que contiene la estructura DashboardData (ver src/types/getPrincipalDashboard.types.ts). Ejemplo exacto devuelto en body (el servicio devuelve result[0]?.get_dashboard_data):
  {
    "stats": {
      "total_recetas": 12,
      "total_ingredientes": 34
    },
    "recetas": [
      { "id": "<uuid>", "nombre": "Torta", "descripcion": "...", "imagen_url": "https://..." }
    ],
    "ingredientes": [
      { "id": "<uuid>", "ingrediente": "Harina", "categoria": "Secos", "stock": 20, "unidad": "kg" }
    ]
  }
- Nota: DashboardsService devuelve directamente el objeto DashboardData (no envuelve en "get_dashboard_data"). Si la función SQL no devuelve filas, la API responde null.

---

## Errores comunes y códigos HTTP
- 400 Bad Request: validación (ValidationPipe) o UUID mal formado
- 401 Unauthorized: login fallido o validaciones de unicidad en createUser lanzan UnauthorizedException
- 404 Not Found: recursos no encontrados (NotFoundException)
- 409 Conflict: duplicados (ConflictException)
- 500 Internal Server Error: errores no manejados por Prisma o excepciones no transformadas

---

## Notas para la IA del frontend
- Todos los endpoints esperan/salen JSON salvo GET / que devuelve un string simple.
- UUIDs deben validarse en cliente.
- Para crear receta: enviar arrays "ingredientes" y "pasos" con los campos exactos (id_producto, cantidad; orden, paso).
- Para dashboard: el cliente espera como respuesta el objeto DashboardData mostrado arriba.

---

Si quieres, puedo generar ejemplos mock (requests y responses) en formato JSON para cada endpoint.
