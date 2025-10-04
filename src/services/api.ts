import axios from 'services/axios.customize';

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 1000
        }
    })
}

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/auth/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone })
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 100
        }
    })
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.get<IBackendRes<IRegister>>(urlBackend)
}

export const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUserAPI = (fullName: string, email: string,
    password: string, phone: string) => {
    const urlBackend = "/api/v1/users";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { fullName, email, password, phone, role:"6883003aac8a30a7ede53073" })
}

export const bulkCreateUserAPI = (hoidanit: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}[]) => {
    const urlBackend = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, hoidanit)
}

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = `/api/v1/users`;
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        { _id, fullName, phone })
}

export const deleteUserAPI = (_id: string) => {
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getBooksAPI = (query: string) => {
    const urlBackend = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend,
        {
            headers: {
                delay: 100
            }
        }
    )
}

export const getCategoriesAPI = (query: string) => {
    const urlBackend = `/api/v1/category?${query}`;
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(urlBackend,
        {
            headers: {
                delay: 100
            }
        }
    )
}

export const getCategoryAPI = () => {
    const urlBackend = `/api/v1/category`;
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(urlBackend);
}

export const createCategoryAPI = (
    name: string
) => {
    const urlBackend = "/api/v1/category";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { name })
}

export const updateCategoryAPI = (
    _id: string, name: string,
) => {
    const urlBackend = `/api/v1/category/${_id}`;
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        { name })
}

export const deleteCategoryAPI = (_id: string) => {
    const urlBackend = `/api/v1/category/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', fileImg);
    return axios<IBackendRes<{
        fileName: string
    }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "upload-type": folder
        },
    });
}


export const createBookAPI = (
    name:string,
    mainText: string, desc:string, author: string,
    price: number, quantity: number, category: string,
    thumbnail: string, slider: string[]
) => {
    const urlBackend = "/api/v1/book";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        {name, mainText,desc, author, price, quantity, category, thumbnail, slider, sold: 0 })
}


export const updateBookAPI = (
    _id: string,
    name:string, mainText: string,desc:string, author: string,
    price: number, quantity: number, category: string,
    thumbnail: string, slider: string[]
) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        {name, mainText,desc, author, price, quantity, category, thumbnail, slider })
}


export const deleteBookAPI = (_id: string) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getBookByIdAPI = (id: string) => {
    const urlBackend = `/api/v1/book/${id}`;
    return axios.get<IBackendRes<IBookTable>>(urlBackend,
        {
            headers: {
                delay: 100
            }
        }
    )
}

export const createOrderAPI = (
    name: string, address: string,
    phone: string, totalPrice: number,
    type: string, detail: any
) => {
    const urlBackend = "/api/v1/order";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { name, address, phone, totalPrice, type, detail })
}

export const getHistoryAPI = () => {
    const urlBackend = `/api/v1/history`;
    return axios.get<IBackendRes<IHistory[]>>(urlBackend)
}

export const updateUserInfoAPI = (
    _id: string, avatar: string, email:string,
    fullName: string, phone: string, role:string) => {
    const urlBackend = `/api/v1/users`;
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        { fullName, phone, avatar, _id, role, email })
}

export const updateUserPasswordAPI = (
    email: string, oldpass: string, newpass: string) => {
    const urlBackend = "/api/v1/users/change-password";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { email, oldpass, newpass })
}

export const getOrdersAPI = (query: string) => {
    const urlBackend = `/api/v1/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend)
}

export const getDashboardAPI = () => {
    const urlBackend = `/api/v1/dashboard`;
    return axios.get<IBackendRes<{
        totalOrders: number;
        // countUser: number;
        totalBooks: number;
    }>>(urlBackend)
}

