import Link from "next/link";

export default function LegalNotice() {
  return (
    <div className="auth-legal">
      By continuing, you agree to Subnex&apos;s{" "}
      <Link href="/terms-conditions">Terms & Conditions</Link>{" "}
      and{" "}
      <Link href="/privacy-policy">Privacy Policy</Link>.
    </div>
  );
}
