import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-xl" aria-hidden>
            🎁
          </span>
          <div>
            <h1 className="text-lg font-bold">Gift Wala Admin</h1>
            <p className="text-sm text-muted">Sign in to manage the app</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
