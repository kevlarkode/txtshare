
let getBtn = document.querySelector('#fetch-info');
let inputBox = document.querySelector('#input-box');
let viewBtn = document.querySelector('#view');
let downloadBtn = document.querySelector('#download');

let fetchResult = '';
let fetchResponse = '';

const clipId = new URLSearchParams(window.location.search).get('id');

inputBox.value = clipId;

let loadingMessage = document.createElement('p');
loadingMessage.innerText = 'Loading...';
let btnDiv = document.querySelector('.btn-div');

getBtn.addEventListener('click', () => {
    let clip_id = inputBox.value;
    if (clip_id !== '') {
        getBtn.style.display = 'none';
        btnDiv.appendChild(loadingMessage);
        getFile(clip_id);
    }
    else {
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Enter Clip ID first!'
        })
    }
});

downloadBtn.addEventListener('click', () => {
    // console.log(fetchResult.count)
    deleteFileOnCondition();
});

let deleteFileOnCondition = async () => {
    let clip_id = inputBox.value;
    if (fetchResult.count === 0) {
        await fetch('/.netlify/functions/posts?' + new URLSearchParams({
            clip_id: clip_id
        }));
    }
};

const getFile = async (clip_id) => {
    try {
        const response = await fetch('/.netlify/functions/posts?' + new URLSearchParams({
            clip_id: clip_id
        }));

        const res = await response.json();
        fetchResponse = response;
        fetchResult = res;

        if (response.ok) {
            loadingMessage.remove();
            viewBtn.style.display = 'block';
            viewBtn.href = fetchResult.url;
            downloadBtn.href = fetchResult.download_url;
            downloadBtn.style.display = 'block';
        }
        else {
            Swal.fire({
                icon: 'error',
                confirmButtonColor: '#8b0000',
                confirmButtonText: 'OK',
                title: 'The file does not exist!'
            }).then(() => {
                window.location.replace('/get/');
            })

        }
    } catch (err) {
        console.error(err)
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Something went wrong!'
        });
        return;
    }
}
