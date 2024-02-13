import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './App.css';
import { useSelector } from 'react-redux';
import { setActivityIdForFeedback } from './store/slices/globalSlice';

const Emoticon = ({ emoji, value, onClick }) => {
  const [emojis, setEmojis] = useState([]);
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  const handleClick = (event) => {

    setEmojis([...emojis, ...new Array(10).fill(emoji)]);
    onClick(event, value);
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setEmojis([]);
    }, 2000);
    return () => clearTimeout(timer);
  }, [emojis]);

  return (
    <div className="emoticon" style={props} onClick={handleClick}>
      {emoji}
      {emojis.map((e, index) => (
        <div key={index} className="floating-emoji">
          {e}
        </div>
      ))}
    </div>
  );
};

function Reactions() {
  const { activityIdForFeedback } = useSelector((state) => state.global);

  const handleClick = async (event, value) => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ emoji: value })
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/activities/${activityIdForFeedback}/feedbacks`, options);
    const data = await response.json();

    if (data.success) {
      //   alert('Feedback created');
    } else {
      alert('Error creating feedback');
    }
  };

  return (
    <div className="reactions">
      <Emoticon emoji="😀" value={1} onClick={handleClick} />
      <Emoticon emoji="☹️" value={2} onClick={handleClick} />
      <Emoticon emoji="😮" value={3} onClick={handleClick} />
      <Emoticon emoji="😕" value={4} onClick={handleClick} />
    </div>
  );
};

export default Reactions;
