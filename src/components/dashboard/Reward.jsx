"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Wallet,
  Tag,
  ShoppingBag,
  Coins,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import "./Reward.css";

// Data Dummy Katalog Reward
const REWARD_ITEMS = [
  {
    id: "r1",
    title: "Saldo GoPay Rp 10.000",
    category: "ewallet",
    pointsCost: 100,
    image: "📱",
    stock: 25,
    description: "Voucher saldo GoPay langsung masuk ke nomor HP terdaftar.",
  },
  {
    id: "r2",
    title: "Saldo OVO Rp 20.000",
    category: "ewallet",
    pointsCost: 200,
    image: "💜",
    stock: 12,
    description: "Voucher saldo OVO tanpa potongan biaya admin.",
  },
  {
    id: "r3",
    title: "Voucher Toko Kelontong Eco 15%",
    category: "voucher",
    pointsCost: 80,
    image: "🏷️",
    stock: 50,
    description: "Diskon belanja produk ramah lingkungan di partner TongCi.",
  },
  {
    id: "r4",
    title: "Sedotan Stainless Steel Set",
    category: "merch",
    pointsCost: 350,
    image: "🥤",
    stock: 8,
    description: "Set sedotan stainless + sikat pembersih + kantong blacu.",
  },
  {
    id: "r5",
    title: "Totebag Blacu Ramah Lingkungan",
    category: "merch",
    pointsCost: 500,
    image: "🛍️",
    stock: 15,
    description: "Tas belanja kain tahan beban hingga 10kg.",
  },
  {
    id: "r6",
    title: "Voucher Bibit Tanaman 🌱",
    category: "voucher",
    pointsCost: 150,
    image: "🪴",
    stock: 30,
    description: "Klaim 2 bibit tanaman buah/sayur gratis di Bank Sampah mitra.",
  },
];

export default function Reward({ points = 0, onRedeemSuccess }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState(null); // 'success' | 'error' | null

  // Filter Reward
  const filteredRewards =
    selectedCategory === "all"
      ? REWARD_ITEMS
      : REWARD_ITEMS.filter((item) => item.category === selectedCategory);

  // Handle Tukar Poin
  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setRedeemStatus(null);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;

    if (points < selectedReward.pointsCost) {
      setRedeemStatus("error");
      return;
    }

    setIsRedeeming(true);

    // Simulasi Proses Penukaran (1.2 detik)
    setTimeout(() => {
      setIsRedeeming(false);
      setRedeemStatus("success");
      if (onRedeemSuccess) {
        onRedeemSuccess(selectedReward.pointsCost);
      }
    }, 1200);
  };

  return (
    <section className="reward-container">
      {/* HEADER */}
      <div className="reward-header">
        <div className="reward-header-text">
          <div className="reward-badge">
            <Gift size={14} />
            <span>KATALOG HADIAH</span>
          </div>
          <h2>Tukarkan Poin Kebaikanmu 🎁</h2>
          <p>
            Gunakan poin hasil pemilahan sampah untuk klaim saldo e-wallet,
            voucher, atau merchandise ramah lingkungan.
          </p>
        </div>

        {/* CURRENT POINTS DISPLAY */}
        <div className="current-points-badge">
          <Coins size={18} className="coins-icon" />
          <div className="points-info">
            <span className="points-label">Poin Tersedia</span>
            <strong className="points-val">
              {points.toLocaleString("id-ID")} Pts
            </strong>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="reward-tabs">
        <button
          className={`reward-tab ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          Semua
        </button>
        <button
          className={`reward-tab ${selectedCategory === "ewallet" ? "active" : ""}`}
          onClick={() => setSelectedCategory("ewallet")}
        >
          <Wallet size={14} />
          E-Wallet
        </button>
        <button
          className={`reward-tab ${selectedCategory === "voucher" ? "active" : ""}`}
          onClick={() => setSelectedCategory("voucher")}
        >
          <Tag size={14} />
          Voucher
        </button>
        <button
          className={`reward-tab ${selectedCategory === "merch" ? "active" : ""}`}
          onClick={() => setSelectedCategory("merch")}
        >
          <ShoppingBag size={14} />
          Merchandise
        </button>
      </div>

      {/* REWARD CARDS GRID */}
      <div className="reward-grid">
        {filteredRewards.map((item) => {
          const canAfford = points >= item.pointsCost;

          return (
            <motion.div
              key={item.id}
              className={`reward-card ${!canAfford ? "insufficient" : ""}`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="reward-card-top">
                <span className="reward-icon">{item.image}</span>
                <span className="reward-stock">Sisa {item.stock}</span>
              </div>

              <h4 className="reward-title">{item.title}</h4>
              <p className="reward-desc">{item.description}</p>

              <div className="reward-card-footer">
                <div className="reward-cost">
                  <Coins size={14} />
                  <span>{item.pointsCost} Pts</span>
                </div>

                <button
                  className={`btn-tukar ${canAfford ? "active" : "disabled"}`}
                  onClick={() => handleRedeem(item)}
                >
                  {canAfford ? "Tukarkan" : "Poin Kurang"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL KONFIRMASI / HASIL */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            className="reward-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              className="reward-modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedReward(null)}
              >
                <X size={18} />
              </button>

              {redeemStatus === "success" ? (
                <div className="modal-status success">
                  <CheckCircle2 size={48} className="status-icon" />
                  <h3>Penukaran Berhasil! 🎉</h3>
                  <p>
                    Kamu berhasil menukarkan <strong>{selectedReward.pointsCost} Pts</strong> untuk{" "}
                    <strong>{selectedReward.title}</strong>. Silakan cek menu voucher/email kamu.
                  </p>
                  <button
                    className="btn-modal-action"
                    onClick={() => setSelectedReward(null)}
                  >
                    Tutup
                  </button>
                </div>
              ) : redeemStatus === "error" ? (
                <div className="modal-status error">
                  <AlertCircle size={48} className="status-icon" />
                  <h3>Poin Tidak Cukup ⚠️</h3>
                  <p>
                    Kamu membutuhkan <strong>{selectedReward.pointsCost} Pts</strong>, sedangkan
                    poinmu saat ini adalah <strong>{points} Pts</strong>. Yuk kumpulkan lebih banyak poin!
                  </p>
                  <button
                    className="btn-modal-action"
                    onClick={() => setSelectedReward(null)}
                  >
                    Mengerti
                  </button>
                </div>
              ) : (
                <div className="modal-confirm">
                  <span className="modal-item-icon">{selectedReward.image}</span>
                  <h3>Konfirmasi Penukaran</h3>
                  <p className="modal-subtitle">{selectedReward.title}</p>

                  <div className="modal-summary">
                    <div className="summary-row">
                      <span>Poin Kamu:</span>
                      <strong>{points} Pts</strong>
                    </div>
                    <div className="summary-row">
                      <span>Biaya Poin:</span>
                      <strong className="text-red">-{selectedReward.pointsCost} Pts</strong>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row total">
                      <span>Sisa Poin:</span>
                      <strong>{points - selectedReward.pointsCost} Pts</strong>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="btn-modal-cancel"
                      onClick={() => setSelectedReward(null)}
                      disabled={isRedeeming}
                    >
                      Batal
                    </button>
                    <button
                      className="btn-modal-confirm"
                      onClick={confirmRedeem}
                      disabled={isRedeeming}
                    >
                      {isRedeeming ? "Memproses..." : "Ya, Tukarkan"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}