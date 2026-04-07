//node fileOps.js
// Import the file system module
const fs = require('fs');

// Define file name
const fileName = 'labFile.txt';

// 1. Create and write to file
fs.writeFile(fileName, 'Hello, this is the initial content.\n', (err) => {
    if (err) {
        console.error('Error creating file:', err);
        return;
    }
    console.log('File created successfully.');

    // 2. Read the file
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log('\nFile Content:\n' + data);

        // 3. Append to the file
        fs.appendFile(fileName, 'This content is appended.\n', (err) => {
            if (err) {
                console.error('Error appending file:', err);
                return;
            }
            console.log('\nData appended successfully.');

            // 4. Read updated file
            fs.readFile(fileName, 'utf8', (err, updatedData) => {
                if (err) {
                    console.error('Error reading updated file:', err);
                    return;
                }
                console.log('\nUpdated File Content:\n' + updatedData);

                // 5. Delete the file
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                    console.log('\nFile deleted successfully.');
                });
            });
        });
    });
});