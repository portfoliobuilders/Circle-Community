export interface ClippingGuide {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  publishedAt: string;
  contentMd: string;
}

export const CLIPPING_GUIDES: ClippingGuide[] = [
  {
    slug: "hook-architecture-vertical-video",
    title: "Hook Architecture for Vertical Video: The First 3 Seconds",
    summary: "How to engineer high-retention openings for YouTube Shorts and Instagram Reels that capture attention before the swipe.",
    category: "Video Editing",
    readTime: "6 min read",
    publishedAt: "2026-11-01",
    contentMd: `### The 3-Second Retention Rule
In vertical video platforms like YouTube Shorts and Instagram Reels, over 65% of audience drop-off occurs within the opening 3 seconds. To maximize verified views on CIRCLE clipping campaigns, your edits must establish immediate visual and psychological intrigue.

### 1. The Audio-Visual Mismatch
Never start with a title card or an introduction sentence like *"In this podcast episode..."*. Instead, cut directly into the most contentious assertion or an unfinished sentence:
- **Audio:** *"Most developers are completely wrong about how AI agents work."*
- **Visual:** High-contrast b-roll or dynamic animated keyword text highlighting the friction point.

### 2. Kinetic Subtitles Done Right
Subtitles are not just accessibility aids; they are pacing instruments:
- Limit text to 2 to 4 words per frame.
- Highlight keywords in brand accent colors (e.g. lime or gold).
- Sync cuts directly with speech cadence rather than arbitrary 2-second timers.

### 3. Pacing and B-Roll Micro-Cuts
Introduce a visual perspective change every 2.5 to 4 seconds:
- Alternate between the primary speaker, the reacting host, and context b-roll.
- Use subtle sound design (whooshes, risers, paper textures) to emphasize key data points without overpowering dialogue.

### 4. Avoiding False Clickbait
CIRCLE's anti-fraud policy disqualifies edits that maliciously alter quotes out of context. Retain the authentic nuance of the speaker's argument while sharpening the delivery.`,
  },
  {
    slug: "asci-compliance-guide-india",
    title: "The 2026 ASCI Influencer Advertising Code for Indian Creators",
    summary: "A practical compliance handbook for tagging paid partnerships, #ad disclosures, and maintaining legal transparency.",
    category: "Legal & Compliance",
    readTime: "5 min read",
    publishedAt: "2026-11-03",
    contentMd: `### Why ASCI Compliance is Mandatory
The Advertising Standards Council of India (ASCI) regulates commercial disclosures across all digital media. On CIRCLE, compliance is not optional: both Video Clipping and Social Media PR require strict adherence to ASCI guidelines to qualify for payout release.

### Core Disclosure Requirements
1. **Prominent Caption Placement:**
   - The hashtag \`#ad\` or \`#collab\` must be situated in the first two lines of your post caption, clearly visible before the user clicks *"more"*.
   - Do not bury the tag inside a block of 30 hashtags at the bottom.

2. **Native Platform Tools:**
   - **Instagram:** You must activate the built-in *Paid Partnership with...* tag linking to the campaign owner's handle.
   - **YouTube Shorts:** You must select the native *Paid Promotion* checkbox in YouTube Studio.

3. **Audio Disclosures in Video:**
   - For dedicated PR reviews and sponsored reels, an on-screen visual super (\`#Ad\` or \`Sponsored\`) must persist for at least the first 5 seconds or throughout the deliverable.

4. **Permanent Visibility During the 7-Day Hold:**
   - For Social Media PR campaigns, the post must remain unedited, public, and properly disclosed for the entire 7-day maturation window (\`PR_LIVE_DAYS\`).
   - Removing the tag or archiving the post voids the escrow payout and incurs an account flag.`,
  },
  {
    slug: "bio-code-account-verification",
    title: "How to Link and Verify Your Creator Accounts with Bio Codes",
    summary: "Step-by-step instructions for completing 72-hour bio-code verification and passing the 10,000 follower audit.",
    category: "Platform Guide",
    readTime: "4 min read",
    publishedAt: "2026-11-05",
    contentMd: `### Why Account Verification Matters
To prevent impersonation and guarantee that video metrics correspond to actual creator channels, CIRCLE requires bio-code verification before participating in campaigns.

### The 4-Step Linking Process
1. **Initiate Verification:**
   - Navigate to your Creator Dashboard under the *Connected Platforms* tab.
   - Enter your public Instagram handle or YouTube Channel URL.

2. **Receive Your Unique Code:**
   - CIRCLE generates an ephemeral 6-character code (e.g., \`CRC-889B\`) with a 72-hour expiration window.

3. **Paste Into Your Public Bio:**
   - Open your Instagram or YouTube profile settings.
   - Insert the code into your bio description text.

4. **Confirm Verification:**
   - Click *Verify Bio Match* in your CIRCLE dashboard.
   - Once verified, you may safely delete the code from your bio.

### The 10K Follower Audit for Social Media PR
For accounts applying to Social Media PR campaigns:
- An administrator inspects your profile to confirm at least 10,000 authentic followers.
- The admin reviews your recent like-to-comment ratios to filter out purchased bot followers.
- Once recorded, follower verification is valid for 90 days (\`PR_FOLLOWER_RECHECK_DAYS\`).`,
  },
  {
    slug: "pricing-social-pr-rate-cards",
    title: "Pricing Your Social Media PR Rate Card for Indian Brands",
    summary: "How established creators and theme pages determine fixed fees, quote custom briefs, and maximize monthly escrow earnings.",
    category: "Creator Business",
    readTime: "7 min read",
    publishedAt: "2026-11-08",
    contentMd: `### The Shift from CPM to Guaranteed PR Fees
While video clippers earn per 1,000 views, Social Media PR provides guaranteed post fees for creators with over 10,000 followers. Determining your rate requires balancing audience quality, niche authority, and production effort.

### 1. Benchmarking Your Base Rate
In the Indian creator economy, baseline PR rates typically correlate with verified niche reach:
- **10K to 50K Micro-Niche Pages:** ₹2,500 to ₹8,000 per post.
- **50K to 250K Mid-Tier Channels:** ₹8,000 to ₹25,000 per post.
- **250K+ High-Authority Hubs:** ₹25,000 to ₹75,000+ per post.

### 2. Factoring the Deliverable Format
- **Single Static Post:** Lowest effort, baseline rate.
- **Multi-Slide Carousel:** 1.3x to 1.5x baseline due to higher swipe-through engagement and research time.
- **Vertical Reel or Short:** 1.5x to 2x baseline for original voiceover, camera presence, or custom motion graphics.

### 3. Understanding CIRCLE's Net Rate
CIRCLE operates a transparent 10% platform fee on creator earnings:
- If an owner offers a fixed fee of ₹10,000, your net wallet accrual upon Day 7 lock is **₹9,000**.
- Always price quotes with your net outcome in mind. CIRCLE displays your net figure upfront.

### 4. Crafting Winning Pitch Notes
In quote-mode campaigns, owners review your pitch before accepting:
- Explain your specific content angle (*"We will demonstrate the app's recurring deposit tool by comparing it against traditional savings account yields"*).
- Mention past reel engagement metrics rather than generic self-praise.
- Never share contact details (phone, WhatsApp, email) in your pitch; CIRCLE automatically detects and rejects contact info to keep escrow protected.`,
  },
  {
    slug: "podcast-to-viral-clip",
    title: "From 60-Minute Podcast to Viral Reel: A Clipper's Workflow",
    summary: "A repeatable technical framework for identifying hook moments, trimming dead air, and formatting horizontal video for mobile feeds.",
    category: "Workflow & Craft",
    readTime: "8 min read",
    publishedAt: "2026-11-10",
    contentMd: `### The Clipper's Edge
Successful clippers on CIRCLE do not simply cut random segments; they locate self-contained mini-narratives within long-form interviews and engineer them for mobile consumption.

### Phase 1: Rapid Timestamp Discovery
1. **Inspect Video Transcripts:**
   - Scan YouTube automated transcripts or show notes for contentious keywords (*"the mistake"*, *"nobody talks about"*, *"costly error"*).
2. **Look for Energy Shifts:**
   - Pay attention to moments where the host or guest changes pitch, leans forward, or interrupts to challenge a point.
3. **The 45-Second Sweet Spot:**
   - While Shorts can run up to 60 seconds, clips between 35 and 45 seconds have significantly higher completion rates and algorithm distribution.

### Phase 2: Frame Re-Composition (16:9 to 9:16)
- **Split-Screen Layouts:** Stack the speaker on top and the reacting interviewer on the bottom. Ensure both faces remain centered in the upper two-thirds of the screen.
- **Dynamic Face-Tracking:** When a guest gestures or moves, keyframe your pan crop smoothly rather than letting them drift off-frame.
- **Safe Zones:** Keep key text and captions away from the right-hand icon rail and bottom caption area where TikTok, Reels, and Shorts overlay native UI buttons.

### Phase 3: Audio Polish
- **Normalize Dialogue:** Ensure vocals sit between -12dB and -6dB.
- **Subtle Music Bed:** Keep background music -18dB to -24dB beneath speech so words remain crystal clear.`,
  },
  {
    slug: "payouts-wallet-and-taxes",
    title: "The CIRCLE Wallet, Double-Row Ledger, and UPI Settlement Guide",
    summary: "How your clipping and PR earnings mature on Day 7, how ledger integrity is audited, and how to withdraw via UPI.",
    category: "Wallet & Finance",
    readTime: "6 min read",
    publishedAt: "2026-11-12",
    contentMd: `### Accounting Integrity on CIRCLE
CIRCLE utilizes an immutable, append-only double-row ledger system (\`clip_wallet_ledger\`). Your balance is never an editable number in a database column; it is always the cryptographic sum of verified ledger transactions (\`SUM(amount_inr)\`).

### The Double-Row Ledger Explained
When a clipping submission or PR deliverable passes Day 7 verification:
1. **Row 1 (\`earning\`):** Credited with the full gross amount (e.g. \`+₹1,000\`).
2. **Row 2 (\`fee\`):** Debited with CIRCLE's 10% platform fee (e.g. \`-₹100\`).
3. **Net Accrual:** Your wallet balance increases by the exact net difference (\`₹900\`).

### Handling Reversals
If an admin flags a clip for post deletion or bot activity prior to payout:
- Two offsetting rows are written: \`reversal\` (\`-gross\`) and \`fee_reversal\` (\`+fee\`).
- This nets your wallet to zero for that clip and restores the campaign owner's budget without corrupting historical audit logs.

### Requesting Your UPI Payout
- **Minimum Withdrawal Floor:** ₹500 (\`MIN_PAYOUT_INR\`).
- **Zero Withdrawal Fees:** CIRCLE charges zero fees on withdrawals; you receive 100% of your net balance.
- **Weekly Settlement Cycle:** Admin payout runs are compiled weekly and transferred directly to your bank account via UPI.

### Tax Transparency
- For campaign owners, Portfolix issues official tax invoices for the 10% platform service fee.
- For creators, earnings are reported under Indian income tax guidelines. Track your annual earnings in your dashboard to ensure accurate reporting on your ITR.`,
  },
];
