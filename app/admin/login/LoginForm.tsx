"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/app/components/LanguageProvider";
import LanguageSelect from "@/app/components/LanguageSelect";

const loginCopy = {
  en: {
    kicker: "Nothing in My Way",
    title: "Private studio",
    description: "Sign in to add journal entries and shape the story shared with your readers.",
    language: "Language",
    email: "Admin email",
    password: "Password",
    signIn: "Enter private studio",
    signingIn: "Signing in...",
    error: "That email and password combination could not be verified.",
  },
  id: {
    kicker: "Nothing in My Way",
    title: "Studio admin",
    description: "Masuk untuk mengelola jurnal dan mengatur cerita yang dibagikan kepada pembaca.",
    language: "Bahasa",
    email: "Email admin",
    password: "Kata sandi",
    signIn: "Masuk ke studio",
    signingIn: "Sedang masuk...",
    error: "Email atau kata sandi tidak cocok. Silakan coba lagi.",
  },
} as const;

export default function LoginForm() {
  const { language } = useLanguage();
  const t = loginCopy[language];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(t.error);
      setIsLoading(false);
      return;
    }

    window.location.assign("/admin");
  }

  return (
    <>
      <div className="adminLoginHeader">
        <div>
          <p className="adminKicker">{t.kicker}</p>
          <h1>{t.title}</h1>
          <p className="adminLead">{t.description}</p>
        </div>
        <LanguageSelect className="adminLanguageSelect" label={t.language} />
      </div>
      <form className="adminForm" onSubmit={handleSubmit}>
        <label>
          <span>{t.email}</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          <span>{t.password}</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="adminError">{error}</p>}
        <button type="submit" className="adminButton" disabled={isLoading}>
          {isLoading ? t.signingIn : t.signIn}
        </button>
      </form>
    </>
  );
}
