import React, { useState, useRef, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCheck,
  FaImage
} from 'react-icons/fa';
import {
  FiCheck
} from 'react-icons/fi'
import {
  IoMdSkipForward,
  IoMdSkipBackward
} from 'react-icons/io';
import {
  MdSpeed
} from 'react-icons/md';
import axiosInstance from '../../api/axiosInstance';
import './index.css';

const GuideRayVideoComponent = ({ videoData, topicIndex, courseName, studentId, courseId }) => {
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
  const [thumbnailUrl, setThumbnailUrl] = useState(videoData.thumbnail);
  const [playerReady, setPlayerReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaybackMenu, setShowPlaybackMenu] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarkedRead, setIsMarkedRead] = useState(false);
  const [progressData, setProgressData] = useState(null);

  console.log(courseId)
  console.log(studentId)

  // Fetch progress data on mount
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/consistency/progress/${studentId}/${courseId}`
        );
        if (response.data.success) {
          setProgressData(response.data.data);
          // Check if this topic is already marked as completed
          const topicProgress = response.data.data.t.find(t => t.t === topicIndex);
          if (topicProgress && topicProgress.p >= 25) {
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

  // Check if thumbnail loads successfully
  useEffect(() => {
    const img = new Image();
    img.onload = () => setThumbnailError(false);
    img.onerror = handleThumbnailError;
    img.src = videoData.thumbnail;
  }, [videoData.thumbnail]);

  // Check if video is completed (watched 95% or more) and mark as read automatically
  useEffect(() => {
    if (progress >= 95 && duration > 0) {
      setIsCompleted(true);
      if (!isMarkedRead) {
        markAsCompleted();
      }
    }
  }, [progress, duration, isMarkedRead]);

  // API call to mark video as completed
  const markAsCompleted = async () => {
    try {
      const now = new Date().toISOString();
      const response = await axiosInstance.post(
        `/api/consistency/progress/${studentId}`,
        {
          courseName: courseId,
          topicIndex: topicIndex,
          completionType: "video",
          date: now
        }
      );

      if (response.data.success) {
        setIsMarkedRead(true);
        // Update local progress data
        const updatedProgressData = { ...progressData };
        const topicToUpdate = updatedProgressData.t.find(t => t.t === topicIndex);
        if (topicToUpdate) {
          topicToUpdate.p = 100; // Mark as fully completed
        }
        setProgressData(updatedProgressData);
      }
    } catch (error) {
      console.error('Error marking video as completed:', error);
    }
  };

  // Manual mark as read handler
  const handleMarkAsRead = async () => {
    await markAsCompleted();
  };

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
    try {
      const videoId = extractYouTubeId(videoData.link);

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
    } catch (e) {
      console.error('Error initializing YouTube player:', e);
      setIsLoading(false);
    }
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const onPlayerReady = (event) => {
    setPlayerReady(true);
    setDuration(event.target.getDuration());
    event.target.setVolume(volume * 100);
  };

  const onPlayerStateChange = (event) => {
    switch (event.data) {
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
        setIsCompleted(true);
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
  const handlePlayClick = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    togglePlay();
  };

  const togglePlay = () => {
    if (!playerReady) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVideoClick = () => {
    togglePlay();
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
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!playerReady) return;

      switch (e.key) {
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
    <div className="guideray-video-component-outer-container">
      <div
        className={`guideray-video-component-container ${isFullscreen ? 'fullscreen' : ''}`}
        ref={containerRef}
        onDoubleClick={toggleFullscreen}
      >
        {/* Video element */}
        <div className="guideray-video-component-video-container">
          <div
            ref={videoRef}
            className="guideray-video-component-video-iframe"
            onClick={handleVideoClick}
          />

          {/* Loading spinner - shown only when buffering */}
          <div className={`guideray-video-component-loading-spinner ${isLoading ? 'show' : ''}`}>
            <div className="guideray-video-component-spinner"></div>
            <div className="guideray-video-component-spinner-text">Loading...</div>
          </div>

          {/* Thumbnail overlay - shown when video is not playing and player is ready */}
          {(!hasUserInteracted || !isPlaying) && !isLoading && (
            <div
              className="guideray-video-component-thumbnail-overlay"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
              onClick={handlePlayClick}
            >
              <button className="guideray-video-component-play-button">
                <FaPlay size={36} />
              </button>
              {thumbnailError && (
                <div className="guideray-video-component-thumbnail-placeholder">
                  <FaImage size={40} />
                  <p>Video Preview Not Available</p>
                </div>
              )}
            </div>
          )}

          {/* Controls overlay */}
          <div className={`guideray-video-component-controls-overlay ${showControls ? 'visible' : ''}`}>
            {/* Top controls */}
            <div className="guideray-video-component-top-controls">
              <h3 className="guideray-video-component-video-title">{videoData.title}</h3>
            </div>

            {/* Center controls */}
            <div className="guideray-video-component-center-controls">
              <button
                className="guideray-video-component-control-button guideray-video-component-skip-backward"
                onClick={skipBackward}
                data-tooltip="15 seconds back"
              >
                <IoMdSkipBackward size={28} />
                <span>15</span>
              </button>

              <button
                className="guideray-video-component-control-button guideray-video-component-play-pause"
                onClick={handlePlayClick}
                data-tooltip={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <FaPause size={24} />
                ) : (
                  <FaPlay size={24} />
                )}
              </button>

              <button
                className="guideray-video-component-control-button guideray-video-component-skip-forward"
                onClick={skipForward}
                data-tooltip="30 seconds forward"
              >
                <IoMdSkipForward size={28} />
                <span>30</span>
              </button>
            </div>

            {/* Bottom controls */}
            <div className="guideray-video-component-bottom-controls">
              {/* Progress bar */}
              <div
                className="guideray-video-component-progress-container"
                ref={progressRef}
                onClick={handleProgressClick}
              >
                <div
                  className="guideray-video-component-progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
                <div
                  className="guideray-video-component-progress-thumb"
                  style={{ left: `${progress}%` }}
                ></div>
                <div className="guideray-video-component-progress-hover"></div>
              </div>

              <div className="guideray-video-component-controls-group">
                {/* Time display */}
                <div className="guideray-video-component-time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Additional controls */}
                <div className="guideray-video-component-right-controls">
                  {/* Playback rate */}
                  <div className="guideray-video-component-playback-rate-container">
                    <button
                      className="guideray-video-component-control-button guideray-video-component-playback-button"
                      onClick={() => setShowPlaybackMenu(!showPlaybackMenu)}
                      data-tooltip="Playback speed"
                    >
                      <MdSpeed size={20} />
                      <span>{playbackRate}x</span>
                    </button>
                    {showPlaybackMenu && (
                      <div className="guideray-video-component-playback-menu">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                          <button
                            key={rate}
                            className={`guideray-video-component-playback-option ${playbackRate === rate ? 'active' : ''}`}
                            onClick={() => changePlaybackRate(rate)}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Volume controls */}
                  <div className="guideray-video-component-volume-controls">
                    <button
                      className="guideray-video-component-control-button guideray-video-component-volume-button"
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
                      className="guideray-video-component-volume-slider"
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
                    className="guideray-video-component-control-button guideray-video-component-fullscreen-button"
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

      {/* Mark as Read Button */}
      <div className="guideray-video-component-mark-read-container">
        <button
          className={`guideray-video-component-mark-read-button ${isMarkedRead ? 'completed' : ''}`}
          onClick={handleMarkAsRead}
          disabled={isMarkedRead}
          data-tooltip={
            isMarkedRead
              ? 'Video completed'
              : isCompleted
                ? 'Click to mark as read'
                : 'Complete the video to mark as read'
          }
        >
          <span className="guideray-video-component-mark-read-circle">
            {isMarkedRead && <FiCheck className="check-icon" />}
          </span>
          <span>{isMarkedRead ? 'Marked as Read' : 'Mark as Read'}</span>
        </button>
      </div>
    </div>
  );
};

export default GuideRayVideoComponent;