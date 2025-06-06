import React from 'react';
import GuideRayVideoComponent from '../GuideRayVideoComponent';
import GuideRayMcqComponent from '../GuideRayMcqComponent';
import GuideRayCodingPracticeComponent from '../GuideRayCodingPracticeComponent';

const GuideRayTopicContent = ({ topicData }) => {
  return (
    <div className="guideraytopiccontent-container">
      {topicData.videoComponent && <GuideRayVideoComponent videoData={topicData.videoComponent} />}
      {topicData.practiceMcq && <GuideRayMcqComponent mcqData={topicData.practiceMcq} />}
      {topicData.codingPractice && <GuideRayCodingPracticeComponent codingData={topicData.codingPractice} />}
    </div>
  );
};

export default GuideRayTopicContent;