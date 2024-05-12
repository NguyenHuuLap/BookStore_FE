import { axiosJWT } from "./UserService"

export const createCartItem = async (data, access_token) => {
    console.log('data', data)
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/cartitem/create/${data.user}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsCartItem = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/cartitem/order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}