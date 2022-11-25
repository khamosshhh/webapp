export default function authenticationHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.jwt) {
        return { Authorization: 'Bearer ' + user.jwt };
    } else {
        return {};
    }
}