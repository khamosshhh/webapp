import React, { useEffect, useState } from 'react'
import ItemListMedicineComponent from './ItemListMedicineComponent'
import '../../css/MedicineListComponent.css'
import CommonService from '../../service/CommonService'
import AdminService from '../../service/AdminService'


const ListMedicineComponent = () => {

    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const initialize = async () => {
            try {
                const category = await AdminService.getAllCategories();
                setCategories(category.data);
                const medicines = await CommonService.getAllMedicines();
                setMedicines(medicines.data);

            } catch (e) {
                console.log(e.message);
            }
        }
        initialize();
    }, []);

    const onDropdownSelected = async (e) => {

        const selectedIndex = e.target.options.selectedIndex;
        const categoryid = e.target.options[selectedIndex].getAttribute('categoryid');
        console.log(categoryid);
        try {
            if (categoryid === '-1') {
                const medicines = await CommonService.getAllMedicines();
                setMedicines(medicines.data);
            } else {
                const res = await AdminService.getCategoryById(categoryid);
                console.log(res.data);
                setMedicines(res?.data?.medicines);

            }
        } catch (e) { }
    };

    const medicineItems = medicines?.map((medicine, index) => {

        return (<div key={index}>
            <ItemListMedicineComponent key={index} medicine={medicine} />
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
                                <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
                                    <ol className="breadcrumb mb-0">
                                        <li className="breadcrumb-item active" aria-current="page">
                                            <div className="form-control-static">
                                                <div className='form-group'>
                                                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Category</label>
                                                    <select className='form-select' name="categories" onChange={onDropdownSelected}>
                                                        <option categoryid='-1'>All</option>
                                                        {categories?.map((category) => {
                                                            return <option key={category.id} categoryid={category.id}>{category.name}</option>;
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        {medicineItems}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ListMedicineComponent