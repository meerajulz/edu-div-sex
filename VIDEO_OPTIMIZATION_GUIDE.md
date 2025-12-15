# Video Optimization & Error Logging Guide

## Problem Statement

Users on older Android tablets (e.g., Galaxy Tab A SM-T510) were experiencing:
- App hanging/freezing when loading videos
- Blank screens during activity loading
- Need to refresh multiple times to load content
- Issues even with good WiFi connection

## Root Causes

1. **Aggressive video preloading** - Videos were using `preload="auto"` which downloads entire videos upfront
2. **No error handling** - Video failures were silent with no retry mechanism
3. **Limited logging** - Vercel free tier only shows 24-hour logs, making debugging difficult
4. **No optimization for low-power devices** - Same loading strategy for all devices

## Solutions Implemented

### 1. Client-Side Error Logging System

**Location**: `apps/web/src/app/utils/errorLogger.ts`

A comprehensive error logging utility that:
- Stores errors in localStorage (last 50 errors)
- Sends errors to API endpoint for server-side logging
- Tracks video errors, network issues, and performance warnings
- Includes device information (platform, memory, connection type)
- Allows exporting logs for sharing with support

**API Endpoint**: `apps/web/src/app/api/log-error/route.ts`
- Receives error logs from client
- Logs to Vercel console (visible in free tier for 24 hours)
- Can be extended to send to external services (Sentry, LogRocket, etc.)

**How to access error logs**:
- Press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac) anywhere in the app
- Add `?debug=logs` to URL
- In development mode, click the red warning button in bottom-right corner
- Export logs as JSON file to share with developers

### 2. Optimized Video Component

**Location**: `apps/web/src/app/components/OptimizedVideo/OptimizedVideo.tsx`

Features:
- **Lazy loading** - Videos only start loading when near viewport (200px margin)
- **Metadata-only preload** - Only loads video metadata, not full video
- **Low-power mode detection** - Automatically detects Android/low-memory devices
- **Retry mechanism** - Automatically retries failed loads (3 attempts with exponential backoff)
- **Performance monitoring** - Tracks and logs slow loading times
- **Loading states** - Shows spinner while loading
- **Error overlays** - User-friendly error messages with retry button
- **Network stall detection** - Detects and logs network issues

### 3. Updated VideoBackground Component

**Changes**:
- Changed `preload="auto"` to `preload="metadata"`
- Added error logging with device context
- Maintains all existing audio handling for iOS/iPad/Desktop

### 4. Global Error Log Viewer

**Location**: `apps/web/src/app/components/GlobalErrorLogViewer/`

Accessible throughout the app via keyboard shortcut or debug mode. Shows:
- All logged errors with timestamps
- Device information
- Ability to filter by error type
- Export functionality for sharing with developers

## How to Use

### For Developers

#### 1. Update existing video elements to use OptimizedVideo:

```tsx
// Before
<video
  src="/video/my-video.mp4"
  autoPlay
  playsInline
  onEnded={handleEnd}
/>

// After
import OptimizedVideo from '@/app/components/OptimizedVideo';

<OptimizedVideo
  src="/video/my-video.mp4"
  autoPlay
  playsInline
  onEnded={handleEnd}
  lazyLoad={true}
  lowPowerMode={true}
  maxRetries={3}
/>
```

#### 2. Log custom errors:

```tsx
import { logError, logVideoError } from '@/app/utils/errorLogger';

// Log general errors
logError('component_error', 'Failed to load game', { gameId: 123 });

// Log video-specific errors
logVideoError('/video/my-video.mp4', error, { additionalContext: 'value' });

// Log performance warnings
import { logPerformanceWarning } from '@/app/utils/errorLogger';
logPerformanceWarning('data fetch', 5000, 3000, { endpoint: '/api/data' });
```

### For Users/Testers

#### Accessing Error Logs:

