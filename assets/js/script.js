
// <--- theme switch -->

// getting the selected theme from the local storage
let theme = localStorage.getItem('theme');

if (theme == null) {
    setTheme('light-mode');
}
else {
    setTheme(theme);
}


// switching themes
let themeDots = document.getElementsByClassName('theme-dot');

for (var i = 0; i < themeDots.length; i++) {
    themeDots[i].addEventListener('click', function () {
        let mode = this.id;
        // console.log(id);
        setTheme(mode);
    })
}

function setTheme(mode) {
    if (mode == 'light-mode') {
        document.querySelector('#theme-style').href = "";
    }
    if (mode == 'dark-mode') {
        document.querySelector('#theme-style').href = "/assets/css/dark.css";
    }
    localStorage.setItem('theme', mode);
}
