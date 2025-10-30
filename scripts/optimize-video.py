#!/usr/bin/env python3
"""
Video Optimization Script for Render Deployment
Optimizes video files for web delivery and Render static hosting
"""

import os
import subprocess
import sys
from pathlib import Path

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def optimize_video(input_path, output_dir):
    """Optimize video for web delivery"""
    input_file = Path(input_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    base_name = input_file.stem
    
    # MP4 optimization (H.264)
    mp4_output = output_dir / f"{base_name}.mp4"
    mp4_cmd = [
        'ffmpeg', '-i', str(input_file),
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-pix_fmt', 'yuv420p',
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
        '-y',
        str(mp4_output)
    ]
    
    # WebM optimization (VP9)
    webm_output = output_dir / f"{base_name}.webm"
    webm_cmd = [
        'ffmpeg', '-i', str(input_file),
        '-c:v', 'libvpx-vp9',
        '-crf', '30',
        '-b:v', '2M',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
        '-y',
        str(webm_output)
    ]
    
    print(f"Optimizing {input_file.name}...")
    
    # Generate MP4
    print("Creating MP4 version...")
    try:
        subprocess.run(mp4_cmd, check=True)
        print(f"✅ MP4 created: {mp4_output}")
    except subprocess.CalledProcessError as e:
        print(f"❌ MP4 creation failed: {e}")
        return False
    
    # Generate WebM
    print("Creating WebM version...")
    try:
        subprocess.run(webm_cmd, check=True)
        print(f"✅ WebM created: {webm_output}")
    except subprocess.CalledProcessError as e:
        print(f"❌ WebM creation failed: {e}")
        return False
    
    # Generate poster image
    poster_output = output_dir / f"{base_name}-poster.jpg"
    poster_cmd = [
        'ffmpeg', '-i', str(input_file),
        '-ss', '00:00:02',
        '-vframes', '1',
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
        '-q:v', '2',
        '-y',
        str(poster_output)
    ]
    
    print("Creating poster image...")
    try:
        subprocess.run(poster_cmd, check=True)
        print(f"✅ Poster created: {poster_output}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Poster creation failed: {e}")
    
    # Print file sizes
    print("\n📊 File Sizes:")
    for file_path in [mp4_output, webm_output, poster_output]:
        if file_path.exists():
            size_mb = file_path.stat().st_size / (1024 * 1024)
            print(f"  {file_path.name}: {size_mb:.2f} MB")
    
    return True

def main():
    if len(sys.argv) != 3:
        print("Usage: python optimize-video.py <input_video> <output_directory>")
        print("Example: python optimize-video.py soc-demo.mov frontend/public/videos/")
        sys.exit(1)
    
    if not check_ffmpeg():
        print("❌ FFmpeg not found. Please install FFmpeg first.")
        print("   Ubuntu/Debian: sudo apt install ffmpeg")
        print("   macOS: brew install ffmpeg")
        print("   Windows: Download from https://ffmpeg.org/")
        sys.exit(1)
    
    input_video = sys.argv[1]
    output_dir = sys.argv[2]
    
    if not os.path.exists(input_video):
        print(f"❌ Input video not found: {input_video}")
        sys.exit(1)
    
    print(f"🎬 Optimizing video for Render deployment...")
    print(f"Input: {input_video}")
    print(f"Output: {output_dir}")
    print()
    
    success = optimize_video(input_video, output_dir)
    
    if success:
        print("\n✅ Video optimization complete!")
        print("\n📝 Next steps:")
        print("1. Update hero-section.tsx to use the optimized video files")
        print("2. Test video playback locally")
        print("3. Deploy to Render")
        print("4. Verify video loads correctly in production")
    else:
        print("\n❌ Video optimization failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
