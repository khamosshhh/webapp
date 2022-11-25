import React, { useEffect, useState } from 'react'
import ItemCustomerCartListMedicineComponent from '../medicine/ItemListMedicineComponent'
import '../../css/MedicineListComponent.css'
import AuthenticationService from '../../service/AuthenticationService'


const CustomerCartListMedicineComponent = () => {

    const [medicines, setMedicines] = useState([]);
    useEffect(() => {
        const initialize = async () => {
            try {
                const customer = await (await AuthenticationService.getLoggedCustomer()).data;
                const medicines = customer.cartMedicines;
                setMedicines(medicines);
            } catch (e) {
                console.log(e.message);
            }
        }
        initialize();
    }, []);

    

    const medicineItems = medicines?.map((medicine, index) => {

        return (<div key={index}>
            <ItemCustomerCartListMedicineComponent key={index} medicine={medicine} />
            <div className="mt-2"></div>
        </div>
        )
    });
    return (
        <div>
            <div className="container mt-5 mb-5">
                <div className="d-flex justify-content-center row">
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col">
                                <h3 className='text-center text-success'>Wish List</h3>
                            </div>
                        </div>


                        {medicineItems}
                        {/* <ItemCustomerCartListMedicineComponent />
                        <div className="mt-2"></div>
                        <ItemCustomerCartListMedicineComponent />
                        <div className="mt-2"></div>
                        <ItemCustomerCartListMedicineComponent />
                        <div className="mt-2"></div>  */}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CustomerCartListMedicineComponent