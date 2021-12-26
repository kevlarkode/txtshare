/*****  download button*****/
const downloadBtn = document.querySelector('#download');

downloadBtn.addEventListener('click', () => {
    saveFile();
});

let saveFile = () => {

    const inputText = document.querySelector('#input');
    let data = inputText.value;

    if (data === '') {
        alert('Enter text before download!');
        return;
    }

    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = 'result.txt';

    let newLink = document.createElement('a');
    newLink.download = sFileName;

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

// let max = (a, b) => {
//     return a > b ? a : b
// }
// let min = (a, b) => {
//     return a < b ? a : b
// }

// let count = 1;
// let uploadCount = document.querySelector('.upload-count');
// let uploadCountDown = document.querySelector('.upload-count-down');
// let uploadCountUp = document.querySelector('.upload-count-up');

// uploadCountDown.addEventListener('click', () => {
//     count = max(1, count - 1);
//     uploadCount.innerText = count;
// });
// uploadCountUp.addEventListener('click', () => {
//     count = min(100, count + 1);
//     uploadCount.innerText = count;
// });

/******  File create, process and upload *****/

const inputFile = document.querySelector('#input');
const submitBtn = document.querySelector('#submit');
const fileLink = document.querySelector('#file-link');
const fileCode = document.querySelector('#file-code');

submitBtn.addEventListener('click', () => {
    createFile();
});

let createFile = () => {

    const userInput = document.querySelector('#input');
    let inputText = userInput.value;

    if (inputText === '') {
        alert('Enter text before upload!');
        return;
    }

    let fileName = 'result';

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
        alert('No input found!');
        return;
    }

    uploadFile(base64EncodedFile);
};

let uploadFile = async (base64EncodedFile) => {
    try {
        const response = await fetch('/.netlify/functions/uploadFile', {
            method: 'POST',
            body: JSON.stringify({ data: base64EncodedFile }),
            headers: { 'Content-Type': 'application/json' },
        });
        let res = await response.json();

        fileLink.innerText = window.location + `clip/index.html?id=${res.clip_id}`;
        fileLink.href = window.location + `clip/index.html?id=${res.clip_id}`;
        fileCode.innerText = res.clip_id;

        let linkBox = document.querySelector('.display-link-div');
        linkBox.style.backgroundColor = ' hsl(249, 100%, 70%)';
    } catch (err) {
        console.error(err);
        alert('Something went wrong!');
    }
}