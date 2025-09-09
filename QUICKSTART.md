# Quick Start Guide

## Bước 1: Thiết lập API Key
```bash
# Thiết lập OpenAI API key (bắt buộc)
export OPENAI_API_KEY="your-openai-api-key-here"

# Hoặc tạo file .env
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

## Bước 2: Chạy chương trình
```bash
# Cú pháp cơ bản
./run.sh "https://www.youtube.com/watch?v=VIDEO_ID"

# Ví dụ thực tế
./run.sh "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Với options
./run.sh "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --keep-audio --output ./transcripts
```

## Kết quả
- File transcript được lưu tại: `./data/transcript_[youtube_id].txt`
- Tên file sử dụng YouTube video ID (ví dụ: `transcript_dQw4w9WgXcQ.txt`)
- Nếu không extract được ID → fallback về timestamp
- Format: URL ở dòng đầu, 1 dòng trống, sau đó là text transcript tiếng Anh
- File MP3 tự động xóa (trừ khi dùng --keep-audio)
- Thư mục `./data` được tạo tự động

## Test chương trình
```bash
# Chạy test script để kiểm tra tất cả
./test.sh
```

## Lỗi thường gặp
1. **"OPENAI_API_KEY không hợp lệ"** → API key sai hoặc hết hạn
2. **"Cần thiết lập OPENAI_API_KEY"** → Chưa set API key
3. **"URL không hợp lệ"** → URL YouTube không đúng format
4. **"yt-dlp command not found"** → Chưa cài yt-dlp
5. **"ffmpeg command not found"** → Chưa cài ffmpeg
6. **"Không tìm thấy file audio"** → Video có thể bị restricted hoặc không có audio

## Cấu hình hiện tại
- **Priority 1**: YouTube Captions (miễn phí, nhanh, chính xác)
- **Priority 2**: AI Transcription với `gpt-4o-transcribe`
- **Language**: `en` (tiếng Anh)
- **Response format**: `text` (plain text)
- **Audio quality**: Cao nhất (0) - chỉ khi cần AI transcription
