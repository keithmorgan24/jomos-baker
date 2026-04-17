const bcrypt = require('bcryptjs');
const secretPassword = "JomoAdmin2026";

bcrypt.hash(secretPassword, 10, (err, hash) => {
    console.log("----------------------------");
    console.log("COPY THIS NEW HASH:");
    console.log(hash);
    console.log("----------------------------");
});