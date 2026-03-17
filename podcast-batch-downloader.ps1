<#
.SYNOPSIS
    Downloads multiple MP3 files from a list of URLs directly to your computer.

.DESCRIPTION
    This script downloads each file sequentially, saving it to the specified folder.
    It extracts the filename from the URL and handles URLs that may contain query parameters.

.NOTES
    Author: AI Assistant
    Date:   March 2026
#>

# ============================================================================
# USER CONFIGURATION – EDIT THESE VALUES BEFORE RUNNING
# ============================================================================

# List of MP3 URLs to download – replace with your own URLs, one per line
$urls = @(
    'https://www.podtrac.com/pts/redirect.mp3/pdst.fm/e/traffic.megaphone.fm/NBNK8651608028.mp3?updated=1773289759',
    'https://www.podtrac.com/pts/redirect.mp3/pdst.fm/e/traffic.megaphone.fm/NBNK8977114588.mp3?updated=1773291274',
    'https://www.podtrac.com/pts/redirect.mp3/pdst.fm/e/traffic.megaphone.fm/NBNK1870451135.mp3'
    # Add as many as you like
)

# Folder where the files will be saved – change this to your preferred location
$downloadFolder = "$env:USERPROFILE\Downloads\Podcasts"
# Examples:
#   $downloadFolder = "C:\Users\YourName\Desktop\MyPodcasts"
#   $downloadFolder = "D:\Audio\Podcasts"

# ============================================================================
# SCRIPT – DO NOT MODIFY BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING
# ============================================================================

# Create the download folder if it doesn't already exist
# -Force creates the folder and any missing parent folders silently
New-Item -ItemType Directory -Force -Path $downloadFolder | Out-Null

Write-Host "📁 Download folder: $downloadFolder"
Write-Host "📦 Total files to download: $($urls.Count)`n"

# Loop through each URL in the list
for ($i = 0; $i -lt $urls.Count; $i++) {
    $url = $urls[$i]

    # Extract the filename from the URL
    # 1. Split by '/' and take the last part (e.g., "NBNK8651608028.mp3?updated=1773289759")
    $filenameWithQuery = $url.Split('/')[-1]
    # 2. Split by '?' and take the first part (removes query string)
    $filename = $filenameWithQuery.Split('?')[0]
    # 3. Ensure the filename ends with .mp3 (add it if missing)
    if (-not $filename.EndsWith('.mp3')) {
        $filename += '.mp3'
    }

    # Full path where the file will be saved
    $outFile = Join-Path $downloadFolder $filename

    Write-Host "[$($i+1)/$($urls.Count)] Downloading: $filename"

    try {
        # Invoke-WebRequest downloads the file to the specified path
        # -Uri: the source URL
        # -OutFile: where to save the file locally
        Invoke-WebRequest -Uri $url -OutFile $outFile -ErrorAction Stop
        Write-Host "   ✅ Saved to: $outFile"
    }
    catch {
        Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        # Optional: uncomment the next line to stop on first error
        # exit 1
    }

    # Add a blank line between downloads for readability
    Write-Host ""
}

Write-Host "🎉 All downloads completed!" -ForegroundColor Green
