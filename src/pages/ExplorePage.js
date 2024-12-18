import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import { useSelector } from 'react-redux'

const ExplorePage = () => {
  const params = useParams()
  const [pageNo, setPageNo] = useState(1)
  const [data, setData] = useState([])
  const [totalPageNo, setTotalPageNo] = useState(0)
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    year: ''
  })

  const fetchData = async () => {
    try {
      const response = await axios.get(`/discover/${params.explore}`, {
        params: {
          page: pageNo,
          genre: filters.genre,
          rating: filters.rating,
          year: filters.year
        }
      })

      // Apply local filtering for year and rating after fetching data
      let filteredResults = response.data.results;

      if (filters.year) {
        filteredResults = filteredResults.filter(item => {
          const releaseYear = new Date(item.release_date).getFullYear();
          return releaseYear === parseInt(filters.year);
        });
      }

      if (filters.rating) {
        filteredResults = filteredResults.filter(item => {
          return item.vote_average >= parseFloat(filters.rating);
        });
      }

      setData((prev) => [
        ...prev,
        ...filteredResults
      ]);
      setTotalPageNo(response.data.total_pages);
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleScroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      setPageNo(prev => prev + 1)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }))
    setPageNo(1)
    setData([]) // Reset the data when filters are changed
  }

  useEffect(() => {
    fetchData()
  }, [pageNo, filters])

  useEffect(() => {
    setPageNo(1)
    setData([])
    fetchData()
  }, [params.explore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isClicked = useSelector((state) => state.click_redux_slice.isClicked)

  // Generate a list of years from current year to a certain past year
  const currentYear = new Date().getFullYear()
  const yearsList = []
  for (let year = currentYear; year >= 1900; year--) {
    yearsList.push(year)
  }

  // Generate a list of ratings from 1 to 10
  const ratingsList = []
  for (let rating = 1; rating <= 10; rating++) {
    ratingsList.push(rating)
  }

  // Adjust classNames dynamically based on `isClicked` state
  const containerClasses = isClicked ? 'py-16' : 'py-16 bg-slate-100'
  const titleClasses = isClicked ? 'capitalize text-lg lg:text-xl font-semibold my-3' : 'capitalize text-black/60 text-lg lg:text-xl font-semibold my-3'
  const filterPanelClasses = isClicked ? 'w-1/4 p-4' : 'w-1/4 p-4 text-black'
  const contentPanelClasses = isClicked ? 'w-3/4 pl-6' : 'w-3/4 pl-6'

  return (
    <div className={containerClasses}>
      <div className="container mx-auto flex">
        {/* Left Filter Section */}
        <div className={`${filterPanelClasses} shadow-lg`}>
          <h4 className="text-xl font-semibold mb-4">Filters</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Genre</label>
              <select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md text-black"
              >
                <option value="">Select Genre</option>
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                {/* Add more genres as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full p-2 border text-black rounded-md"
              >
                <option value="">Select Rating</option>
                {ratingsList.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}+
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Year</label>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full p-2 border text-black rounded-md"
              >
                <option value="">Select Year</option>
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className={contentPanelClasses}>
          <h3 className={titleClasses}>
            Popular {params.explore} show
          </h3>

          <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">
            {
              data.map((exploreData, index) => {
                return (
                  <Card data={exploreData} key={exploreData.id + "exploreSEction"} media_type={params.explore} />
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
