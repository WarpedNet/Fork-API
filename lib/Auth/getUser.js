async function getUser(token, res) {
    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            res.json({ username: decoded.username, email: decoded.email })
        }
    });
}
module.exports = getUser;