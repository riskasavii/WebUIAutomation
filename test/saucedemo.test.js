const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Saucedemo UI Automation Test - Sesi 10 Advance', function () {
    this.timeout(40000); 
    let driver;

    // HOOK: Berjalan otomatis sebelum setiap test case dimulai
    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    // HOOK: Berjalan otomatis setelah setiap test case selesai
    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('Case 1: Sukses Login', async function () {
        await driver.get('https://www.saucedemo.com');

        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();

        await driver.sleep(1000);

        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, 'https://www.saucedemo.com/inventory.html');

        const titleText = await driver.findElement(By.className('title')).getText();
        assert.strictEqual(titleText, 'Products');
    });

    it('Case 2: Urutkan Produk dari A-Z', async function () {
        await driver.get('https://www.saucedemo.com');
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();
        
        await driver.sleep(1000);

        // 1. Jalankan fitur sortir di website ke A-Z
        const sortDropdown = await driver.findElement(By.className('product_sort_container'));
        await sortDropdown.click();

        const optionAZ = await driver.findElement(By.css('option[value="az"]'));
        await optionAZ.click();

        await driver.sleep(2000); // Jeda 2 detik agar browser selesai menyusun ulang elemen UI

        // 2. Ambil semua elemen nama produk yang muncul setelah disortir di web
        const sesudahElements = await driver.findElements(By.className('inventory_item_name'));
        let productNamesAfterSort = [];
        for (let element of sesudahElements) {
            productNamesAfterSort.push(await element.getText());
        }

        // 3. PERBAIKAN LOGIKA ADVANCE:
        // Membuat array ekspektasi yang di-sort menggunakan localeCompare agar sinkron dengan algoritma browser Chrome
        let expectedSortedNames = [...productNamesAfterSort].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

        // 4. Assertion: Bandingkan hasil sortir website dengan ekspektasi buatan kita
        assert.deepStrictEqual(productNamesAfterSort, expectedSortedNames);

        // Jeda waktu 3 detik untuk pembuktian visual sebelum browser ditutup otomatis oleh afterEach
        await driver.sleep(3000); 
    });
});