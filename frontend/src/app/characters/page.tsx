"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { api, UserProfile } from "@/lib/api";
import { playClickSound, playCorrectSound, playIncorrectSound, playVictorySound } from "@/lib/sound";
import { speakText } from "@/lib/speech";
import confetti from "canvas-confetti";

interface KanaCharacter {
  kana: string;
  romaji: string;
  example: string;
  exampleEn: string;
}

// Complete Hiragana Syllabary
const HIRAGANA_BASE: { label: string; items: (KanaCharacter | null)[] }[] = [
  {
    label: "Vowels (あ行)",
    items: [
      { kana: "あ", romaji: "a", example: "あさ (asa)", exampleEn: "morning" },
      { kana: "い", romaji: "i", example: "いぬ (inu)", exampleEn: "dog" },
      { kana: "う", romaji: "u", example: "うみ (umi)", exampleEn: "sea" },
      { kana: "え", romaji: "e", example: "えき (eki)", exampleEn: "station" },
      { kana: "お", romaji: "o", example: "おちゃ (ocha)", exampleEn: "tea" },
    ],
  },
  {
    label: "K-row (か行)",
    items: [
      { kana: "か", romaji: "ka", example: "かさ (kasa)", exampleEn: "umbrella" },
      { kana: "き", romaji: "ki", example: "き (ki)", exampleEn: "tree" },
      { kana: "く", romaji: "ku", example: "くるま (kuruma)", exampleEn: "car" },
      { kana: "け", romaji: "ke", example: "けむり (kemuri)", exampleEn: "smoke" },
      { kana: "こ", romaji: "ko", example: "こども (kodomo)", exampleEn: "child" },
    ],
  },
  {
    label: "S-row (さ行)",
    items: [
      { kana: "さ", romaji: "sa", example: "さかな (sakana)", exampleEn: "fish" },
      { kana: "し", romaji: "shi", example: "しろ (shiro)", exampleEn: "white" },
      { kana: "す", romaji: "su", example: "すし (sushi)", exampleEn: "sushi" },
      { kana: "せ", romaji: "se", example: "せんせい (sensei)", exampleEn: "teacher" },
      { kana: "そ", romaji: "so", example: "そら (sora)", exampleEn: "sky" },
    ],
  },
  {
    label: "T-row (た行)",
    items: [
      { kana: "た", romaji: "ta", example: "たまご (tamago)", exampleEn: "egg" },
      { kana: "ち", romaji: "chi", example: "ちず (chizu)", exampleEn: "map" },
      { kana: "つ", romaji: "tsu", example: "つき (tsuki)", exampleEn: "moon" },
      { kana: "て", romaji: "te", example: "て (te)", exampleEn: "hand" },
      { kana: "と", romaji: "to", example: "とり (tori)", exampleEn: "bird" },
    ],
  },
  {
    label: "N-row (な行)",
    items: [
      { kana: "な", romaji: "na", example: "なつ (natsu)", exampleEn: "summer" },
      { kana: "に", romaji: "ni", example: "にほん (nihon)", exampleEn: "Japan" },
      { kana: "ぬ", romaji: "nu", example: "ぬいぐるみ", exampleEn: "plush toy" },
      { kana: "ね", romaji: "ne", example: "ねこ (neko)", exampleEn: "cat" },
      { kana: "の", romaji: "no", example: "のり (nori)", exampleEn: "seaweed" },
    ],
  },
  {
    label: "H-row (は行)",
    items: [
      { kana: "は", romaji: "ha", example: "はな (hana)", exampleEn: "flower" },
      { kana: "ひ", romaji: "hi", example: "ひと (hito)", exampleEn: "person" },
      { kana: "ふ", romaji: "fu", example: "ふね (fune)", exampleEn: "ship" },
      { kana: "へ", romaji: "he", example: "へや (heya)", exampleEn: "room" },
      { kana: "ほ", romaji: "ho", example: "ほん (hon)", exampleEn: "book" },
    ],
  },
  {
    label: "M-row (ま行)",
    items: [
      { kana: "ま", romaji: "ma", example: "まち (machi)", exampleEn: "town" },
      { kana: "み", romaji: "mi", example: "みず (mizu)", exampleEn: "water" },
      { kana: "む", romaji: "mu", example: "むし (mushi)", exampleEn: "bug" },
      { kana: "め", romaji: "me", example: "め (me)", exampleEn: "eye" },
      { kana: "も", romaji: "mo", example: "もり (mori)", exampleEn: "forest" },
    ],
  },
  {
    label: "Y-row (や行)",
    items: [
      { kana: "や", romaji: "ya", example: "やま (yama)", exampleEn: "mountain" },
      null,
      { kana: "ゆ", romaji: "yu", example: "ゆき (yuki)", exampleEn: "snow" },
      null,
      { kana: "よ", romaji: "yo", example: "よる (yoru)", exampleEn: "night" },
    ],
  },
  {
    label: "R-row (ら行)",
    items: [
      { kana: "ら", romaji: "ra", example: "らいおん (raion)", exampleEn: "lion" },
      { kana: "り", romaji: "ri", example: "りんご (ringo)", exampleEn: "apple" },
      { kana: "る", romaji: "ru", example: "るす (rusu)", exampleEn: "away" },
      { kana: "れ", romaji: "re", example: "れいぞうこ", exampleEn: "fridge" },
      { kana: "ろ", romaji: "ro", example: "ろく (roku)", exampleEn: "six" },
    ],
  },
  {
    label: "W-row & N (わ行・ん)",
    items: [
      { kana: "わ", romaji: "wa", example: "わたし (watashi)", exampleEn: "I / me" },
      null,
      null,
      null,
      { kana: "を", romaji: "wo (o)", example: "みずをのむ", exampleEn: "particle" },
    ],
  },
  {
    label: "Singular N (ん)",
    items: [
      { kana: "ん", romaji: "n", example: "にほん (nihon)", exampleEn: "Japan" },
      null, null, null, null
    ]
  }
];

