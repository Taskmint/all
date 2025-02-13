document.addEventListener("DOMContentLoaded", function () {
    const lastPage = localStorage.getItem("lastPage");

    // If a last visited page exists and it's not the current one, redirect
    if (lastPage && lastPage !== window.location.pathname) {
        let iframe = document.getElementById("iframe");

// Set the src attribute dynamically
        iframe.src = lastPage;
    }
});

function savePage(url) {
    localStorage.setItem("lastPage", url);
}

