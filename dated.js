const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const FILE_PATH = 'data.json';

const writeDataAndCommit = async (data, date) => {
    try {
        await new Promise((resolve, reject) => {
            jsonfile.writeFile(FILE_PATH, data, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        await simpleGit()
            .add([FILE_PATH])
            .commit(`Commit on ${date}`, { '--date': date })
            .push();
    } catch (err) {
        console.error("Error during git operations:", err);
    }
};

// Function to simulate multiple commits per day
const commitMultipleTimes = async (day, commitsCount, totalDays, doneCount) => {
    for (let i = 0; i < commitsCount; i++) {
        // Randomize the time within the same day
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        const randomSecond = Math.floor(Math.random() * 60);

        const commitDate = day.clone().hour(randomHour).minute(randomMinute).second(randomSecond);
        const formattedDate = commitDate.format();

        const data = { date: formattedDate };
        console.log(
            `Commit #${doneCount + 1}.${i + 1} of ${totalDays} days → ${formattedDate}`
        );

        await writeDataAndCommit(data, formattedDate);
    }
};

// Recursive function to go back in time day by day
const mc = async (currentDate, stopDate, totalDays, doneCount = 0) => {
    if (currentDate.isBefore(stopDate)) {
        console.log("Reached stop date. Done!");
        return;
    }

    // Randomize 2–5 commits for the current day
    const commitsToday = Math.floor(Math.random() * 4) + 2; // 2,3,4,5
    console.log(`\n📅 ${currentDate.format('YYYY-MM-DD')} → ${commitsToday} commits`);

    await commitMultipleTimes(currentDate.clone(), commitsToday, totalDays, doneCount);

    // Move to previous day
    await mc(currentDate.subtract(1, 'days'), stopDate, totalDays, doneCount + 1);
};

// Start process
const start = moment();
const stop = moment("2024-05-05");
const totalDays = start.diff(stop, 'days') + 1;

console.log(`Total days to process: ${totalDays}`);
mc(start, stop, totalDays);
