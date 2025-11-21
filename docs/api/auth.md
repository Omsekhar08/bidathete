# Auth API

This document details the authentication-related endpoints for the BidAthlete API.

## Register

Creates a new user account.

* **URL:** `/auth/register`
* **Method:** `POST`
* **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "Your Name"
}
```

* **Example `curl`:**

```bash
curl -X POST 'http://localhost:3000/auth/register' \
-H 'Content-Type: application/json' \
-d '{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "Your Name"
}'
```

## Login

Logs in a user and returns a JWT access token and refresh token.

* **URL:** `/auth/login`
* **Method:** `POST`
* **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

* **Example `curl`:**

```bash
curl -X POST 'http://localhost:3000/auth/login' \
-H 'Content-Type: application/json' \
-d '{
  "email": "user@example.com",
  "password": "yourpassword"
}'
```

## Refresh Token

Refreshes an expired access token using a refresh token.

* **URL:** `/auth/refresh`
* **Method:** `POST`
* **Request Body:**

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

* **Example `curl`:**

```bash
curl -X POST 'http://localhost:3000/auth/refresh' \
-H 'Content-Type: application/json' \
-d '{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}'
```

## Logout

Revokes a refresh token, effectively logging the user out.

* **URL:** `/auth/logout`
* **Method:** `POST`
* **Request Body:**

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

* **Example `curl`:**

```bash
curl -X POST 'http://localhost:3000/auth/logout' \
-H 'Content-Type: application/json' \
-d '{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}'
```

## Get Current User

Retrieves the profile of the currently authenticated user. Requires a valid JWT in the `Authorization` header.

* **URL:** `/auth/me`
* **Method:** `GET`
* **Headers:**
  * `Authorization: Bearer YOUR_JWT_TOKEN`
* **Example `curl`:**

```bash
curl -X GET 'http://localhost:3000/auth/me' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'
```
