"use client";

import "./register.css";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const passwordRules = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
  };

  const passwordMatch =
    form.password &&
    form.confirm &&
    form.password === form.confirm;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert("Password tidak sama.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Register berhasil!");
    }, 2000);
  };

  return (
    <section className="register-page">

      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7 }}
      >

        <motion.img
          src="/asset/images/logo.png"
          className="logo"
          animate={{ y: [0, -8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
        />

        <h1>Buat Akun</h1>

        <p>
          Bergabunglah bersama TongCi dan mulai peduli
          terhadap lingkungan.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-box">
            <User size={20}/>
            <input
              type="text"
              placeholder="Nama Lengkap"
              name="name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <Mail size={20}/>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <Lock size={20}/>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ?
                <EyeOff size={20}/> :
                <Eye size={20}/>
              }
            </button>

          </div>

          <div className="input-box">
            <Lock size={20}/>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Konfirmasi Password"
              name="confirm"
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
            >
              {showConfirm ?
                <EyeOff size={20}/> :
                <Eye size={20}/>
              }
            </button>

          </div>

          <div className="strength">

            <span className={passwordRules.length ? "ok":""}>
              <CheckCircle size={15}/>
              Minimal 8 karakter
            </span>

            <span className={passwordRules.uppercase ? "ok":""}>
              <CheckCircle size={15}/>
              Huruf besar
            </span>

            <span className={passwordRules.number ? "ok":""}>
              <CheckCircle size={15}/>
              Angka
            </span>

            <span className={passwordMatch ? "ok":""}>
              <CheckCircle size={15}/>
              Password cocok
            </span>

          </div>

          <button
            className="register-btn"
            disabled={loading}
          >
            {loading ?
              "Mendaftarkan..."
              :
              <>
                Daftar
                <ArrowRight size={18}/>
              </>
            }
          </button>

        </form>

        <div className="bottom">

          Sudah punya akun?

          <Link href="/login">
            Masuk
          </Link>

        </div>

      </motion.div>

    </section>
  );
}