const HIRAGANA_DAKUTEN: { label: string; items: (KanaCharacter | null)[] }[] = [
  {
    label: "G-row (が行)",
    items: [
      { kana: "が", romaji: "ga", example: "がっこう (gakkō)", exampleEn: "school" },
      { kana: "ぎ", romaji: "gi", example: "ぎんこう (ginkō)", exampleEn: "bank" },
      { kana: "ぐ", romaji: "gu", example: "ぐんたい (guntai)", exampleEn: "army" },
      { kana: "げ", romaji: "ge", example: "げんき (genki)", exampleEn: "healthy" },
      { kana: "ご", romaji: "go", example: "ごはん (gohan)", exampleEn: "rice" },
    ],
  },
  {
    label: "Z-row (ざ行)",
    items: [
      { kana: "ざ", romaji: "za", example: "ざっし (zasshi)", exampleEn: "magazine" },
      { kana: "じ", romaji: "ji", example: "じかん (jikan)", exampleEn: "time" },
      { kana: "ず", romaji: "zu", example: "ちず (chizu)", exampleEn: "map" },
      { kana: "ぜ", romaji: "ze", example: "ぜんぶ (zenbu)", exampleEn: "all" },
      { kana: "ぞ", romaji: "zo", example: "ぞう (zō)", exampleEn: "elephant" },
    ],
  },
  {
    label: "D-row (だ行)",
    items: [
      { kana: "だ", romaji: "da", example: "だいがく (daigaku)", exampleEn: "college" },
      { kana: "ぢ", romaji: "ji", example: "はなぢ (hanaji)", exampleEn: "nosebleed" },
      { kana: "づ", romaji: "zu", example: "つづく (tsuzuku)", exampleEn: "continue" },
      { kana: "で", romaji: "de", example: "でんしゃ (densha)", exampleEn: "train" },
      { kana: "ど", romaji: "do", example: "どこ (doko)", exampleEn: "where" },
    ],
  },
  {
    label: "B-row (ば行)",
    items: [
      { kana: "ば", romaji: "ba", example: "ばす (basu)", exampleEn: "bus" },
      { kana: "び", romaji: "bi", example: "びょういん (byōin)", exampleEn: "hospital" },
      { kana: "ぶ", romaji: "bu", example: "ぶた (buta)", exampleEn: "pig" },
      { kana: "べ", romaji: "be", example: "べんきょう", exampleEn: "study" },
      { kana: "ぼ", romaji: "bo", example: "ぼうし (bōshi)", exampleEn: "hat" },
    ],
  },
  {
    label: "P-row (ぱ行)",
    items: [
      { kana: "ぱ", romaji: "pa", example: "ぱん (pan)", exampleEn: "bread" },
      { kana: "ぴ", romaji: "pi", example: "ぴあの (piano)", exampleEn: "piano" },
      { kana: "ぷ", romaji: "pu", example: "ぷーる (pūru)", exampleEn: "pool" },
      { kana: "ぺ", romaji: "pe", example: "ぺん (pen)", exampleEn: "pen" },
      { kana: "ぽ", romaji: "po", example: "ぽけっと (poketto)", exampleEn: "pocket" },
    ],
  },
];

