/*****  prompt before leaving when input is not empty *****/
const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = "Are you sure you want to exit?";
};

const inputText = document.querySelector('#input');

inputText.addEventListener("input", (event) => {
    if (event.target.value !== "") {
        addEventListener("beforeunload", beforeUnloadListener, { capture: true });
    } else {
        removeEventListener("beforeunload", beforeUnloadListener, { capture: true });
    }
});


/*****  download button *****/
const downloadBtn = document.querySelector('#download');

downloadBtn.addEventListener('click', () => {
    saveFile();
});

let saveFile = () => {

    let fileNameElement = document.querySelector('#file-name');
    let fileName = fileNameElement.value !== '' ? (fileNameElement.value).replace(/[\W_]+/g, '-') : 'result';

    const inputText = document.querySelector('#input');
    let data = inputText.value;

    if (data === '') {
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Enter text before \ndownload!'
        });
        return;
    }

    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const extention = 'txt';

    fileName = `${fileName}.${extention}`;

    let newLink = document.createElement('a');
    newLink.download = fileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = 'none';
        document.body.appendChild(newLink);
    }

    newLink.click();
}

/******  Copy to clip board *****/

const copyToClipboard = () => {

    let dummy = document.createElement('input');
    let copyText = document.querySelector('#file-link').text;

    document.body.appendChild(dummy);
    dummy.value = copyText;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    let linkCopied = document.querySelector('.copy-link');
    let copyLinkBtn = document.querySelector('#copy-icon');

    linkCopied.style.backgroundColor = 'hsl(60, 100%, 45%)';
    copyLinkBtn.style.color = '#000';

    setTimeout(() => {
        linkCopied.style.backgroundColor = '#333';
        copyLinkBtn.style.color = '#fff';
    }, 1500);
}

/******  change counter *****/

let max = (a, b) => {
    return a > b ? a : b
}
let min = (a, b) => {
    return a < b ? a : b
}

let count = 1;
let uploadCount = document.querySelector('.upload-count');
let uploadCountDown = document.querySelector('.upload-count-down');
let uploadCountUp = document.querySelector('.upload-count-up');

uploadCountDown.addEventListener('click', () => {
    count = max(1, count - 1);
    uploadCount.innerText = count;
});
uploadCountUp.addEventListener('click', () => {
    count = min(100, count + 1);
    uploadCount.innerText = count;
});

/******  File create, process and upload *****/

let myConfetti = (x_value, y_value) => {
    confetti({
        particleCount: 250,
        startVelocity: 30,
        spread: 360,
        origin: {
            x: x_value,
            y: y_value
        }
    });
}

const inputFile = document.querySelector('#input');
const submitBtn = document.querySelector('#submit');
const fileLink = document.querySelector('#file-link');
const fileCode = document.querySelector('#file-code');
let fileNameElement = document.querySelector('#file-name');

submitBtn.addEventListener('click', () => {
    createFile();
});

let createFile = () => {

    const userInput = document.querySelector('#input');
    let inputText = userInput.value;

    if (inputText === '') {
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Enter text before \nupload!'
        });
        return;
    }

    fileName = fileNameElement.value !== '' ? (fileNameElement.value).replace(/[\W_]+/g, '-') : 'result';

    let txtFile = new File([inputText], `${fileName}.txt`, { type: 'text/plain;charset=utf-8' });

    processFile(txtFile);
}

let processFile = (file) => {
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            let base64EncodedFile = event.target.result;
            handleSubmitFile(base64EncodedFile);
        }
    } catch (err) {
        console.error(err);
    }
};

let handleSubmitFile = (base64EncodedFile) => {
    if (!base64EncodedFile) {
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'No input found!'
        });
        return;
    }

    uploadFile(base64EncodedFile);
};

let loadingMessage = document.createElement('p');
loadingMessage.innerText = 'Loading...';
loadingMessage.id = 'loading'
let btnDiv = document.querySelector('.btn-div');


let uploadFile = async (base64EncodedFile) => {
    try {

        submitBtn.style.display = 'none';
        btnDiv.appendChild(loadingMessage);

        fileName = fileNameElement.value !== '' ? (fileNameElement.value).replace(/[\W_]+/g, '-') : 'result';
        const response = await fetch('/.netlify/functions/uploadFile', {
            method: 'POST',
            body: JSON.stringify({ fileName: fileName, file: base64EncodedFile }),
            headers: { 'Content-Type': 'application/json' },
        });

        let res = await response.json();
        let clip_id = res.clip_id;

        let getPageUrl = window.location + `get/index.html?id=${clip_id}`;

        getPageUrl = String(getPageUrl).replace('send/', '');

        fileLink.innerText = getPageUrl;
        fileLink.href = getPageUrl;
        fileCode.innerText = clip_id;

        let linkBox = document.querySelector('.display-link-div');
        linkBox.style.backgroundColor = `hsl(${Math.random() * 1000 % 357}, 100%, 30%)`;

        fileName = fileNameElement.value !== '' ? (fileNameElement.value).replace(/[\W_]+/g, '-') : 'result';

        let count = document.querySelector('#upload-count').innerText;

        if (Number(count) === NaN || (Number(count) < 1 || Number(count) > 100)) {
            count = 1;
        }
        else {
            count = Number(count)
        }

        createPost(fileName, clip_id, count);

         setTimeout(() => {
            myConfetti(0.5, 0.3)
        }, 100);

        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'File Uploaded Successful!',
                text: 'Your file link and code is ready!',
                confirmButtonAriaLabel: 'Thumbs up, OK!',
                confirmButtonColor: '#3bb300'
            })
        }, 600);
        

        submitBtn.style.display = 'flex';
        loadingMessage.remove();

    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Something went wrong!'
        });
    }
}

const createPost = async (fileName, clip_id, count) => {
    try {

        let imageUrl = `http://res.cloudinary.com/kevlarkode/raw/upload/v1640516148/txt-share-app/${fileName}_${clip_id}.txt`;
        let downloadUrl = `http://res.cloudinary.com/kevlarkode/raw/upload/fl_attachment/v1640516148/txt-share-app/${fileName}_${clip_id}.txt`;
        const extention = 'txt';

        fileName = `${fileName}.${extention}`;

        imageUrl = imageUrl.replace('http', 'https');
        downloadUrl = downloadUrl.replace('http', 'https');

        const doc = {
            fileName: fileName,
            clip_id: clip_id,
            url: imageUrl,
            download_url: downloadUrl,
            count: count,
        }

        await fetch('/.netlify/functions/posts', {
            method: 'POST',
            body: JSON.stringify(doc),
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (err) {
        console.error(err)
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Something went wrong!'
        });
    }
}