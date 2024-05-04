const fs = require('fs/promises');

async function copyFiles() {
    try {
        await fs.cp('src/public', 'dist/public', {recursive: true});
        await fs.cp('src/views', 'dist/views',  {recursive: true});
        console.log('Files copied successfully!');
    } catch (err) {
        console.error('Error copying files:', err);
    }
}

copyFiles();
