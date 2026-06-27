const LOGIN_LOCATORS = {
  url: 'https://www.saucedemo.com/',
  selectors: {
    usernameInput: { type: 'id', value: 'user-name' },
    passwordInput: { type: 'id', value: 'password' },
    loginButton: { type: 'id', value: 'login-button' },
    errorMessage: { type: 'css', value: '[data-test="error"]' }
  }
};
module.exports = LOGIN_LOCATORS;