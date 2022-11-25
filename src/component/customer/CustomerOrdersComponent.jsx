import React, { useEffect, useState } from 'react'
import AdminService from '../../service/AdminService';
import AuthenticationService from '../../service/AuthenticationService';

const CustomerOrdersComponent = () => {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const handleOrders = async () => {
            setOrders([]);
            try {
                const customerResponse =  await AuthenticationService.getLoggedCustomer();
                const customerId = customerResponse.data.id;
                const orders = await AdminService.getAllOrdersWithRelations();
                const filteredOrders = orders.filter(p => p.customer.id === customerId);
                setOrders(filteredOrders);
            } catch (e) {
                console.log(e.message);
            }
        }
        handleOrders();
    }, []);



    const order = orders?.map((order, index) => {
        return (
            <tbody key={index}>
                <tr>
                    <td>{order?.medicine?.name}</td>
                    <td>₹{order?.medicine?.price}</td>
                    <td>{order?.orderDate}</td>
                    <td>{order?.quantity}</td>
                    <td>₹{(Number(order?.quantity * order?.medicine?.price) || 0)}</td>

                </tr>
            </tbody>
        )
    });

    return (
        <div>
            <div className="container">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row ">
                            <div className="col-sm-8"><h2><b>
                                Orders
                            </b></h2></div>
                        </div>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Total Cost</th>
                            </tr>
                        </thead>
                        {/* //TABLE order HERE */}
                        {order}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CustomerOrdersComponent