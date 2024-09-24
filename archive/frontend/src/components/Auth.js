export function isAuthorized() {
    return localStorage.getItem("LoggedIn") === 'true';
}

export function setLoggedIn(state) {
    localStorage.setItem("LoggedIn", state);
}