import axiosInstance from './axiosInstance';

export const getStudentConsistency = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/api/consistency/${studentId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch progress data';
  }
};

export const updateTopicProgress = async (studentId, courseName, topicIndex, completionType) => {
  try {
    const response = await axiosInstance.post(`/api/consistency/progress/${studentId}`, {
      courseName,
      topicIndex,
      completionType
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update progress';
  }
};