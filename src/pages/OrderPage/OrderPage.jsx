import { Checkbox, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperInputNumber, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';
import * as CartItemService from '../../services/CartItemService'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';

const OrderPage = () => {
  const user = useSelector((state) => state.user)
  const location = useLocation()
  const { state } = location

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const navigate = useNavigate()
  const [form] = Form.useForm();

  const dispatch = useDispatch()
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const fetchCartItem = async () => {
    const res = await CartItemService.getDetailsCartItem(state?.id, state?.token)
    return res.data;
  };
  const queryCartItem = useQuery({ queryKey: ['user'], queryFn: fetchCartItem }, {
    // enabled: state?.id && state?.token
  });

  const mutation = useMutationHooks(
    (data) => {
      const { id, access_token, ...rests } = data
      CartItemService.updateAmount(id, ...rests, access_token)
    }
  )
  const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess, isError } = mutation

  // const mutation = useMutationHooks(
  //   (data) => {
  //     const { id, token , cartItems, userId } = data
  //     const res = CartItemService.getDetailsCartItem(id, token,cartItems, userId)
  //     return res
  //   }
  // )

  const { isLoading: isLoadingCartItem, data: dataCartItem } = queryCartItem;

  const handleChangeCount = async (type, idProduct, limited, access_token) => {
    const userId = user.id;

    const cartItem = dataCartItem?.cartItems?.find(item => item.product === idProduct);
    console.log('Cart Item:', cartItem);
    if (cartItem) {
      if (type === 'increase') {
        if (!limited) {
          // dispatch(increaseAmount({ idProduct }));
          mutation.mutate({ id: idProduct, cartItem, access_token: access_token })
          await CartItemService.updateAmount(userId, access_token, cartItem, type);   // Truyền loại hành động và dữ liệu cần cập nhật
        }

      } else {
        if (!limited) {
          // dispatch(decreaseAmount({ idProduct }));
          mutation.mutate({ id: idProduct, cartItem, access_token: access_token })
          await CartItemService.updateAmount(userId, access_token, cartItem, type); // Truyền loại hành động và dữ liệu cần cập nhật
        }
      }
    } else {
      console.error('Sản phẩm không tồn tại trong giỏ hàng');
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }))
  }

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = []
      dataCartItem?.cartItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }
  // console.log('data12', dataCartItem)

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }
  // Thêm hàm để tính toán tổng giá tiền của những sản phẩm có trong listChecked
  const calculateTotalPrice = (cartItems) => {
    let totalPrice = 0;
    cartItems.forEach(cartItem => {
      if (listChecked.includes(cartItem.product)) {
        const priceAfterDiscount = cartItem.price * (1 - (cartItem.discount || 0) / 100);
        totalPrice += priceAfterDiscount * cartItem.amount;
      }
    });
    return totalPrice;
  };

  const priceMemo = useMemo(() => {
    if (dataCartItem && dataCartItem.cartItems) {
      return calculateTotalPrice(dataCartItem.cartItems);
    }
    return 0;
  }, [dataCartItem, listChecked]);
  // console.log('data1', priceMemo)

  const priceDiscountMemo = useMemo(() => {
    // const result = order?.orderItemsSlected?.reduce((total, cur) => {
    //   const priceAfterDiscount = cur.price * (1 - (cur.discount || 0) / 100); // Tính giá sau khi giảm giá
    //   return total + (priceAfterDiscount * cur.amount); // Tính tổng tiền sau giảm giá cho sản phẩm hiện tại
    // },0)
    // if(Number(result)){
    //   return result
    // }
    return 0
  }, [dataCartItem])

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 20000 && priceMemo < 500000) {
      return 10000
    } else if (priceMemo >= 500000 || dataCartItem?.cartItems?.length === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) + Number(diliveryPriceMemo) + Number(priceDiscountMemo)
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])
  // console.log(totalPriceMemo)

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
  }

  const handleAddCard = () => {
    if (!dataCartItem?.cartItems?.length) {
      message.error('Vui lòng chọn sản phẩm')
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment', {
        state: {
          selectedProducts: dataCartItem?.listChecked, // Pass selected products data
        }
      });
    }
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, access_token, ...rests } = data
      CartItemService.updateAmount(id, rests, access_token)
    },
  )

  const { isLoading, data } = mutationUpdate

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const itemsDelivery = [
    {
      title: '20.000 VND',
      description: 'Dưới 200.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
    },
    {
      title: 'Free ship',
      description: 'Trên 500.000 VND',
    },
  ]
  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <Loading isLoading={isLoading}>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperLeft>
              <h4>Phí giao hàng</h4>
              <WrapperStyleHeaderDilivery>
                <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 10000
                  ? 2 : diliveryPriceMemo === 20000 ? 1
                    : dataCartItem.cartItems.length === 0 ? 0 : 3} />
              </WrapperStyleHeaderDilivery>
              <WrapperStyleHeader>
                <span style={{ display: 'inline-block', width: '390px' }}>
                  <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === dataCartItem?.cartItems?.length}></CustomCheckbox>
                  <span> Tất cả ({dataCartItem?.cartItems?.length} sản phẩm)</span>
                </span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
                </div>
              </WrapperStyleHeader>
              <WrapperListOrder>
                {dataCartItem?.cartItems?.map((cartItems) => {
                  return (
                    <WrapperItemOrder key={cartItems?.product}>
                      <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CustomCheckbox onChange={onChange} value={cartItems?.product} checked={listChecked.includes(cartItems?.product)}></CustomCheckbox>
                        <img src={cartItems?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                        <div style={{
                          width: 260,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{cartItems?.name}</div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>
                          <span style={{ fontSize: '13px', color: '#333', fontWeight: '650' }}>{convertPrice((cartItems?.price - cartItems?.price * (cartItems?.discount / 100)))}</span>
                          {/* <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span> */}
                        </span>
                        <WrapperCountOrder>
                          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', cartItems?.product, cartItems?.amount === 1, user?.access_token)}>
                            <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />

                          </button>

                          <WrapperInputNumber defaultValue={cartItems?.amount} value={cartItems?.amount} size="small" min={1} max={cartItems?.countInstock} />
                          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', cartItems?.product, cartItems?.amount === cartItems.countInstock, cartItems?.amount === 1, user?.access_tokend)}>
                            <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                          </button>
                        </WrapperCountOrder>
                        <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{convertPrice((cartItems?.price - cartItems?.price * (cartItems?.discount / 100)) * cartItems?.amount)}</span>
                        <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(cartItems?.product)} />
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperListOrder>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: '100%' }}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>Thay đổi</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Tạm tính</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Giảm giá</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Phí giao hàng</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(diliveryPriceMemo)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              <ButtonComponent
                onClick={() => handleAddCard()}
                size={40}
                styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
                }}
                textbutton={'Mua hàng'}
                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonComponent>
            </WrapperRight>
          </div>
        </div>
        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          {/* <Loading isLoading={isLoading}> */}
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
          </Form>
          {/* </Loading> */}
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default OrderPage