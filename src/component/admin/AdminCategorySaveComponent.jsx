import '../../css/LoginComponent.css'
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminService from '../../service/AdminService';

const AdminCategorySaveComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [itemId, setItemId] = useState();
    const [item, setItem] = useState({});

    useEffect(() => {
        if (location.state) {
            setItemId(location.state.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId, location?.state?.id]);

    useEffect(() => {
        if (location.state) {
            const handleItems = async () => {
                try {
                    if (itemId) {
                        const res = await AdminService.getCategoryById(itemId);
                        setItem(res.data);
                    }

                } catch (e) {
                    console.log(e);
                }
            }
            handleItems();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId])

    const handleSave = async (data) => {
        try {
            await AdminService.saveCategory(data);
            navigate('/admin/categories');
        } catch (e) {
            console.log(e);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required")
    });


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: item.name || ""
        },
        validationSchema,
        onSubmit: (data) => {
            let category;
            if (location.state) {
                category = {
                    id: item.id,
                    name: data.name,
                }
            } else {
                category = {
                    name: data.name,
                }
            }
            console.log(JSON.stringify(category));
            handleSave(category);
        },
    });




    return (
        <>
            <div className="login-form">
                <form onSubmit={formik.handleSubmit}>
                    <div className='form-group'>
                        <h2 className="text-center">Save</h2>
                    </div>
                    <br />
                    <div className="form-group">
                        <input
                            name="name"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values?.name}
                            placeholder='Name'
                        />
                        <div className="text-danger">
                            {formik.errors.name ? formik.errors.name : null}
                        </div>
                    </div>
                    <br />
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            {location.state && <>Update</>}
                            {!location.state && <>Create</>}
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

export default AdminCategorySaveComponent