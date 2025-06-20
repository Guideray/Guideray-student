import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaExpand, 
  FaCompress,
  FaStepForward,
  FaStepBackward,
  FaClosedCaptioning,
  FaCog
} from 'react-icons/fa';
import { 
  IoMdSettings,
  IoMdSkipForward,
  IoMdSkipBackward
} from 'react-icons/io';
import { 
  MdHighQuality,
  MdSpeed
} from 'react-icons/md';
import './index.css';

const GuideRayVideoComponent = ({ videoData }) => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [playerReady, setPlayerReady] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaybackMenu, setShowPlaybackMenu] = useState(false);

  // Extract YouTube video ID
  useEffect(() => {
    const videoId = videoData.link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
    setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
  }, [videoData.link]);

  // Initialize YouTube Player API
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
    const videoId = videoData.link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
    
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
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });
  };

  const onPlayerReady = (event) => {
    setPlayerReady(true);
    setDuration(event.target.getDuration());
    event.target.setVolume(volume * 100);
    setIsLoading(false);
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
        break;
      case window.YT.PlayerState.BUFFERING:
        if (isPlaying) {
          setIsLoading(true);
        }
        break;
      case window.YT.PlayerState.CUED:
        setIsLoading(false);
        break;
    }
  };

  const onPlayerError = (error) => {
    console.error('YouTube Player Error:', error);
    setIsLoading(false);
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

  // Event handlers
  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
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
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackRate = (rate) => {
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowPlaybackMenu(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!playerReady) return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5, true);
          break;
        case 'ArrowLeft':
          playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5, true);
          break;
        case 'ArrowUp':
          const newVolUp = Math.min(volume + 0.1, 1);
          playerRef.current.setVolume(newVolUp * 100);
          setVolume(newVolUp);
          break;
        case 'ArrowDown':
          const newVolDown = Math.max(volume - 0.1, 0);
          playerRef.current.setVolume(newVolDown * 100);
          setVolume(newVolDown);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        default:
          return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, playerReady, isFullscreen]);

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
    <div 
      className={`guideray-video-player ${isFullscreen ? 'fullscreen' : ''}`}
      ref={containerRef}
      onDoubleClick={toggleFullscreen}
    >
      {/* Video element */}
      <div className="video-container">
        <div 
          ref={videoRef}
          className="video-iframe"
        />
        
        {/* Loading spinner */}
        <div className={`loading-spinner ${isLoading ? 'show' : ''}`}>
          <div className="spinner"></div>
          <div className="spinner-text">Loading...</div>
        </div>
        
        {/* Thumbnail overlay */}
        {!isPlaying && !isLoading && playerReady && (
          <div 
            className="thumbnail-overlay"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
            onClick={togglePlay}
          >
            <button className="play-button">
              <FaPlay size={20} />
            </button>
          </div>
        )}
        
        {/* Controls overlay */}
        <div className={`controls-overlay ${showControls ? 'visible' : ''}`}>
          {/* Top controls */}
          <div className="top-controls">
            <h3 className="video-title">{videoData.title}</h3>
          </div>
          
          {/* Center controls */}
          <div className="center-controls">
            <button 
              className="control-button skip-backward" 
              onClick={skipBackward}
              data-tooltip="15 seconds back"
            >
              <IoMdSkipBackward size={28} />
              <span>15</span>
            </button>
            
            <button 
              className="control-button play-pause" 
              onClick={togglePlay}
              data-tooltip={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <FaPause size={24} />
              ) : (
                <FaPlay size={24} />
              )}
            </button>
            
            <button 
              className="control-button skip-forward" 
              onClick={skipForward}
              data-tooltip="30 seconds forward"
            >
              <IoMdSkipForward size={28} />
              <span>30</span>
            </button>
          </div>
          
          {/* Bottom controls */}
          <div className="bottom-controls">
            {/* Progress bar */}
            <div 
              className="progress-container" 
              ref={progressRef}
              onClick={handleProgressClick}
            >
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
              <div 
                className="progress-thumb"
                style={{ left: `${progress}%` }}
              ></div>
              <div className="progress-hover"></div>
            </div>
            
            <div className="controls-group">
              {/* Time display */}
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              {/* Additional controls */}
              <div className="right-controls">
                {/* Playback rate */}
                <div className="playback-rate-container">
                  <button 
                    className="control-button playback-button"
                    onClick={() => setShowPlaybackMenu(!showPlaybackMenu)}
                    data-tooltip="Playback speed"
                  >
                    <MdSpeed size={20} />
                    <span>{playbackRate}x</span>
                  </button>
                  {showPlaybackMenu && (
                    <div className="playback-menu">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          className={`playback-option ${playbackRate === rate ? 'active' : ''}`}
                          onClick={() => changePlaybackRate(rate)}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Volume controls */}
                <div className="volume-controls">
                  <button 
                    className="control-button volume-button" 
                    onClick={toggleMute}
                    data-tooltip={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <FaVolumeMute size={20} />
                    ) : volume > 0.5 ? (
                      <FaVolumeUp size={20} />
                    ) : (
                      <FaVolumeUp size={20} />
                    )}
                  </button>
                  
                  <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    ref={volumeRef}
                  />
                </div>
                
                {/* Fullscreen button */}
                <button 
                  className="control-button fullscreen-button" 
                  onClick={toggleFullscreen}
                  data-tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <FaCompress size={18} />
                  ) : (
                    <FaExpand size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideRayVideoComponent;