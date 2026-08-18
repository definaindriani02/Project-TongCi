"use client";

import "./QuickAction.css";
import { motion } from "framer-motion";
import {
  ScanLine,
  BookOpen,
  Bot,
  Trophy,
} from "lucide-react";

const actions = [
  {
    title: "Scan Sampah",
    desc: "Identifikasi sampah dengan AI",
    icon: ScanLine,
    color: "#16C95A",
  },
  {
    title: "Edukasi",
    desc: "Pelajari pengelolaan sampah",
    icon: BookOpen,
    color: "#3B82F6",
  },
  {
    title: "Chat CICI",
    desc: "Tanya AI kapan saja",
    icon: Bot,
    color: "#8B5CF6",
  },
  {
    title: "Leaderboard",
    desc: "Lihat peringkat pengguna",
    icon: Trophy,
    color: "#F59E0B",
  },
];

export default function QuickAction() {
  return (
    <section className="quick-action">

      <div className="section-title">
        <h2>Akses Cepat</h2>
        <p>Pilih fitur yang ingin digunakan</p>
      </div>

      <div className="quick-grid">

        {actions.map((item, index) => {

          const Icon = item.icon;

          return (

            <motion.div
              key={index}
              className="quick-card"
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
            >

              <div
                className="quick-icon"
                style={{
                  background: `${item.color}20`,
                }}
              >
                <Icon
                  size={30}
                  color={item.color}
                />
              </div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

            </motion.div>

          );

        })}

      </div>

    </section>
  );
}