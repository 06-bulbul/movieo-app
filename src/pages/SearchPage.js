import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { useSelector } from 'react-redux'

const SearchPage = () => {
  const location = useLocation()
  const [data,setData] = useState([])
  const [page,setPage] = useState(1)
  const navigate = useNavigate()

  const query = location?.search?.slice(3)

  const fetchData = async()=>{
    try {
        const response = await axios.get(`search/multi`,{
          params : {
            query :location?.search?.slice(3),
            page : page
          }
        })
        setData((preve)=>{
          return[
              ...preve,
              ...response.data.results
          ]
        })
    } catch (error) {
        console.log('error',error)
    }
  }

  useEffect(()=>{
    if(query){
      setPage(1)
      setData([])
      fetchData()
    }
  },[location?.search])


  const handleScroll = ()=>{
    if((window.innerHeight + window.scrollY ) >= document.body.offsetHeight){
      setPage(preve => preve + 1)
    }
  }

  useEffect(()=>{
    if(query){
      fetchData()
    }
  },[page])

  useEffect(()=>{
    window.addEventListener('scroll',handleScroll)
},[])

const isClicked = useSelector((state)=> state.click_redux_slice.isClicked);

  return (
    <div className={isClicked? 'py-16':'py-16 bg-slate-100'}>

        <div className='lg:hidden my-2 mx-1 sticky top-[70px] z-30'>
            <input 
              type='text'
              placeholder='Search here...'
              onChange={(e)=> navigate(`/search?q=${e.target.value}`)}
              value={query?.split("%20")?.join(" ")}
              className='px-4 py-1 text-lg w-full bg-white rounded-full text-neutral-900 '
            />
        </div>
        <div className='container mx-auto'>
          <h3 className={isClicked? 'capitalize text-lg lg:text-xl font-semibold my-3':'capitalize text-black/60 text-lg lg:text-xl font-semibold my-3'}>Search Results</h3>

          <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
              {
                data.map((searchData,index)=>{
                  return(
                    <Card data={searchData} key={searchData.id+"search"} media_type={searchData.media_type}/>
                  )
                })
              }
          </div>

        </div>
    </div>
  )
}

export default SearchPage
