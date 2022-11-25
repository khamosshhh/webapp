import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/MedicineListComponent.css';
import PlaceholderImage from '../../image/medicine/placeholder_medicine.webp';
import AuthenticationService from '../../service/AuthenticationService';
import CommonService from '../../service/CommonService';
import CustomerService from '../../service/CustomerService';

const ItemListMedicineComponent = (props) => {
    const navigate = useNavigate();
    const [category, setCategory] = useState({});
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        CommonService.getCategoryByMedicineId(props.medicine.id)
            .then(response => {
                setCategory(response.data);
            }).catch(e => {
                console.log(e);
            });
        const handleCart = async () => {
            try {
                if (localStorage.getItem('user')) {
                    const custoemrRes = await AuthenticationService.getLoggedCustomer();
                    const customer = custoemrRes.data;
                    const inCart = customer.cartMedicines.some(med => med.id === props.medicine.id);
                    setInCart(inCart);
                }
            } catch (e) { }
        }
        handleCart();

    }, [props.medicine.id])

    const buyButtonClicked = (medicine) => {
        if (!localStorage.getItem('user')) {
            navigate('/login')
        } else {

            navigate('/user/buy', { state: { medicine } });
        }
    }

    const cartButtonClicked = async (medicine) => {
        if (!localStorage.getItem('user')) {
            navigate('/login')
        } else {
            try {
                const custoemrRes = await AuthenticationService.getLoggedCustomer();
                const customer = custoemrRes.data;
                if (!inCart) {
                    await CustomerService.addMedicineToCustomer(customer.id, medicine.id);
                    setInCart(true);
                } else {
                    await CustomerService.removeMedicineFromCustomer(customer.id, medicine.id);
                    setInCart(false);
                }
            } catch (e) { }
        }


    }

    return (
        <div>
            <div className="row p-2 bg-white border rounded">
                <div className="col-md-3 mt-1"><img className="img-fluid img-responsive rounded product-image" src={PlaceholderImage} alt='img' /></div>
                <div className="col-md-6 mt-1">
                    <h5>{props.medicine.name}</h5>
                    <div className="d-flex flex-row">
                        <div className="mt-1 mb-1 spec-1"><span>{props.medicine.companyName}</span></div>
                    </div>
                    <h6 className="text-success">{category.name}</h6>
                    <p className="text-justify text-truncate para mb-0 mt-3">MFD - {props.medicine.manufacturingDate}</p>
                    <p className="text-justify text-truncate para mb-0">Expiry - {props.medicine.expiryDate}<br /><br /></p>
                </div>
                <div className="align-items-center align-content-center col-md-3 border-left mt-1">
                    <div className="d-flex flex-row align-items-center">
                        <h4 className="mr-1">₹{props.medicine.price}</h4>
                    </div>
                    <div className="d-flex flex-column mt-4">
                        <button className="btn btn-primary btn-sm" type="button" onClick={() => { buyButtonClicked(props.medicine) }}>Buy Now</button>
                        {!inCart && (<button className="btn btn-outline-primary btn-sm mt-2" type="button" onClick={() => { cartButtonClicked(props.medicine) }}>Add to Wishlist</button>)}
                        {inCart && (<button className="btn btn-danger btn-sm mt-2" type="button" onClick={() => { cartButtonClicked(props.medicine) }}>Remove from Wishlist</button>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemListMedicineComponent