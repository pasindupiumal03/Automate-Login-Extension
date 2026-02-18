const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [16, 32, 48, 64, 128];
const SOURCE_ICON = path.resolve(__dirname, '../src/assets/icons/logo.png');
const DEST_DIR = path.dirname(SOURCE_ICON);

async function generateIcons() {
    if (!fs.existsSync(SOURCE_ICON)) {
        console.error('Source icon not found:', SOURCE_ICON);
        process.exit(1);
    }

    console.log(`Generating icons from ${SOURCE_ICON}...`);

    for (const size of ICON_SIZES) {
        const destPath = path.join(DEST_DIR, `${size}.png`);
        try {
            await sharp(SOURCE_ICON)
                .resize(size, size)
                .toFile(destPath);
            console.log(`Generated ${size}x${size} icon: ${destPath}`);
        } catch (err) {
            console.error(`Error generating ${size}x${size} icon:`, err);
        }
    }

    console.log('Icon generation complete.');
}

generateIcons();
