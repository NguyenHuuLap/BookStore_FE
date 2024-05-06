import React, { useState } from 'react'
import { Menu } from 'antd'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons'
import HeaderCoponent from '../../components/HeaderComponent/HeaderComponent'
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />), 
        getItem('Sản phẩm', 'product', <AppstoreOutlined />), 
    ];

    const [keySelected, setkeySelected] = useState('');

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            default:
                return <></>
        }
    }


    const handleOnClick = ({ key }) => {
        setkeySelected(key)
    }

    return (
        <>
            <HeaderCoponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                    }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: 1, padding: '15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    )
}
export default AdminPage