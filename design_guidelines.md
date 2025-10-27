# Design Guidelines: Futuristic Investment DApp

## Design Approach

**Reference-Based Approach**: Drawing inspiration from leading crypto/DeFi platforms (Uniswap, Aave, Compound) combined with futuristic fintech aesthetics. The design emphasizes trust, technological sophistication, and real-time financial data visualization.

**Core Principles**:
- **Futuristic Minimalism**: Clean interfaces with high-tech visual elements
- **Data Transparency**: Clear, immediate access to investment metrics
- **Trust & Security**: Professional aesthetic that conveys financial reliability
- **Progressive Disclosure**: Complex data revealed through intuitive interactions

## Visual Identity & Aesthetic

**Design Language**: Cyberpunk meets professional fintech
- Glassmorphism cards with subtle blur effects and translucent backgrounds
- Dark theme foundation with neon accent highlights (cyan, electric blue, purple gradients)
- Sharp geometric shapes mixed with smooth rounded corners (border-radius: 12px-24px)
- Gradient borders and subtle glow effects on interactive elements
- Grid patterns and dot matrices as background textures
- Floating card elevations with multiple shadow layers

## Typography

**Font Strategy**: Use **Inter** (primary) and **Space Grotesk** (headings/numbers)

**Hierarchy**:
- **Hero Headlines**: text-5xl to text-7xl, font-bold, tracking-tight, Space Grotesk
- **Section Headers**: text-3xl to text-4xl, font-semibold, Space Grotesk
- **Dashboard Metrics**: text-2xl to text-4xl, font-bold, tabular-nums, Space Grotesk
- **Card Titles**: text-xl, font-semibold, Inter
- **Body Text**: text-base, font-normal, Inter, leading-relaxed
- **Labels & Captions**: text-sm, font-medium, Inter, opacity-70
- **Micro-copy**: text-xs, uppercase tracking-wide for badges

**Number Treatment**: All financial data uses tabular-nums, monospace-style spacing for alignment

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Element margins: mb-4, mt-6, mx-8

**Grid System**:
- **Dashboard**: 12-column grid with 2-column sidebar (user info/quick stats) + 10-column main content area
- **Package Cards**: grid-cols-1 md:grid-cols-2 xl:grid-cols-3 with gap-6
- **Referral Tree**: Hierarchical visual display, max-w-7xl centered
- **Mobile**: Single column stack, full-width cards with collapsible sections

**Container Strategy**:
- Max-width: max-w-7xl for main content areas
- Full-width backgrounds with contained content
- Sticky navigation/wallet header

## Component Library

### Navigation
**Header**: Glassmorphic sticky header with blur backdrop
- Logo + Network indicator (chain icon + name)
- Connected wallet display (truncated address with identicon)
- Connect Wallet button (prominent, gradient background)
- Mobile: Hamburger menu with slide-in drawer

### Hero Section (Landing)
**Layout**: Full viewport height split design
- Left: Headline + value proposition + CTA buttons (Connect Wallet, View Packages)
- Right: Animated 3D isometric illustration or abstract financial visualization
- Background: Subtle animated grid pattern with gradient overlay
- Statistics bar below hero: Active Users, Total Invested, Total Rewards Paid (animated counters)

### Package Selection Cards
**Design**: Elevated cards with hover lift effect
- Card structure: Package tier badge → Price range → Daily ROI percentage (large, emphasized) → Feature list → Invest button
- Visual differentiation: Border gradient intensity increases with tier
- Active/selected state: Glow effect + border pulse animation
- Responsive: Stack on mobile, 2-col tablet, 3-col desktop

### Dashboard Components

**Metrics Cards**: 
- Grid of 4 key metrics: Total Invested, Available Rewards, Total Withdrawn, Total Referrals
- Each card: Icon + Label + Large number + 24h change indicator (+ percentage with arrow)
- Real-time pulse animation on reward counter
- Glassmorphic background with gradient border

**Active Investment Display**:
- Large card showing current package details
- Progress bar to 200% cap (gradient fill, percentage label)
- Circular progress indicator for daily ROI cycle
- Reward accrual counter (updates per second with smooth number transitions)
- Action buttons: Claim Rewards (primary), Reinvest (secondary)

**Referral System**:
- Copy referral link input with one-click copy button
- 5-level pyramid visualization showing: Level → Referrals count → Earnings
- Animated connection lines between levels
- Expandable list showing individual referral details per level

### Forms & Inputs
- Input fields: Dark background with light border, focus state adds glow
- Amount inputs: Large text with USD equivalent below in smaller font
- Approve + Deposit flow: Two-step progress indicator
- Connected buttons showing loading states with spinner + text

### Buttons
**Primary**: Gradient background (cyan to blue), white text, font-semibold, px-8 py-3, hover scale-105
**Secondary**: Transparent with gradient border, hover fills with subtle gradient
**Ghost**: Text-only with hover underline effect
**Disabled**: Reduced opacity, no interactions

### Modals & Overlays
- Transaction confirmation: Center modal with blur backdrop
- Loading states: Skeleton screens with shimmer effect
- Success/Error notifications: Toast-style, slide-in from top-right
- Wallet connection modal: Grid of wallet options with icons

### Data Visualization
- Line charts for reward growth over time (use Chart.js or Recharts)
- Pie chart for referral level distribution
- Progress bars with gradient fills
- Real-time tickers for live data

## Animations & Interactions

**Page Transitions**:
- Fade-in on load with stagger effect for cards (100ms delay between elements)
- Smooth scroll behavior with scroll-triggered animations

**Micro-interactions**:
- Button hover: scale-105 + shadow intensifies
- Card hover: translateY(-4px) + glow effect + border pulse
- Number counters: Smooth counting animation using odometer effect
- Progress bars: Fill animation on load
- Loading states: Gradient shimmer across skeleton components

**Futuristic Effects**:
- Particle background: Floating dots with slow parallax movement
- Data streams: Vertical flowing lines in background (CSS animation)
- Glow pulses: Radial gradient pulse on active elements (2s infinite)
- Holographic borders: Animated gradient rotation on premium cards
- Connecting lines: SVG path animations between referral levels
- Reward counter: Continuous increment with color flash on milestone

**Gesture Support**:
- Swipe gestures for mobile card navigation
- Pull-to-refresh on dashboard
- Long-press for additional options

## Images & Visual Assets

**Hero Section**: Abstract 3D rendered visualization featuring:
- Floating geometric shapes (cubes, spheres) with gradient materials
- Network connection nodes and lines suggesting blockchain
- Color scheme: Deep purples, electric blues, cyan highlights
- Animated subtle rotation and float

**Package Cards**: Icon-based graphics (not photos)
- Use icon library for features (Shield for security, Zap for fast, TrendingUp for ROI)
- Optional: Abstract gradient background shapes unique per tier

**Empty States**: Illustrated graphics for:
- No active investments: Minimalist rocket or growth chart illustration
- No referrals: Network nodes illustration
- Use outline/stroke style illustrations in brand accent colors

**No photography needed** - maintain fully digital, tech-forward aesthetic throughout

## Responsive Behavior

**Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

**Mobile Optimizations**:
- Bottom sheet modals instead of center modals
- Sticky CTA buttons fixed to bottom
- Collapsible sections with accordion behavior
- Horizontal scroll for package cards with snap-scroll
- Simplified animations (reduce particle effects)
- Touch-optimized button sizes (min-h-12)

**Tablet**: Two-column layouts, side drawer navigation

**Desktop**: Full multi-column dashboard, hover effects enabled, expanded animations