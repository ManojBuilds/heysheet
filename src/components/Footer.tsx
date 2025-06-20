import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 mt-12 py-6 px-4 text-sm text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-center">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-white">HeySheet</span>. All rights
          reserved.
        </p>
        <div className="flex gap-4 text-zinc-400">
          <Link href="/privacy-policy" className="hover:text-white transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms
          </Link>
          {/* <Link href="/contact" className="hover:text-white transition"> */}
          {/*   Contact */}
          {/* </Link> */}
        </div>
      </div>
    </footer>
  );
}
