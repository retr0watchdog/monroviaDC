# Decap CMS Documentation for Stop the Data Center Website

## Getting Started

Your website now has a Content Management System (CMS) that allows you to edit content without coding. Here's how to use it:

### Accessing the CMS

1. Go to your website URL followed by `/admin` (e.g., `https://yoursite.com/admin`)
2. Click "Login with GitHub"
3. You'll need to be added as a collaborator to the GitHub repository

### First Time Setup

**Important**: Before you can use the CMS, you need to:

1. **Update the repository name** in `/admin/config.yml`:
   - Change `repo: randylane/monroviaDC-main` to your actual GitHub username/repository
   
2. **Set up GitHub OAuth** (this requires some technical setup):
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `https://api.netlify.com/auth/done`
   - Note the Client ID and Client Secret

3. **Deploy to Netlify** (recommended for GitHub Pages + CMS):
   - Connect your GitHub repository to Netlify
   - Add environment variables for GitHub OAuth
   - This enables the authentication system

## What You Can Edit

### 1. Site Settings
- **Hero title and subtitle** (main page banner text)
- **Petition URL** (Change.org link)
- **Donation URL** (GoFundMe link)
- **Statistics** (petition signatures, volunteers, etc.)

### 2. Events
- **Add new events** with dates, times, locations
- **Edit existing events**
- **Set event colors** (red for campaign events, green for festivals)
- **Mark featured events** (appear prominently)

### 3. Page Content
- **Home page milestones** (campaign progress)
- **Back story content** (sections and text)
- **Donate page content** (descriptions and donation uses)

### 4. Representatives
- **Add/edit local officials** contact information
- **Organize by category** (State, Town Council, etc.)
- **Update contact details** (phone, email)

### 5. Media & Images
- **Upload new images** for hero sections
- **Change feature card images**
- **Update alt text** for accessibility

### 6. FAQ
- **Add new questions and answers**
- **Edit existing FAQ content**
- **Reorder questions** by changing the order number

## How to Edit Content

### Editing Text
1. Navigate to the content section (e.g., "Site Settings")
2. Click on the item you want to edit
3. Make your changes in the editor
4. Click "Save" then "Publish"
5. Changes appear on your website immediately

### Adding Events
1. Go to "Events" section
2. Click "New Events"
3. Fill in the form:
   - **Event Title**: Name of the event
   - **Date**: Use the date picker
   - **Time**: Enter time as text (e.g., "7:00 PM")
   - **Location**: Where the event takes place
   - **Description**: Brief description
   - **Color**: Choose red (#B30000) for campaign events
   - **Featured**: Check for important events
4. Save and publish

### Uploading Images
1. Go to "Media & Images"
2. Click on the image field you want to change
3. Click "Choose an image"
4. Upload your new image or select from existing
5. Update the alt text (important for accessibility)
6. Save and publish

### Updating Statistics
1. Go to "Site Settings"
2. Scroll to "Social Proof Stats"
3. Update the numbers:
   - Petition Signatures
   - Active Volunteers
   - Local Businesses
   - Meetings Organized
4. Save and publish

## Content Guidelines

### Writing Style
- Keep text clear and action-oriented
- Use active voice ("Join us" not "You can join us")
- Include specific dates and locations
- Emphasize community impact

### Images
- Use high-quality images (at least 1200px wide for hero images)
- Include people when possible (shows community support)
- Ensure images are relevant to the content
- Always add descriptive alt text

### Events
- Include complete information (date, time, location)
- Write compelling descriptions that encourage attendance
- Use consistent formatting for times (e.g., "7:00 PM")
- Mark important events as "featured"

## Technical Notes

### File Structure
The CMS creates and manages these files:
- `_data/settings.yml` - Site-wide settings
- `_data/pages/home.yml` - Home page content
- `_data/events/` - Individual event files
- `_data/representatives/` - Official contact info
- `_data/media.yml` - Image settings

### Backup
- All changes are saved to GitHub automatically
- GitHub keeps a complete history of all changes
- You can revert to previous versions if needed

### Publishing
- Changes are live immediately after publishing
- The website updates automatically from the data files
- No need to manually update HTML files

## Troubleshooting

### Can't Log In
- Make sure you're added as a collaborator to the GitHub repository
- Check that the repository name in `config.yml` is correct
- Verify GitHub OAuth is set up properly

### Changes Not Appearing
- Make sure you clicked "Publish" not just "Save"
- Check browser cache (try refreshing with Ctrl+F5)
- Verify the data files were updated in GitHub

### Images Not Loading
- Ensure images are uploaded to the correct folder
- Check file names don't have spaces or special characters
- Verify image file sizes aren't too large (under 5MB recommended)

## Support

If you need help:
1. Check this documentation first
2. Look at the GitHub repository for recent changes
3. Contact your technical administrator
4. Check the browser console for error messages (F12 key)

## Best Practices

### Regular Updates
- Update petition signature counts weekly
- Add new events as soon as they're planned
- Keep representative contact information current
- Refresh images periodically to show ongoing activity

### Content Strategy
- Focus on local impact and community stories
- Include specific calls to action
- Update milestones as campaign progresses
- Highlight upcoming events prominently

### SEO Considerations
- Use descriptive titles for events and pages
- Include location names in content
- Keep descriptions informative and keyword-rich
- Update meta descriptions when content changes significantly

Remember: The CMS makes it easy to keep your website current and engaging. Regular updates help maintain community interest and support for your cause!
