import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import '../../css/UserDashboard.css'
import PlaceholderImage from '../../image/user/user_dashboard_medicine.png';
import AuthenticationService from '../../service/AuthenticationService';


const UserDashboardComponent = () => {
    const [user, setUser] = useState({});
    const location = useLocation();

    useEffect(() => {
        const initialize = async () => {
            let user = {};
            if (location.pathname.includes('user')) {
                user = await AuthenticationService.getLoggedCustomer();
            } else if (location.pathname.includes('admin')) {
                user = await AuthenticationService.getLoggedAdmin();
            }
            setUser(user.data);
        }
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <section  >
                <div className="container ">
                    <div className="row">
                        <div className="col">
                            <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
                                <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item active" aria-current="page"><Link to={'/account-setup'} className=" text-reset text-decoration-none" > Edit Profile</Link></li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <img src={PlaceholderImage} alt="avatar"
                                        className="rounded-circle img-fluid" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Full Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.name}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default UserDashboardComponent