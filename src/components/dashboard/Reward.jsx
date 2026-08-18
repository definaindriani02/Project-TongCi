"use client";
import "./Reward.css";

import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function Reward({ points = 0 }) {
  const currentPoints = Number(points) || 0;

  const levels = [
    {
      name: "Pemula Hijau",
      target: 100,
      icon: "🌱",
    },
    {
      name: "Sahabat Bumi",
      target: 300,
      icon: "🌿",
    },
    {
      name: "Pejuang Lingkungan",
      target: 500,
      icon: "🌳",
    },
  ];

  const currentLevel =
    levels.find((level) => currentPoints < level.target) ||
    levels[levels.length - 1];

  const previousTarget =
    levels[
      Math.max(
        levels.indexOf(currentLevel) - 1,
        0
      )
    ]?.target || 0;

  const progress = Math.min(
    Math.max(
      ((currentPoints - previousTarget) /
        (currentLevel.target - previousTarget)) *
        100,
      0
    ),
    100
  );

  const remaining = Math.max(
    currentLevel.target - currentPoints,
    0
  );

  return (
    <section className="reward-dashboard">

      {/* HEADER */}

      <div className="reward-dashboard-header">

        <div>
          <span className="reward-dashboard-label">
            PENCAPAIANMU
          </span>

          <h2>
            Terus Kumpulkan Kebaikan 🏆
          </h2>

          <p>
            Setiap scan membawa kamu lebih dekat
            ke pencapaian berikutnya.
          </p>
        </div>

        <Link
          href="/leaderboard"
          className="reward-see-all"
        >
          Leaderboard
          <ArrowRight size={13} />
        </Link>

      </div>


      {/* MAIN REWARD CARD */}

      <motion.div
        className="reward-main-card"

        initial={{
          opacity: 0,
          y: 15,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
        }}
      >

        {/* DECORATION */}

        <div className="reward-orb reward-orb-one" />
        <div className="reward-orb reward-orb-two" />


        {/* TROPHY */}

        <motion.div
          className="reward-trophy"

          animate={{
            y: [0, -5, 0],
            rotate: [0, 2, -2, 0],
          }}

          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>
            {currentLevel.icon}
          </span>

          <div className="reward-trophy-sparkle">
            <Sparkles size={12} />
          </div>
        </motion.div>


        {/* INFO */}

        <div className="reward-info">

          <span className="reward-small-label">
            LEVEL BERIKUTNYA
          </span>

          <h3>
            {currentLevel.name}
          </h3>

          <p>
            {remaining > 0
              ? `Tinggal ${remaining} poin lagi untuk mencapai level ini.`
              : "Keren! Kamu sudah mencapai pencapaian ini."}
          </p>


          {/* PROGRESS */}

          <div className="reward-progress-area">

            <div className="reward-progress-top">

              <span>
                {currentPoints} Pts
              </span>

              <span>
                {currentLevel.target} Pts
              </span>

            </div>

            <div className="reward-progress">

              <motion.div
                className="reward-progress-fill"

                initial={{
                  width: 0,
                }}

                whileInView={{
                  width: `${progress}%`,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  duration: 1,
                  delay: 0.25,
                }}
              />

            </div>

          </div>

        </div>


        {/* BADGE */}

        <div className="reward-badge">

          <div className="reward-badge-icon">
            <Trophy size={19} />
          </div>

          <span>
            {Math.round(progress)}%
          </span>

          <small>
            Progress
          </small>

        </div>

      </motion.div>


      {/* MINI REWARDS */}

      <div className="reward-mini-grid">

        <div className="reward-mini-card">

          <div className="reward-mini-icon">
            <Star size={17} />
          </div>

          <div>
            <strong>
              Rajin Scan
            </strong>

            <p>
              Scan sampah secara rutin
            </p>
          </div>

          <span className="reward-mini-status">
            ✓
          </span>

        </div>


        <div className="reward-mini-card locked">

          <div className="reward-mini-icon">
            <Lock size={16} />
          </div>

          <div>
            <strong>
              Eco Hero
            </strong>

            <p>
              Kumpulkan 500 poin
            </p>
          </div>

          <span className="reward-mini-status">
            🔒
          </span>

        </div>

      </div>

    </section>
  );
}