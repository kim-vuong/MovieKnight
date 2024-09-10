import useAuthService from '../hooks/useAuthService'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { tryFetch } from '../utils'
import { Modal } from 'antd'
import UserUpdateModal from './UserUpdateModal'

import '../vanilla/user-profile.css'

export default function UserDetail() {
    const { user, signout } = useAuthService()
    const [isFormVisible, setIsFormVisible] = useState(false)
    const navigate = useNavigate()
    const updateFormModal = () => {
        setIsFormVisible(true)
    }

    const API_HOST = import.meta.env.VITE_API_HOST
    if (!API_HOST) {
        throw new Error('VITE_API_HOST is not defined')
    }

    const closeFormModal = () => {
        setIsFormVisible(false)
    }

    const handleDelete = async () => {
        Modal.confirm({
            className: 'user-modal',
            title: 'Confirm Deletion',
            content:
                'Are you sure you want to permanently delete your account?',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                const userUrl = `${API_HOST}/api/users/${user.id}`
                const options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                }
                try {
                    await tryFetch(userUrl, options)
                    signout()
                    navigate('/')
                } catch (e) {
                    console.error(`Failed to delete user: ${e}`)
                }
            },
        })
    }

    if (!user) return <div>Loading</div>

    return (
        <div className="max-w-96 detail-card">
            <div className="flex flex-col justify-center">
                <div className="flex justify-center mb-2">
                    <img
                        className="border-2 rounded-full max-w-48 mb-4"
                        src={user.picture_url}
                        alt=""
                    />
                </div>
                <div className="flex justify-center mb-6">
                    <h1 className="text-3xl">{user.username}</h1>
                </div>
                <div className="flex justify-center mb-3">
                    <button
                        onClick={updateFormModal}
                        className="user-detail-button
                            submit
                            hover:bg-zinc-600 hover:text-white hover:border-zinc-500
                            transition-colors duration-300"
                    >
                        Update
                    </button>
                </div>
                <div className="flex justify-center user-modal mb-3">
                    <button
                        onClick={handleDelete}
                        type="button"
                        className="user-detail-button
                        user-modal
                        hover:bg-red-500 hover:text-white hover:border-red-500
                        transition-colors duration-300"
                    >
                        Delete
                    </button>
                </div>
                <div className="flex justify-center user-modal mb-3">
                    <Link
                        className="
                            user-detail-button
                            user-tl-button
                            submit
                            hover:bg-zinc-600 hover:text-white hover:border-zinc-500
                            transition-colors duration-300"
                        to="/displaytierlist"
                    >
                        Tierlist
                    </Link>
                </div>
                <div className="flex justify-center user-modal">
                    <Link
                        className="
                            user-detail-button
                            user-tl-button
                            submit
                            hover:bg-zinc-600 hover:text-white hover:border-zinc-500
                            transition-colors duration-300"
                        to="/tierlist"
                    >
                        Edit Tierlist
                    </Link>
                </div>
            </div>
            <UserUpdateModal visible={isFormVisible} onClose={closeFormModal} />
        </div>
    )
}
