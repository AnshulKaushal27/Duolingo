"use client";

import React from "react";
import { playClickSound } from "@/lib/sound";

export default function LandingFooter() {
  const siteLanguages = [
    { code: "ar", label: "العربية", href: "https://ar.duolingo.com" },
    { code: "bn", label: "বাংলা", href: "https://bn.duolingo.com" },
    { code: "cs", label: "Čeština", href: "https://cs.duolingo.com" },
    { code: "de", label: "Deutsch", href: "https://de.duolingo.com" },
    { code: "el", label: "Ελληνικά", href: "https://el.duolingo.com" },
    { code: "en", label: "English", href: "https://en.duolingo.com" },
    { code: "es", label: "Español", href: "https://es.duolingo.com" },
    { code: "fr", label: "Français", href: "https://fr.duolingo.com" },
    { code: "hi", label: "हिंदी", href: "https://hi.duolingo.com" },
    { code: "hu", label: "Magyar", href: "https://hu.duolingo.com" },
    { code: "id", label: "Bahasa Indonesia", href: "https://id.duolingo.com" },
    { code: "it", label: "Italiano", href: "https://it.duolingo.com" },
    { code: "ja", label: "日本語", href: "https://ja.duolingo.com" },
    { code: "kn", label: "ಕನ್ನಡ", href: "https://kn.duolingo.com" },
    { code: "ko", label: "한국어", href: "https://ko.duolingo.com" },
    { code: "mr", label: "मराठी", href: "https://mr.duolingo.com" },
    { code: "nl", label: "Nederlands", href: "https://nl.duolingo.com" },
    { code: "pa", label: "ਪੰਜਾਬੀ", href: "https://pa.duolingo.com" },
    { code: "pl", label: "Polski", href: "https://pl.duolingo.com" },
    { code: "pt", label: "Português", href: "https://pt.duolingo.com" },
    { code: "ro", label: "Română", href: "https://ro.duolingo.com" },
    { code: "ru", label: "Русский", href: "https://ru.duolingo.com" },
    { code: "sv", label: "svenska", href: "https://sv.duolingo.com" },
    { code: "ta", label: "தமிழ்", href: "https://ta.duolingo.com" },
    { code: "te", label: "తెలుగు", href: "https://te.duolingo.com" },
    { code: "th", label: "ภาษาไทย", href: "https://th.duolingo.com" },
    { code: "tl", label: "Tagalog", href: "https://tl.duolingo.com" },
    { code: "tr", label: "Türkçe", href: "https://tr.duolingo.com" },
    { code: "uk", label: "Українською", href: "https://uk.duolingo.com" },
    { code: "ur", label: "اُردُو", href: "https://ur.duolingo.com" },
    { code: "vi", label: "Tiếng Việt", href: "https://vi.duolingo.com" },
    { code: "zh", label: "中文", href: "https://zs.duolingo.com" },
  ];

  return (
    <footer
      className="_1nNuk duo-main-footer"
      style={{
        backgroundColor: "#58cc02",
        color: "#ffffff",
        width: "100%",
        fontFamily: "var(--duo-font)",
      }}
    >
      {/* 5 Navigation Columns matching Duolingo desktop layout */}
      <div
        className="kWIKU"
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "48px 24px 60px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "36px 24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Column 1: About us */}
        <div>
          <div className="_30Vi6 duo-footer-col-title">About us</div>
          <ul className="duo-footer-list">
            <li><a href="https://www.duolingo.com/courses" target="_blank" rel="noreferrer" className="duo-footer-link">Courses</a></li>
            <li><a href="https://about.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Mission</a></li>
            <li><a href="https://about.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Approach</a></li>
            <li><a href="https://www.duolingo.com/efficacy" target="_blank" rel="noreferrer" className="duo-footer-link">Efficacy</a></li>
            <li><a href="https://duolingo.com/handbook" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo Handbook</a></li>
            <li><a href="https://research.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Research</a></li>
            <li><a href="https://careers.duolingo.com/#careers" target="_blank" rel="noreferrer" className="duo-footer-link">Careers</a></li>
            <li><a href="https://store.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Store</a></li>
            <li><a href="https://press.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Press</a></li>
            <li><a href="https://investors.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Investors</a></li>
            <li><a href="https://about.duolingo.com/#contact" target="_blank" rel="noreferrer" className="duo-footer-link">Contact us</a></li>
          </ul>
        </div>

        {/* Column 2: Products */}
        <div>
          <div className="_30Vi6 duo-footer-col-title">Products</div>
          <ul className="duo-footer-list">
            <li><a href="https://www.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo</a></li>
            <li><a href="https://schools.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo for Schools</a></li>
            <li><a href="https://englishtest.duolingo.com/en" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo English Test</a></li>
            <li><a href="https://podcast.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Podcast</a></li>
            <li><a href="https://www.duolingo.com/business" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo for Business</a></li>
            <li><a href="https://www.duolingo.com/super" target="_blank" rel="noreferrer" className="duo-footer-link">Super Duolingo</a></li>
            <li><a href="https://www.duolingo.com/gift" target="_blank" rel="noreferrer" className="duo-footer-link">Gift Super Duolingo</a></li>
            <li><a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo Max</a></li>
          </ul>
        </div>

        {/* Column 3: Apps */}
        <div>
          <div className="_30Vi6 duo-footer-col-title">Apps</div>
          <ul className="duo-footer-list">
            <li><a href="https://play.google.com/store/apps/details?hl=en&id=com.duolingo&referrer=utm_source%3Dduolingo.com%26utm_medium%3Dduolingo_web%26utm_content%3Ddownload_button%26utm_campaign%3Dsite_map" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo for Android</a></li>
            <li><a href="https://itunes.apple.com/app/duolingo-learn-spanish-french/id570060128?mt=8" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo for iOS</a></li>
          </ul>
        </div>

        {/* Column 4: Help and support */}
        <div>
          <div className="_30Vi6 duo-footer-col-title">Help and support</div>
          <ul className="duo-footer-list">
            <li><a href="https://www.duolingo.com/help" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo FAQs</a></li>
            <li><a href="https://duolingoschools.zendesk.com/hc/en-us" target="_blank" rel="noreferrer" className="duo-footer-link">Schools FAQs</a></li>
            <li><a href="https://englishtest.duolingo.com/faq" target="_blank" rel="noreferrer" className="duo-footer-link">Duolingo English Test FAQs</a></li>
            <li><a href="https://status.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Status</a></li>
          </ul>
        </div>

        {/* Column 5: Privacy and terms + Social */}
        <div>
          <div className="_30Vi6 duo-footer-col-title">Privacy and terms</div>
          <ul className="duo-footer-list">
            <li><a href="https://www.duolingo.com/guidelines" target="_blank" rel="noreferrer" className="duo-footer-link">Community guidelines</a></li>
            <li><a href="https://www.duolingo.com/terms" target="_blank" rel="noreferrer" className="duo-footer-link">Terms</a></li>
            <li><a href="https://www.duolingo.com/privacy" target="_blank" rel="noreferrer" className="duo-footer-link">Privacy</a></li>
            <li><a href="https://about.duolingo.com/?dnsspi#dnsspi" target="_blank" rel="noreferrer" className="duo-footer-link">Do Not Sell or Share My Personal Information</a></li>
          </ul>

          <div className="_30Vi6 duo-footer-col-title" style={{ marginTop: "36px" }}>Social</div>
          <ul className="duo-footer-list">
            <li><a href="https://blog.duolingo.com/" target="_blank" rel="noreferrer" className="duo-footer-link">Blog</a></li>
            <li><a href="https://www.instagram.com/duolingo" target="_blank" rel="noreferrer" className="duo-footer-link">Instagram</a></li>
            <li><a href="https://tiktok.com/@duolingo" target="_blank" rel="noreferrer" className="duo-footer-link">TikTok</a></li>
            <li><a href="https://twitter.com/duolingo" target="_blank" rel="noreferrer" className="duo-footer-link">Twitter</a></li>
            <li><a href="https://youtube.com/user/duolingo" target="_blank" rel="noreferrer" className="duo-footer-link">YouTube</a></li>
            <li><a href="https://linkedin.com/company/duolingo" target="_blank" rel="noreferrer" className="duo-footer-link">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Full-width Divider Line - SIBLING OF kWIKU */}
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 24px", boxSizing: "border-box" }}>
        <hr
          className="c-sxz"
          style={{
            border: "none",
            borderTop: "2px solid rgba(255, 255, 255, 0.25)",
            margin: "0",
            width: "100%",
          }}
        />
      </div>

      {/* Site Language Section - SIBLING OF kWIKU & hr */}
      <div
        className="-Dahb"
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "36px 24px 64px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          className="_1LLyK"
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "18px",
            letterSpacing: "-0.2px",
          }}
        >
          Site language:
        </div>

        <ul
          className="_3PydS"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "10px 24px",
            alignItems: "center",
          }}
        >
          {siteLanguages.map((lang) => (
            <li key={lang.code} className="yu122" style={{ display: "inline-block", margin: 0 }}>
              <a
                href={lang.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound()}
                className="FXHbm duo-footer-lang"
              >
                {lang.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .kWIKU {
          max-width: 1040px !important;
          grid-template-columns: repeat(5, 1fr) !important;
          gap: 36px 24px !important;
          padding: 80px 24px 60px !important;
        }
        .duo-footer-col-title {
          font-size: 19px !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          margin-bottom: 16px !important;
          letter-spacing: -0.2px !important;
        }
        .duo-footer-list {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }
        .duo-footer-link {
          color: rgba(255, 255, 255, 0.85) !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          line-height: 22px !important;
          text-decoration: none !important;
          transition: color 0.15s ease, text-decoration 0.15s ease !important;
        }
        .duo-footer-link:hover {
          color: #ffffff !important;
          text-decoration: underline !important;
        }
        .duo-footer-lang {
          color: rgba(255, 255, 255, 0.82) !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          line-height: 22px !important;
          text-decoration: none !important;
          cursor: pointer !important;
          transition: color 0.15s ease, text-decoration 0.15s ease !important;
          font-family: var(--duo-font) !important;
        }
        .duo-footer-lang:hover {
          color: #ffffff !important;
          text-decoration: underline !important;
        }
        @media (max-width: 900px) {
          .kWIKU {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
          }
        }
      `}</style>
    </footer>
  );
}