1. **Keyboard shortcut**: Press `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac)
2. **URL parameter**: Add `?debug=logs` to the URL
3. **Debug mode**: Add `?debug=1` to see the debug button

#### Sharing Error Logs:

1. Open error log viewer (see above)
2. Click "Exportar" button
3. Save the JSON file
4. Share the file with the development team via email

## Performance Improvements

### Changes to VideoBackground:
- **Before**: Preloaded entire video on page load
- **After**: Only loads video metadata (~ 90% reduction in initial load)

### Changes to Scene Videos:
- **Before**: Videos loaded immediately when scene mounted
- **After**: Videos load when entering viewport + optimized for low-power devices

### Expected Impact:
- **Faster page loads**: Especially on slower connections
- **Reduced memory usage**: Better for devices with limited RAM
- **Better error recovery**: Automatic retries instead of stuck state
- **Improved debugging**: Detailed error logs instead of guessing

## Monitoring & Debugging

### Check Logs in Vercel:

1. Go to Vercel Dashboard → Your Project → Logs
2. Filter by "CLIENT ERROR" to see error logs
3. Look for patterns (same error repeated, specific videos failing, etc.)

### Check Client-Side Logs:

1. Press `Ctrl+Shift+E` to open error viewer
2. Filter by error type (video_error, network_error, etc.)
3. Export logs for detailed analysis

## Next Steps & Recommendations

### Immediate Actions:

1. **Deploy changes** to production
2. **Ask affected users** to add `?debug=1` to URL and send error logs
3. **Monitor Vercel logs** for CLIENT ERROR entries in the next 24 hours

### Short-term Improvements:

1. **Video compression**: Consider re-encoding videos at lower bitrates
   - Current videos may be too high quality for tablets
   - Recommend: 720p @ 2-3 Mbps for educational content
   - Tools: HandBrake, FFmpeg

2. **Add video CDN**: Consider using a CDN for video delivery
   - Vercel serves from single region by default
   - CDN provides geographic distribution and adaptive bitrate
   - Options: Cloudflare Stream, Mux, AWS CloudFront

3. **Implement adaptive streaming**: Use HLS or DASH for automatic quality adjustment
   - Requires video transcoding to multiple bitrates
   - Better experience on varying connection speeds

### Long-term Improvements:

1. **External Error Tracking**:
   - Integrate Sentry (free tier available) for better error tracking
   - Real-time alerts for critical errors
   - User session replay to see what happened

2. **Performance Monitoring**:
   - Add Vercel Speed Insights
   - Track Core Web Vitals
   - Monitor video load times

3. **A/B Testing**:
   - Test different video formats (MP4 vs WebM)
   - Test different preload strategies
   - Measure impact on user completion rates

## Video Optimization Recommendations

### Re-encode Videos for Better Performance:

```bash
# Using FFmpeg to create optimized videos for tablets
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 28 \
  -profile:v baseline \
  -level 3.0 \
  -maxrate 2M \
  -bufsize 4M \
  -vf "scale=1280:720" \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4
```

**Parameters explained**:
- `-crf 28`: Quality (lower = better, 18-28 is good range)
- `-maxrate 2M`: Max bitrate of 2 Mbps (good for tablets)
- `-scale=1280:720`: 720p resolution (sufficient for tablets)
- `-profile:v baseline`: Maximum compatibility with old devices
- `-movflags +faststart`: Optimizes for web streaming

### Create Poster Images:

```bash
# Extract first frame as poster
ffmpeg -i input.mp4 -frames:v 1 -q:v 2 poster.jpg
```

Then use in OptimizedVideo:
```tsx
<OptimizedVideo
  src="/video/my-video.mp4"
  poster="/video/posters/my-video.jpg"
  ...
/>
```

## Testing Checklist

Before marking as resolved:

- [ ] Deploy to production
- [ ] Test on affected user's device (Galaxy Tab A SM-T510)
- [ ] Test with slow 3G connection (Chrome DevTools)
- [ ] Verify error logging works
- [ ] Confirm retry mechanism works on network failure
- [ ] Check Vercel logs show CLIENT ERROR entries
- [ ] Test error log export functionality
- [ ] Verify all scenes load correctly
- [ ] Check memory usage on old devices

## Support Information

### For Users Experiencing Issues:

1. Try adding `?debug=1` to the URL
2. Press `Ctrl+Shift+E` to see error logs
3. Click "Exportar" and send the log file to support
4. Include device model and browser version

### For Developers Debugging:

1. Check Vercel logs for CLIENT ERROR
2. Review exported error logs from users
3. Look for patterns in error types and timing
4. Check network conditions in error details
5. Verify video file accessibility and encoding

## Conclusion

These changes provide:
- ✅ Better performance on older devices
- ✅ Comprehensive error logging without paid Vercel plan
- ✅ Automatic retry mechanism for transient failures
- ✅ Detailed debugging information for developers
- ✅ User-friendly error messages
- ✅ Path forward for further optimizations

The error logging system will help identify the root cause of issues much faster, even without paid Vercel logs.
