import React, { useEffect, useState } from 'react'
import '../../css/BuyMedicineComponent.css'
import placeholder from '../../image/medicine/buy_medicine_placeholder.png'
import {  useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import AuthenticationService from '../../service/AuthenticationService';
import CustomerService from '../../service/CustomerService';

const BuyMedicineComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [medicine, setMedicine] = useState([]);
    const [quantity, setQuantity] = useState(1);
    
    useEffect(() => {
        setMedicine(location.state.medicine);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const onQuantityChanged = e => {
        const { value } = e.target;
        if(value > 0) {
            setQuantity(value);
        }

    }



    const onOrder = async() => {
        const res = await AuthenticationService.getLoggedCustomer();
        const customer = res.data;
        const date = format(new Date(), 'dd/MM/yyyy');

        const order = {
            orderDate: date,
            quantity,
        }
        CustomerService.buyMedicine(order, medicine.id, customer.id);
        navigate('/user/success');
    }

  return (
    <div>
        <div className='container'>
        <div className="card mx-auto col-md-5 col-8 mt-3 p-0">
            <img className='mx-auto pic' src={placeholder} alt='med'/>
            <div className="card-title d-flex px-4">
                <p className="item text-muted">{medicine?.name}<label className="register">&reg;</label> </p>
                <p>₹{medicine?.price * quantity}</p>
            </div>
            <div className="card-body">
                <p className="text-muted">Your payment details</p>
                <div className="numbr mb-3">
                    <i className=" col-1 fas fa-credit-card text-muted p-0"></i>
                    <input className="col-10 p-0" type="text" placeholder="Card Number"/>
                    
                </div>
                <div className="numbr mb-3">
                    <i className=" col-1 fas fa-credit-card text-muted p-0"></i>
                    <input className="col-10 p-0" type="number" value={quantity} placeholder="Quantity" onChange={(e) => onQuantityChanged(e)}/>
                    
                </div>
                <div className="line2 col-lg-12 col-12 mb-4">
                    <i className="col-1 far fa-calendar-minus text-muted p-0"></i>
                    <input className="cal col-5 p-0" type="text" placeholder="MM/YY"/>
                    <i className="col-1 fas fa-lock text-muted"></i>
                    <input className="cvc col-5 p-0" type="text" placeholder="CVC"/>
                </div>
            </div>
            <div className="footer text-center p-0">
                <div className="col-lg-12 col-12 p-0">
                    <p className="order" onClick={() => onOrder()}>Order Now</p>
                </div>
            </div>
        </div>

    </div>
    </div>
  )
}

export default BuyMedicineComponent