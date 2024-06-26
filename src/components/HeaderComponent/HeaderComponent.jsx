import { Badge, Button, Col, Popover } from 'antd'
import React from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButttonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { useEffect } from 'react';
import { searchProduct } from '../../redux/slides/productSlide'
import imageShop from '../../assets/image/Shop.png'
import * as  CartItemService from '../../services/CartItemService'
import { useQuery } from '@tanstack/react-query';
import { useMutationHooks } from '../../hooks/useMutationHook';


const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const user = useSelector((state) => state.user);

  const location = useLocation()
  const { state } = location

  const fetchCartItem = async () => {
    const res = await CartItemService.getDetailsCartItem(user?.id, user?.access_token)
    return res.data;
  };

  const queryCartItem = useQuery({ queryKey: ['user'], queryFn: fetchCartItem }, {
    // enabled: state?.id && state?.token
  });
  const { isLoading, data } = queryCartItem;

  const [loading, setLoading] = useState(false)
  const handleNavigateLogin = () => {
    navigate('/login')
  }

  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const handleDetailsCart = (id) => {
    navigate(`/order/${id}`, {
      state: {
        id: user?.id,
        token: user?.access_token
      }
    });
  };

  // const mutation = useMutationHooks(
  //   (data) => {
  //     const { id, token, cartItems, userId } = data
  //     const res = CartItemService.getDetailsCartItem(id, token, cartItems, userId)
  //     return res
  //   }
  // )
  // console.log('data:', data);
  // console.log('id', data?.map((cart) => cart.cartItems?.length))

  // console.log('Data:', data);
  // console.log('cartItem', data.cartItems.length)

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (

        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === 'profile') {
      navigate('/profile-user')
    } else if (type === 'admin') {
      navigate('/system/admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{ heiht: '100%', width: '100%', display: 'flex', background: '#9255FD', justifyContent: 'center' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={3}>
          <WrapperTextHeader to='/'>
            <img src={imageShop} alt="Shop Logo" style={{ height: 'auto', width: '100%', maxWidth: '100px' }} />
          </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={14}>
            <ButttonInputSearch
              size="large"
              bordered={false}
              textbutton="Tìm kiếm"
              placeholder="input search text"
              onChange={onSearch}
              backgroundColorButton="#5a20c1"
            />
          </Col>
        )}
        <Col span={4} style={{ display: 'flex', gap: '60px', alignItems: 'center', marginLeft: '30px' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccout>
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div style={{ cursor: 'pointer', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccout>
          </Loading>
          <Loading isLoading={isLoading}>
            {!isHiddenCart && (
              <div onClick={() => handleDetailsCart(data?._id)} style={{ cursor: 'pointer' }}>
                <Badge count={data?.cartItems.length} size="small">
                  <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                </Badge>
                <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
              </div>
            )}
          </Loading>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent