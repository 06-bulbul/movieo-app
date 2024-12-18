import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import userIcon from '../assets/user.png'
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from '../contants/navigation';
import { toggleClick } from '../store/clickSlice';
import { useSelector, useDispatch } from 'react-redux';
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

const Header = () => {
    const location = useLocation()
    const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ")
    const [searchInput,setSearchInput] = useState(removeSpace)
    const navigate = useNavigate()
   
    useEffect(()=>{
        if(searchInput){
            navigate(`/search?q=${searchInput}`)
        }
    },[searchInput])

    const handleSubmit = (e)=>{
        e.preventDefault()
    }

    const isClicked = useSelector((state) => state.click_redux_slice.isClicked);
    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(toggleClick()); 
    };

  return (
    <header className={isClicked ? 'fixed top-0 w-full h-16 bg-black bg-opacity-50 z-40':'fixed top-0 w-full h-16 bg-slate-100 text-black bg-opacity-90 z-40'}>
            <div className='container mx-auto px-3 flex items-center h-full'>
                <Link to={"/"}>
                    <img
                        src={logo}
                        alt='logo'
                        width={60}
                    />
                </Link>

                <nav className='hidden lg:flex items-center gap-1 ml-5'>
                    {
                        navigation.map((nav,index)=>{
                            return(
                                <div>
                                    <NavLink key={nav.label+"header"+index} to={nav.href} className={isClicked? ({isActive})=>`px-2 hover:text-neutral-100 hover:font-extrabold ${isActive && "text-neutral-100 font-extrabold"}`:({isActive})=>`px-2 hover:text-neutral-900 hover:font-extrabold ${isActive && "text-neutral-900 font-extrabold"}`}>
                                        {nav.label}
                                    </NavLink>
                                </div>
                            )
                        })
                    }
                </nav>

                <div className='ml-auto flex items-center gap-5'>
                    <form className='flex items-center gap-2' onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Search here...'
                            className='bg-transparent px-4 py-1 outline-none border-none hidden lg:block'
                            onChange={(e)=>setSearchInput(e.target.value)}
                            value={searchInput}
                        />
                        <button className={isClicked? 'text-2xl text-white':'text-2xl'}>
                                <IoSearchOutline/>
                        </button>
                    </form>
                    <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all'>
                        <Link to={"/user"}>
                            <img
                                src={userIcon}
                                width='w-ful h-full'
                                alt="" 
                            />
                        </Link>
                    </div>
                    <div className='ml-auto cursor-pointer'>
                        {isClicked ? <MdLightMode size={32} onClick={handleToggle}/> : <MdDarkMode className='text-black' size={32} onClick={handleToggle}/>}
                    </div>
                </div>
            </div>
    </header>
  )
}

export default Header
