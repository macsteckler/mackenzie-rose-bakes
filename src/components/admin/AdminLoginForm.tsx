"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  requestAdminMagicLink,
  signInAdminWithPassword,
  type LoginActionState,
  type PasswordLoginActionState,
} from "@/app/admin/login/actions";

const magicInitialState: LoginActionState = { status: "idle" };
const passwordInitialState: PasswordLoginActionState = { status: "idle" };

type SignInMode = "password" | "magic";

export default function AdminLoginForm({ hadError }: { hadError: boolean }) {
  const [mode, setMode] = useState<SignInMode>("password");
  const [magicState, magicAction, magicPending] = useActionState(
    requestAdminMagicLink,
    magicInitialState
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    signInAdminWithPassword,
    passwordInitialState
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-rose-50">
      <div className="max-w-sm w-full bg-white rounded-3xl border border-rose-100 shadow-sm p-8">
        <h1
          className="text-2xl font-bold text-rose-950 mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Admin Sign In
        </h1>
        <p className="text-sm text-stone-500 mb-5">
          Sign in with your admin email and password, or request a magic link.
        </p>

        <div className="flex rounded-full bg-stone-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${
              mode === "password"
                ? "bg-white text-rose-950 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${
              mode === "magic"
                ? "bg-white text-rose-950 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Magic link
          </button>
        </div>

        {mode === "password" ? (
          <form action={passwordAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="username email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm"
              />
            </div>
            {passwordState.status === "invalid" && (
              <p className="text-sm text-red-600">
                Enter a valid email and password.
              </p>
            )}
            {passwordState.status === "failed" && (
              <p className="text-sm text-red-600">
                Invalid email or password.
              </p>
            )}
            <button
              type="submit"
              disabled={passwordPending}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold rounded-full transition-colors"
            >
              {passwordPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : magicState.status === "sent" ? (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm text-rose-700">
            If that email is registered, a sign-in link is on its way. Check
            your inbox (and spam folder) — the link expires shortly, so use it
            soon.
          </div>
        ) : magicState.status === "rate_limited" ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-2">
              <p>
                Supabase blocked the sign-in email. On the built-in email
                provider this project can send only <strong>2 auth emails per
                hour total</strong> — switching to a different admin email
                does not reset that.
              </p>
              <p>
                Wait about an hour, connect custom SMTP in Supabase (see
                README), or use the <strong>Password</strong> tab instead.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form action={magicAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition text-stone-800 text-sm"
              />
            </div>
            {magicState.status === "invalid" && (
              <p className="text-sm text-red-600">
                Enter a valid email address.
              </p>
            )}
            {hadError && (
              <p className="text-sm text-amber-600">
                That sign-in link is invalid or has expired. Request a new one
                below.
              </p>
            )}
            <button
              type="submit"
              disabled={magicPending}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold rounded-full transition-colors"
            >
              {magicPending ? "Sending..." : "Send Sign-In Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
