import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';


let folderPath = null;

// stdinp flags
let doUndo = false;


// chalkAnimation.rainbow(`Welcome to File organizer`, 0.1);

const argvs = process.argv.slice(2);

const sleep = (ms = 2000) => {
    new Promise((r) => {setTimeout(r, ms)});
}

const spinner = createSpinner('Whatcha doing?').start();
await sleep();

figlet("Hello World!", (err, data) => {
    if (err) {
        console.log("Something Went Wrong!");
        console.log(err);
        return;
    } 
    chalkAnimation.karaoke(data);
});


let isPath = function (path) {
    if (typeof (path) !== "string") {
        return false;
    } else if (path.startsWith("-")) {
        return false;
    }

    const stat = fs.statSync(path);

    if (stat.isDirectory()) {
        folderPath = path;
        return true;
    } else {
        return false;
    }
}


for (const argv of argvs) {

    if (argv.startsWith("-")) {
        if (argv === '--undo' || argv === '-u') {
            doUndo = true;
            continue;
        }
    } else if (!folderPath) {
        isPath(argv);
    } 
}


if (!folderPath) {
    folderPath = '.';
}


const allFiles = fs.readdirSync(folderPath);


const fileCategories = {
    images: ['jpg', 'png', 'gif'],
    documents: ['pdf', 'docx', 'txt'],
    videos: ['mp4', 'mkv'],
    archives: ['zip', 'rar', 'tar'],
    others: []
}

const folderCreation = new Set();

for (const file of allFiles) {
    const fileExtension = path.extname(file).slice(1).toLowerCase();

    if (fileCategories.images.includes(fileExtension)) {
        folderCreation.add('images');
    } else if (fileCategories.documents.includes(fileExtension)) {
        folderCreation.add('documents');
    } else if (fileCategories.videos.includes(fileExtension)) {
        folderCreation.add('videos');
    } else if (fileCategories.archives.includes(fileExtension)) {
        folderCreation.add('archives');
    } else {
        folderCreation.add('others');
    }
}


for (const folder of folderCreation) {
    const completePath = path.join(folderPath, folder);

    if (!fs.existsSync(completePath)) {
        fs.mkdirSync(completePath);
        console.log(chalk.yellow(`Creating Folder: ${folder}`));
    }
}



for (let i = 0; i < allFiles.length; i++) {

    const fileName = allFiles[i];
    const completePath = path.join(folderPath, fileName);

    //File Exsist Check
    const isFile = fs.lstatSync(completePath).isFile();

    if (!isFile) continue;

    const fileExtension = path.extname(fileName).slice(1);

    let fileMoved = false;

    //fileCategory is an object, i.e. no map
    for (const category in fileCategories) {
        const extensions = fileCategories[category];

        if (extensions.includes(fileExtension)) {
            const destPath = path.join(folderPath, category, fileName)
            fs.renameSync(completePath, destPath);
            fileMoved = true;
            break;
        }
    }

    if (!fileMoved) {
        const destPath = path.join(folderPath, 'others', fileName);
        fs.renameSync(completePath, destPath);
    }
}


