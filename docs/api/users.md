# Users API

This document details the user management endpoints for the BidAthlete API.

## Update My Profile

Updates the profile of the currently authenticated user. Requires a valid JWT.

* **URL:** `/users/me`
* **Method:** `PUT`
* **Headers:**
  * `Authorization: Bearer YOUR_JWT_TOKEN`
* **Request Body:**

```json
{
  "name": "My New Name",
  "someOtherField": "some value"
}
```

* **Example `curl`:**

```bash
curl -X PUT 'http://localhost:3000/users/me' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-d '{
  "name": "My New Name"
}'
```

## Delete My Account

Deletes the account of the currently authenticated user. Requires a valid JWT.

* **URL:** `/users/me`
* **Method:** `DELETE`
* **Headers:**
  * `Authorization: Bearer YOUR_JWT_TOKEN`
* **Example `curl`:**

```bash
curl -X DELETE 'http://localhost:3000/users/me' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

---

## Admin Endpoints

The following endpoints are for administrators only and require a JWT from an admin user.

### List All Users

* **URL:** `/users`
* **Method:** `GET`
* **`curl`:** `curl -X GET http://localhost:3000/users -H 'Authorization: Bearer YOUR_ADMIN_JWT'`

### Create a User

* **URL:** `/users`
* **Method:** `POST`
* **`curl`:** `curl -X POST http://localhost:3000/users -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_ADMIN_JWT' -d '{"email": "...", "password": "..."}'`

### Get a Single User

* **URL:** `/users/:id`
* **Method:** `GET`
* **`curl`:** `curl -X GET http://localhost:3000/users/USER_ID -H 'Authorization: Bearer YOUR_ADMIN_JWT'`

### Update a User

* **URL:** `/users/:id`
* **Method:** `PUT`
* **`curl`:** `curl -X PUT http://localhost:3000/users/USER_ID -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_ADMIN_JWT' -d '{"name": "..."}'`

### Delete a User

* **URL:** `/users/:id`
* **Method:** `DELETE`
* **`curl`:** `curl -X DELETE http://localhost:3000/users/USER_ID -H 'Authorization: Bearer YOUR_ADMIN_JWT'`
