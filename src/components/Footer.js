import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Footer = () => {
  const isClicked = useSelector((state)=> state.click_redux_slice.isClicked);
  return (
    <footer className={isClicked? 'text-center bg-neutral-600 bg-opacity-35 text-neutral-400 py-2':'text-center bg-neutral-400 bg-opacity-35 text-neutral-200 py-2'}>
        <div className='flex items-center justify-center gap-4'>
          <Link to="/" >About</Link>
          <Link to="/">Contact</Link>
        </div>
        <p className='text-sm'>Created By 🐦Bulbul</p>
    </footer>
  )
}

export default Footer
