import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import withAuth from '../utile/withAuth'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { BsFillPlayFill } from 'react-icons/bs'
import VideoShowModal from './Componant/VideoShowModal';
import CastAndCrew from './CastAndCrew';
function DetailsPage() {
    const location = useLocation()
    const [movieDetails, setmovieDetails] = useState([])
    const [movieTrailer, setMovieTrailer] = useState("")
    const [openmodal, setopenmodal] = useState(false)
    const [castCraw, setCastCrew] = useState([])
    const [socialMediaID, setSocialMediaID] = useState([])
    useEffect(() => {
        const data = withAuth({
            endPoint: `movie/${location.state.id}?append_to_response=videos`,
            method: "get"
        })
        data.then((respones) => {
            setmovieDetails(respones)
        })
        movieVideo()
        getCastCrew()
        fetchSocialMedia()
    }, [location])

    const movieVideo = () => {
        const data = withAuth({
            endPoint: `movie/${location.state.id}?append_to_response=videos`,
            method: "get"
        })
        data.then((respones) => {
            respones.videos.results.filter((value) => {
                if (value.name.includes("Trailer")) {
                    setMovieTrailer(value.key)
                }
            })
        })
    }

    const getCastCrew = () => {
        const data = withAuth({
            endPoint: `movie/${location.state.id}?append_to_response=credits`,
            method: "get"
        })
        data.then((respones) => {
            setCastCrew(respones)
        })
    }

    const fetchSocialMedia = () => {
        const data = withAuth({
            endPoint: `movie/${location.state.id}/external_ids`,
            method: "get"
        })
        data.then((respones) => {
            setSocialMediaID(respones)
        })
    }
    return (
        <div className=''>
            <div className='flex flex-col' >
                <div className='flex justify-center  relative max-w-screen-xl mx-2  flex-wrap'>
                    <img src={`https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`} className={`background-image: linear-gradient(to top, var(--tw-gradient-stops));  max-w-screen-xl flex justify-center items-center rounded-3xl w-[98%] h-[480px]  max-md:mx-1  max-lg:h-[500px] bg-gradient-to-t from-slate-600  top-[0%] right-[0%]   max-md:w-[99%]  max-sm:w-[102%]    max-sm:mx-1 mr-[0.5%] max-sm:mr-0`}>
                    </img>
                    <div className='absolute  max-w-screen-xl flex justify-end items-center rounded-3xl w-[99%] h-[490px]  max-md:mx-1  max-lg:h-[500px] bg-gradient-to-t from-slate-600  top-[0%] right-[0%]   max-md:w-[99%]  max-sm:w-[102%]    max-sm:mx-1 mr-[0.5%] max-sm:mr-0  '>

                        {movieDetails.poster_path && <div className=' mx-8 max-xs:hidden'>
                            <img src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`} className='w-64 h-auto rounded-md' />
                        </div>}
                        {movieDetails.release_date && <div className='relative text-white w-11/12 flex flex-col' >
                            <div className='flex items-center'>
                                <span className=' text-[33px]  max-lg:text-[27px] max-md:text-[22px]   font-extralight leading-9' style={{ fontFamily: "notosans" }}>{movieDetails.original_title} {`(${movieDetails.release_date.substring(0, 4)})`} </span>

                            </div>
                            <div className=' w-10/12 mt-1 max-xs:text-sm'>
                                {<span className='cerificate text-sm  mr-1 border border-[0.1] px-1 border-[#B3E5F8] fon'>UA</span>}
                                <span className='release_date mx-1'>{`${movieDetails.release_date} (IN)`}</span>
                                <span className='mx-1'>{movieDetails?.genres?.map((data) => {
                                    return <span className='mx-1'>{data.name}</span>

                                })}</span>
                                <span className='mx-1'>{`${Math.floor(movieDetails.runtime / 60)}h  ${movieDetails.runtime % 60}M`}</span>
                            </div>
                            <div className='my-3 flex  items-center   '>
                                <span className='block w-11 hover:scale-125 transition duration-500 cursor-pointer mx-1'>
                                    <CircularProgressbar value={movieDetails.vote_average * 10} text={`${Math.floor(movieDetails.vote_average * 10)} % `} styles={buildStyles({
                                        textSize: '28px', transition: 'stroke-dashoffset 0.5s ease 0s',
                                        backgroundColor: "white",
                                        textColor: "#fff",
                                        pathColor: "#fff",
                                        trailColor: "gray",
                                        rotation: 0.25,
                                    })} />
                                </span>
                                <span className='ml-2 text-base font-medium leading-5' style={{ fontFamily: "sandRegular" }} >
                                    User<br /> Score
                                </span>
                                <span onClick={() => { setopenmodal(true) }} style={{ fontFamily: "sandRegular" }} className='flex items-center text-base ml-5 hover:scale-105 transition duration-500 cursor-pointer mx-1 '>
                                    <BsFillPlayFill className='text-2xl mt-1' color={movieTrailer ? "green" : "white"} /> Play Trailer
                                </span>
                            </div>
                            <div className='mt-4 max-md:mt-1'>
                                <span className='my-2'>
                                    {movieDetails.tagline}
                                </span>
                                <div className='my-5 max-md:my-1'>
                                    <span className='my-5 max-md:my-2'>Overview</span>
                                    <span className=' w-11/12  flex leading-5 text-[15px]  max-lg:text-[13px] max-md:text-[12px] max-md:leading-4'>

                                        {(movieDetails?.overview?.length > 270) ? movieDetails.overview.substring(0, 270) : movieDetails.overview}
                                    </span>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <VideoShowModal videoID={movieTrailer} openModal={openmodal} modalHandle={setopenmodal} />
                </div>

                <div className='mx-2 w-full'>
                    <CastAndCrew CastCrewProps={castCraw} socialMedia={socialMediaID} movieDetails={movieDetails} />
                </div>
            </div>
        </div>
    )
}

export default DetailsPage