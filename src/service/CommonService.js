import axios from "axios"

const API_URL_COMMON = 'http://localhost:4040/commons';

const getAllMedicines = () => {
    return axios.get(API_URL_COMMON + '/medicines');
}

const getCategoryByMedicineId = (id) => {
    return axios.get(API_URL_COMMON + '/category-of-medicine/' + id);
}



const CommonService = {
    getAllMedicines,
    getCategoryByMedicineId
    
}

export default CommonService;
