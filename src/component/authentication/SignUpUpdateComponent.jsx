import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../../service/AuthenticationService';
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const SignUpUpdateComponent = () => {
    let navigate = useNavigate();
    const [updatingUser, setUpdatingUser] = useState();
    const [userId, setUserId] = useState();
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [viewError, setViewError] = useState(false);

    useEffect(() => {
        const handleIfLoggedIn = async () => {
            let user;
            const token = AuthenticationService.getCurrentToken();
            if (token) {
                user = jwtDecode(token.jwt);
                try {
                    if (user.isAdmin) {
                        setUserRole('admin');
                        user = await AuthenticationService.getLoggedAdmin();
                    } else {
                        setUserRole('user');
                        user = await AuthenticationService.getLoggedCustomer();
                    }
                } catch (e) {
                    setError(e.message);
                    setViewError(true);
                }

            }
            setUserId(user?.data.id);
            setUpdatingUser(user?.data);
        }
        handleIfLoggedIn();
    }, []);

    const handleSignUp = (user) => {
        if (updatingUser) {
            user.role = userRole;
        }
        if (user.role === 'admin') {
            AuthenticationService.registerAdmin(user).then(
                () => {
                    AuthenticationService.login(user.email, user.password, `admin`).then(
                        () => {
                            navigate("/home");
                            window.location.reload();
                        },
                        (error) => {
                            const resMessage =
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString();
                            console.log(resMessage);
                            setError(resMessage);
                    setViewError(true);
                        }
                    );

                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    console.log(resMessage);
                    setError(resMessage);
                    setViewError(true);
                }
            );
        } else {
            console.log(user);
            AuthenticationService.registerCustomer(user).then(
                (response) => {
                    console.log(user);
                    AuthenticationService.login(user.email, user.password, `user`).then(
                        () => {
                            navigate("/home");
                            window.location.reload();
                        },
                        (error) => {
                            const resMessage =
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString();
                            console.log(resMessage);
                            setError(resMessage);
                            setViewError(true);
                        }
                    );
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    console.log(resMessage);
                    setError(resMessage);
                    setViewError(true);
                }
            );
        }
    };

    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Fullname is required"),
        email: Yup.string().required("Email is required").email("Email is invalid"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
            .max(40, "Password must not exceed 40 characters"),
        confirmPassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
        acceptTerms: Yup.bool().oneOf([true], "Accept Terms is required"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fullname: updatingUser?.name || "",
            email: updatingUser?.email || "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
            role: updatingUser?.role || "user"
        },
        validationSchema,
        onSubmit: (data) => {
            const { fullname, email, password, role } = data;
            const user = {
                id: userId,
                name: fullname,
                email,
                password,
                role
            }
            handleSignUp(user);
        },
        onReset: () => {
            setViewError(false);
        }
    });
    return (
        <>
            <div className="login-form">
                <form onSubmit={formik.handleSubmit}>
                    <div className='form=group'>
                        <h2 className="text-center">
                            {!updatingUser && (<>Sign Up</>)}
                            {updatingUser && (<>Update Profile</>)}
                        </h2>
                        <br />
                        {!updatingUser && (<div className="text-center">
                            <div className="form-check form-check-inline" >

                                <input
                                    name="role"
                                    type="radio"
                                    className="form-check-input"
                                    onChange={formik.handleChange}
                                    value='user'
                                    id='radioUserSignUp'
                                    defaultChecked={true}

                                />
                                <label className="form-check-label" htmlFor="radioUserSignUp">
                                    User
                                </label>
                            </div>
                            <div className="form-check form-check-inline" >

                                <input
                                    name="role"
                                    type="radio"
                                    className="form-check-input"
                                    onChange={formik.handleChange}
                                    value='admin'
                                    id='radioAdminSignUp'
                                />
                                <label className="form-check-label" htmlFor="radioAdminSignUp">
                                    Admin
                                </label>
                            </div>
                        </div>)}
                    </div>
                    <br />

                    {viewError && (<div className="text-danger text-center">
                        <p>{error}</p>
                    </div>)}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            name="fullname"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.fullname}
                            placeholder='Full Name'
                        />
                        <div className="text-danger">
                            {formik.errors.fullname ? formik.errors.fullname : null}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email"> Email </label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            placeholder='Email'
                        />
                        <div className="text-danger">
                            {formik.errors.email ? formik.errors.email : null}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"> Password </label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            placeholder='Password'
                        />
                        <div className="text-danger">
                            {formik.errors.password ? formik.errors.password : null}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword"> Confirm Password </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            placeholder='Confirm Password'
                        />
                        <div className="text-danger">
                            {formik.errors.confirmPassword
                                ? formik.errors.confirmPassword
                                : null}
                        </div>
                    </div>
                    <br />
                    <div className="form-group form-check">
                        <input
                            name="acceptTerms"
                            type="checkbox"
                            className="form-check-input"
                            onChange={formik.handleChange}
                            value={formik.values.acceptTerms}
                        />
                        <label htmlFor="acceptTerms" className="form-check-label">
                            I have read and agree to the Terms
                        </label>
                        <div className="text-danger">
                            {formik.errors.acceptTerms ? formik.errors.acceptTerms : null}
                        </div>
                    </div>
                    <br />
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning float-end"
                            onClick={formik.handleReset}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div >


        </>
    );
}

export default SignUpUpdateComponent