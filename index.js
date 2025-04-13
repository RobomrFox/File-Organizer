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


const filesName = Object.keys(fileCategories);


for (let i = 0; i < filesName.length; i++) {
    //exact folder path
    const completePath = path.join(folderPath, filesName[i]);

    if (!fs.existsSync(completePath)) {
        fs.mkdirSync(completePath);
        
        console.log(`Creating folder: ${completePath}`);
    } 
}



