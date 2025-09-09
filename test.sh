#!/bin/bash

# Test script để kiểm tra chương trình hoạt động
echo "🧪 Testing YouTube Transcript Generator..."

# Kiểm tra dependencies
echo ""
echo "📋 Checking dependencies..."

if ! command -v yt-dlp &> /dev/null; then
    echo "❌ yt-dlp not found. Please install: brew install yt-dlp"
    exit 1
else
    echo "✅ yt-dlp found: $(which yt-dlp)"
fi

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found. Please install: brew install ffmpeg"
    exit 1
else
    echo "✅ ffmpeg found: $(which ffmpeg)"
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not set. Please set it: export OPENAI_API_KEY='your-key'"
    exit 1
else
    echo "✅ OPENAI_API_KEY is set"
fi

# Test với video ngắn (Rick Roll - classic test video)
TEST_URL="https://www.youtube.com/watch?v=dQw4w9WgXcQ"

echo ""
echo "🎬 Testing with short video: $TEST_URL"
echo "⏳ This will take a few moments..."
echo ""

# Chạy test
bun run index.ts "$TEST_URL"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Test thành công!"
    echo "📁 Kiểm tra file transcript trong thư mục ./data/"
    ls -la ./data/transcript_*.txt 2>/dev/null || echo "Không tìm thấy file transcript"
else
    echo ""
    echo "❌ Test thất bại. Kiểm tra lỗi bên trên."
fi
