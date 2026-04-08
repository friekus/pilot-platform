"use client";
import "../../quiz/quiz.css";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

export default function TermsPage() {
  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <a href="/" className="quiz-score-pill" style={{ textDecoration: "none" }}>Home</a>
      </nav>
      <div className="quiz-container">
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", marginBottom: 8 }}>Terms of Use</h1>
          <p style={{ fontSize: 13, color: "#4A5568", marginBottom: 32 }}>Last updated: April 2026</p>
          <div style={{ fontSize: 15, color: "#8899AA", lineHeight: 1.8 }}>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>1. About Vectored</h2>
            <p>Vectored (vectored.com.au) is an online aviation education platform providing practice exam questions, study resources, and career guidance for Australian student pilots. By accessing or using Vectored, you agree to these Terms of Use.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>2. Educational disclaimer</h2>
            <p>Vectored is a <strong style={{ color: "#FFF" }}>supplementary study aid only</strong>. It is not a registered training organisation (RTO), not endorsed by or affiliated with the Civil Aviation Safety Authority (CASA), and not a substitute for formal flight training, ground school, or professional instruction.</p>
            <p style={{ marginTop: 12 }}>While we strive for accuracy, questions and explanations are created for educational purposes and may contain errors. <strong style={{ color: "#FFF" }}>Vectored does not guarantee exam results.</strong> Users should always verify information against official CASA publications, the Part 61 Manual of Standards, AIP, and other authoritative sources.</p>
            <p style={{ marginTop: 12 }}>Aviation regulations and knowledge requirements change. Vectored endeavours to keep content current but cannot guarantee that all material reflects the latest amendments.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>3. AI Tutor</h2>
            <p>Vectored includes an AI-powered tutor feature that provides personalised explanations of quiz questions and aviation concepts. The AI Tutor is powered by a third-party large language model and is subject to the following conditions:</p>
            <p style={{ marginTop: 12 }}>The AI Tutor is a <strong style={{ color: "#FFF" }}>study aid only</strong> and does not replace qualified flight instruction or ground school training. AI-generated explanations may occasionally contain inaccuracies, outdated information, or errors. Users must always verify AI Tutor responses against official CASA publications, the Visual Flight Rules Guide (VFRG), the Part 61 Manual of Standards, and other authoritative sources before relying on them.</p>
            <p style={{ marginTop: 12 }}>Vectored does not guarantee the accuracy, completeness, or currency of AI Tutor responses. The AI Tutor is designed to reference Australian aviation regulations only, but users should be aware that AI systems can occasionally produce incorrect or misleading information.</p>
            <p style={{ marginTop: 12 }}>Conversations with the AI Tutor are not stored or reviewed by Vectored. However, usage data (such as the number of interactions) may be collected for the purpose of platform improvement and usage monitoring.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>4. Use of the platform</h2>
            <p>You may use Vectored for personal, non-commercial educational purposes. You must not reproduce, redistribute, or sell Vectored content (including questions, explanations, and guides) without written permission. You must not attempt to scrape, download, or bulk-extract the question database. You must not use automated tools or bots to access the platform.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>5. Accounts and payments</h2>
            <p>When account and subscription features become available, you will be responsible for maintaining the security of your account credentials. Subscription fees, refund policies, and billing terms will be communicated at the point of purchase. Vectored reserves the right to modify pricing with reasonable notice to existing subscribers.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>6. Intellectual property</h2>
            <p>All content on Vectored — including questions, explanations, diagrams, branding, and software — is the intellectual property of the Vectored operator unless otherwise attributed. References to CASA, the Part 61 Manual of Standards, AIP, and other official documents are for educational context only and remain the property of their respective owners.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>7. Career guidance disclaimer</h2>
            <p>Career information, operator databases, and employment guidance provided by Vectored are for general informational purposes only. Vectored does not act as a recruitment agency, does not guarantee employment outcomes, and is not responsible for the accuracy of third-party operator information. Always verify operator details, hiring requirements, and employment conditions directly with the operator.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>8. Limitation of liability</h2>
            <p>To the maximum extent permitted by Australian law, Vectored is provided &quot;as is&quot; without warranties of any kind. Vectored, its operator, and its contributors will not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to exam results, career decisions, or reliance on information provided.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>9. Changes to these terms</h2>
            <p>Vectored may update these Terms of Use from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms. Material changes will be communicated via the website or email where possible.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>10. Governing law</h2>
            <p>These Terms of Use are governed by the laws of New South Wales, Australia. Any disputes will be subject to the jurisdiction of the courts of New South Wales.</p>

            <h2 style={{ fontSize: 18, color: "#FFF", fontWeight: 600, marginTop: 32, marginBottom: 12 }}>11. Contact</h2>
            <p>If you have questions about these terms, contact us at <span style={{ color: "#00D4AA" }}>vectoredau@outlook.com</span></p>
          </div>
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
            <a href="/privacy" style={{ color: "#00D4AA", textDecoration: "none", fontSize: 14, marginRight: 24 }}>Privacy Policy</a>
            <a href="/" style={{ color: "#4A5568", textDecoration: "none", fontSize: 14 }}>Back to home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
