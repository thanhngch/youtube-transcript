#!/bin/bash

# YouTube Transcript Generator & Audio Transcriber
# Chạy chương trình với Bun.js

if [ $# -eq 0 ]; then
    echo "📺 YouTube Transcript Generator & Audio Transcriber"
    echo ""
    echo "Sử dụng:"
    echo "  ./run.sh <youtube-url|audio-file> [options]"
    echo ""
    echo "Ví dụ YouTube:"
    echo "  ./run.sh 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'"
    echo "  ./run.sh 'https://youtu.be/dQw4w9WgXcQ' --keep-audio"
    echo ""
    echo "Ví dụ file audio local:"
    echo "  ./run.sh './audio/recording.mp3'"
    echo "  ./run.sh '/Users/name/interview.wav' --output ./transcripts"
    echo "  ./run.sh 'meeting.m4a' --keep-audio"
    echo ""
    echo "Options:"
    echo "  --keep-audio    Giữ lại file MP3 sau khi xử lý"
    echo "  --output <dir>  Thư mục để lưu transcript (mặc định: ./data)"
    echo ""
    echo "Formats hỗ trợ:"
    echo "  - YouTube: https://youtube.com/..., https://youtu.be/..."
    echo "  - Audio: .mp3, .wav, .m4a, .flac, .aac"
    echo ""
    exit 1
fi

# Chạy chương trình với Bun
bun run index.ts "$@"
