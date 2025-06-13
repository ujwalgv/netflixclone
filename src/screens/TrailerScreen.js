import React, { useState, useEffect, Component } from "react";
import axios from "../axios";
import { Rings } from "react-loader-spinner";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import "./TrailerScreen.css";

const apiConstants = {
  initial: "INITIAL",
  inProgress: "INPROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const TrailerScreen = () => {
  const [apiStatus, setApiStatus] = useState(apiConstants.initial);
  const [movieData, setMovieData] = useState({});
  const [videoLink, setVideoLink] = useState();
  const [posterLink, setPosterLink] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setApiStatus(apiConstants.inProgress);
      const API_KEY = "b001728b52268d061be60d754ba98fbe";

      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;
      const response = await fetch(url);
      if (response.ok === true) {
        const data = await response.json();
        if (data.videos.results.length > 0) {
          setVideoLink(data.videos.results[0].key);
          setMovieData({
            movieData: data,
            title: data.title,
            caption: data.tagline,
            description: data.overview,
          });
          setApiStatus(apiConstants.success);
        } else if (data.videos.results.length == 0) {
          setPosterLink(data.backdrop_path);
          setMovieData({
            movieData: data,
            title: data.title,
            caption: data.tagline,
            description: data.overview,
          });
          setApiStatus(apiConstants.success);
        }
        setPosterLink(data.backdrop_path);
        setMovieData({
          movieData: data,
          title: data.title,
          caption: data.tagline,
          description: data.overview,
        });
        setApiStatus(apiConstants.success);
        // setApiStatus(apiConstants.failure);
      } else {
        setApiStatus(apiConstants.failure);
      }
      console.log(response);
    };
    fetchData();
  }, []);

  // state = { apiStatus: apiConstants.initial, movieData: {} };

  // componentDidMount() {
  //   this.getMovieDetails();
  // }

  // getMovieDetails = async () => {
  //   this.setState({ apiStatus: apiConstants.inProgress });
  //   const API_KEY = "b001728b52268d061be60d754ba98fbe";
  //   const { id } = useParams();
  //   const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

  //   const response = await fetch(url);
  //   if (response.ok === true) {
  //     this.setState({
  //       movieData: response,
  //       apiStatus: apiConstants.success,
  //     });
  //   } else {
  //     this.setState({ apiStatus: apiConstants.failure });
  //   }
  // };

  const renderLoadingView = () => (
    <div data-testid="loader">
      <Rings type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  );

  const onHomeClick = () => {
    navigate("/");
  };

  const renderFailureView = () => (
    <div className="failure-screen">
      <img
        className="loginScreen-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
        alt="logo"
        onClick={onHomeClick}
      />
      <img src="/not found.svg" alt="failure view" className="lost-icon" />
      <div className="failure-page">
        <h1>Oops! Something Went Wrong</h1>
        <p>
          We are having some trouble to complete your request. <br />
          Please try again.
        </p>
        <button type="button" onClick={onHomeClick}>
          Go Home
        </button>
      </div>
    </div>
  );

  const renderMoviePageVideos = () => {
    const videoUrl = `https://www.youtube-nocookie.com/embed/${videoLink}?autoplay=1&controls=0&mute=1&showinfo=1`;
    console.log(movieData);
    const match = movieData.movieData.vote_average;
    const year = movieData.movieData.release_date.slice(0, 4);
    console.log(videoLink);

    return (
      <div className="trailerScreen">
        <img
          className="loginScreen-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="logo"
          onClick={onHomeClick}
        />
        <div className="banner--faderight" />

        <div className="trailerScreen-video-container">
          {videoLink != undefined ? (
            <iframe
              className="video-frame"
              width="800"
              height="600"
              src={videoUrl}
              frameBorder="0"
            ></iframe>
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/original/${posterLink}`}
              alt="poster"
              className="poster-image"
            />
          )}
        </div>
        <div className="video-titles-container">
          <h1>{movieData.title}</h1>
          <h2>{movieData.caption}</h2>
          <div className="movie-tags">
            <p className="movie-match-text">{`${match * 10}% Match`}</p>
            <p className="year">{year}</p>
            <img src="/imdb.png" className="imdb-pic" alt="imdb" />
            <p className="year">{match}</p>
            <img src="/HD.png" alt="hd" className="hd-icon" />
          </div>
          <p className="movie-description">{movieData.description}</p>
        </div>
      </div>
    );
  };

  const renderAllVideos = () => {
    console.log("this is success", apiStatus);
    switch (apiStatus) {
      case apiConstants.success:
        return renderMoviePageVideos();
      case apiConstants.failure:
        return renderFailureView();
      case apiConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return <div>{renderAllVideos()}</div>;
};

// function TrailerScreen(fetchUrl) {
//   const { id } = useParams();
//   const [trailerLink, setTrailerLink] = useState([]);
//   const [movieData, setMovieData] = useState([]);
//   const [posterLink, setPosterLink] = useState([]);
//   const url = `/movie/${id}${fetchUrl.fetchUrl}`;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const request = await axios.get(url);
//         setMovieData(request.data);
//         setTrailerLink(request.data.videos.results[1].key);
//       } catch (error) {
//         console.log(error.message);
//         const navigate = useNavigate();
//         navigate("/failure");
//       }
//     };

//     fetchData();
//   }, []);

//   // useEffect(() => {
//   //   async function fetchData() {
//   //     try {
//   //     const request = await axios.get(url)
//   //       setMovieData(request.data);
//   //       setTrailerLink(request.data.videos.results[1].key);
//   //     }
//   //     catch(error) {
//   //       console.error(error);
//   //     }
//   //     // return request;

//   //   fetchData();
//   // }, [fetchUrl]);

//   const videoUrl = `https://www.youtube-nocookie.com/embed/${trailerLink}?autoplay=1&controls=0&mute=1&showinfo=1`;

//   return (
//     <div className="trailerScreen">
//       <img
//         className="loginScreen-logo"
//         src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png"
//         alt="logo"
//       />
//       <div className="trailerScreen-video-container">
//         <iframe
//           className="video-frame"
//           width="1200"
//           height="600"
//           src={videoUrl}
//           frameBorder="0"
//         ></iframe>
//       </div>
//       <div className="video-titles-container">
//         <h1>{movieData.title}</h1>
//         <h2>{movieData.tagline}</h2>
//         <p>{movieData.overview}</p>
//       </div>
//     </div>
//   );
// }

export default TrailerScreen;
