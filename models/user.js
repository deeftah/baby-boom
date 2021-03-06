var pool = require("../db/connection");
var bcrypt = require("bcrypt");
var SALT_ROUNDS = 10;

// find by username
exports.findByUsername = function(username) {
  return query("SELECT * FROM users WHERE username = $1", [ username ])
    .then(function(users) {
      return users[0];
    })
    .catch(function(err) {
      console.log("Error finding user by username", err);
    });
};

// find by id
exports.findById = function(id) {
  return query("SELECT * FROM users WHERE id = $1", [ id ])
    .then(function(users) {
      return users[0];
    })
    .catch(function(err) {
      console.log("Error finding user by id", err);
    });
};

// compare password
// takes a username and a password, looks up the user by the given username
// and returns promise which resolves to a boolean indicating whether the
// passwords matched
exports.findAndComparePassword = function(username, password) {
  return exports.findByUsername(username).then(function(user) {
    return bcrypt
      .compare(password, user.password)
      .then(function(match) {
        return { match: match, user: user };
      })
      .catch(function(err) {
        return false;
      });
  });
};

exports.create = function(username, password, fullname, baby_name, baby_birthday) {
  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then(function(hash) {
      return query(
        "INSERT INTO users (username, password, user_fullname, user_baby_name, user_baby_birthday) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [ username, hash , fullname, baby_name, baby_birthday]
      ).then(function(users) {
        return users[0];
      });
    })
    .catch(function(err) {
      console.log("Error creating user", err);
    });
};


//shortens the typical error checking
function query(sqlString, data) {
  return new Promise(function(resolve, reject) {
    pool.connect(function(err, client, done) {
      try {
        if (err) {
          return reject(err);
        }

        client.query(sqlString, data, function(err, result) {
          if (err) {
            return reject(err);
          }

          resolve(result.rows);
        });
      } finally {
        done();
      }
    });
  });
}
//
