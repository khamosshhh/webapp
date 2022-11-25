import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BuyMedicineComponent from './component/medicine/BuyMedicineComponent';
import LoginComponent from './component/authentication/LoginComponent';
import SignUpUpdateComponent from './component/authentication/SignUpUpdateComponent';
import NavbarComponent from './component/common/NavbarComponent';
import { Routes, Route } from 'react-router-dom';
import UserDashboardComponent from './component/common/UserDashboardComponent'
import AdminItemListComponent from './component/admin/AdminItemListComponent'
import AdminMedicineSaveComponent from './component/admin/AdminMedicineSaveComponent'
import AdminCategorySaveComponent from './component/admin/AdminCategorySaveComponent'
import CustomerOrdersComponent from './component/customer/CustomerOrdersComponent';
import ListMedicineComponent from './component/medicine/ListMedicineComponent';
import OrderSuccessComponent from './component/medicine/OrderSuccessComponent';
import CustomerCartListMedicineComponent from './component/customer/CustomerCartListMedicineComponent';

function App() {
    return (
        <div className="App">
            <NavbarComponent />
            <Routes>
                <Route path="/" >
                    <Route path="admin" >
                        <Route path='medicines' element={<AdminItemListComponent/>}></Route>
                        <Route path="dashboard" element={<UserDashboardComponent />} />
                        <Route path='categories' element={<AdminItemListComponent/>}></Route>
                        <Route path='customers' element={<AdminItemListComponent/>}></Route>
                        <Route path='orders' element={<AdminItemListComponent/>}></Route>
                        <Route path='update-medicine' element={<AdminMedicineSaveComponent/>}/>
                        <Route path='add-medicine' element={<AdminMedicineSaveComponent/>}/>
                        <Route path='update-category' element={<AdminCategorySaveComponent/>}/>
                        <Route path='add-category' element={<AdminCategorySaveComponent/>}/>
                        <Route index element={<UserDashboardComponent />} />
                    </Route>
                    <Route path="login" element={<LoginComponent />} />
                    <Route path="account-setup" element={<SignUpUpdateComponent />} />
                    <Route path="user" >
                        <Route path="buy" element={<BuyMedicineComponent />} />
                        <Route path="orders" element={<CustomerOrdersComponent />} />
                        <Route path="dashboard" element={<UserDashboardComponent />} />
                        <Route path="success" element={<OrderSuccessComponent />} />
                        <Route path="cart" element={<CustomerCartListMedicineComponent />} />
                        <Route index element={<ListMedicineComponent />} />
                    </Route>
                    <Route index element={<ListMedicineComponent />} />
                </Route>
                <Route path='/home' element={<ListMedicineComponent />} />
            </Routes>

        </div>
    );
}

export default App;
