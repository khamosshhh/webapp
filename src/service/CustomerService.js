import axios from "axios";
import authenticationHeader from "./AuthenticationHeader";

const API_URL_CUSTOMER = "http://localhost:4040/customer";
const API_URL_ORDER = "http://localhost:4040/order";

// const getAllOrders = () => {
//   return axios.get(API_URL + "all");
// };

const buyMedicine = async (order, medicineId, customerId) => {
    const auth = {
        headers: authenticationHeader()
    }
    const res = await axios.post(API_URL_ORDER + '/save', order, auth);
    const backOrder = res.data;
    const a = await axios.post(`${API_URL_ORDER}/${backOrder.id}/assign-medicine/${medicineId}`, auth);
    const b = await axios.post(API_URL_ORDER  + '/' + backOrder.id + '/assign-customer/' + customerId, auth);
    console.log(a,b, auth);
}

const addMedicineToCustomer = (customerId, medicineId) =>  {
    return axios.post(`${API_URL_CUSTOMER}/${customerId}/add-medicine/${medicineId}`, { headers: authenticationHeader() });
}

const removeMedicineFromCustomer = (customerId, medicineId) =>  {
    return axios.post(`${API_URL_CUSTOMER}/${customerId}/remove-medicine/${medicineId}`, { headers: authenticationHeader() });
}

const CustomerService = {
    buyMedicine,
    addMedicineToCustomer,
    removeMedicineFromCustomer
};


export default CustomerService;