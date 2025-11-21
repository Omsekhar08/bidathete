db.createUser({
  user: "admin",
  pwd: "bidathlete",
  roles: [{ role: "readWrite", db: "bidathlete" }]
})


MONGODB_URI=mongodb://admin:bidathlete@localhost:27017/bidathlete
PORT=3000
JWT_SECRET=nKfc38L9qAsVSj1J/0oFweBAWCC4HqzhxULsNJIiLr0=