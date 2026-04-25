import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  };

  if (loading) {
    return (
      <main style={styles.loadingScreen}>
        <div className="loading-dot" />
        <h1 style={styles.loadingText}>Creating your account...</h1>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .register-card { animation: fadeUp 0.6s ease forwards; }
        .register-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .register-input::placeholder { color: rgba(255,255,255,0.2); }
        .register-input:focus {
          background: rgba(255,45,120,0.05);
          border-color: rgba(255,45,120,0.3);
          box-shadow: 0 0 0 3px rgba(255,45,120,0.08);
        }
        .register-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          padding: 0.9rem;
          width: 100%;
          background: linear-gradient(135deg, #ff2d78, #ff6b6b);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(255,45,120,0.3);
          letter-spacing: 0.01em;
        }
        .register-btn:hover {
          background: linear-gradient(135deg, #ff1a6a, #ff5252);
          box-shadow: 0 8px 30px rgba(255,45,120,0.45);
          transform: translateY(-1px);
        }
        .register-link {
          color: rgba(255,45,120,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .register-link:hover { color: #ff2d78; }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb-pink {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,45,120,0.15) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .orb-blue {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation: float 8s ease-in-out infinite;
          animation-delay: 4s;
        }
        .loading-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ff2d78;
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div style={styles.grid} />
      <div className="orb orb-pink" />
      <div className="orb orb-blue" />

      <div className="register-card" style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.iconWrap}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff2d78"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>
            Start your personalized interview prep journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <div style={styles.inputWrap}>
              <svg
                style={styles.inputIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                className="register-input"
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                id="username"
                name="username"
                placeholder="yourname"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Email address
            </label>
            <div style={styles.inputWrap}>
              <svg
                style={styles.inputIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                className="register-input"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <div style={styles.inputWrap}>
              <svg
                style={styles.inputIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                className="register-input"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="register-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginRight: "0.5rem" }}
            >
              <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956Z" />
            </svg>
            Create Account
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Sign in →
          </Link>
        </p>
      </div>
    </main>
  );
};

const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0d12",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(255,45,120,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.04) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "440px",
    margin: "1.5rem",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "2.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 0 1px rgba(255,45,120,0.1), 0 32px 64px rgba(0,0,0,0.4)",
  },
  cardHeader: { textAlign: "center", marginBottom: "2rem" },
  iconWrap: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "52px",
    height: "52px",
    background: "rgba(255,45,120,0.1)",
    border: "1px solid rgba(255,45,120,0.2)",
    borderRadius: "14px",
    marginBottom: "1.25rem",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "0.5rem",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.4)",
    fontWeight: "300",
  },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label: {
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute",
    left: "1rem",
    color: "rgba(255,255,255,0.25)",
    pointerEvents: "none",
    zIndex: 1,
  },
  footer: {
    textAlign: "center",
    marginTop: "1.75rem",
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.3)",
  },
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0d12",
    gap: "1rem",
  },
  loadingText: {
    fontFamily: "'Syne', sans-serif",
    color: "rgba(255,255,255,0.4)",
    fontSize: "1rem",
    fontWeight: "400",
  },
};

export default Register;
