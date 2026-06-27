const { Builder } = require('selenium-webdriver');
const { expect } = require('chai');
const LoginPage = require('../page/LoginPage');
const InventoryPage = require('../page/InventoryPage');
const ScreenshotPage = require('../page/ScreenshotPage');
const VisualRegressionHelper = require('../utilities/VisualRegressionHelper');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Saucedemo POM & Visual Regression Automation Suite', function () {
  let driver;
  let loginPage;
  let inventoryPage;
  let screenshotAction;
  let visualRegression;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    
    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
    screenshotAction = new ScreenshotPage(driver);
    visualRegression = new VisualRegressionHelper();
  });

  after(async function () {
    await driver.quit();
  });

  beforeEach(async function () {
    await driver.manage().deleteAllCookies();
    await loginPage.open(); // Memastikan setiap test case selalu dimulai dari halaman login utama
  });

  // ==================== POSITIVE TEST CASES ====================
  it('Positive: Login Success, Add to Cart, and Checkout', async function () {
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Assertion 1: Memastikan berhasil masuk ke halaman produk
    const title = await inventoryPage.getTitle();
    expect(title).to.equal('Products');

    // Visual Regression 1
    await screenshotAction.takeFullScreenshot('current/inventory_page.png');
    const vrResult1 = await visualRegression.compareImages('inventory_page.png');
    expect(vrResult1.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult1.matchPercentage}%`);

    // Add to cart
    await inventoryPage.addBackpackToCart();
    await inventoryPage.clickCart(); // Masuk ke halaman Cart
    await sleep(3500);
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).to.equal('1');

    // Checkout Process
    await inventoryPage.clickCart();
    await inventoryPage.clickCheckout();
    await sleep(3500);
    await inventoryPage.inputInformation('Riska', 'Safitri', '10110');
    await inventoryPage.clickContinue();
    await inventoryPage.clickFinish();

    // Capture HALAMAN CART
    await screenshotAction.takeFullScreenshot('current/cart_page.png');
    
    // Assertion 2: Memastikan berhasil checkout sempurna
    const completeHeader = await inventoryPage.getCompleteHeader();
    expect(completeHeader).to.equal('Thank you for your order!');

    // SCREENSHOT HALAMAN SUKSES CHECKOUT
    await screenshotAction.takeFullScreenshot('current/checkout_complete.png');
  });

  // ==================== NEGATIVE TEST CASES ====================
  it('Negative: Invalid Username', async function () {
    await loginPage.login('wrong_user', 'secret_sauce');
    
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.include('Username and password do not match any user in this service');

    // Visual Regression 2
    await screenshotAction.takeFullScreenshot('current/invalid_username.png');
    const vrResult2 = await visualRegression.compareImages('invalid_username.png');
    expect(vrResult2.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult2.matchPercentage}%`);
  });

  it('Negative: Wrong Password', async function () {
    await loginPage.login('standard_user', 'wrong_password');
    
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.include('Username and password do not match any user in this service');

    // Visual Regression 3
    await screenshotAction.takeFullScreenshot('current/wrong_password.png');
    const vrResult3 = await visualRegression.compareImages('wrong_password.png');
    expect(vrResult3.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult3.matchPercentage}%`);
  });

  it('Negative: Locked Out User', async function () {
    await loginPage.login('locked_out_user', 'secret_sauce');
    
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.include('Sorry, this user has been locked out.');

    // Visual Regression 4
    await screenshotAction.takeFullScreenshot('current/locked_out_user.png');
    const vrResult4 = await visualRegression.compareImages('locked_out_user.png');
    expect(vrResult4.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult4.matchPercentage}%`);
  });
}); 