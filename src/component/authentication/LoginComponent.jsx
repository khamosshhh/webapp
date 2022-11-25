import '../../css/LoginComponent.css'
import { useFormik } from "formik";
import * as Yup from 'yup';
import AuthenticationService from '../../service/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginComponent = () => {
    let navigate = useNavigate();
    const [error, setError] = useState('');
    const [viewError, setViewError] = useState(false);

    const handleLogin = (user) => {
        AuthenticationService.login(user.email, user.password, user.role).then(
            () => {
                if(user.role === 'admin') {
                    navigate("/user/dashboard");
                    window.location.reload();
                } else {
                    navigate("/home");
                    window.location.reload();
                }
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
    };

    const validationSchema = Yup.object().shape({

        email: Yup.string().required("Email is required").email("Email is invalid"),
        password: Yup.string()
            .required("Password is required")
    });

    const formik = useFormik({
        initialValues: {

            email: "",
            password: "",
            role: "user"
        },
        validationSchema,
        onSubmit: (data) => {
            let user = {
                email: data.email,
                password: data.password,
                role: data.role
            }
            handleLogin(user);
        },
        onReset: ( )=> {
            setViewError(false);
        }
    });

    return (
        <>

            <div className="login-form">

                <form onSubmit={formik.handleSubmit}>
                    <div className='form-group'>
                        <h2 className="text-center">Log in</h2>
                        <br />
                        <div className="text-center">
                            <div className="form-check form-check-inline" >

                                <input
                                    name="role"
                                    type="radio"
                                    className="form-check-input"
                                    onChange={formik.handleChange}
                                    value='user'
                                    id='radioUser'
                                    defaultChecked={true}

                                />
                                <label className="form-check-label" htmlFor="radioUser">
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
                                    id='radioAdmin'
                                />
                                <label className="form-check-label" htmlFor="radioAdmin">
                                    Admin
                                </label>
                            </div>
                        </div>
                    </div>
                    <br />
                     {viewError && (<div className="text-danger text-center">
                        <p>{error}</p>
                    </div>)}
                    <div className="form-group">
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
                    <br />
                    <div className="form-group">

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
                    <br />
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Login
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
            </div>
        </>
    );
}

export default LoginComponent