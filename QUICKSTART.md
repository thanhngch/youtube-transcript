# Quick Start Guide - YouTube & Audio Files

## Bước 1: Thiết lập API Key
```bash
# Thiết lập OpenAI API key (bắt buộc)
export OPENAI_API_KEY="your-openai-api-key-here"

# Hoặc tạo file .env
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

## Bước 2: Chọn input type

### **YouTube Videos**
```bash
# YouTube URL
./run.sh "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
./run.sh "https://youtu.be/dQw4w9WgXcQ" --keep-audio

# Hoặc dùng bun trực tiếp
bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### **Local Audio Files**
```bash
# File MP3, WAV, M4A, FLAC, AAC
./run.sh "./audio/recording.mp3"
./run.sh "/Users/name/interview.wav"
./run.sh "meeting.m4a" --output ./transcripts

# Hoặc dùng bun trực tiếp
bun run index.ts "./audio/recording.mp3" --keep-audio
```

## Kết quả

### **Tên file output:**
- **YouTube**: `transcript_[youtube_id].txt` (ví dụ: `transcript_dQw4w9WgXcQ.txt`)
- **Local file**: `transcript_[filename].txt` (ví dụ: `transcript_recording.txt`)
- **Fallback**: `transcript_[timestamp].txt` (nếu không extract được ID/name)

### **Format nội dung:**
- **Dòng 1**: Source (YouTube URL hoặc absolute file path)
- **Dòng 2**: Dòng trống
- **Dòng 3+**: Text transcript tiếng Anh

### **Cleanup:**
- File MP3 tạm tự động xóa (trừ khi dùng `--keep-audio`)
- File convert tạm tự động xóa
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
4. **"File không tồn tại"** → Đường dẫn file audio không đúng
5. **"Format file không được hỗ trợ"** → File không phải .mp3, .wav, .m4a, .flac, .aac
6. **"yt-dlp command not found"** → Chưa cài yt-dlp (cho YouTube)
7. **"ffmpeg command not found"** → Chưa cài ffmpeg (cho conversion)
8. **"Không tìm thấy file audio"** → Video có thể bị restricted hoặc không có audio

## Cấu hình hiện tại
- **Priority 1**: YouTube Captions (miễn phí, nhanh, chính xác)
- **Priority 2**: AI Transcription với `gpt-4o-transcribe`
- **Language**: `en` (tiếng Anh)
- **Response format**: `text` (plain text)
- **Audio quality**: Cao nhất (0) - chỉ khi cần AI transcription
