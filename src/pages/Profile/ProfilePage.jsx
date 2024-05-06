import React, { useEffect, useState } from 'react'
import {
  WrapperHeader,
  WrapperContentProfile,
  WrapperLabel,
  WrapperInput,
  WrapperUploadFile
} from './style'
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useSelector, useDispatch } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { updateUser } from '../../redux/slides/userSlide';
import * as message from '../../components/Message/Message'
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils';

const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState(user?.email)
  const [name, setName] = useState(user?.name)
  const [phone, setPhone] = useState(user?.phone)
  const [address, setAddress] = useState(user?.address)
  const [avatar, setAvatar] = useState(user?.avatar)
  const mutaion = useMutationHooks(
    (data) => {
      const { id, access_token, ...rests } = data
      UserService.updateUser(id, data, access_token)
    })

  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError } = mutaion


  useEffect(() => {
    setEmail(user?.email)
    setName(user?.name)
    setPhone(user?.phone)
    setAddress(user?.address)
    setAvatar(user?.avatar)
  }, [user])

  useEffect(() => {
    if (isSuccess) {
      message.success('Cập nhật thành công')
      window.location.reload();       //reload trang khi nhấn update
      handleGetDetailsUser(user?.id, user?.access_token)
    } else if (isError) {
      message.error('Cập nhật thất bại')
    }
  }, [isSuccess, isError])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  };

  const handleOnChangeName = (value) => {
    setName(value)
  };

  const handleOnChangePhone = (value) => {
    setPhone(value)
  };

  const handleOnChangeAddress = (value) => {
    setAddress(value)
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview)
  }



  const handleUpdate = () => {
    mutaion.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
  };

  return (
    <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isLoading={isLoading}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <InputForm
              style={{ width: '300px' }}
              id="email"
              value={email}
              onChange={handleOnChangeEmail}
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '2px 6px 6px'
              }}
              textbutton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="name">Name</WrapperLabel>
            <InputForm
              style={{ width: '300px' }}
              id="name"
              value={name}
              onChange={handleOnChangeName}
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '2px 6px 6px'
              }}
              textbutton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
            <InputForm
              style={{ width: '300px' }}
              id="phone"
              value={phone}
              onChange={handleOnChangePhone}
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '2px 6px 6px'
              }}
              textbutton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </WrapperUploadFile>
            {avatar && (
              <img src={avatar} style={{
                height: '60px',
                width: '60px',
                borderRadius: '50%',
                objectFit: 'cover'
              }} alt='avatar' />
            )}
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '2px 6px 6px'
              }}
              textbutton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="address">address</WrapperLabel>
            <InputForm
              style={{ width: '300px' }}
              id="address"
              value={address}
              onChange={handleOnChangeAddress}
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '2px 6px 6px'
              }}
              textbutton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </WrapperInput>

        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default ProfilePage