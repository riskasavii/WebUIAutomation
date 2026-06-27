const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

class VisualRegressionHelper {
  constructor() {
    this.baseDir = path.join(__dirname, '..', 'screenshots');
  }

  async compareImages(imageName) {
    const baselinePath = path.join(this.baseDir, 'baseline', imageName);
    const currentPath = path.join(this.baseDir, 'current', imageName);
    const diffPath = path.join(this.baseDir, 'diff', imageName);

    // Jika baseline belum ada, buat duplikasi dari current sebagai benchmark awal
    if (!fs.existsSync(baselinePath)) {
      fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
      fs.copyFileSync(currentPath, baselinePath);
      return { hasBaseline: false, match: true, matchPercentage: 100 };
    }

    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));
    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const diffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    fs.mkdirSync(path.dirname(diffPath), { recursive: true });
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const matchPercentage = ((totalPixels - diffPixels) / totalPixels) * 100;
    const match = diffPixels === 0;

    return { hasBaseline: true, match, matchPercentage };
  }
}
module.exports = VisualRegressionHelper;