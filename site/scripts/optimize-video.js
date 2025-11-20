const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = 'public/assets/hero-main.mp4';
const outputFile = 'public/assets/hero-main-optimized.mp4';

console.log('Starting video optimization...');

ffmpeg(inputFile)
  .setStartTime('00:00:00')
  .setDuration(12)
  .outputOptions([
    '-c:v libx264',
    '-preset fast',
    '-crf 23',
    '-an' // No audio
  ])
  .on('end', () => {
    console.log('Video optimization finished successfully.');
  })
  .on('error', (err) => {
    console.error('Error during optimization:', err.message);
  })
  .save(outputFile);
