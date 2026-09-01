"use client";

import "./login.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage("Email atau password salah.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="login-page">

      {/* Background Decoration */}

      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: .8,
          ease: "easeOut"
        }}
      >

        {/* LEFT */}

        <motion.div
          className="login-left"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: .2 }}
        >

          <motion.img
            src="/asset/images/logo.png"
            alt="TongCi"
            className="login-logo"
            animate={{
              y: [0, -12, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
          />

          <h1>
            Selamat Datang <br />
            <span> di TongCi</span>
          </h1>

          <p>
            Masuk untuk mulai menggunakan AI
            dalam mengenali sampah, belajar
            memilah, dan memperoleh reward.
          </p>

          <div className="login-info">

            <div className="info-card">
              🌱 Ramah Lingkungan
            </div>

            <div className="info-card">
              🤖 Berbasis AI
            </div>

            <div className="info-card">
              🎁 Reward Poin
            </div>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="login-card"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: .3 }}
        >

          <h2>Login</h2>

          <p>
            Masuk ke akun TongCi
          </p>

          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div className="input-group">

              <Mail size={20} />

              <input
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            {/* Password */}

            <div className="input-group">

              <Lock size={20} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >

                {showPassword
                  ? <EyeOff size={20}/>
                  : <Eye size={20}/>
                }

              </button>

            </div>

            {errorMessage && (
              <div className="login-error">
                {errorMessage}
              </div>
            )}

            <div className="login-option">

              <label>

                <input type="checkbox"/>

                Ingat Saya

              </label>

              <Link href="#">
                Lupa Password?
              </Link>

            </div>

            <motion.button
              whileHover={{
                scale:1.03
              }}
              whileTap={{
                scale:.96
              }}
              type="submit"
              className="login-btn"
              disabled={loading}
            >

              {loading
                ? "Memproses..."
                : (
                  <>
                    Login
                    <ArrowRight size={18}/>
                  </>
                )}

            </motion.button>

          </form>

          <div className="divider">

            <span>atau</span>

          </div>

          <button className="google-btn">

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />

            Login dengan Google

          </button>

          <div className="register-link">

            Belum punya akun?

            <Link href="/register">
              Daftar Sekarang
            </Link>

          </div>

        </motion.div>

      </motion.div>

    </main>
  );
}