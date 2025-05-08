async function createComment(data, res) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');
    const jwt = require('jsonwebtoken');
    jwt.verify(data.token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            const addComment = new PS({name: "add-comment", text: "INSERT INTO comments (customer_id, fork_id, comment, rating) VALUES ($1, $2, $3, $4)"});
            db.none(addComment, [decoded.userID, data.forkID, data.comment, data.rating]);
            res.status(200).send("Comment created")
        }
    });
}
module.exports = createComment;