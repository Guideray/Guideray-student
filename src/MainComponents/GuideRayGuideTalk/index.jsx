import React, { useState } from 'react';
import { Avatar, Input, Button, List, Typography, Card } from 'antd';
import { FaUser, FaPaperPlane, FaPhone, FaEnvelope } from 'react-icons/fa';
import './index.css';

const { Text } = Typography;

const GuideRayGuideTalk = ({ userData }) => {
  // Extract student and mentor data from props
  const student = {
    name: userData?.data?.name || 'Student',
    profilePic: userData?.data?.profilePic,
    id: userData?.data?.id
  };

  const mentor = {
    name: userData?.data?.mentor?.name || 'Mentor',
    email: userData?.data?.mentor?.email,
    mobile: userData?.data?.mentor?.mobile || '+1 (555) 123-4567',
    profilePic: userData?.data?.mentor?.profilePic,
    id: userData?.data?.mentor?.id
  };

  // State for messages and new message input
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: mentor.id,
      text: 'Hello John! How are you doing with your project? I wanted to check in before our meeting tomorrow.',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      sender: student.id,
      text: 'Hi Dr. Johnson! I\'m making good progress but have some questions about the research methodology section. Could we discuss this?',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 3,
      sender: mentor.id,
      text: 'Of course! I\'d be happy to help. What specific questions do you have? Feel free to send them over and we can go through them together.',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 4,
      sender: student.id,
      text: 'Thank you! Mainly about the sample size calculation and which statistical tests would be most appropriate for our data.',
      timestamp: new Date(Date.now() - 600000)
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      sender: student.id,
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="GuideRayGuideTalk-container">
      {/* Header/Navbar */}
      <div className="GuideRayGuideTalk-header">
        <div className="GuideRayGuideTalk-mentor-info">
          <Avatar 
            src={mentor.profilePic} 
            icon={<FaUser />} 
            size={48}
            className="GuideRayGuideTalk-avatar"
          />
          <div className="GuideRayGuideTalk-mentor-details">
            <Text strong className="GuideRayGuideTalk-mentor-name">{mentor.name}</Text>
            <Text className="GuideRayGuideTalk-mentor-title">Academic Mentor</Text>
          </div>
        </div>
        
        <div className="GuideRayGuideTalk-contact-info">
          <div className="GuideRayGuideTalk-contact-item">
            <FaEnvelope className="GuideRayGuideTalk-contact-icon" />
            <Text className="GuideRayGuideTalk-contact-text">{mentor.email}</Text>
          </div>
          <div className="GuideRayGuideTalk-contact-item">
            <FaPhone className="GuideRayGuideTalk-contact-icon" />
            <Text className="GuideRayGuideTalk-contact-text">{mentor.mobile}</Text>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="GuideRayGuideTalk-chat-container">
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item 
              className={`GuideRayGuideTalk-message-item ${
                message.sender === student.id 
                  ? 'GuideRayGuideTalk-student-message' 
                  : 'GuideRayGuideTalk-mentor-message'
              }`}
            >
              <div className="GuideRayGuideTalk-message-content">
                {message.sender !== student.id && (
                  <Avatar 
                    src={mentor.profilePic} 
                    icon={<FaUser />} 
                    size="small"
                    className="GuideRayGuideTalk-message-avatar"
                  />
                )}
                <div className="GuideRayGuideTalk-message-bubble">
                  <div className="GuideRayGuideTalk-message-text">{message.text}</div>
                  <div className="GuideRayGuideTalk-message-time">
                    {formatTime(new Date(message.timestamp))}
                  </div>
                </div>
                {message.sender === student.id && (
                  <Avatar 
                    src={student.profilePic} 
                    icon={<FaUser />} 
                    size="small"
                    className="GuideRayGuideTalk-message-avatar"
                  />
                )}
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Message Input Area */}
      <div className="GuideRayGuideTalk-input-area">
        <Input.TextArea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="GuideRayGuideTalk-message-input"
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FaPaperPlane />}
          onClick={handleSendMessage}
          className="GuideRayGuideTalk-send-button"
          size="large"
        />
      </div>
    </div>
  );
};

export default GuideRayGuideTalk;