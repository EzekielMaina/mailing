const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const FILE_PATH = 'data.json';

// Function to generate a random integer between min and max
function getRandomInt(min, max) {
    min = Math.ceil(min);   // Round up the minimum value
    max = Math.floor(max);  // Round down the maximum value
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to write data to the file and then commit & push using git
const writeDataAndCommit = async (data, date) => {
    try {
        // Write data to the JSON file
        await new Promise((resolve, reject) => {
            jsonfile.writeFile(FILE_PATH, data, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

        // Git add, commit, and push
        await simpleGit().add([FILE_PATH])
            .commit(date, { '--date': date })
            .push();
    } catch (err) {
        console.error("Error during git operations:", err);
    }
};

// Recursive function to run the process 'n' times
const mc = async (n) => {
    if (n <= 0) {
        return; // Stop recursion when n is zero or negative
    }

    // Generate random values for x and y
    const x = getRandomInt(0, 8);
    const y = getRandomInt(0, 6);

    // Generate a formatted date string
    const DATE = moment().add(0, 'months').subtract(0, 'years')
        .subtract(x, 'w').subtract(y, 'd').format();

    // Create the data object to write to the JSON file
    const data = {
        date: DATE
    };

    // Log the generated date
    console.log("Generated Date:", DATE);

    // Write the data to the file, commit, and push
    await writeDataAndCommit(data, DATE);

    // Recursive call with decremented n
    await mc(n - 1);
};

// Start the process with an initial value of 10
mc(100);
