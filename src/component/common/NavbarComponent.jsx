import jwt from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import AuthenticationService from '../../service/AuthenticationService'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
    const navigate = useNavigate();
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentUserName, setCurrentUserName] = useState('');

    useEffect(() => {
        const token = AuthenticationService.getCurrentToken();
        if (token) {
            const user = jwt(token.jwt);
            setCurrentUser(user);
            setShowAdminBoard(user.isAdmin);
            if (user && user.isAdmin) {
                AuthenticationService.getLoggedAdmin().then(r => {
                    setCurrentUserName(r.data.name);
                }).catch(c => {
                    console.log(c);
                })
            } else {
                AuthenticationService.getLoggedCustomer().then(r => {
                    setCurrentUserName(r.data.name);
                }).catch(c => {
                    console.log(c);
                })
            }

        }
    }, []);
    const logOut = () => {
        AuthenticationService.logout();
        navigate("/home");
        window.location.reload();
    };
    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div  className="navbar-brand ms-5">
                    Medicine Shop
                </div>

                <div className="navbar-nav mr-auto">
                    {!showAdminBoard && currentUser && (
                        <li className="nav-item">
                            <Link to={"/home"} className="nav-link">
                                Home
                            </Link>
                        </li>
                    )}
                    {showAdminBoard && (
                        <>

                            <li className="nav-item">
                                <Link to={"/user/dashboard"} className="nav-link">
                                    Profile
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"admin/medicines"} className="nav-link">
                                    Medicines
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"admin/categories"} className="nav-link">
                                    Categories
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"admin/customers"} className="nav-link">
                                    Customers
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"admin/orders"} className="nav-link">
                                    Orders
                                </Link>
                            </li>
                        </>
                    )}
                    {!showAdminBoard && currentUser && (
                        <>
                            <li className="nav-item">
                                <Link to={"/user/dashboard"} className="nav-link">
                                    Profile
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"user/orders"} className="nav-link">
                                    Orders
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"user/cart"} className="nav-link">
                                    Wishlist
                                </Link>
                            </li>
                        </>
                    )}
                </div>
                {currentUser ? (
                    <div className="navbar-nav ms-auto pe-5">
                        <li className="nav-item">
                            <div className="nav-link">
                                {currentUserName}
                            </div>
                        </li>
                        <li className="nav-item">
                            <a href='#logout' className="nav-link" onClick={logOut}>
                                LogOut
                            </a>
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/account-setup"} className="nav-link">
                                Sign Up
                            </Link>
                        </li>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default NavbarComponent