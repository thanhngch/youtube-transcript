# YouTube Transcript Generator

Chương trình TypeScript chạy với Bun.js để chuyển đổi YouTube URL thành file transcript.

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

# Lưu transcript vào thư mục riêng
bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --output ./my_transcripts
```

## Cách hoạt động

1. **Download Video**: Sử dụng `yt-dlp` để download video từ YouTube
2. **Chuyển đổi Audio**: Tự động chuyển đổi thành MP3 với chất lượng cao
3. **Tạo Transcript**: Sử dụng OpenAI model `gpt-4o-transcribe` (fallback `whisper-1`) với language='en' và response_format='text'
4. **Lưu kết quả**: Ghi transcript ra file .txt với timestamp

## Cấu trúc file output

```
data/                         # Thư mục output mặc định
├── transcript_1703123456789.txt  # File transcript chính
└── temp/                     # Thư mục tạm (tự động xóa)
    ├── video.mp3            # File audio (xóa nếu không dùng --keep-audio)
    └── video.txt            # File transcript tạm
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
