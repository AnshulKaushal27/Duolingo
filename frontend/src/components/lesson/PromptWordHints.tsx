"use client";

import React, { useState, useRef, useEffect } from "react";

// Common translation dictionary for seed courses (Spanish <-> English)
const VOCABULARY_DICT: Record<string, string> = {
  // Spanish -> English
  "la": "the (fem.)",
  "el": "the (masc.)",
  "los": "the (plural masc.)",
  "las": "the (plural fem.)",
  "un": "a / an (masc.)",
  "una": "a / an (fem.)",
  "unos": "some (masc.)",
  "unas": "some (fem.)",
  "mujer": "woman",
  "hombre": "man",
  "niño": "boy / child",
  "niña": "girl / child",
  "manzana": "apple",
  "manzanas": "apples",
  "pan": "bread",
  "agua": "water",
  "leche": "milk",
  "café": "coffee",
  "vino": "wine",
  "cerveza": "beer",
  "come": "eats (he/she/it)",
  "comes": "eat (you)",
  "como": "eat (I)",
  "comen": "eat (they)",
  "bebe": "drinks",
  "bebes": "drink (you)",
  "bebo": "drink (I)",
  "yo": "I",
  "tú": "you",
  "él": "he",
  "ella": "she",
  "nosotros": "we",
  "hola": "hello / hi",
  "adiós": "goodbye / bye",
  "buenos": "good",
  "días": "days / morning",
  "tardes": "afternoon / evening",
  "noches": "nights",
  "por": "please / by / for",
  "favor": "favor (please)",
  "gracias": "thank you",
  "de": "of / from",
  "nada": "nothing (you're welcome)",
  "mucho": "much / a lot",
  "gusto": "pleasure (nice to meet you)",
  "restaurante": "restaurant",
  "cuenta": "bill / check",
  "mesa": "table",
  "dos": "two",
  "tres": "three",
  "cuatro": "four",
  "cinco": "five",

  // English -> Spanish
  "the": "el / la",
  "woman": "mujer",
  "man": "hombre",
  "eats": "come",
  "an": "un / una",
  "a": "un / una",
  "apple": "manzana",
  "apples": "manzanas",
  "milk": "leche",
  "bread": "pan",
  "water": "agua",
  "drinks": "bebe",
  "boy": "niño",
  "girl": "niña",
  "coffee": "café",
  "tea": "té",
  "hello": "hola",
  "goodbye": "adiós",
  "please": "por favor",
  "thanks": "gracias",
  "thank": "gracias",
  "you": "tú / usted",
  "is": "es / está",
  "are": "eres / están",
  "good": "bueno / buenos",
  "morning": "días / mañana",
  "night": "noche",
};

interface PromptWordHintsProps {
  sentence: string;
  customHints?: Record<string, string>;
  style?: React.CSSProperties;
}

export default function PromptWordHints({ sentence, customHints = {}, style }: PromptWordHintsProps) {
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveWordIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Split sentence into words and whitespace/punctuation
  const tokens = sentence.split(/(\s+|[.,!?;:¿¡])/);

  return (
    <div
      ref={containerRef}
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        fontSize: "19px",
        fontWeight: 700,
        color: "var(--duo-text)",
        lineHeight: 1.4,
        ...style,
      }}
    >
      {tokens.map((token, idx) => {
        const isWhitespace = /^\s+$/.test(token);
        const isPunctuation = /^[.,!?;:¿¡]+$/.test(token);

        if (isWhitespace) {
          return <span key={idx}>&nbsp;</span>;
        }

        if (isPunctuation) {
          return <span key={idx}>{token}</span>;
        }

        // Clean word for dictionary lookup
        const cleanKey = token.toLowerCase().replace(/^[.,!?;:¿¡]+|[.,!?;:¿¡]+$/g, "");
        const hint =
          customHints[token] ||
          customHints[cleanKey] ||
          VOCABULARY_DICT[cleanKey] ||
          VOCABULARY_DICT[token];

        const isCurrentActive = activeWordIndex === idx;

        return (
          <span
            key={idx}
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => {
              if (hint) setActiveWordIndex(idx);
            }}
            onMouseLeave={() => {
              if (activeWordIndex === idx) setActiveWordIndex(null);
            }}
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (hint) {
                  setActiveWordIndex(isCurrentActive ? null : idx);
                }
              }}
              style={{
                borderBottom: hint ? "2px dotted var(--duo-border-dark, #afafaf)" : "none",
                cursor: hint ? "pointer" : "default",
                paddingBottom: "1px",
                transition: "color 0.15s ease",
                color: isCurrentActive ? "var(--duo-blue, #1cb0f6)" : "inherit",
              }}
              title={hint ? `Hint: ${hint}` : undefined}
            >
              {token}
            </span>

            {/* Duolingo Tap-a-Word Tooltip */}
            {isCurrentActive && hint && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#2e3856",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  zIndex: 50,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                  animation: "fadeIn 0.15s ease",
                  pointerEvents: "none",
                }}
              >
                {hint}
                {/* Pointer Arrow */}
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid #2e3856",
                  }}
                />
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}
