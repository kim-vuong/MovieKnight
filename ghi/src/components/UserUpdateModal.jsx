import useAuthService from '../hooks/useAuthService'
import { useEffect } from 'react'
import { tryFetch } from '../utils'
import { Modal, Form, Input, Button, message } from 'antd'

import '../vanilla/user-profile.css'

export default function UserUpdateModal({ visible, onClose }) {
    const { user, setUser } = useAuthService()
    const [form] = Form.useForm()

    const API_HOST = import.meta.env.VITE_API_HOST
    if (!API_HOST) {
        throw new Error('VITE_API_HOST is not defined')
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                picture_url: user.picture_url,
            })
        }
    }, [user, form])

    const handleSubmit = async (formData) => {
        const defaultPictureUrl =
            'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'

        const updatedFormData = {
            ...formData,
            picture_url: formData.picture_url || defaultPictureUrl,
        }

        const updateUrl = `${API_HOST}/api/users/update`
        const options = {
            credentials: 'include',
            method: 'PUT',
            body: JSON.stringify(updatedFormData),
            headers: { 'Content-Type': 'application/json' },
        }

        const updatedUser = await tryFetch(updateUrl, options)

        if (updatedUser instanceof Error) {
            console.error(`Error: ${updatedUser.error}`)
        } else {
            setUser(updatedUser)
            message.success('Profile successfully updated!')
            onClose()
        }
    }

    return (
        <Modal
            forceRender
            title="Update Profile Details"
            open={visible}
            onCancel={onClose}
            footer={null}
            className="user-modal"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="username" label="Username">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="New Password">
                    <Input.Password />
                </Form.Item>
                <Form.Item name="picture_url" label="Picture URL">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
