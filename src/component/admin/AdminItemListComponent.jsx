import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import AdminService from '../../service/AdminService';
import PlaceholderImage from '../../image/medicine/placeholder_medicine.webp';
import '../../css/MedicineListComponent.css';

const AdminItemListComponent = () => {
    const [items, setItems] = useState([]);
    const [itemType, setItemType] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.includes('customer')) {
            setItemType('customer');
        } else if (location.pathname.includes('categor')) {
            setItemType('category');
        } else if (location.pathname.includes('order')) {
            setItemType('order');
        } else if (location.pathname.includes('medicine')) {
            setItemType('medicine');
        }
    }, [location.pathname])


    useEffect(() => {

        const handleItems = async () => {
            let response = undefined;
            setItems([]);
            try {
                if (itemType === 'customer') {
                    response = await AdminService.getAllCustomers();
                    setItems(response.data);
                }
                if (itemType === 'category') {
                    response = await AdminService.getAllCategories();
                    setItems(response.data);
                }
                if (itemType === 'order') {
                    response = await AdminService.getAllOrdersWithRelations();
                    if (location.state?.id) {
                        const filteredOrders = response.filter((o) => o.customer.id === location.state.id);
                        setItems(filteredOrders);
                    } else {
                        setItems(response);
                    }

                }
                if (itemType === 'medicine') {
                    response = await AdminService.getAllMedicinesWithRelations();
                    if (location.state?.id) {
                        const filteredMedicine = response.filter((o) => o.category.id === location.state.id);
                        setItems(filteredMedicine);
                    } else {
                        setItems(response);
                    }

                }

            } catch (e) {}
        }
        handleItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemType]);

    const ordersButtonClicked = (id) => {
        navigate('/admin/orders', { state: { id } });
    }

    const addButtonClicked = () => {
        if(itemType === 'medicine') {
            navigate('/admin/add-medicine');
        } else if(itemType === 'category') {
            navigate('/admin/add-category');
        }
    }

    const medicinesButtonClicked = (id) => {
        navigate('/admin/medicines', { state: { id } });
    }

    const deleteButtonClicked = (id) => {
        AdminService.deleteItemById(id, itemType);
        const updatedItems = items.filter(p => p.id !== id);
        setItems(updatedItems);
    }

    const updateButtonClicked = (id) => {
        if(itemType === 'medicine') {
            navigate('/admin/update-medicine', { state: { id } });
        } else if(itemType === 'category') {
            navigate('/admin/update-category', { state: { id} });
        }
    }

    const item = items?.map((item, index) => {
        return (
            <tbody key={index}>
                <tr>
                    {(itemType !== 'order' && <td>{item?.name}</td>)}
                    {(itemType === 'order' && <td>{item?.medicine?.name}</td>)}
                    {(itemType === 'order' && <td>{item?.medicine?.price}</td>)}
                    {(itemType === 'order' && <td>{item?.customer?.name}</td>)}
                    {(itemType === 'order' && <td>{item?.customer?.email}</td>)}
                    {(itemType === 'order' && <td>{item?.orderDate}</td>)}
                    {(itemType === 'order' && <td>{item?.quantity}</td>)}
                    {(itemType === 'order' && <td>{(Number(item?.quantity * item?.medicine?.price) || 0)}</td>)}
                    {(itemType === 'customer' && <td>{item.email}</td>)}
                    <td>
                        {(itemType === 'customer' && <button className="btn btn-primary mx-1" title="Orders" data-toggle="tooltip"><i className="material-icons" onClick={() => { ordersButtonClicked(item.id) }}>Orders</i></button>)}
                        {(itemType === 'category' && <button className="btn btn-primary mx-1" title="Medicines" data-toggle="tooltip"><i className="material-icons" onClick={() => { medicinesButtonClicked(item.id) }}>Medicines</i></button>)}
                        {(itemType === 'category' && <button className="btn btn-success mx-1" title="Edit" data-toggle="tooltip"><i className="material-icons" onClick={() => { updateButtonClicked(item.id) }}>Update</i></button>)}
                        <button className="btn btn-danger" title="Delete" data-toggle="tooltip"><i className="material-icons" onClick={() => { deleteButtonClicked(item.id) }}>Delete</i></button>
                    </td>
                </tr>
            </tbody>
        )
    });

    const medicine = items?.map((medicine, index) => {
        return (
            <div key={index}>
                <div className="row p-2 bg-white border rounded">
                    <div className="col-md-3 mt-1"><img className="img-fluid img-responsive rounded product-image" src={PlaceholderImage} alt='img' /></div>
                    <div className="col-md-6 mt-1">
                        <h5>{medicine.name}</h5>
                        <div className="d-flex flex-row">
                            <div className="mt-1 mb-1 spec-1"><span>{medicine.companyName}</span></div>
                        </div>
                        <h6 className="text-success">{medicine?.category?.name}</h6>
                        <p className="text-justify text-truncate para mb-0 mt-3">MFD - {medicine.manufacturingDate}</p>
                        <p className="text-justify text-truncate para mb-0">Expiry - {medicine.expiryDate}<br /><br /></p>
                    </div>
                    <div className="align-items-center align-content-center col-md-3 border-left mt-1">
                        <div className="d-flex flex-row align-items-center">
                            <h4 className="mr-1">₹{medicine.price}</h4>
                        </div>
                        <div className="d-flex flex-column mt-4">
                            <button className="btn btn-primary btn-sm" type="button" onClick={() => { updateButtonClicked(medicine.id) }}>UPDATE</button>
                            <button className="btn btn-danger btn-sm mt-2" type="button" onClick={() => { deleteButtonClicked(medicine.id) }}>DELETE</button></div>
                    </div>
                </div>
                <br />
            </div>
        )
    });


    return (
        <div>
            <div className="container">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row ">
                            <div className="col-sm-8"><h2><b>
                                {(itemType === 'customer' && <>Customer Details</>)}
                                {(itemType === 'category' && <>Categories</>)}
                                {(itemType === 'order' && <>Orders</>)}
                                {(itemType === 'medicine' && <>Medicines</>)}
                            </b></h2></div>
                            <div className="col-sm-4 text-end">
                                {itemType !== 'customer' && itemType !== 'order' && (<button type="button" className="btn btn-success" onClick={() => addButtonClicked()}><i className="fa fa-plus"></i> Add New</button>)}

                            </div>
                        </div>
                    </div>
                    {(itemType === 'medicine' && <>{medicine}</>)}
                    {(itemType !== 'medicine' && <table className="table table-bordered">
                        <thead>
                            <tr>
                                {(itemType !== 'order' && <th>Name</th>)}
                                {(itemType === 'order' && <th>Medicine</th>)}
                                {(itemType === 'order' && <th>Price</th>)}
                                {(itemType === 'order' && <th>Customer</th>)}
                                {(itemType === 'order' && <th>Customer Email</th>)}
                                {(itemType === 'order' && <th>Date</th>)}
                                {(itemType === 'order' && <th>Quantity</th>)}
                                {(itemType === 'order' && <th>Total Cost</th>)}
                                {(itemType === 'customer' && <th>Email</th>)}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {/* //TABLE ITEM HERE */}
                        {item}
                    </table>)}
                </div>
            </div>
        </div>
    )
}

export default AdminItemListComponent