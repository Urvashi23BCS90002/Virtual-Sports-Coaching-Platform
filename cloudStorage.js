import { S3 } from 'aws-sdk';

// Initialize AWS S3 client
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Upload a video to S3
export const uploadVideo = async (file) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `videos/${file.name}`, // Unique path for the video
      Body: file,
    };
    const uploadResult = await s3.upload(params).promise();
    console.log('Video uploaded successfully:', uploadResult.Location);
    return uploadResult.Location; // Return the video URL
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};

// Generate a URL for video access
export const getVideoURL = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const videoURL = s3.getSignedUrl('getObject', params);
    console.log('Generated Video URL:', videoURL);
    return videoURL;
  } catch (error) {
    console.error('Error fetching video URL:', error);
    throw new Error('Failed to generate video URL');
  }
};

import * as tf from '@tensorflow/tfjs';

export const trackPerformance = async (videoStream) => {
  try {
    // Load pre-trained AI model
    const model = await tf.loadLayersModel('/path/to/model.json');
    console.log('Model loaded successfully');

    // Process video frames for analysis
    const predictions = model.predict(videoStream);
    console.log('AI Predictions:', predictions);

    return predictions; // Return analysis results
  } catch (error) {
    console.error('Error in performance tracking:', error);
    throw new Error('Failed to track performance');
  }
};

