import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const BannerHome = () => {
    const bannerData = useSelector(state => state.movieoData.bannerData)
    const imageURL = useSelector(state => state.movieoData.imageURL)
    const [currentImage,setCurrentImage] = useState(0)

    const handleNext = ()=>{
        if(currentImage < bannerData.length - 1){
            setCurrentImage(preve => preve + 1)
        }
    }
    const handleprevious = ()=>{
        if(currentImage > 0){
            setCurrentImage(preve => preve - 1)
        }
    }

    useEffect(()=>{
        const interval = setInterval(()=>{
            if(currentImage < bannerData.length - 1){
                handleNext()
            }else{
                setCurrentImage(0)
            }
        },5000)

        return ()=>clearInterval(interval)
    },[bannerData,imageURL,currentImage])

    const isClicked = useSelector((state) => state.click_redux_slice.isClicked);

  return (
    <section className='w-full h-full'>
        <div className={isClicked ?'bg-black flex min-h-full max-h-[95vh] overflow-hidden':'bg-white flex min-h-full max-h-[95vh] overflow-hidden'}>
            {
                bannerData.map((data,index)=>{
                    return(
                        <div key={data.id+"bannerHome"+index} className='min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all' style={{ transform : `translateX(-${currentImage * 100}%)`}}>
                                <div className='w-full h-full'>
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${imageURL+data.backdrop_path}`}
                                        className='h-full w-full object-cover'
                                        alt=''
                                    />
                                </div>

                                {/***button next and previous image */}
                                <div className='absolute top-0 w-full h-full hidden items-center  justify-between px-4 group-hover:lg:flex'>
                                    <button onClick={handleprevious} className={isClicked? 'bg-white p-1 text-black rounded-full -ml-2 z-10':'bg-black p-1 text-white rounded-full -ml-2 z-10'}>
                                        <FaAngleLeft/>
                                    </button>
                                    <button onClick={handleNext} className={isClicked? 'bg-white p-1 text-black rounded-full -ml-2 z-10':'bg-black p-1 text-white rounded-full -ml-2 z-10'}>
                                        <FaAngleRight/>
                                    </button>
                                </div>

                                <div className={isClicked? 'absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent':'absolute top-0 w-full h-full bg-gradient-to-t from-slate-100 to-transparent'}>
                                </div>

                                <div className='container mx-auto'>
                                    <div className=' w-full absolute bottom-0 max-w-md px-3'>
                                        <h2 className={isClicked? 'font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl':'font-extrabold text-2xl lg:text-4xl text-black drop-shadow-2xl'}>{data?.title || data?.name}</h2>
                                        <p className={isClicked? 'text-ellipsis line-clamp-3 my-2':'text-ellipsis text-black/60 line-clamp-3 my-2'}>{data.overview}</p>
                                        <div className={isClicked? 'flex items-center gap-4':'flex items-center gap-4 text-black/60'}>
                                            <p>Rating : { Number(data.vote_average).toFixed(1) }+</p>
                                            <span>|</span>
                                            <p>View : { Number(data.popularity).toFixed(0) }</p>
                                        </div>
                                        <Link to={"/"+data?.media_type+"/"+data.id}>
                                            <button  className={isClicked? 'bg-white px-4 py-2 text-black font-bold rounded mt-4 mb-3  hover:bg-gradient-to-l from-red-700 to-orange-500 shadow-md transition-all hover:scale-105':'bg-black px-4 py-2 text-white font-bold rounded mt-4 mb-3  hover:bg-gradient-to-l from-red-700 to-orange-500 shadow-md transition-all hover:scale-105'}>
                                                Play Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                
                        </div>
                    )
                })
            }
        </div>
    </section>
  )
}

export default BannerHome
