"use client";

import {
  Recycle,
  Coins,
  Flame,
  Leaf,
} from "lucide-react";

import "./dashboard.css";

const stats = [
  {
    title: "Sampah Dipilah",
    value: "--",
    icon: Recycle,
    color: "#16A34A",
  },
  {
    title: "Poin Terkumpul",
    value: "--",
    icon: Coins,
    color: "#F59E0B",
  },
  {
    title: "Hari Aktif",
    value: "--",
    icon: Flame,
    color: "#EF4444",
  },
  {
    title: "Kontribusi",
    value: "--",
    icon: Leaf,
    color: "#22C55E",
  },
];

export default function DashboardStats() {
  return (
    <section className="dashboard-stats">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div className="stat-card" key={index}>
            <div
              className="stat-icon"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Icon size={28} color={item.color} />
            </div>

            <div className="stat-content">
              <h2>{item.value}</h2>
              <p>{item.title}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}