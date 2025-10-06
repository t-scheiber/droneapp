# 🚁 Drone Document Wallet

A secure, mobile-optimized document viewer specifically designed for drone operators. Show authorities your complete documentation instantly when stopped while flying.

**Perfect for drone pilots who need to present insurance, registration, and aviation documents to police or authorities on-the-spot.**

## 🌐 Live Page

**Access the live application:** [drone.thomasscheiber.com](https://drone.thomasscheiber.com)

## 🚔 Police & Authority Features

- 🔒 **Instant Access**: One-click login with your chosen passphrase - ready in seconds
- 📱 **Mobile-First**: Designed specifically for smartphone verification scenarios
- 🚁 **Drone-Focused**: Tailored for German drone regulations and insurance requirements
- 📋 **Complete Documentation**: All required papers in one accessible location
- ⚡ **Offline-Ready**: Works even without internet connection after initial load
- 🔍 **Professional Presentation**: Clean, official-looking interface for authorities
- 🛡️ **GitHub-Safe**: Passphrase stored securely in environment variables, not in code

## Technical Features

- 📱 **Police-Optimized Mobile UI**: Perfect for showing documents during drone stops
- 📄 **Full-Screen PDF Viewer**: Maximum visibility for document verification
- 🎯 **Touch-Friendly Controls**: Large buttons and intuitive navigation for stressed situations
- ⚡ **Fast Loading**: Critical documents load instantly when you need them
- 🔄 **Auto-Detection**: Automatically finds and organizes all your drone-related PDFs

## 🚁 Quick Setup for Drone Pilots

### 1. Install & Setup (5 minutes)
```bash
# Install dependencies
npm install

# Copy environment file and set your passphrase
cp .env.example .env.local
# Edit .env.local and change NEXT_PUBLIC_DRONE_PASSPHRASE to your secure passphrase

# Build the application (includes automatic document detection)
npm run build
```

### 2. Test Your Setup
1. **Open**: http://localhost:3000 (or your assigned port)
2. **Login**: Enter your chosen passphrase → Documents appear instantly
3. **Verify**: All your insurance and registration docs are visible
4. **Test Mobile**: Open on your phone - should work perfectly

**Or use the live demo:** [drone.thomasscheiber.com](https://drone.thomasscheiber.com)

### 3. Deploy for Field Use
```bash
# The build command already created the static export in 'out/' folder

# Option A: Python (if installed)
cd out && python -m http.server 8000

# Option B: Node.js (recommended)
npx serve out -p 8000

# Option C: Copy 'out' folder to your phone for offline access
```

### 4. Police-Stop Ready ✅
- **Bookmark** [drone.thomasscheiber.com](https://drone.thomasscheiber.com) on your phone's home screen
- **Test** your passphrase works
- **Verify** all critical documents load quickly
- **Practice** the one-click access flow

**You're ready!** 🚁✨

## 🔐 GitHub Security - Completely Safe for Public Repos

This application is **100% safe to upload to GitHub as a public repository** because:

### 🛡️ **No Secrets in Code**
- ✅ **Passphrase**: Stored in environment variables, never hardcoded
- ✅ **No API Keys**: Client-side only, no backend authentication needed
- ✅ **Configuration**: All sensitive data is in `.env.local` (ignored by Git)

### 🔒 **Environment Variable Security**
- ✅ `.env.local` contains your passphrase → **Automatically ignored by Git** (`.gitignore`)
- ✅ `.env.example` shows structure → **Safe to commit** (contains no secrets)
- ✅ Passphrase is loaded at runtime → **Never visible in source code**
- ✅ **Build verified**: Environment variables are loaded during build process

### 🚀 **Public Repository Benefits**
- **Share Code**: Others can benefit from the drone document system
- **Community**: Get contributions and improvements
- **Transparency**: Show how the secure document system works
- **Documentation**: Help other drone pilots set up their own systems

### ⚠️ **Important Reminders**
- **Never commit** `.env.local` to GitHub
- **Use a strong passphrase** for your actual deployment
- **Test thoroughly** after changing the passphrase
- **Keep backups** of your important documents

### Static Build (Default & Recommended)

The `npm run build` command creates a static export in the `out/` folder that can be served by any web server:

```bash
npm run build
```

**This is the main build command** - it automatically:
- ✅ Generates the document list from your PDF files
- ✅ Creates a completely static site in the `out/` folder
- ✅ Optimizes for production deployment
- ✅ Ready for any web server or mobile deployment

### Production Deployment

The application is live at **[drone.thomasscheiber.com](https://drone.thomasscheiber.com)**

Deploy your own instance by:
1. Building the static export with `npm run build`
2. Uploading the `out/` folder to any static hosting service
3. Configure your passphrase via environment variables before building

## 🚁 Drone Pilot Usage Guide

### Quick Start
Visit **[drone.thomasscheiber.com](https://drone.thomasscheiber.com)** on your phone and add to home screen for instant access!

### During Normal Flight
1. **Access the Application**: Navigate to [drone.thomasscheiber.com](https://drone.thomasscheiber.com)
2. **Enter Passphrase**: Use your chosen passphrase to unlock the document viewer
3. **Browse Documents**: View available PDF documents in a tile layout
4. **View Documents**: Click "View" to open PDFs in a modal viewer
5. **Download**: Click the download icon to save PDF documents locally

### 🚔 Police Stop Scenario
1. **Stay Calm**: Politely explain you have digital documentation ready
2. **Quick Access**: Enter your passphrase - **one word, ready in seconds**
3. **Show Documents**: Present insurance, registration, and aviation certificates
4. **Professional Presentation**: Clean, official interface makes verification easy
5. **Download Physical Copies**: Option to download PDFs if physical copies needed

### Essential Documents for Austrian Drone Operators

**🚁 Required by Austrian Aviation Law:**
- ✅ **Liability Insurance** (Haftpflichtversicherung) - Required for all drones over 250g
- ✅ **Drone Registration** (Drohnen-Meldung) - EU drone registration number
- ✅ **Aviation Authority Certificates** (Luftfahrt-Bescheinigung) - AustroControl approvals
- ✅ **Insurance Policies** (Versicherungspolicen) - R+V or similar drone insurance
- ✅ **Technical Specifications** (Technische Datenblätter) - Drone model specifications

**📋 What Police Typically Check:**
1. **Insurance Certificate** - Must be valid and cover drone operations
2. **Registration Number** - EU drone ID must be displayed on the drone
3. **Operator Certificate** - Proof of competency for commercial operations
4. **Flight Permissions** - Special approvals for restricted areas

**💡 Pro Tips:**
- **Keep it Simple**: Your passphrase → Documents ready in 3 seconds
- **Be Prepared**: Have both digital and physical copies
- **Know Your Rights**: Politely ask which specific documents they need
- **Stay Compliant**: Ensure all documents are current and valid

## Security

- Client-side authentication using localStorage
- Passphrase: **Your chosen passphrase** (stored securely in environment variables)
- Authentication state persists across browser sessions
- No sensitive data stored on the client

### Styling

The application uses Tailwind CSS for styling. Modify `app/globals.css` to customize the appearance.

## 🚔 Police-Stop Optimized Mobile Features

- 📱 **One-Hand Operation**: Designed for stressful situations where you need quick access
- 👆 **44px Touch Targets**: Meets accessibility guidelines - easy to tap even when nervous
- 🎯 **Instant Loading**: Critical documents load immediately when you need them most
- 📖 **Maximum Visibility**: Full-screen PDF viewer ensures authorities can clearly read documents
- 🔄 **Stress-Tested UI**: Large buttons, clear labels, intuitive navigation for high-pressure situations
- 📌 **Always Accessible**: Sticky header and simple navigation - no fumbling with complex menus
- ⚡ **Offline Ready**: Works without internet connection after initial setup
- 🚁 **Professional Appearance**: Clean, official-looking interface that authorities recognize and trust

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom mobile utilities
- **Build**: Static export with dynamic file detection
- **Authentication**: Client-side with React Context
- **State Management**: React hooks and localStorage
- **File Detection**: Build-time scanning with JSON generation
- **Dynamic Loading**: Automatic document discovery and metadata generation
- **Mobile Optimization**: Touch manipulation, responsive breakpoints, and accessibility features

## Browser Support

### Desktop
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Mobile
- ✅ iOS Safari (iPhone/iPad)
- ✅ Chrome Mobile (Android)
- ✅ Samsung Internet
- ✅ Firefox Mobile
- ✅ Edge Mobile

**Mobile-First Design**: Optimized for touch interactions, responsive layouts, and mobile performance.

## License

This project is open source and available under the [MIT License](LICENSE).
