const { By, until } = require('selenium-webdriver');
const INVENTORY_LOCATORS = require('../locator/InventoryPage.locator');

class InventoryPage {
  constructor(driver) {
    this.driver = driver;
  }

  async getTitle() {
    const titleEl = await this.driver.wait(until.elementLocated(By.css(INVENTORY_LOCATORS.selectors.pageTitle.value)), 5000);
    return await titleEl.getText();
  }

  async addBackpackToCart() {
    await this.driver.findElement(By.id(INVENTORY_LOCATORS.selectors.addToCartBackpack.value)).click();
  }

  async getCartBadgeCount() {
    const badge = await this.driver.findElement(By.css(INVENTORY_LOCATORS.selectors.cartBadge.value));
    return await badge.getText();
  }

  // ===== KITA SESUAIKAN SINKRONISASI DAN STEP NYA DI SINI =====
  async clickCart() {
    const cart = await this.driver.wait(until.elementLocated(By.css(INVENTORY_LOCATORS.selectors.cartLink.value)), 5000);
    await cart.click();
  }

  async clickCheckout() {
    const checkoutBtn = await this.driver.wait(until.elementLocated(By.id(INVENTORY_LOCATORS.selectors.checkoutButton.value)), 5000);
    await checkoutBtn.click();
  }

  async inputInformation(firstName, lastName, postalCode) {
    const firstNameInput = await this.driver.wait(until.elementLocated(By.id(INVENTORY_LOCATORS.selectors.firstName.value)), 5000);
    await firstNameInput.sendKeys(firstName);
    await this.driver.findElement(By.id(INVENTORY_LOCATORS.selectors.lastName.value)).sendKeys(lastName);
    await this.driver.findElement(By.id(INVENTORY_LOCATORS.selectors.postalCode.value)).sendKeys(postalCode);
  }

  async clickContinue() {
    await this.driver.findElement(By.id(INVENTORY_LOCATORS.selectors.continueButton.value)).click();
  }

  async clickFinish() {
    const finishBtn = await this.driver.wait(until.elementLocated(By.id(INVENTORY_LOCATORS.selectors.finishButton.value)), 5000);
    await finishBtn.click();
  }

  async getCompleteHeader() {
    const header = await this.driver.wait(until.elementLocated(By.css(INVENTORY_LOCATORS.selectors.completeHeader.value)), 5000);
    return await header.getText();
  }
}

module.exports = InventoryPage;