// Complete Katakana Syllabary
const KATAKANA_BASE: { label: string; items: (KanaCharacter | null)[] }[] = [
  {
    label: "Vowels (ア行)",
    items: [
      { kana: "ア", romaji: "a", example: "アイス (aisu)", exampleEn: "ice cream" },
      { kana: "イ", romaji: "i", example: "インク (inku)", exampleEn: "ink" },
      { kana: "ウ", romaji: "u", example: "ウール (ūru)", exampleEn: "wool" },
      { kana: "エ", romaji: "e", example: "エレベーター", exampleEn: "elevator" },
      { kana: "オ", romaji: "o", example: "オレンジ (orenji)", exampleEn: "orange" },
    ],
  },
  {
    label: "K-row (カ行)",
    items: [
      { kana: "カ", romaji: "ka", example: "カメラ (kamera)", exampleEn: "camera" },
      { kana: "キ", romaji: "ki", example: "キッチン (kicchin)", exampleEn: "kitchen" },
      { kana: "ク", romaji: "ku", example: "クラス (kurasu)", exampleEn: "class" },
      { kana: "ケ", romaji: "ke", example: "ケーキ (kēki)", exampleEn: "cake" },
      { kana: "コ", romaji: "ko", example: "コーヒー (kōhī)", exampleEn: "coffee" },
    ],
  },
  {
    label: "S-row (サ行)",
    items: [
      { kana: "サ", romaji: "sa", example: "サラダ (sarada)", exampleEn: "salad" },
      { kana: "シ", romaji: "shi", example: "シャツ (shatsu)", exampleEn: "shirt" },
      { kana: "ス", romaji: "su", example: "スプーン (supūn)", exampleEn: "spoon" },
      { kana: "セ", romaji: "se", example: "セーター (sētā)", exampleEn: "sweater" },
      { kana: "ソ", romaji: "so", example: "ソファ (sofa)", exampleEn: "sofa" },
    ],
  },
  {
    label: "T-row (タ行)",
    items: [
      { kana: "タ", romaji: "ta", example: "タクシー (takushī)", exampleEn: "taxi" },
      { kana: "チ", romaji: "chi", example: "チーズ (chīzu)", exampleEn: "cheese" },
      { kana: "ツ", romaji: "tsu", example: "ツアー (tsuā)", exampleEn: "tour" },
      { kana: "テ", romaji: "te", example: "テレビ (terebi)", exampleEn: "TV" },
      { kana: "ト", romaji: "to", example: "トイレ (toire)", exampleEn: "toilet" },
    ],
  },
  {
    label: "N-row (ナ行)",
    items: [
      { kana: "ナ", romaji: "na", example: "ナイフ (naifu)", exampleEn: "knife" },
      { kana: "ニ", romaji: "ni", example: "ニュース (nyūsu)", exampleEn: "news" },
      { kana: "ヌ", romaji: "nu", example: "ヌードル (nūdoru)", exampleEn: "noodle" },
      { kana: "ネ", romaji: "ne", example: "ネクタイ (nekutai)", exampleEn: "tie" },
      { kana: "ノ", romaji: "no", example: "ノート (nōto)", exampleEn: "notebook" },
    ],
  },
  {
    label: "H-row (ハ行)",
    items: [
      { kana: "ハ", romaji: "ha", example: "ハンバーガー", exampleEn: "hamburger" },
      { kana: "ヒ", romaji: "hi", example: "ヒーター (hītā)", exampleEn: "heater" },
      { kana: "フ", romaji: "fu", example: "フォーク (fōku)", exampleEn: "fork" },
      { kana: "ヘ", romaji: "he", example: "ヘルメット", exampleEn: "helmet" },
      { kana: "ホ", romaji: "ho", example: "ホテル (hoteru)", exampleEn: "hotel" },
    ],
  },
  {
    label: "M-row (マ行)",
    items: [
      { kana: "マ", romaji: "ma", example: "マスク (masuku)", exampleEn: "mask" },
      { kana: "ミ", romaji: "mi", example: "ミルク (miruku)", exampleEn: "milk" },
      { kana: "ム", romaji: "mu", example: "ムービー (mūbī)", exampleEn: "movie" },
      { kana: "メ", romaji: "me", example: "メニュー (menyū)", exampleEn: "menu" },
      { kana: "モ", romaji: "mo", example: "モデル (moderu)", exampleEn: "model" },
    ],
  },
  {
    label: "R-row (ラ行)",
    items: [
      { kana: "ラ", romaji: "ra", example: "ラジオ (rajio)", exampleEn: "radio" },
      { kana: "リ", romaji: "ri", example: "リーダー (rīdā)", exampleEn: "leader" },
      { kana: "ル", romaji: "ru", example: "ルール (rūru)", exampleEn: "rule" },
      { kana: "レ", romaji: "re", example: "レストラン", exampleEn: "restaurant" },
      { kana: "ロ", romaji: "ro", example: "ロボット (robotto)", exampleEn: "robot" },
    ],
  },
  {
    label: "W-row & N (ワ行・ン)",
    items: [
      { kana: "ワ", romaji: "wa", example: "ワイン (wain)", exampleEn: "wine" },
      null, null, null,
      { kana: "ヲ", romaji: "wo (o)", example: "ヲ", exampleEn: "rare" },
    ],
  },
  {
    label: "Singular N (ン)",
    items: [
      { kana: "ン", romaji: "n", example: "パン (pan)", exampleEn: "bread" },
      null, null, null, null
    ]
  }
];

