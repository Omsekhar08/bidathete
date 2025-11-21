# Auctions API

This document details the auction management endpoints for the BidAthlete API.

## List All Auctions

* **URL:** `/auctions`
* **Method:** `GET`
* **`curl`:** `curl -X GET http://localhost:3000/auctions`

## Get a Single Auction

* **URL:** `/auctions/:id`
* **Method:** `GET`
* **`curl`:** `curl -X GET http://localhost:3000/auctions/AUCTION_ID`

## Get Live Auction State

* **URL:** `/auctions/:id/live`
* **Method:** `GET`
* **`curl`:** `curl -X GET http://localhost:3000/auctions/AUCTION_ID/live`

---

## Organizer Endpoints

The following endpoints are for auction organizers only and require a JWT from an organizer user.

### Create an Auction

* **URL:** `/auctions`
* **Method:** `POST`
* **`curl`:** `curl -X POST http://localhost:3000/auctions -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_ORGANIZER_JWT' -d '{"title": "..."}'`

### Update an Auction

* **URL:** `/auctions/:id`
* **Method:** `PUT`
* **`curl`:** `curl -X PUT http://localhost:3000/auctions/AUCTION_ID -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_ORGANIZER_JWT' -d '{"title": "..."}'`

### Delete an Auction

* **URL:** `/auctions/:id`
* **Method:** `DELETE`
* **`curl`:** `curl -X DELETE http://localhost:3000/auctions/AUCTION_ID -H 'Authorization: Bearer YOUR_ORGANIZER_JWT'`

### Start an Auction

* **URL:** `/auctions/:id/start`
* **Method:** `POST`
* **`curl`:** `curl -X POST http://localhost:3000/auctions/AUCTION_ID/start -H 'Authorization: Bearer YOUR_ORGANIZER_JWT'`

### End an Auction

* **URL:** `/auctions/:id/end`
* **Method:** `POST`
* **`curl`:** `curl -X POST http://localhost:3000/auctions/AUCTION_ID/end -H 'Authorization: Bearer YOUR_ORGANIZER_JWT'`
