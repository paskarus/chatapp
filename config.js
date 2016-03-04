// TODO: migrate to env variables instead of hardcoded values
var config = {
    mongodb_url: process.env.MONGOLAB_URI || "mongodb://localhost:27017/chat",
    messages_limit: 10
};

module.exports = config;