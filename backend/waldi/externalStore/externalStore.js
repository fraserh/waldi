/* 
 * Abstracts away the implementation of the external store 
 * from the models.
 * This is done so that we can change from Redis to MySQL—or similar—
 * without having to touch code anywhere else.
 */

// module.exports = require('./redis');
module.exports = require('./sql');
