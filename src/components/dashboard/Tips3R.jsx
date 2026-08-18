"use client";
import "./Tips3R.css";
import { motion } from "framer-motion";
import {
  Leaf,
  Recycle,
  Droplets,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const tips = [
  {
    icon: Recycle,
    title: "Reduce",
    text: "Kurangi penggunaan barang sekali pakai.",
  },
  {
    icon: Leaf,
    title: "Reuse",
    text: "Gunakan kembali barang yang masih layak.",
  },
  {
    icon: Droplets,
    title: "Recycle",
    text: "Pilah sampah agar mudah didaur ulang.",
  },
];

export default function Tips3R() {
  return (
    <section className="tips3r-section">

      <div className="tips3r-header">
        <div>
          <span className="tips3r-label">
            TIPS HARI INI
          </span>

          <h2>
            Yuk, Terapkan 3R 🌱
          </h2>

          <p>
            Kebiasaan kecil bisa memberi dampak besar.
          </p>
        </div>

        <div className="tips3r-lightbulb">
          <Lightbulb size={17} />
        </div>
      </div>


      <div className="tips3r-list">

        {tips.map((tip, index) => {
          const Icon = tip.icon;

          return (
            <motion.div
              key={tip.title}
              className="tips3r-card"
              initial={{
                opacity: 0,
                x: 15,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{
                x: 4,
              }}
            >

              <div className="tips3r-icon">
                <Icon size={17} />
              </div>

              <div className="tips3r-content">
                <h3>
                  {tip.title}
                </h3>

                <p>
                  {tip.text}
                </p>
              </div>

              <ArrowRight
                className="tips3r-arrow"
                size={14}
              />

            </motion.div>
          );
        })}

      </div>

    </section>
  );
}