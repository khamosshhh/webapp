import axios from "axios";
import authenticationHeader from "./AuthenticationHeader";
const API_URL_CATEGORY = "http://localhost:4040/category";
const API_URL_ORDER = "http://localhost:4040/order";
const API_URL_ADMIN = "http://localhost:4040/admin";
const API_URL_MEDICINE = "http://localhost:4040/medicine";
const API_URL_CUSTOMER = "http://localhost:4040/customer";
const API_URL_COMMONS = "http://localhost:4040/commons";

const getAllCustomers = () => {
    return axios.get(API_URL_ADMIN + "/customer", { headers: authenticationHeader(), });
};

const getAllCategories = () => {
    return axios.get(API_URL_CATEGORY, { headers: authenticationHeader() });
};

const getAllOrders = () => {
    return axios.get(API_URL_ORDER, { headers: authenticationHeader(), });
}

const getAllOrdersWithRelations = async () => {
    const response = await getAllOrders();
    const orders = response.data;

    for (const order of orders) {
        const medicine = await axios.get(API_URL_MEDICINE + '/of-order/' + order.id, { headers: authenticationHeader() });
        const customer = await axios.get(API_URL_CUSTOMER + '/of-order/' + order.id, { headers: authenticationHeader() });
        order.medicine = medicine.data;
        order.customer = customer.data;
    }
    return orders;
}

const getAllMedicines = () => {
    return axios.get(API_URL_COMMONS + '/medicines');
}

const getMedicineById = (id) => {
    return axios.get(API_URL_MEDICINE + '/' + id, { headers: authenticationHeader() });
}

const getMedicineByIdWithRelations = async (id) => {
    const medicineResponse = await axios.get(API_URL_MEDICINE + '/' + id, { headers: authenticationHeader() });
    const medicine = medicineResponse.data;
    const categoryResponse = await axios.get(API_URL_COMMONS + '/category-of-medicine/' + medicineResponse.data.id);
    const category = categoryResponse.data;
    medicine.category = category;
    return medicine;
}

const getAllMedicinesWithRelations = async () => {
    const response = await getAllMedicines();
    const medicines = response.data;

    for (const medicine of medicines) {
        const category = await axios.get(API_URL_COMMONS + '/category-of-medicine/' + medicine.id);
        medicine.category = category.data;
    }
    return medicines;
}

const getCategoryById = async (id) => {
    return await axios.get(API_URL_CATEGORY+ '/' + id);
}

const deleteCustomerById = (id) => {
    return axios.get(API_URL_ADMIN + "/customer/delete" + id, { headers: authenticationHeader(), });
}

const deleteItemById = (id, itemType) => {
    switch (itemType) {
        case 'medicine':
            return axios.delete(API_URL_MEDICINE + "/delete/" + id, { headers: authenticationHeader() });
        case 'order':
            return axios.delete(API_URL_ORDER + "/delete/" + id, { headers: authenticationHeader() });
        case 'customer':
            return axios.delete(API_URL_ADMIN + "/customer/delete/" + id, { headers: authenticationHeader() });
        case 'category':
            return axios.delete(API_URL_CATEGORY + "/delete/" + id, { headers: authenticationHeader() });
        default:
            break;
    }
}

const saveMedicine = (medicine) =>  {
    return axios.post(API_URL_MEDICINE + "/save", medicine, { headers: authenticationHeader(), });
}

const assignMedicineToCategory = (medicineId, categoryId) =>  {
    return axios.post(`${API_URL_MEDICINE}/${medicineId}/assign-category/${categoryId}`, { headers: authenticationHeader() });
}

const saveCategory = (category) =>  {
    return axios.post(API_URL_CATEGORY + "/save", category, { headers: authenticationHeader(), });
}

const AdminService = {
    getAllCustomers,
    deleteCustomerById,
    getAllCategories,
    getAllOrders,
    getAllOrdersWithRelations,
    getAllMedicinesWithRelations,
    deleteItemById,
    getMedicineByIdWithRelations,
    getCategoryById,
    saveCategory,
    saveMedicine,
    assignMedicineToCategory,
    getMedicineById
}
export default AdminService;