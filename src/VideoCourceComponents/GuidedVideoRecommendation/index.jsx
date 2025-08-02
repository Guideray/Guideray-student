import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaExpand, 
  FaCompress,
  FaImage
} from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { IoMdSkipForward, IoMdSkipBackward } from 'react-icons/io';
import { MdSpeed } from 'react-icons/md';
import axios from 'axios';
import './index.css';
import API_BASE_URL from '../../../config';

const GuidedVideoRecommendation = ({ videoData, darkMode, topicIndex, courseId, studentId }) => {
  // Refs
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(`https://img.youtube.com/vi/${getVideoId(videoData.link)}/maxresdefault.jpg`);
  const [playerReady, setPlayerReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaybackMenu, setShowPlaybackMenu] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isMarkedRead, setIsMarkedRead] = useState(false);
  const [progressData, setProgressData] = useState(null);

  // Extract YouTube ID from URL
  function getVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Fetch progress data on mount
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/consistancy/progress/${studentId}/${courseId}`
        );
        if (response.data.success) {
          setProgressData(response.data.data);
          // Check if this topic is already marked as completed
          const topicProgress = response.data.data.t.find(t => t.t === topicIndex);
          if (topicProgress && topicProgress.p > 0) {
            setIsMarkedRead(true);
          }
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    if (studentId && courseId) {
      fetchProgressData();
    }
  }, [studentId, courseId, topicIndex]);

  // Handle thumbnail loading error
  const handleThumbnailError = () => {
    setThumbnailError(true);
    setThumbnailUrl('https://via.placeholder.com/1280x720/333333/ffffff?text=Video+Preview');
  };

  // Check if video is completed (watched 95% or more) and mark as read automatically
  useEffect(() => {
    if (progress >= 95 && duration > 0 && !isMarkedRead) {
      markAsCompleted();
    }
  }, [progress, duration]);

  // Mark video as completed
  const markAsCompleted = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/consistancy/progress/${studentId}`,
        {
          courseName: courseId,
          topicIndex: topicIndex,
          completionType: "video",
          date: new Date().toISOString()
        }
      );

      if (response.data.success) {
        setIsMarkedRead(true);
        // Update local progress data
        if (progressData) {
          const updatedProgressData = { ...progressData };
          const topicToUpdate = updatedProgressData.t.find(t => t.t === topicIndex);
          if (topicToUpdate) {
            topicToUpdate.p = 100;
          } else {
            updatedProgressData.t.push({ t: topicIndex, p: 100 });
          }
          setProgressData(updatedProgressData);
        }
      }
    } catch (error) {
      console.error('Error marking video as completed:', error);
    }
  };

  // Manual mark as read handler
  const handleMarkAsRead = async () => {
    await markAsCompleted();
  };

  // Initialize YouTube Player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const initializePlayer = () => {
    const videoId = getVideoId(videoData.link);
    
    playerRef.current = new window.YT.Player(videoRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  const onPlayerReady = (event) => {
    setPlayerReady(true);
    setDuration(event.target.getDuration());
    event.target.setVolume(volume * 100);
  };

  const onPlayerStateChange = (event) => {
    switch(event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        setIsLoading(false);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        setIsLoading(false);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        setIsLoading(false);
        setProgress(100);
        setIsMarkedRead(true);
        break;
      case window.YT.PlayerState.BUFFERING:
        setIsLoading(true);
        break;
      case window.YT.PlayerState.CUED:
        setIsLoading(false);
        break;
    }
  };

  // Update progress and time
  useEffect(() => {
    let interval;
    
    if (isPlaying && playerReady) {
      interval = setInterval(() => {
        const newTime = playerRef.current.getCurrentTime();
        const newDuration = playerRef.current.getDuration();
        setCurrentTime(newTime);
        setProgress((newTime / newDuration) * 100);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, playerReady]);

  // Player controls
  const togglePlay = () => {
    if (!playerReady) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      setHasUserInteracted(true);
    }
  };

  const handleProgressClick = (e) => {
    if (!playerReady) return;
    
    const progressBar = progressRef.current;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const percentage = (clickPosition / progressBarWidth) * 100;
    const seekTo = (percentage / 100) * playerRef.current.getDuration();
    
    playerRef.current.seekTo(seekTo, true);
    setProgress(percentage);
    setCurrentTime(seekTo);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    playerRef.current.setVolume(newVolume * 100);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!playerReady) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume * 100);
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const skipForward = () => {
    if (!playerReady) return;
    const newTime = playerRef.current.getCurrentTime() + 30;
    playerRef.current.seekTo(newTime, true);
  };

  const skipBackward = () => {
    if (!playerReady) return;
    const newTime = playerRef.current.getCurrentTime() - 15;
    playerRef.current.seekTo(newTime > 0 ? newTime : 0, true);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const changePlaybackRate = (rate) => {
    if (!playerReady) return;
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowPlaybackMenu(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Auto-hide controls
  useEffect(() => {
    
    const resetControlsTimeout = () => {
      clearTimeout(controlsTimeoutRef.current);
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    if (isPlaying) {
      resetControlsTimeout();
      containerRef.current.addEventListener('mousemove', resetControlsTimeout);
    }

    return () => {
      clearTimeout(controlsTimeoutRef.current);
      containerRef.current?.removeEventListener('mousemove', resetControlsTimeout);
    };
  }, [isPlaying]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`guidedVideoRecommendation-container ${darkMode ? 'dark-mode' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="guidedVideoRecommendation-header">
        <h2 className="guidedVideoRecommendation-title">Recommended Learning Material</h2>
        <p className="guidedVideoRecommendation-subtitle">{videoData.title || 'Video Lesson'}</p>
      </div>

      <div 
        className="guidedVideoRecommendation-video-container"
        ref={containerRef}
      >
        <div className="guidedVideoRecommendation-video-wrapper">
          <div 
            ref={videoRef}
            className="guidedVideoRecommendation-video"
          />
          
          {/* Loading spinner */}
          {isLoading && (
            <div className="guidedVideoRecommendation-loading">
              <div className="guidedVideoRecommendation-spinner"></div>
            </div>
          )}
          
          {/* Thumbnail overlay */}
          {(!hasUserInteracted || !isPlaying) && !isLoading && (
            <div 
              className="guidedVideoRecommendation-thumbnail"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
              onClick={togglePlay}
            >
              <button className="guidedVideoRecommendation-play-button">
                <FaPlay size={26} />
              </button>
              {thumbnailError && (
                <div className="guidedVideoRecommendation-thumbnail-placeholder">
                  <FaImage size={40} />
                  <p>Video Preview Not Available</p>
                </div>
              )}
            </div>
          )}
          
          {/* Video controls */}
          <div className={`guidedVideoRecommendation-controls ${showControls ? 'visible' : ''}`}>
            {/* Progress bar */}
            <div 
              className="guidedVideoRecommendation-progress"
              ref={progressRef}
              onClick={handleProgressClick}
            >
              <div 
                className="guidedVideoRecommendation-progress-filled"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="guidedVideoRecommendation-controls-bottom">
              <div className="guidedVideoRecommendation-controls-left">
                <button 
                  className="guidedVideoRecommendation-control-button"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                
                <button 
                  className="guidedVideoRecommendation-control-button"
                  onClick={skipBackward}
                >
                  <IoMdSkipBackward />
                  <span>15</span>
                </button>
                
                <button 
                  className="guidedVideoRecommendation-control-button"
                  onClick={skipForward}
                >
                  <IoMdSkipForward />
                  <span>30</span>
                </button>
                
                <div className="guidedVideoRecommendation-volume">
                  <button 
                    className="guidedVideoRecommendation-control-button"
                    onClick={toggleMute}
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    ref={volumeRef}
                  />
                </div>
                
                <div className="guidedVideoRecommendation-time">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="guidedVideoRecommendation-controls-right">
                <div className="guidedVideoRecommendation-playback-rate">
                  <button 
                    className="guidedVideoRecommendation-control-button"
                    onClick={() => setShowPlaybackMenu(!showPlaybackMenu)}
                  >
                    <MdSpeed />
                    <span>{playbackRate}x</span>
                  </button>
                  
                  {showPlaybackMenu && (
                    <div className="guidedVideoRecommendation-playback-menu">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          className={playbackRate === rate ? 'active' : ''}
                          onClick={() => changePlaybackRate(rate)}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  className="guidedVideoRecommendation-control-button"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mark as Read button */}
      <div className="guidedVideoRecommendation-mark-read-container">
        <button
          className={`guidedVideoRecommendation-mark-read-button ${isMarkedRead ? 'completed' : ''}`}
          disabled={isMarkedRead}
          data-tooltip={
            isMarkedRead
              ? 'Video completed'
              : progress >= 95
                ? 'Click to mark as read'
                : 'Complete the video to mark as read'
          }
        >
          <span className="guidedVideoRecommendation-mark-read-circle">
            {isMarkedRead && <FiCheck className="guidedVideoRecommendation-check-icon" />}
          </span>
          <span>{isMarkedRead ? 'Marked as Read' : 'Mark as Read'}</span>
        </button>
      </div>

      {/* Credits */}
      {videoData.credits && (
        <div className="guidedVideoRecommendation-credits">
          <p>Credits Goes To: {videoData.credits}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="guidedVideoRecommendation-disclaimer">
        <p>Disclaimer: We are not directly hosting any content. This is a YouTube embed and all monetization goes to the original video creator.</p>
      </div>
    </div>
  );
};

export default GuidedVideoRecommendation;