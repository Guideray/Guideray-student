import axios from 'axios';

const API_BASE_URL = '/api/student-consistency';

export const getStudentConsistency = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${studentId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch progress data';
  }
};

export const updateTopicProgress = async (studentId, courseName, topicIndex, completionType) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/progress/${studentId}`, {
      courseName,
      topicIndex,
      completionType
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update progress';
  }
};