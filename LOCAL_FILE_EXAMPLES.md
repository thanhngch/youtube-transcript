# Local Audio File Support - Examples

## 🎵 **Supported Audio Formats**

### ✅ **Fully Supported**
- **.mp3** - Ready to use (no conversion needed)
- **.wav** - Auto-convert to MP3
- **.m4a** - Auto-convert to MP3 
- **.flac** - Auto-convert to MP3
- **.aac** - Auto-convert to MP3

### ❌ **Not Supported**
- Video formats (.mp4, .avi, .mkv) - use yt-dlp for video extraction first
- Compressed formats (.zip, .rar)
- Document formats (.pdf, .txt)

## 📝 **Usage Examples**

### **Example 1: MP3 File (No Conversion)**
```bash
# Input: recording.mp3
bun run index.ts "./audio/recording.mp3"

# Expected Output:
🎵 Đang xử lý file local: ./audio/recording.mp3
🎵 Đang xử lý file MP3 local: ./audio/recording.mp3
✅ File MP3 sẵn sàng: recording.mp3
🔄 Đang sử dụng OpenAI Whisper API...
✅ Transcript đã được tạo thành công
📝 Transcript đã được lưu tại: data/transcript_recording.txt
✅ Hoàn thành!

# File Created: data/transcript_recording.txt
# Content Format:
/Users/chithanh/projects/learn_english/youtube/audio/recording.mp3

[transcript content here...]
```

### **Example 2: WAV File (Auto-Convert)**
```bash
# Input: interview.wav  
bun run index.ts "./audio/interview.wav" --keep-audio

# Expected Output:
🎵 Đang xử lý file local: ./audio/interview.wav
🎵 Đang xử lý file MP3 local: ./audio/interview.wav
🔄 Đang convert .wav sang MP3...
✅ Convert hoàn thành: interview.mp3
🔄 Đang sử dụng OpenAI Whisper API...
✅ Transcript đã được tạo thành công
📝 Transcript đã được lưu tại: data/transcript_interview.txt
✅ Hoàn thành!

# Files Created: 
# - data/transcript_interview.txt (transcript)
# - data/temp/interview.mp3 (converted MP3, kept due to --keep-audio)
```

### **Example 3: M4A File (Custom Output)**
```bash
# Input: meeting.m4a
bun run index.ts "meeting.m4a" --output ./transcripts

# Expected Output:
🎵 Đang xử lý file local: meeting.m4a
🎵 Đang xử lý file MP3 local: meeting.m4a
🔄 Đang convert .m4a sang MP3...
✅ Convert hoàn thành: meeting.mp3
🔄 Đang sử dụng OpenAI Whisper API...
✅ Transcript đã được tạo thành công
📁 Đã tạo thư mục: ./transcripts
📝 Transcript đã được lưu tại: transcripts/transcript_meeting.txt
🗑️ Đã dọn dẹp file tạm
✅ Hoàn thành!
```

## 🏗️ **Behind The Scenes**

### **Input Processing Flow:**
1. **Detect Input Type**: `isUrl()` returns `false` for file paths
2. **Validate File**: Check existence and extension
3. **Convert If Needed**: Use ffmpeg to convert to MP3
4. **Transcribe**: Send MP3 to OpenAI Whisper API
5. **Generate Filename**: Sanitize and create `transcript_[filename].txt`
6. **Write Output**: Include absolute file path at top
7. **Cleanup**: Remove temporary conversion files

### **Filename Sanitization:**
```typescript
// Examples of filename sanitization:
"My Recording (Final).mp3" → "transcript_My_Recording__Final_.txt"
"meeting-2024.m4a" → "transcript_meeting-2024.txt"
"interview #1.wav" → "transcript_interview__1.txt"
"voice note.flac" → "transcript_voice_note.txt"
```

## 🎯 **Use Cases**

### **Perfect For:**
- **Meeting recordings** - Convert meeting MP3s to text
- **Interview transcripts** - Professional interview processing  
- **Voice notes** - Personal voice memos to text
- **Podcast episodes** - Content creators making show notes
- **Lectures** - Students transcribing recorded classes
- **Audio books** - Converting audiobooks to searchable text

### **Workflow Examples:**

#### **Journalist Workflow:**
```bash
# 1. Record interview
# 2. Save as interview_2024_12_09.wav
# 3. Transcribe
bun run index.ts "./recordings/interview_2024_12_09.wav" --output ./articles

# Result: articles/transcript_interview_2024_12_09.txt
```

#### **Content Creator Workflow:**
```bash
# 1. Record podcast episode
# 2. Export as episode_45.m4a 
# 3. Create transcript for show notes
bun run index.ts "podcast/episode_45.m4a" --output ./show_notes --keep-audio

# Result: 
# - show_notes/transcript_episode_45.txt (transcript)
# - data/temp/episode_45.mp3 (backup audio)
```

## ⚠️ **Important Notes**

### **File Paths:**
- Use relative paths: `"./audio/file.mp3"`
- Use absolute paths: `"/Users/name/Documents/audio.wav"`
- Avoid spaces in terminal: `"file with spaces.mp3"` (use quotes)

### **Performance:**
- **MP3 files**: ~10-30 seconds (no conversion)
- **Other formats**: +5-15 seconds (conversion time)
- **Large files**: Conversion time scales with file size

### **Quality:**
- **Original**: Keep original quality during conversion
- **Compression**: MP3 conversion uses high quality settings
- **Accuracy**: Same transcription quality as YouTube processing
