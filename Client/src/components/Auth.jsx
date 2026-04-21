import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Login from '../pages/Login'
import Register from '../pages/Register'

const Auth = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth)
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    if (user) {
      onClose()
    }
  }, [user])

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4'>
      <div className='relative w-full max-w-md'>
        
        <button 
          onClick={onClose}
          className='absolute top-8 right-5 text-gray-800 hover:text-black text-xl'>
          <FaTimes size={18}/> 
        </button>

        {isLogin ? (
          <Login isModel={true} switchAuth={() => setIsLogin(false)} />
        ) : (
          <Register isModel={true} switchAuth={() => setIsLogin(true)} />
        )}

      </div>
    </div>
  )
}

export default Auth