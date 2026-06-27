const fs = require('fs');
const path = require('path');

class ScreenshotPage {
  constructor(driver) {
    this.driver = driver;
    // Menggunakan path.resolve untuk memastikan jalur absolut Windows terbentuk sempurna
    this.screenshotDir = path.resolve(__dirname, '..', 'screenshots');
  }

  async takeFullScreenshot(filename) {
    // 1. Ambil screenshot dari selenium
    const screenshot = await this.driver.takeScreenshot();
    
    // 2. Tentukan jalur lengkap file target secara absolut
    const screenshotPath = path.resolve(this.screenshotDir, filename);
    
    // 3. Ambil jalur folder pembungkusnya (misal: .../screenshots/current)
    const targetDir = path.dirname(screenshotPath);
    
    // 4. Buat folder secara rekursif (jika belum ada, otomatis dibuatkan dari root sampai sub-level)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 5. Tulis file gambar secara sinkronus
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    return screenshotPath;
  }
}

module.exports = ScreenshotPage;