function generateLogin() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const loginLength = Math.floor(Math.random() * (11 - 5 + 1)) + 5;
  let login = "";

  for (let i = 0; i < loginLength; i++) {
    login += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return login;
}
module.exports = generateLogin;
