#!/bin/bash
# Build the reference clips from a raw recording: remove long pauses, normalise loudness, cut three 20s prompts.
# Usage: ./make_ref.sh "/path/to/recording.wav"
set -euo pipefail
cd "$(dirname "$0")"
SRC="${1:-$HOME/Music/Ableton/Live Recordings/2026-10-04 193239 Temp Project/Samples/Recorded/1 referance 0001 [2026-10-04 193324].wav}"
[ -f "$SRC" ] || { echo "source not found: $SRC"; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg missing (brew install ffmpeg)"; exit 1; }
mkdir -p ref
ffmpeg -y -v error -i "$SRC" -af "highpass=f=70,silenceremove=stop_periods=-1:stop_duration=0.6:stop_threshold=-40dB,loudnorm=I=-20:TP=-2" \
  -ar 44100 -ac 1 -c:a pcm_s16le ref/ref_full_clean.wav
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ref/ref_full_clean.wav)
echo "clean reference: ${D}s"
for i in 1 2 3; do
  S=$(python3 -c "print(round(max(0,($D-22))*$i/4,1))")
  ffmpeg -y -v error -ss "$S" -t 20 -i ref/ref_full_clean.wav -c:a pcm_s16le "ref/prompt_$i.wav"
done
ls -la ref
