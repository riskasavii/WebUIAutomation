const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Saucedemo UI Automation Test', function () {
    // Memberikan batas waktu 30 detik untuk eksekusi asinkronus
    this.timeout(30000); 
    let driver;

    // Fungsi yang berjalan sekali sebelum test case dimulai
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    // Fungsi yang berjalan sekali setelah semua test case selesai
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('Case 1: Sukses Login', async function () {
        // 1. Buka halaman website saucedemo
        await driver.get('https://www.saucedemo.com');

        // 2. Cari elemen input username & password, lalu masukkan datanya
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');

        // 3. Cari dan klik tombol Login
        await driver.findElement(By.id('login-button')).click();

        // 4. Validasi/Assertion menggunakan strictEqual (Memastikan URL berubah ke halaman inventory)
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, 'https://www.saucedemo.com/inventory.html');

        // Validasi tambahan: Memastikan teks judul halaman adalah "Products"
        const titleText = await driver.findElement(By.className('title')).getText();
        assert.strictEqual(titleText, 'Products');
    });

    it('Case 2: Urutkan Produk dari A-Z', async function () {
        // Catatan: Test case ini melanjutkan sesi login dari Case 1

        // 1. Temukan elemen container dropdown filter pengurutan produk
        const sortDropdown = await driver.findElement(By.className('product_sort_container'));
        await sortDropdown.click();

        // 2. Pilih opsi pengurutan 'Name (A to Z)' yang memiliki value "az"
        const optionAZ = await driver.findElement(By.css('option[value="az"]'));
        await optionAZ.click();

        // 3. Ambil semua elemen nama produk yang muncul di halaman
        const productElements = await driver.findElements(By.className('inventory_item_name'));
        
        let productNames = [];
        for (let element of productElements) {
            let name = await element.getText();
            productNames.push(name);
        }

        // 4. Salin array nama produk lalu urutkan secara alfabetis menggunakan javascript (.sort())
        let expectedSortedNames = [...productNames].sort();

        // 5. Assertion: Bandingkan urutan di web dengan urutan alfabetis asli
        assert.deepStrictEqual(productNames, expectedSortedNames);

        
    });
});