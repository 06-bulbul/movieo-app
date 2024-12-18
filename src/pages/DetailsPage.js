import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useFetchDetails from '../hooks/useFetchDetails'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Divider from '../components/Divider'
import HorizontalScollCard from '../components/HorizontalScollCard'
import VideoPlay from '../components/VideoPlay'

const DetailsPage = () => {
  const params = useParams()
  const imageURL = useSelector(state => state.movieoData.imageURL)
  const { data } = useFetchDetails(`/${params?.explore}/${params?.id}`)
  const { data :castData} = useFetchDetails(`/${params?.explore}/${params?.id}/credits`)
  const { data : similarData } = useFetch(`/${params?.explore}/${params?.id}/similar`)
  const { data : recommendationData } = useFetch(`/${params?.explore}/${params?.id}/recommendations`)
  const [playVideo,setPlayVideo] = useState(false)
  const [playVideoId,setPlayVideoId] = useState("")

  console.log("data",data)
  console.log("star cast",castData)

  const handlePlayVideo = (data) => {
    // Set play video
    setPlayVideoId(data);
    setPlayVideo(true);

    // Add movie to recently watched list in localStorage
    const movieToAdd = {
      title: data?.title || data?.name,
      id: data?.id,
      poster: data?.poster_path,
      backdrop: data?.backdrop_path,
      release_date: data?.release_date,
      overview: data?.overview,
      vote_average: data?.vote_average,
      vote_count: data?.vote_count,
      watchedOn: new Date().toISOString(), // Add current timestamp when watched
    };

    // Retrieve existing recently watched list
    const existingList = JSON.parse(localStorage.getItem('recentlyWatched')) || [];

    // Check if the movie is already in the list
    const isMovieAlreadyWatched = existingList.some(movie => movie.id === movieToAdd.id);

    if (!isMovieAlreadyWatched) {
      // Add movie to list and update localStorage
      existingList.push(movieToAdd);
      localStorage.setItem('recentlyWatched', JSON.stringify(existingList));
    }
  }

  const duration = (data?.runtime/60)?.toFixed(1)?.split(".")
  const writer = castData?.crew?.filter(el => el?.job === "Writer")?.map(el => el?.name)?.join(", ")

  const isClicked = useSelector((state)=> state.click_redux_slice.isClicked);

  return (
    <div className={isClicked ? '' : 'bg-slate-100'}>
      <div className='w-full h-[280px] relative hidden lg:block'>
        <div className='w-full h-full'>
          <img
              src={imageURL + data?.backdrop_path}
              className='h-full w-full object-cover'
              alt=''
          />
        </div>
        <div className={isClicked ? 'absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent' : 'absolute top-0 w-full h-full bg-gradient-to-t from-slate-100 to-transparent'}></div>
      </div>

      <div className='container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10'>
        <div className='relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60'>
          <img
              src={imageURL + data?.poster_path}
              className='h-80 w-60 object-cover rounded'
              alt=''
          />
          <button onClick={() => handlePlayVideo(data)} className='mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition-all'>Play Now</button>
        </div>

        <div>
          <h2 className={isClicked ? 'text-2xl lg:text-4xl font-bold text-white' : 'text-2xl lg:text-4xl font-bold text-black'}>{data?.title || data?.name}</h2>
          <p className={isClicked ? 'text-neutral-400' : 'text-neutral-600'}>{data?.tagline}</p>

          <Divider />

          <div className={isClicked ? 'flex items-center gap-3' : 'flex items-center gap-3 text-black'}>
            <p>Rating : {Number(data?.vote_average).toFixed(1)}+</p>
            <span>|</span>
            <p>View : {Number(data?.vote_count)}</p>
            <span>|</span>
            <p>Duration : {duration[0]}h {duration[1]}m</p>
          </div>

          <Divider />

          <div>
            <h3 className={isClicked ? 'text-xl font-bold text-white mb-1' : 'text-xl font-bold text-black mb-1'}>Overview</h3>
            <p className={isClicked ? '' : 'text-neutral-600'}>{data?.overview}</p>

            <Divider />
            <div className={isClicked ? 'flex items-center gap-3 my-3 text-center' : 'flex items-center gap-3 my-3 text-center text-neutral-600'}>
              <p>Status : {data?.status}</p>
              <span>|</span>
              <p>Release Date : {moment(data?.release_date).format("MMMM Do YYYY")}</p>
              <span>|</span>
              <p>Revenue : {Number(data?.revenue)}</p>
            </div>

            <Divider />
          </div>

          <div>
            <p><span className={isClicked ? 'text-white' : 'text-black'}>Director</span> : {castData?.crew[0]?.name}</p>

            <Divider />

            <p>
              <span className={isClicked ? 'text-white' : 'text-black'}>Writer : {writer}</span>
            </p>
          </div>

          <Divider />

          <h2 className={isClicked ? 'font-bold text-lg' : 'font-bold text-lg text-neutral-600'}>Cast :</h2>
          <div className='grid grid-cols-[repeat(auto-fit,96px)] gap-5 my-4'>
            {
              castData?.cast?.filter(el => el?.profile_path).map((starCast, index) => {
                return (
                  <div key={index}>
                    <div>
                      <img
                        src={imageURL + starCast?.profile_path}
                        className='w-24 h-24 object-cover rounded-full'
                        alt=''
                      />
                    </div>
                    <p className='font-bold text-center text-sm text-neutral-400'>{starCast?.name}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      <div>
        <HorizontalScollCard data={similarData} heading={"Similar " + params?.explore} media_type={params?.explore} />
        <HorizontalScollCard data={recommendationData} heading={"Recommendation " + params?.explore} media_type={params?.explore} />
      </div>

      {
        playVideo && (
          <VideoPlay data={playVideoId} close={() => setPlayVideo(false)} media_type={params?.explore} />
        )
      }
    </div>
  )
}

export default DetailsPage
