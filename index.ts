#!/usr/bin/env bun
import { $ } from "bun";
import { existsSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";

interface TranscriptOptions {
  youtubeUrl: string;
  outputDir?: string;
  keepAudio?: boolean;
}

class YouTubeTranscriber {
  private tempDir: string = "./data/temp";
  
  constructor() {
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    if (!existsSync(this.tempDir)) {
      await mkdir(this.tempDir, { recursive: true });
    }
  }

  /**
   * Download YouTube video và chuyển đổi thành MP3
   */
  private async downloadAndConvertToMp3(youtubeUrl: string): Promise<string> {
    console.log("🔄 Đang download và chuyển đổi video thành MP3...");
    
    // Đảm bảo thư mục temp tồn tại
    await this.ensureTempDir();
    
    const outputTemplate = path.join(this.tempDir, "%(title)s.%(ext)s");
    
    try {
      // Sử dụng yt-dlp để download và convert thành mp3
      const result = await $`yt-dlp -x --audio-format mp3 --audio-quality 0 -o ${outputTemplate} ${youtubeUrl}`;
      
      if (result.exitCode !== 0) {
        console.error("❌ yt-dlp stderr:", result.stderr.toString());
        throw new Error(`yt-dlp failed with exit code ${result.exitCode}`);
      }
      
      // Tìm tất cả file audio (không chỉ mp3)
      let audioFiles: string[] = [];
      try {
        const mp3Files = await $`find ${this.tempDir} -name "*.mp3" 2>/dev/null || true`;
        const m4aFiles = await $`find ${this.tempDir} -name "*.m4a" 2>/dev/null || true`;
        const wavFiles = await $`find ${this.tempDir} -name "*.wav" 2>/dev/null || true`;
        
        audioFiles = [
          ...mp3Files.stdout.toString().trim().split('\n').filter(f => f && f.trim()),
          ...m4aFiles.stdout.toString().trim().split('\n').filter(f => f && f.trim()),
          ...wavFiles.stdout.toString().trim().split('\n').filter(f => f && f.trim())
        ];
      } catch (e) {
        console.error("Lỗi khi tìm audio files:", e);
      }
      
      if (audioFiles.length === 0) {
        throw new Error("Không tìm thấy file audio sau khi download. Kiểm tra URL YouTube có hợp lệ không.");
      }
      
      // Lấy file đầu tiên và convert thành MP3 nếu cần
      let audioFile = audioFiles[0];
      if (!audioFile) {
        throw new Error("Không tìm thấy file audio sau khi download. Kiểm tra URL YouTube có hợp lệ không.");
      }

      // Nếu file không phải MP3, convert nó
      if (!audioFile.endsWith('.mp3')) {
        console.log("🔄 Đang convert sang MP3...");
        const mp3File = audioFile.replace(/\.[^.]+$/, '.mp3');
        await $`ffmpeg -i ${audioFile} -acodec mp3 ${mp3File} -y`;
        
        // Xóa file gốc
        await $`rm ${audioFile}`;
        audioFile = mp3File;
      }
      
      console.log(`✅ Download hoàn thành: ${path.basename(audioFile)}`);
      return audioFile;
      
    } catch (error) {
      console.error("❌ Lỗi khi download video:", error);
      throw error;
    }
  }

  /**
   * Tạo transcript từ file MP3 sử dụng OpenAI Whisper API
   */
  private async transcribeWithOpenAI(mp3FilePath: string): Promise<string> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      throw new Error("Cần thiết lập OPENAI_API_KEY environment variable");
    }

    console.log("🔄 Đang sử dụng OpenAI Whisper API...");
    
    try {
      const formData = new FormData();
      const audioFile = Bun.file(mp3FilePath);
      formData.append('file', audioFile);
      formData.append('model', 'gpt-4o-transcribe');
      formData.append('language', 'en');
      formData.append('response_format', 'text');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error(`❌ OPENAI_API_KEY không hợp lệ. Vui lòng kiểm tra API key của bạn.`);
        }
        
        if (response.status === 400) {
          console.warn("⚠️  Model gpt-4o-transcribe không hoạt động, thử fallback sang whisper-1...");
          return this.transcribeWithWhisperFallback(mp3FilePath);
        }
        
        throw new Error(`OpenAI API error: ${response.statusText} (${response.status})`);
      }

      // Với response_format='text', API trả về string trực tiếp
      const transcript = await response.text();
      
      if (!transcript || transcript.trim() === '') {
        throw new Error("Không nhận được transcript từ OpenAI API");
      }
      
      console.log("✅ Transcript đã được tạo thành công");
      return transcript.trim();
    } catch (error) {
      console.error("❌ Lỗi khi sử dụng OpenAI API:", error);
      throw error;
    }
  }

  /**
   * Fallback: sử dụng whisper-1 model nếu gpt-4o-transcribe không hoạt động
   */
  private async transcribeWithWhisperFallback(mp3FilePath: string): Promise<string> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      throw new Error("Cần thiết lập OPENAI_API_KEY environment variable");
    }

    console.log("🔄 Đang sử dụng whisper-1 model...");
    
    try {
      const formData = new FormData();
      const audioFile = Bun.file(mp3FilePath);
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('response_format', 'text');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(`❌ OPENAI_API_KEY không hợp lệ. Vui lòng kiểm tra API key của bạn.`);
        }
        throw new Error(`OpenAI API error with whisper-1: ${response.statusText} (${response.status})`);
      }

      // Với response_format='text', API trả về string trực tiếp
      const transcript = await response.text();
      
      if (!transcript || transcript.trim() === '') {
        throw new Error("Không nhận được transcript từ OpenAI API (whisper-1)");
      }
      
      console.log("✅ Transcript đã được tạo thành công (whisper-1)");
      return transcript.trim();
    } catch (error) {
      console.error("❌ Lỗi khi sử dụng whisper-1 fallback:", error);
      throw error;
    }
  }

  /**
   * Dọn dẹp file tạm
   */
  private async cleanup(keepAudio: boolean = false) {
    if (!keepAudio) {
      try {
        await rm(this.tempDir, { recursive: true, force: true });
        console.log("🗑️  Đã dọn dẹp file tạm");
      } catch (error) {
        console.warn("⚠️  Không thể dọn dẹp file tạm:", error);
      }
    }
  }

  /**
   * Hàm chính để xử lý YouTube URL thành transcript
   */
  async processYouTubeUrl(options: TranscriptOptions): Promise<void> {
    const { youtubeUrl, outputDir = "./data", keepAudio = false } = options;
    
    try {
      // Validate YouTube URL
      const urlPattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
      if (!urlPattern.test(youtubeUrl)) {
        throw new Error("URL không hợp lệ. Vui lòng nhập YouTube URL đúng định dạng.");
      }

      console.log(`🎬 Đang xử lý: ${youtubeUrl}`);
      
      // Bước 1: Download và chuyển đổi thành MP3
      const mp3File = await this.downloadAndConvertToMp3(youtubeUrl);
      
      // Bước 2: Tạo transcript bằng OpenAI Whisper API
      const transcript = await this.transcribeWithOpenAI(mp3File);
      
      // Bước 3: Đảm bảo thư mục output tồn tại
      if (!existsSync(outputDir)) {
        await mkdir(outputDir, { recursive: true });
        console.log(`📁 Đã tạo thư mục: ${outputDir}`);
      }
      
      // Bước 4: Ghi transcript ra file
      const outputFileName = `transcript_${Date.now()}.txt`;
      const outputPath = path.join(outputDir, outputFileName);
      
      await writeFile(outputPath, transcript, 'utf-8');
      console.log(`📝 Transcript đã được lưu tại: ${outputPath}`);
      
      // Bước 5: Dọn dẹp
      await this.cleanup(keepAudio);
      
      console.log("✅ Hoàn thành!");
      
    } catch (error) {
      console.error("❌ Có lỗi xảy ra:", error);
      await this.cleanup();
      process.exit(1);
    }
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📺 YouTube Transcript Generator

Sử dụng:
  bun run index.ts <youtube-url> [options]

Ví dụ:
  bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  bun run index.ts "https://youtu.be/dQw4w9WgXcQ" --keep-audio
  bun run index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --output ./transcripts

Options:
  --keep-audio    Giữ lại file MP3 sau khi xử lý
  --output <dir>  Thư mục để lưu transcript (mặc định: ./data)

Yêu cầu:
  - yt-dlp (đã cài đặt)
  - ffmpeg (đã cài đặt)  
  - OPENAI_API_KEY (environment variable)
`);
    process.exit(1);
  }

  const youtubeUrl = args[0];
  if (!youtubeUrl) {
    throw new Error("URL không hợp lệ");
  }
  const keepAudio = args.includes('--keep-audio');
  
  let outputDir = "./data";
  const outputIndex = args.findIndex(arg => arg === '--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    if (!args[outputIndex + 1]) {
      throw new Error("Thư mục output không hợp lệ");
    }
    outputDir = args[outputIndex + 1] || "./data";
  }

  const transcriber = new YouTubeTranscriber();
  await transcriber.processYouTubeUrl({
    youtubeUrl,
    outputDir,
    keepAudio
  });
}

// Chạy chương trình
if (import.meta.main) {
  main().catch(console.error);
}
