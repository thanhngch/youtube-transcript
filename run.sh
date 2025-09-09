#!/bin/bash

# YouTube Transcript Generator
# Chạy chương trình với Bun.js

if [ $# -eq 0 ]; then
    echo "📺 YouTube Transcript Generator"
    echo ""
    echo "Sử dụng:"
    echo "  ./run.sh <youtube-url> [options]"
    echo ""
    echo "Ví dụ:"
    echo "  ./run.sh 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'"
    echo "  ./run.sh 'https://youtu.be/dQw4w9WgXcQ' --keep-audio"
    echo "  ./run.sh 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' --output ./transcripts"
    echo ""
    echo "Options:"
    echo "  --keep-audio    Giữ lại file MP3 sau khi xử lý"
    echo "  --output <dir>  Thư mục để lưu transcript"
    echo ""
    exit 1
fi

# Chạy chương trình với Bun
bun run index.ts "$@"
