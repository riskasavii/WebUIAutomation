const { By, until } = require('selenium-webdriver');
const LOGIN_LOCATORS = require('../locator/LoginPage.locator');

class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(LOGIN_LOCATORS.url);
    // Tunggu sampai halaman login benar-benar siap
    await this.driver.wait(
      until.elementLocated(By.id(LOGIN_LOCATORS.selectors.loginButton.value)),
      10000
    );
  }

  async login(username, password) {
    await this.driver.findElement(By.id(LOGIN_LOCATORS.selectors.usernameInput.value)).sendKeys(username);
    await this.driver.findElement(By.id(LOGIN_LOCATORS.selectors.passwordInput.value)).sendKeys(password);
    await this.driver.findElement(By.id(LOGIN_LOCATORS.selectors.loginButton.value)).click();
  }

  async getErrorMessage() {
    const errorEl = await this.driver.wait(until.elementLocated(By.css(LOGIN_LOCATORS.selectors.errorMessage.value)), 5000);
    return await errorEl.getText();
  }
}
module.exports = LoginPage;