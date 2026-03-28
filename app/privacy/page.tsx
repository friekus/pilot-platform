"use client";
import "../quiz/quiz.css";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

export default function PrivacyPage() {
  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <a href="/" className="quiz-score-pill" style={{ textDecoration: "none" }}>Home</a>
      </nav>
      <div className="quiz-container">
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: "#4A5568", marginBottom: 32 }}>Last updated: March 2026</p>

          <div style={{ fontSize: 15, color: "#8899AA", lineHeight: 1.8 }}>
            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>1. Who we are</h2>
            <p>Vectored (vectored.com.au) is an aviation education platform operated in New South Wales, Australia. This Privacy Policy explains how we collect, use, and protect your personal information in accordance with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs).</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>2. Information we collect</h2>
            <p><strong style={{ color: "#FFF" }}>Information you provide directly:</strong></p>
            <p style={{ marginTop: 8 }}>When you join our waitlist, we collect your email address. When account registration becomes available, we may collect your name, email address, and payment information (processed securely through Stripe — we do not store credit card details). We may also collect quiz performance data linked to your account to provide personalised study recommendations.</p>
            <p style={{ marginTop: 16 }}><strong style={{ color: "#FFF" }}>Information collected automatically:</strong></p>
            <p style={{ marginTop: 8 }}>When you visit Vectored, we may collect basic analytics data including pages visited, time spent on the platform, browser type, and device type. This data is collected in aggregate and is not used to personally identify you. We do not use third-party advertising trackers.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>3. How we use your information</h2>
            <p>We use your information to provide and improve the Vectored platform, to send you updates about Vectored (if you have joined the waitlist or opted in to communications), to process payments (when subscription features are available), to personalise your study experience through quiz performance tracking, and to comply with legal obligations.</p>
            <p style={{ marginTop: 12 }}>We will not sell, rent, or share your personal information with third parties for marketing purposes.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>4. Third-party services</h2>
            <p>Vectored uses the following third-party services that may process your data:</p>
            <p style={{ marginTop: 8 }}><strong style={{ color: "#FFF" }}>Supabase</strong> — database and authentication (data stored on servers in the Asia-Pacific region).</p>
            <p><strong style={{ color: "#FFF" }}>Vercel</strong> — website hosting.</p>
            <p><strong style={{ color: "#FFF" }}>Stripe</strong> — payment processing (when available). Stripe handles all payment data securely under their own privacy policy and PCI compliance.</p>
            <p style={{ marginTop: 12 }}>Each of these services has their own privacy policy. We select services that comply with industry-standard data protection practices.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>5. Data storage and security</h2>
            <p>Your data is stored securely using industry-standard encryption and access controls. Our database is hosted with Supabase with row-level security enabled. While we take reasonable steps to protect your information, no system is completely secure. We encourage you to use a strong, unique password when account features become available.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>6. Your rights</h2>
            <p>Under the Australian Privacy Principles, you have the right to access the personal information we hold about you, request correction of inaccurate information, request deletion of your personal information, opt out of marketing communications at any time, and lodge a complaint with the Office of the Australian Information Commissioner (OAIC) if you believe your privacy has been breached.</p>
            <p style={{ marginTop: 12 }}>To exercise any of these rights, contact us at <span style={{ color: "#00D4AA" }}>hello@vectored.com.au</span></p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>7. Cookies</h2>
            <p>Vectored may use essential cookies to maintain your session and preferences. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect the functionality of the platform.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>8. Children&apos;s privacy</h2>
            <p>Vectored is intended for users aged 16 and over (consistent with the minimum age for student pilot operations in Australia). We do not knowingly collect information from children under 16. If we become aware that we have collected data from a child under 16, we will delete it promptly.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>9. Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of Vectored after changes constitutes acceptance of the updated policy.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>10. Contact</h2>
            <p>For privacy-related enquiries, contact us at <span style={{ color: "#00D4AA" }}>hello@vectored.com.au</span></p>
          </div>

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
            <a href="/terms" style={{ color: "#00D4AA", textDecoration: "none", fontSize: 14, marginRight: 24 }}>Terms of Use</a>
            <a href="/" style={{ color: "#4A5568", textDecoration: "none", fontSize: 14 }}>Back to home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
