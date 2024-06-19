const sizeOf = require('image-size');
const ffmpeg = require('fluent-ffmpeg');

// UPDATE THESE TWO LINES
ffmpeg.setFfprobePath("path/to/ffprobe")
ffmpeg.setFfmpegPath("path/to/ffmpeg")

const getImageDimensions = (path) => {
  return new Promise((resolve, reject) => {
    sizeOf(path, (err, dimensions) => {
      if (err) {
        reject(err);
      } else {
        resolve(dimensions);
      }
    });
  });
};

const getVideoDimensions = async (path) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        resolve({ width: videoStream.width, height: videoStream.height });
      }
    });
  });
};

const getDimensions = async (path, type) => {
  try {
    if (type === 'image') {
      const dimensions = await getImageDimensions(path);
      console.log(`Image dimensions: ${dimensions.width}x${dimensions.height}`);
    } else if (type === 'video') {
      const dimensions = await getVideoDimensions(path);
      console.log(`Video dimensions: ${dimensions.width}x${dimensions.height}`);
    } else {
      console.error('Unknown type. Please specify either "image" or "video".');
    }
  } catch (error) {
    console.error('Error getting dimensions:', error);
  }
};

// Example usage
// UPDATE THESE TWO LINES
getDimensions('path/to/image', 'image');
getDimensions('path/to/video', 'video');
