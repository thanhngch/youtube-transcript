# YouTube Transcript Generator & Audio Transcriber

Chương trình TypeScript chạy với Bun.js để chuyển đổi YouTube URL hoặc file audio local thành file transcript.

## Yêu cầu hệ thống

### Dependencies đã có sẵn
- `yt-dlp` - để download video từ YouTube
- `ffmpeg` - để chuyển đổi định dạng audio

### Dependencies cần cài thêm
- `OPENAI_API_KEY` - sử dụng OpenAI Whisper API

## Cài đặt

```bash
# Cài đặt dependencies
bun install

# Thiết lập OpenAI API key (bắt buộc)
export OPENAI_API_KEY="your-api-key-here"
```

## Sử dụng

### Cú pháp cơ bản
```bash
bun run index.ts "<youtube-url>"
```

### Với options
```bash
# Giữ lại file MP3 sau khi xử lý
bun run index.ts "<youtube-url>" --keep-audio

# Chỉ định thư mục output
bun run index.ts "<youtube-url>" --output ./transcripts

# Kết hợp các options
bun run index.ts "<youtube-url>" --keep-audio --output ./transcripts
```

### Ví dụ thực tế
```bash
# Ví dụ với YouTube video
bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Ví dụ với YouTube Short URL  
bun run index.ts "https://youtu.be/dQw4w9WgXcQ"

# YouTube URLs
bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
bun run index.ts "https://youtu.be/dQw4w9WgXcQ" --keep-audio

# Local audio files
bun run index.ts "./audio/recording.mp3"
bun run index.ts "/Users/name/interview.wav" --output ./transcripts
bun run index.ts "meeting.m4a" --keep-audio
```

## Cách hoạt động

### **YouTube URLs:**
1. **Kiểm tra YouTube Captions**: Ưu tiên lấy transcript có sẵn từ YouTube (closed captions do người dùng nhập)
2. **AI Transcription** (nếu cần): Download video, chuyển đổi thành MP3 và transcribe
3. **Lưu kết quả**: File với format `transcript_[youtube_id].txt`

### **Local Audio Files:**
1. **Kiểm tra file**: Validate file tồn tại và format được hỗ trợ (.mp3, .wav, .m4a, .flac, .aac)
2. **Convert** (nếu cần): Tự động convert sang MP3 bằng ffmpeg
3. **AI Transcription**: Sử dụng OpenAI model `gpt-4o-transcribe` với language='en' và response_format='text'
4. **Lưu kết quả**: File với format `transcript_[filename].txt`

### **Output Format:**
- Dòng 1: URL/File path
- Dòng 2: Empty line
- Dòng 3+: Transcript content

## Cấu trúc file output

```
data/                         # Thư mục output mặc định
├── transcript_dQw4w9WgXcQ.txt      # YouTube video (ID làm tên)
├── transcript_recording.txt        # Local file (filename làm tên)
├── transcript_interview.txt        # Local file (sanitized name)
└── temp/                     # Thư mục tạm (tự động xóa)
    ├── converted.mp3        # File convert tạm (nếu input không phải MP3)
    └── video.mp3            # File download tạm (YouTube)
```

## Xử lý lỗi

Chương trình tự động xử lý các lỗi phổ biến:
- URL YouTube không hợp lệ
- Lỗi download video
- Lỗi chuyển đổi audio  
- Lỗi tạo transcript
- Tự động dọn dẹp file tạm khi có lỗi

## Troubleshooting

### Lỗi "yt-dlp command not found"
```bash
# Cài đặt yt-dlp
pip install yt-dlp
# hoặc
brew install yt-dlp  
```

### Lỗi "ffmpeg command not found"
```bash
# Cài đặt ffmpeg
brew install ffmpeg
```

### Lỗi transcript không chính xác
- Kiểm tra chất lượng audio của video gốc
- Video có background music có thể ảnh hưởng đến độ chính xác
- Đảm bảo video có nội dung tiếng Anh (đã cấu hình language='en')

## License

MIT License
