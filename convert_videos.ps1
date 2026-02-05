# Run this from your repo root (the folder that contains index.html)
# Requires FFmpeg installed and available as "ffmpeg" in terminal.

New-Item -ItemType Directory -Force -Path "assets\videos" | Out-Null
New-Item -ItemType Directory -Force -Path "assets\posters" | Out-Null

# Convert MOV -> MP4 (H.264 video + AAC audio) so browsers can play it reliably.
ffmpeg -y -i "Main Project\Chelmsford AEC sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\chelmsford-aec-main.mp4"
ffmpeg -y -i "Main Project\Chelmsford AEC Short sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\chelmsford-aec-short.mp4"

ffmpeg -y -i "Event Highlight\ISCW 2025 Event Highlights sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\iscw-2025-event-highlights.mp4"

ffmpeg -y -i "Event Social media vertical products\Analytics short Vertical sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\analytics-vertical.mp4"
ffmpeg -y -i "Event Social media vertical products\Bodycam short Vertical sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\bodycam-vertical.mp4"
ffmpeg -y -i "Event Social media vertical products\Camera short Vertical sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\camera-vertical.mp4"
ffmpeg -y -i "Event Social media vertical products\Enviromental sensor short Vertical sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\environmental-sensor-vertical.mp4"
ffmpeg -y -i "Event Social media vertical products\Intercoms short Vertical sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\intercoms-vertical.mp4"
ffmpeg -y -i "Event Social media vertical products\IP Speaker short Vertical sized.mov" -c:v copy -c:a aac -b:a 160k -movflags +faststart "assets\videos\ip-speaker-vertical.mp4"

# Generate poster JPGs (thumbnails)
$videos = @(
  "chelmsford-aec-main",
  "chelmsford-aec-short",
  "iscw-2025-event-highlights",
  "analytics-vertical",
  "bodycam-vertical",
  "camera-vertical",
  "environmental-sensor-vertical",
  "intercoms-vertical",
  "ip-speaker-vertical"
)

foreach ($v in $videos) {
  ffmpeg -y -ss 00:00:01 -i "assets\videos\$v.mp4" -vframes 1 -q:v 2 "assets\posters\$v.jpg"
}

Write-Host "Done. Start Live Server and click any card to play."
