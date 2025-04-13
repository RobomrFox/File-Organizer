const fs = require('fs');
const path = require('path');
const folderPath = process.argv[2] || '.'



const allFiles = fs.readdirSync(folderPath);



const fileCategories = {
    images: ['jpg', 'png', 'gif'],
    documents: ['pdf', 'docx', 'txt'],
    videos: ['mp4', 'mkv'],
    archives: ['zip', 'rar', 'tar'],
    others: []
}

let folderCreation = [];

for (const file of allFiles) {
    const fileExtension = path.extname(file).slice(1).toLowerCase(); 

    if (fileCategories.images.includes(fileExtension)) {
        folderCreation.push('images');
    } else if (fileCategories.documents.includes(fileExtension)) {
        folderCreation.push('documents');
    } else if (fileCategories.videos.includes(fileExtension)) {
        folderCreation.push('videos');
    } else if (fileCategories.archives.includes(fileExtension)) {
        folderCreation.push('archives');
    } else {
        folderCreation.push('others');
    }
}


for (const folder of folderCreation) {
    const completePath = path.join(folderPath, folder);

    if (!fs.existsSync(completePath)) {
        fs.mkdirSync(completePath);
        console.log(`Creating Folder: ${folder}`);
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


