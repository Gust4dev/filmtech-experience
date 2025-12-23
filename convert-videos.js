const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

// Configuration
const INPUT_DIR = path.join(__dirname, 'public', 'videos');
const OUTPUT_DIR = path.join(__dirname, 'public', 'optimized_videos');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to convert file
const convertVideo = (file) => {
    const inputPath = path.join(INPUT_DIR, file);
    const fileNameWithoutExt = path.parse(file).name;
    // Output as MP4 (H.264 + AAC) - Compatible and compressed
    const outputPath = path.join(OUTPUT_DIR, `${fileNameWithoutExt}.mp4`);

    console.log(`🎬 Processing: ${file} -> ${fileNameWithoutExt}.mp4`);

    // FFmpeg command
    // Use the static binary path
    const command = `"${ffmpegPath}" -i "${inputPath}" -vcodec libx264 -crf 28 -preset medium -acodec aac -movflags +faststart "${outputPath}" -y`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error converting ${file}: ${error.message}`);
            return;
        }
        if (stderr) {
            // ffmpeg outputs progress to stderr, so we can log it if we want, but it's noisy
            // console.log(`ffmpeg stderr: ${stderr}`);
        }
        console.log(`✅ Finished: ${fileNameWithoutExt}.mp4`);
    });
};

// Main execution
console.log('🚀 Starting video conversion...');

if (!fs.existsSync(INPUT_DIR)) {
    console.log(`⚠️  Input directory ${INPUT_DIR} does not exist. Creating it...`);
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    console.log('📂 Please place your video files in public/videos and run this script again.');
} else {
    fs.readdir(INPUT_DIR, (err, files) => {
        if (err) {
            console.error('❌ Could not list the directory.', err);
            return;
        }

        const videoFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mov', '.mp4', '.avi', '.mkv'].includes(ext);
        });

        if (videoFiles.length === 0) {
            console.log('📭 No video files found in public/videos.');
        } else {
            console.log(`found ${videoFiles.length} videos.`);
            videoFiles.forEach(convertVideo);
        }
    });
}
