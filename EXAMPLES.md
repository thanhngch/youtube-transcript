# YouTube Transcript Generator - Examples

## 📺 **Filename Examples**

### ✅ **Standard YouTube URLs**
```bash
# URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
# Output: data/transcript_dQw4w9WgXcQ.txt

# URL: https://youtu.be/dQw4w9WgXcQ  
# Output: data/transcript_dQw4w9WgXcQ.txt

# URL: https://youtube.com/watch?v=dQw4w9WgXcQ
# Output: data/transcript_dQw4w9WgXcQ.txt
```

### ⚙️ **Fallback Cases**
```bash
# Invalid URL hoặc không extract được ID
# URL: https://invalid-url.com
# Output: data/transcript_1757401399120.txt (timestamp)
```

## 🎯 **Real Test Cases**

### **Test 1: Rick Roll (có YouTube captions)**
```bash
bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Expected Output:**
```
🎬 Đang xử lý: https://www.youtube.com/watch?v=dQw4w9WgXcQ
🔍 Đang kiểm tra transcript có sẵn từ YouTube...
✅ Đã lấy transcript từ YouTube captions
🎯 Sử dụng transcript từ YouTube captions
📝 Transcript đã được lưu tại: data/transcript_dQw4w9WgXcQ.txt
✅ Hoàn thành!
```

**File Created:** `data/transcript_dQw4w9WgXcQ.txt`

**Sample Content:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ

♪ We're no strangers to love ♪ ♪ You know the rules and so do I ♪ 
♪ A full commitment's what I'm thinking of ♪ 
♪ You wouldn't get this from any other guy ♪...
```

### **Test 2: Short YouTube URL**
```bash  
bun run index.ts "https://youtu.be/dQw4w9WgXcQ"
```

**Expected Output:** Cùng kết quả như Test 1 (cùng file name)

## 🔗 **URL Pattern Support**

### ✅ **Supported Patterns**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`
- `https://youtube.com/v/VIDEO_ID`

### ❌ **Unsupported Patterns** (fallback to timestamp)
- Playlist URLs với `&list=`
- Live stream URLs
- Invalid/malformed URLs
- URLs without video IDs

## 🎨 **File Organization Benefits**

### **Before (timestamp-based)**
```
data/
├── transcript_1757401399120.txt  # Hard to identify
├── transcript_1757401456789.txt  # Which video is this?
└── transcript_1757401512345.txt  # No context
```

### **After (YouTube ID-based)**
```
data/
├── transcript_dQw4w9WgXcQ.txt    # Rick Roll - Never Gonna Give You Up
├── transcript_9bZkp7q19f0.txt    # PSY - Gangnam Style
└── transcript_kJQP7kiw5Fk.txt    # Despacito
```

### **Advantages**
- ✅ **Identifiable**: Easy to know which video
- ✅ **Unique**: Same video always creates same filename
- ✅ **Shareable**: Consistent filenames across users
- ✅ **No Duplicates**: Re-running same URL overwrites (no clutter)
