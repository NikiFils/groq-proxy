module.exports = async (req, res) => {
  // Просто вызываем нашу функцию из api/chat.js
  return require('./api/chat.js')(req, res);
};