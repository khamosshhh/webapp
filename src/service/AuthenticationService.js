import axios from "axios";
import authenticationHeader from "./AuthenticationHeader";

const API_URL = "http://localhost:4040/authentication";
const registerAdmin = (admin) => {
    return axios.post(API_URL + "/register-admin", admin);
};

const registerCustomer = (customer) => {
  return axios.post(API_URL + "/register-customer", customer);
};

const login = async (username, password, role) => {
    let isAdmin = false;
    let isUser = false;
    if(role === 'admin') {
        isAdmin = true;
    } else {
        isUser = true;
    }
    const response = await axios.post(API_URL + "/login", {
        username,
        password,
        isAdmin,
        isUser
    });
    if (response.data.jwt) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem("user");
};
const getCurrentToken = () => {
    return JSON.parse(localStorage.getItem("user"));
};

//TODO make a parameter inside authenticationHEader function which takes role and check the jwt wheather it is customer if customer role is passed or if it is admin if admin role is passed. and both if all or no or whatever role is passed. else throw error
const getLoggedCustomer = () => {
    return axios.get(API_URL + "/customer/get-logged-in", { headers: authenticationHeader() });
};

const getLoggedAdmin = () => {
    return axios.get(API_URL + "/admin/get-logged-in", { headers: authenticationHeader() });
};

const AuthenticationService = {
    registerAdmin,
    registerCustomer,
    login,
    logout,
    getCurrentToken,
    getLoggedCustomer,
    getLoggedAdmin
};
export default AuthenticationService;