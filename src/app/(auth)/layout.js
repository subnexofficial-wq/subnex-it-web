

export const metadata = {
  title: "Auth | Subnex",
};

export default function AuthLayout({ children }) {
  return (
    <section className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
      {/* Card Wrapper */}
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </section>
  );
}
