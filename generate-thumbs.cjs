const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const VIDEOS_DIR = path.join(__dirname, 'public', 'optimized_videos');

const videoFiles = fs.readdirSync(VIDEOS_DIR).filter(f => {
  const name = f.toLowerCase();
  return name.startsWith('depo') && name.endsWith('.mp4');
});

videoFiles.forEach(file => {
  const base = path.parse(file).name;
  const thumbPath = path.join(VIDEOS_DIR, `thumb_${base}.webp`);

  if (fs.existsSync(thumbPath)) {
    console.log(`⏭  Skipping ${base} (thumb already exists)`);
    return;
  }

  const videoPath = path.join(VIDEOS_DIR, file);
  console.log(`🖼  Generating thumbnail for ${file}...`);

  try {
    execSync(
      `"${ffmpegPath}" -ss 00:00:01 -i "${videoPath}" -vframes 1 -vf "scale=400:-1" -f image2 -vcodec mjpeg -q:v 3 "${thumbPath}.jpg" -y`,
      { stdio: 'pipe' }
    );

    // Convert jpg to webp using ffmpeg
    execSync(
      `"${ffmpegPath}" -i "${thumbPath}.jpg" -c:v libwebp -quality 85 "${thumbPath}" -y`,
      { stdio: 'pipe' }
    );

    fs.unlinkSync(`${thumbPath}.jpg`);
    console.log(`✅ Created: thumb_${base}.webp`);
  } catch (err) {
    // Fallback: try direct webp output
    try {
      execSync(
        `"${ffmpegPath}" -ss 00:00:01 -i "${videoPath}" -vframes 1 -vf "scale=400:-1" "${thumbPath}" -y`,
        { stdio: 'pipe' }
      );
      console.log(`✅ Created: thumb_${base}.webp`);
    } catch (err2) {
      console.error(`❌ Failed for ${file}: ${err2.message}`);
    }
  }
});
