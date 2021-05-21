function getLanguage() {
    if (window.localStorage) {
        return (window.localStorage.language = window.localStorage.language || "en");
    } else {
        return "en";
    }
}
function getURL(language) {
    return `./cv-${language}.md`;
}
function setLanguage(language = getLanguage()) {
    const container = document.querySelector("main");
    container.innerHTML = "";
    if (window.localStorage) {
        window.localStorage.language = language;
    }
    document.title = `Jan Procházka - CV - ${language.toUpperCase()}`;
    fetch(getURL(language))
        .then(res => res.text())
        .then(content => container.innerHTML = marked(content));
}

document.querySelectorAll("[data-select-lang]").forEach(element => {
    let language = element.getAttribute("data-select-lang");
    element.addEventListener("click", _ => setLanguage(language));
});
setLanguage();