const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
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
    // Nonaktifkan popup password manager & notifikasi Chrome
    const options = new chrome.Options();
    options.setUserPreferences({
      'credentials_enable_service': false,
      'profile.password_manager_enabled': false,
      'profile.password_manager_leak_detection': false,
    });
    options.addArguments('--disable-notifications');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
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
    await sleep(1500); // Jeda setelah login

    // Assertion 1: Memastikan berhasil masuk ke halaman produk
    const title = await inventoryPage.getTitle();
    expect(title).to.equal('Products');
    await sleep(1500); // Jeda setelah halaman inventory tampil

    // Visual Regression 1
    await screenshotAction.takeFullScreenshot('current/inventory_page.png');
    const vrResult1 = await visualRegression.compareImages('inventory_page.png');
    expect(vrResult1.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult1.matchPercentage}%`);
    await sleep(1500); // Jeda setelah visual regression

    // Add to cart
    await inventoryPage.addBackpackToCart();
    await sleep(1500); // Jeda agar badge muncul terlihat jelas
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).to.equal('1');
    await sleep(1500); // Jeda sebelum pindah ke Cart

    // Masuk ke halaman Cart
    await inventoryPage.clickCart();
    await sleep(2000); // Jeda untuk melihat isi Cart

    // Capture HALAMAN CART
    await screenshotAction.takeFullScreenshot('current/cart_page.png');
    await sleep(1500);

    // Checkout Process
    await inventoryPage.clickCheckout();
    await sleep(1500); // Jeda setelah masuk form checkout

    await inventoryPage.inputInformation('Riska', 'Safitri', '10110');
    await sleep(1500); // Jeda setelah isi form

    await inventoryPage.clickContinue();
    await sleep(1500); // Jeda di halaman overview

    await inventoryPage.clickFinish();
    await sleep(2000); // Jeda untuk melihat halaman sukses

    // Assertion 2: Memastikan berhasil checkout sempurna
    const completeHeader = await inventoryPage.getCompleteHeader();
    expect(completeHeader).to.equal('Thank you for your order!');

    // SCREENSHOT HALAMAN SUKSES CHECKOUT
    await screenshotAction.takeFullScreenshot('current/checkout_complete.png');
    await sleep(1500); // Jeda akhir sebelum test selesai
  });

  // ==================== NEGATIVE TEST CASES ====================
  it('Negative: Invalid Username', async function () {
    await loginPage.login('wrong_user', 'secret_sauce');
    await sleep(1500); // Jeda setelah klik login

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.include('Username and password do not match any user in this service');
    await sleep(1500); // Jeda agar error message terlihat

    // Visual Regression 2
    await screenshotAction.takeFullScreenshot('current/invalid_username.png');
    const vrResult2 = await visualRegression.compareImages('invalid_username.png');
    expect(vrResult2.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult2.matchPercentage}%`);
    await sleep(1500); // Jeda akhir
  });

  it('Negative: Wrong Password', async function () {
    await loginPage.login('standard_user', 'wrong_password');
    await sleep(1500); // Jeda setelah klik login

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.include('Username and password do not match any user in this service');
    await sleep(1500); // Jeda agar error message terlihat

    // Visual Regression 3
    await screenshotAction.takeFullScreenshot('current/wrong_password.png');
    const vrResult3 = await visualRegression.compareImages('wrong_password.png');
    expect(vrResult3.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult3.matchPercentage}%`);
    await sleep(1500); // Jeda akhir
  });

  it('Negative: Locked Out User', async function () {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await sleep(1500); // Jeda setelah klik login

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.include('Sorry, this user has been locked out.');
    await sleep(1500); // Jeda agar error message terlihat

    // Visual Regression 4
    await screenshotAction.takeFullScreenshot('current/locked_out_user.png');
    const vrResult4 = await visualRegression.compareImages('locked_out_user.png');
    expect(vrResult4.matchPercentage).to.be.at.least(95, `Visual mismatch too high! Match rate: ${vrResult4.matchPercentage}%`);
    await sleep(1500); // Jeda akhir
  });
}); 