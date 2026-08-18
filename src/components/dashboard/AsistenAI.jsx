"use client";

import "./AsistenAI.css";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AsistenAI() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}

      <motion.button
        className="asisten-ai-button"
        onClick={() => setOpen(!open)}
        whileHover={{
          scale: 1.05,
          y: -3,
        }}
        whileTap={{
          scale: 0.95,
        }}
        aria-label="Buka Asisten CiCi"
      >
        {/* =====================================
            TEMPAT MASKOT CICI
            NANTI GANTI BAGIAN INI DENGAN IMAGE
        ====================================== */}

        <div className="cici-placeholder">
          <span>🌱</span>
        </div>

        <div className="ai-sparkle">
          <Sparkles size={10} />
        </div>
      </motion.button>


      {/* CHAT PREVIEW */}

      {open && (
        <motion.div
          className="asisten-ai-popup"

          initial={{
            opacity: 0,
            y: 15,
            scale: 0.95,
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}

          exit={{
            opacity: 0,
            y: 15,
            scale: 0.95,
          }}

          transition={{
            duration: 0.25,
          }}
        >

          {/* HEADER */}

          <div className="ai-popup-header">

            <div className="ai-popup-avatar">
              🌱
            </div>

            <div>
              <strong>
                CiCi
              </strong>

              <span>
                Asisten lingkunganmu
              </span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="ai-close-button"
            >
              <X size={14} />
            </button>

          </div>


          {/* MESSAGE */}

          <div className="ai-popup-message">

            <div className="ai-message-icon">
              <Sparkles size={11} />
            </div>

            <p>
              Hai! 👋 Ada yang ingin kamu
              tanyakan tentang sampah hari ini?
            </p>

          </div>


          {/* ACTION */}

          <a
            href="/CICI"
            className="ai-popup-action"
          >
            Chat dengan CiCi

            <ArrowRight size={13} />
          </a>

        </motion.div>
      )}
    </>
  );
}