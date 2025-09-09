# YouTube Transcript Generator - Summary

## ✨ Tính năng chính

### 🎯 **Smart Transcript Strategy**
1. **Priority 1**: Lấy YouTube Captions (miễn phí, nhanh, chính xác)
2. **Priority 2**: AI Transcription với OpenAI `gpt-4o-transcribe` (nếu không có captions)

### ⚡ **Ưu điểm**
- **Nhanh**: Không cần download video nếu có captions sẵn
- **Tiết kiệm**: Không tốn OpenAI API calls cho videos có captions
- **Chính xác**: YouTube captions thường chính xác hơn AI transcription
- **Linh hoạt**: Fallback automatic sang AI nếu cần

## 🛠️ **Tech Stack**
- **Runtime**: Bun.js (fast JavaScript runtime)
- **Language**: TypeScript
- **Tools**: 
  - `yt-dlp` - Download video/captions
  - `ffmpeg` - Audio conversion
  - OpenAI Whisper API - AI transcription

## 📁 **File Structure**
```
project/
├── index.ts           # Main program
├── run.sh            # Convenience script  
├── test.sh           # Testing script
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
├── README.md         # Full documentation
├── QUICKSTART.md     # Quick start guide
└── data/             # Output directory (auto-created)
    ├── transcript_[youtube_id].txt    # Output files (using YouTube video ID)
    └── temp/              # Temporary files (auto-cleaned)
```

## 🚀 **Usage Examples**

### Cơ bản
```bash
bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Với options
```bash
./run.sh "https://youtube.com/watch?v=..." --keep-audio --output ./my_transcripts
```

### Test
```bash
./test.sh  # Kiểm tra dependencies và chạy test
```

## 📊 **Performance**

### With YouTube Captions (Most Cases)
- ⚡ **Speed**: ~5-10 giây
- 💰 **Cost**: Miễn phí (không dùng OpenAI API)
- 🎯 **Accuracy**: Rất cao (human-made captions)

### With AI Transcription (Fallback)
- ⏱️ **Speed**: ~30-60 giây (tùy độ dài video)
- 💰 **Cost**: ~$0.006/phút (OpenAI pricing)
- 🤖 **Accuracy**: Cao (AI transcription)

## 🎉 **Example Outputs**

### Success with YouTube Captions
```
🎬 Đang xử lý: https://www.youtube.com/watch?v=dQw4w9WgXcQ
🔍 Đang kiểm tra transcript có sẵn từ YouTube...
✅ Đã lấy transcript từ YouTube captions
🎯 Sử dụng transcript từ YouTube captions
📝 Transcript đã được lưu tại: data/transcript_dQw4w9WgXcQ.txt
🗑️ Đã dọn dẹp file tạm
✅ Hoàn thành!
```

**File Content Format:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ

[transcript content here...]
```

### Fallback to AI Transcription
```
🎬 Đang xử lý: https://www.youtube.com/watch?v=...
🔍 Đang kiểm tra transcript có sẵn từ YouTube...
⚠️ Không tìm thấy subtitle/captions
⚙️ Không có transcript sẵn, chuyển sang AI transcription...
🔄 Đang download và chuyển đổi video thành MP3...
✅ Download hoàn thành: video.mp3
🔄 Đang sử dụng OpenAI Whisper API...
✅ Transcript đã được tạo thành công
📝 Transcript đã được lưu tại: data/transcript_1757401399120.txt
✅ Hoàn thành!
```

## 🔧 **Requirements**
- Bun.js
- yt-dlp 
- ffmpeg
- OpenAI API Key (chỉ cho fallback cases)

## 🎯 **Perfect For**
- Content creators cần transcript nhanh
- Researchers phân tích video content
- Language learners cần text từ video
- Accessibility applications
- SEO content generation
