
# Teams API

This document details the team management endpoints for the BidAthlete API.

## List All Teams

Retrieves a list of all teams.

* **URL:** `/teams`
* **Method:** `GET`
* **Example `curl`:**

```bash
curl -X GET 'http://localhost:3000/teams'
```

## Get a Single Team

Retrieves a single team by its ID.

* **URL:** `/teams/:id`
* **Method:** `GET`
* **Example `curl`:**

```bash
curl -X GET 'http://localhost:3000/teams/YOUR_TEAM_ID'
```

## Get My Team

Retrieves the team owned by the currently authenticated user. Requires a valid JWT.

* **URL:** `/teams/my/team`
* **Method:** `GET`
* **Headers:**
  * `Authorization: Bearer YOUR_JWT_TOKEN`
* **Example `curl`:**

```bash
curl -X GET 'http://localhost:3000/teams/my/team' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

## Create a Team

Creates a new team. Requires a valid JWT. The new team will be owned by the authenticated user.

* **URL:** `/teams`
* **Method:** `POST`
* **Headers:**
  * `Authorization: Bearer YOUR_JWT_TOKEN`
* **Request Body:**

```json
{
  "name": "The All-Stars",
  "description": "A team of the best players in the league."
}
```

* **Example `curl`:**

```bash
curl -X POST 'http://localhost:3000/teams' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-d '{
  "name": "The All-Stars",
  "description": "A team of the best players in the league."
}'
```

## Update a Team

Updates an existing team. Requires a valid JWT.

* **URL:** `/teams/:id`
* **Method:** `PUT`
* **Headers:**
  * `Authorization: Bearer YOUR_JWT_TOKEN`
* **Request Body:**

```json
{
  "name": "The New All-Stars",
  "description": "An updated description."
}
```

* **Example `curl`:**

```bash
curl -X PUT 'http://localhost:3000/teams/YOUR_TEAM_ID' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-d '{
  "name": "The New All-Stars",
  "description": "An updated description."
}'
```

## Delete a Team

Deletes a team by its ID. Requires a valid JWT.

* **URL:** `/teams/:id`
* **Method:** `DELETE`
* **Headers:**
  * `Authorization: Bearer YOUR_JWT_TOKEN`
* **Example `curl`:**

```bash
curl -X DELETE 'http://localhost:3000/teams/YOUR_TEAM_ID' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