export default function CharactersPage() {
  return (
    <ProtectedRoute>
      <CharactersContent />
    </ProtectedRoute>
  );
}

function CharactersContent() {
  const { user, updateUserLocally } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scriptType, setScriptType] = useState<"hiragana" | "katakana">("hiragana");
  const [selectedChar, setSelectedChar] = useState<KanaCharacter | null>(null);
  const [drillOpen, setDrillOpen] = useState(false);
  const [drillQuestions, setDrillQuestions] = useState<any[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillSelected, setDrillSelected] = useState<string | null>(null);
  const [drillAnswered, setDrillAnswered] = useState(false);
  const [drillScore, setDrillScore] = useState(0);
  const [drillComplete, setDrillComplete] = useState(false);

  useEffect(() => {
    async function loadProf() {
      try {
        const p = await api.getUserProfile();
        setProfile(p);
      } catch {}
    }
    loadProf();
  }, []);

  const handlePlaySound = (c: KanaCharacter) => {
    playClickSound();
    speakText(c.kana, "ja-JP", 0.9);
    setSelectedChar(c);
  };

  // Start Interactive Kana Practice Drill
  const startDrill = () => {
    playClickSound();
    const allItems: KanaCharacter[] = [];
    const sourceRows = scriptType === "hiragana" ? HIRAGANA_BASE : KATAKANA_BASE;
    sourceRows.forEach((r) => {
      r.items.forEach((item) => {
        if (item) allItems.push(item);
      });
    });

    // Shuffle and pick 5 drill questions
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    const questions = shuffled.slice(0, 5).map((target) => {
      // 3 wrong distractors
      const distractors = allItems
        .filter((it) => it.kana !== target.kana)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [target, ...distractors].sort(() => 0.5 - Math.random());
      return { target, options };
    });

    setDrillQuestions(questions);
    setDrillIndex(0);
    setDrillSelected(null);
    setDrillAnswered(false);
    setDrillScore(0);
    setDrillComplete(false);
    setDrillOpen(true);

    // Speak first question
    if (questions.length > 0) {
      setTimeout(() => {
        speakText(questions[0].target.kana, "ja-JP", 0.9);
      }, 300);
    }
  };

  const handleDrillChoice = (choiceKana: string) => {
    if (drillAnswered) return;
    setDrillSelected(choiceKana);
    setDrillAnswered(true);

    const currentQ = drillQuestions[drillIndex];
    const isCorrect = choiceKana === currentQ.target.kana;
    if (isCorrect) {
      playCorrectSound();
      setDrillScore((s) => s + 1);
    } else {
      playIncorrectSound();
    }
  };

  const handleNextDrillQuestion = () => {
    playClickSound();
    if (drillIndex + 1 < drillQuestions.length) {
      const nextIdx = drillIndex + 1;
      setDrillIndex(nextIdx);
      setDrillSelected(null);
      setDrillAnswered(false);
      setTimeout(() => {
        speakText(drillQuestions[nextIdx].target.kana, "ja-JP", 0.9);
      }, 200);
    } else {
      // Drill complete!
      setDrillComplete(true);
      playVictorySound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      // Award XP
      if (profile) {
        const updated = { ...profile, total_xp: profile.total_xp + 15 };
        setProfile(updated);
        updateUserLocally(() => updated);
      }
    }
  };

  const activeRows = scriptType === "hiragana" ? HIRAGANA_BASE : KATAKANA_BASE;
  const activeDakuten = scriptType === "hiragana" ? HIRAGANA_DAKUTEN : [];

  return (
    <div className="duo-app-layout">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar activeCourse="ja" />

      {/* 2. Middle Characters Study Hub */}
      <main className="duo-main-content" style={{ paddingBottom: "60px" }}>
        {/* Banner with Duo Owl Mascot */}
        <div
          style={{
            backgroundColor: "var(--duo-canvas)",
            border: "2px solid var(--duo-border)",
            borderRadius: "24px",
            padding: "24px 28px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  backgroundColor: "var(--duo-red)",
                  color: "#ffffff",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  letterSpacing: "0.8px",
                }}
              >
                JAPANESE LETTERS
              </span>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--duo-text-muted)" }}>
                46 Characters
              </span>
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: 900, color: "var(--duo-text)", margin: "0 0 6px 0" }}>
              Learn Japanese Characters
            </h1>
            <p style={{ fontSize: "14px", color: "var(--duo-text-muted)", margin: 0, fontWeight: 600, maxWidth: "420px" }}>
              Tap any letter card to hear native pronunciation. Practice daily to master reading and writing!
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <img src="/mascot/duo-happy.svg" alt="Duo" style={{ width: "72px", height: "72px" }} />
            <button
              onClick={startDrill}
              className="duo-btn duo-btn-green"
              style={{ padding: "10px 18px", fontSize: "13px", letterSpacing: "0.5px" }}
            >
              ⚡ PRACTICE KANA
            </button>
          </div>
        </div>

        {/* Script Switcher Pills (Hiragana vs Katakana) */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "28px",
            borderBottom: "2px solid var(--duo-border)",
            paddingBottom: "16px",
          }}
        >
          <button
            onClick={() => {
              playClickSound();
              setScriptType("hiragana");
            }}
            className={`duo-btn ${scriptType === "hiragana" ? "duo-btn-blue" : "duo-btn-outline"}`}
            style={{ padding: "12px 24px", fontSize: "15px" }}
          >
            あ Hiragana (ひらがな)
          </button>
          <button
            onClick={() => {
              playClickSound();
              setScriptType("katakana");
            }}
            className={`duo-btn ${scriptType === "katakana" ? "duo-btn-blue" : "duo-btn-outline"}`}
            style={{ padding: "12px 24px", fontSize: "15px" }}
          >
            ア Katakana (カタカナ)
          </button>
        </div>

        {/* Vowel Column Header Guide */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "110px repeat(5, 1fr)",
            gap: "10px",
            padding: "8px 12px",
            backgroundColor: "var(--duo-surface)",
            borderRadius: "14px",
            marginBottom: "16px",
            fontSize: "12px",
            fontWeight: 800,
            color: "var(--duo-text-muted)",
            textAlign: "center",
          }}
        >
          <div style={{ textAlign: "left", paddingLeft: "8px" }}>ROW</div>
          <div>a (あ)</div>
          <div>i (い)</div>
          <div>u (う)</div>
          <div>e (え)</div>
          <div>o (お)</div>
        </div>

        {/* Base Syllabary Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
          {activeRows.map((rowGroup, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "110px repeat(5, 1fr)",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {/* Row Label */}
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "var(--duo-text-muted)",
                  paddingLeft: "8px",
                }}
              >
                {rowGroup.label.split(" ")[0]}
              </div>

              {/* 5 Vowel Columns */}
              {rowGroup.items.map((item, itemIdx) => {
                if (!item) {
                  return (
                    <div
                      key={itemIdx}
                      style={{
                        height: "72px",
                        borderRadius: "16px",
                        backgroundColor: "transparent",
                      }}
                    />
                  );
                }

                const isSelected = selectedChar?.kana === item.kana;
                return (
                  <button
                    key={item.kana}
                    onClick={() => handlePlaySound(item)}
                    style={{
                      height: "72px",
                      borderRadius: "16px",
                      border: isSelected ? "2px solid var(--duo-blue)" : "2px solid var(--duo-border)",
                      borderBottom: isSelected ? "4px solid var(--duo-blue-dark)" : "4px solid var(--duo-border)",
                      backgroundColor: isSelected ? "var(--duo-blue-bg)" : "var(--duo-canvas)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 0.08s ease, border-color 0.1s ease",
                      outline: "none",
                      padding: "4px",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(2px)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    title={`${item.kana} (${item.romaji}) - Example: ${item.example}`}
                  >
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 900,
                        color: "var(--duo-text)",
                        fontFamily: "'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
                        lineHeight: 1.1,
                      }}
                    >
                      {item.kana}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--duo-text-muted)", marginTop: "2px" }}>
                      {item.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Dakuten & Handakuten Section (if Hiragana) */}
        {activeDakuten.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: "var(--duo-text)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>濁点</span> Dakuten & Handakuten (が, ざ, だ, ば, ぱ)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeDakuten.map((rowGroup, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px repeat(5, 1fr)",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "var(--duo-text-muted)",
                      paddingLeft: "8px",
                    }}
                  >
                    {rowGroup.label.split(" ")[0]}
                  </div>

                  {rowGroup.items.map((item, itemIdx) => {
                    if (!item) return <div key={itemIdx} />;
                    const isSelected = selectedChar?.kana === item.kana;
                    return (
                      <button
                        key={item.kana}
                        onClick={() => handlePlaySound(item)}
                        style={{
                          height: "72px",
                          borderRadius: "16px",
                          border: isSelected ? "2px solid var(--duo-blue)" : "2px solid var(--duo-border)",
                          borderBottom: isSelected ? "4px solid var(--duo-blue-dark)" : "4px solid var(--duo-border)",
                          backgroundColor: isSelected ? "var(--duo-blue-bg)" : "var(--duo-canvas)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <span style={{ fontSize: "24px", fontWeight: 900, color: "var(--duo-text)" }}>
                          {item.kana}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
                          {item.romaji}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Kana Detail Card Footer */}
        {selectedChar && (
          <div
            style={{
              position: "sticky",
              bottom: "20px",
              marginTop: "32px",
              backgroundColor: "var(--duo-canvas)",
              border: "2px solid var(--duo-border)",
              borderRadius: "20px",
              padding: "16px 24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 30,
              animation: "fadeIn 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: "var(--duo-blue-bg)",
                  border: "2px solid var(--duo-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  fontWeight: 900,
                  color: "var(--duo-blue-dark)",
                }}
              >
                {selectedChar.kana}
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "var(--duo-text)" }}>
                  Romaji: <span style={{ color: "var(--duo-blue)" }}>{selectedChar.romaji}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--duo-text-muted)" }}>
                  Example word: <strong>{selectedChar.example}</strong> ({selectedChar.exampleEn})
                </div>
              </div>
            </div>

            <button
              onClick={() => speakText(selectedChar.kana, "ja-JP", 0.9)}
              className="duo-btn duo-btn-blue"
              style={{ padding: "10px 18px", fontSize: "14px" }}
            >
              🔊 REPLAY AUDIO
            </button>
          </div>
        )}
      </main>

      {/* 3. Right Sticky Sidebar */}
      <RightSidebar
        streak={profile?.streak ?? (user?.streak ?? 1)}
        gems={profile?.gems ?? (user?.gems ?? 505)}
        hearts={profile?.hearts ?? (user?.hearts ?? 5)}
        xp={profile?.total_xp ?? (user?.total_xp ?? 20)}
        courseCode="ja"
        courseTitle="Japanese"
        onHeartsUpdated={() => {}}
      />

      {/* Interactive Kana Practice Drill Modal */}
      {drillOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              backgroundColor: "var(--duo-canvas)",
              borderRadius: "24px",
              border: "2px solid var(--duo-border)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Header / Progress Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={() => setDrillOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "var(--duo-text-muted)",
                }}
              >
                ✕
              </button>
              <div style={{ flex: 1, margin: "0 16px" }}>
                <div className="duo-progress-track" style={{ height: "12px" }}>
                  <div
                    className="duo-progress-fill"
                    style={{
                      width: `${((drillIndex + (drillComplete ? 1 : 0)) / drillQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--duo-text-muted)" }}>
                {Math.min(drillIndex + 1, drillQuestions.length)} / {drillQuestions.length}
              </span>
            </div>

            {drillComplete ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <img
                  src="/mascot/duo-happy.svg"
                  alt="Duo"
                  style={{ width: "96px", height: "96px", animation: "duoBounce 1s infinite" }}
                />
                <h2 style={{ fontSize: "24px", fontWeight: 900, color: "var(--duo-text)", marginTop: "16px" }}>
                  Kana Practice Complete!
                </h2>
                <p style={{ fontSize: "15px", color: "var(--duo-text-muted)", fontWeight: 700, margin: "6px 0 20px 0" }}>
                  You scored {drillScore} / {drillQuestions.length} correct! +15 XP earned.
                </p>
                <button
                  onClick={() => setDrillOpen(false)}
                  className="duo-btn duo-btn-green"
                  style={{ width: "100%", padding: "14px", fontSize: "16px" }}
                >
                  CONTINUE
                </button>
              </div>
            ) : drillQuestions.length > 0 ? (
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--duo-text)", marginBottom: "8px" }}>
                  Tap the matching sound:
                </h3>

                {/* Audio Speaker prompt button */}
                <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                  <button
                    onClick={() => speakText(drillQuestions[drillIndex].target.kana, "ja-JP", 0.9)}
                    className="duo-btn duo-btn-blue"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "24px",
                      fontSize: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    🔊
                  </button>
                </div>

                {/* 4 Kana Choice Tiles */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
                  {drillQuestions[drillIndex].options.map((opt: KanaCharacter) => {
                    const isPicked = drillSelected === opt.kana;
                    const isTarget = opt.kana === drillQuestions[drillIndex].target.kana;

                    let btnClass = "duo-btn-outline";
                    if (drillAnswered) {
                      if (isTarget) btnClass = "duo-btn-green";
                      else if (isPicked && !isTarget) btnClass = "duo-btn-red";
                    } else if (isPicked) {
                      btnClass = "duo-btn-blue";
                    }

                    return (
                      <button
                        key={opt.kana}
                        onClick={() => handleDrillChoice(opt.kana)}
                        disabled={drillAnswered}
                        className={`duo-btn ${btnClass}`}
                        style={{
                          height: "80px",
                          borderRadius: "18px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "28px",
                          fontWeight: 900,
                        }}
                      >
                        <span>{opt.kana}</span>
                        {drillAnswered && (
                          <span style={{ fontSize: "12px", fontWeight: 700, opacity: 0.85 }}>
                            {opt.romaji}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Continue Action */}
                {drillAnswered && (
                  <button
                    onClick={handleNextDrillQuestion}
                    className="duo-btn duo-btn-green"
                    style={{ width: "100%", padding: "14px", fontSize: "16px" }}
                  >
                    {drillIndex + 1 === drillQuestions.length ? "FINISH" : "NEXT"}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
