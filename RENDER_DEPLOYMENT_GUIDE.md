# Render Deployment Guide: PostgreSQL Migration & Video Hosting

## Overview

This guide covers the complete migration from MongoDB to PostgreSQL and deployment to Render with locally hosted video assets.

## Prerequisites

- Render account
- Git repository connected to Render
- Original video file for SOC demonstration
- FFmpeg installed (for video optimization)

## Step 1: Database Migration

### 1.1 Create PostgreSQL Database on Render

1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `copperhead-db`
   - **Database Name**: `copperhead_production`
   - **User**: `copperhead_user`
   - **Region**: Choose closest to your users
   - **Plan**: Starter (can upgrade later)

### 1.2 Get Database Connection String

1. Once created, go to database settings
2. Copy the **External Database URL**
3. Format: `postgresql://username:password@host:port/database`

### 1.3 Run Database Migrations

```bash
# Set environment variable
export DATABASE_URL="your_postgresql_connection_string"

# Run migrations
python -m alembic upgrade head
```

## Step 2: Video Optimization & Upload

### 2.1 Optimize Video for Web

```bash
# Install FFmpeg if not already installed
# Ubuntu/Debian: sudo apt install ffmpeg
# macOS: brew install ffmpeg

# Optimize your SOC demonstration video
python scripts/optimize-video.py path/to/original-video.mov frontend/public/videos/
```

This creates:
- `soc-operations-demo.mp4` (H.264, optimized for compatibility)
- `soc-operations-demo.webm` (VP9, smaller file size)
- `soc-operations-demo-poster.jpg` (poster image)

### 2.2 Video Specifications

**Recommended specs for Render hosting:**
- **Resolution**: 1920x1080 (Full HD)
- **Duration**: 30-60 seconds
- **File size**: < 50MB total
- **Formats**: MP4 (primary) + WebM (fallback)
- **Codec**: H.264 for MP4, VP9 for WebM
- **Bitrate**: 2-4 Mbps

## Step 3: Backend Deployment

### 3.1 Create Backend Service

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name**: `copperhead-backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt
     python -m alembic upgrade head
     ```
   - **Start Command**: `python server.py`
   - **Plan**: Starter

### 3.2 Set Environment Variables

1. Go to service settings → Environment
2. Add variables:
   ```
   DATABASE_URL=<from_postgresql_service>
   ENVIRONMENT=production
   CSRF_SECRET=<generate_random_32_chars>
   SESSION_SECRET=<generate_random_32_chars>
   RESEND_API_KEY=<your_resend_key>
   ```

### 3.3 Connect Database

1. In Environment Variables
2. Add `DATABASE_URL` and select "From Database"
3. Choose your PostgreSQL database
4. Select "Connection String"

## Step 4: Frontend Deployment

### 4.1 Update Frontend Environment

Update `frontend/.env`:
```env
VITE_BACKEND_URL=https://copperhead-backend.onrender.com
VITE_APP_NAME=Copperhead Consulting Inc
VITE_ENVIRONMENT=production
```

### 4.2 Create Frontend Service

1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect your Git repository
4. Configure:
   - **Name**: `copperhead-frontend`
   - **Build Command**: 
     ```bash
     cd frontend
     yarn install
     yarn build
     ```
   - **Publish Directory**: `frontend/dist`

### 4.3 Configure Redirects & Headers

Add to `frontend/public/_redirects`:
```
/api/* https://copperhead-backend.onrender.com/api/:splat 200
/* /index.html 200
```

Add to `frontend/public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/videos/*
  Cache-Control: public, max-age=31536000

/images/*
  Cache-Control: public, max-age=31536000

/assets/*
  Cache-Control: public, max-age=31536000
```

## Step 5: Custom Domain (Optional)

### 5.1 Configure Custom Domain

1. Go to frontend service settings
2. Click "Custom Domains"
3. Add `copperheadci.com`
4. Update DNS records as instructed

### 5.2 Update CORS Origins

Update backend environment:
```
CORS_ORIGINS=["https://copperheadci.com", "https://copperhead-frontend.onrender.com"]
```

## Step 6: Testing & Verification

### 6.1 Backend Health Check

Test backend API:
```bash
curl https://copperhead-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "copperhead-api",
  "version": "1.0.0",
  "timestamp": 1706123456
}
```

### 6.2 Database Connection Test

```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM contact_submissions;"
```

### 6.3 Video Playback Test

1. Visit frontend URL
2. Check hero section video plays automatically
3. Verify fallback image loads if video fails
4. Test on mobile devices

### 6.4 Contact Form Test

1. Fill out contact form
2. Check database for new submission:
   ```sql
   SELECT * FROM contact_submissions ORDER BY submitted_at DESC LIMIT 1;
   ```

## Step 7: Performance Optimization

### 7.1 Monitor Video Bandwidth

- Check Render bandwidth usage in dashboard
- Monitor video file sizes and loading times
- Consider CDN if bandwidth costs become high

### 7.2 Database Performance

- Monitor PostgreSQL performance metrics
- Add indexes if query performance degrades
- Consider upgrading plan if needed

### 7.3 Caching Strategy

- Static assets cached for 1 year
- API responses use appropriate cache headers
- Video files cached aggressively

## Step 8: Monitoring & Maintenance

### 8.1 Set Up Monitoring

1. Enable Render monitoring
2. Set up uptime monitoring (UptimeRobot, etc.)
3. Monitor database storage usage
4. Track bandwidth consumption

### 8.2 Backup Strategy

1. Render PostgreSQL includes automatic backups
2. Consider additional backup strategy for critical data
3. Test restore procedures

### 8.3 Security Updates

1. Regularly update dependencies
2. Monitor security advisories
3. Review access logs periodically

## Troubleshooting

### Common Issues

**Video not loading:**
- Check file paths in hero-section.tsx
- Verify video files are in frontend/public/videos/
- Check browser console for errors
- Test video files directly via URL

**Database connection errors:**
- Verify DATABASE_URL environment variable
- Check PostgreSQL service status
- Review connection string format

**CORS errors:**
- Update CORS_ORIGINS environment variable
- Check frontend VITE_BACKEND_URL
- Verify domain configuration

**Build failures:**
- Check build logs in Render dashboard
- Verify all dependencies in requirements.txt
- Test build locally first

## Cost Estimation

### Render Pricing (2025)

**Starter Plan:**
- Backend service: $7/month
- PostgreSQL: $7/month
- Static site: Free
- Bandwidth: $0.15/GB

**Estimated monthly cost:**
- Base services: $14/month
- Bandwidth (100GB): $15/month
- **Total: ~$29/month**

### Scaling Considerations

- **< 1GB data, < 100GB bandwidth**: Starter plan sufficient
- **1-10GB data, 500GB+ bandwidth**: Consider Pro plan + CDN
- **High traffic**: Implement external CDN for video assets

## Success Metrics

✅ **Migration Complete When:**
- PostgreSQL database operational
- All API endpoints working
- Video plays correctly on all devices
- Contact forms submit to PostgreSQL
- Security logging functional
- Performance meets requirements
- SSL certificates active
- Custom domain configured (if applicable)

## Next Steps

After successful deployment:
1. Monitor performance for 1 week
2. Optimize based on real usage patterns
3. Consider implementing CDN if bandwidth costs are high
4. Set up automated backups
5. Plan for scaling based on traffic growth

---

**Support:** For issues, check Render documentation or contact support through their dashboard.
