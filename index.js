const fs = require('fs');
const path = require('path');
const folderPath = process.argv[2] || '.'

const fileCategories = {
    images: ['jpg', 'png', 'gif'],
    documents: ['pdf', 'docx', 'txt'],
    videos: ['mp4', 'mkv'],
    archives: ['zip', 'rar', 'tar'],
    others: []
}


const folderNames = Object.keys(fileCategories);


for (let i = 0; i < folderNames.length; i++) {
    //exact folder path
    const completePath = path.join(folderPath, folderNames[i]);

    if (!fs.existsSync(completePath)) {
        fs.mkdirSync(completePath);
        
        console.log(`Creating folder: ${completePath}`);
    } 
}



const allFiles = fs.readdirSync(folderPath)

for (let i = 0; i < allFiles.length; i++) {

    const fileName = allFiles[i];
    const completePath = path.join(folderPath, fileName);

    const isFile = fs.lstatSync(completePath).isFile();

    if (!isFile) continue;

    const fileExtension = path.extname(fileName).slice(1);

    let fileMoved = false;

    //fileCategory is an object, i.e. no map
    for (const category in fileCategories) {
        const extensions = fileCategories[category];

        if (extensions.includes(fileExtension)){
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


