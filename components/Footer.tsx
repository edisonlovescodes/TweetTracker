export default function Footer() {
  return (
    <div className="mt-12 pt-8 pb-6 border-t border-dark/10 text-center">
      <p className="text-dark/70 text-sm mb-2">Built by</p>
      <a
        href="https://twitter.com/edisonisgrowing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent font-semibold text-lg hover:underline"
      >
        @edisonisgrowing
      </a>
      <p className="text-dark/60 text-sm mt-3 max-w-md mx-auto leading-relaxed">
        Want an app like this for your community?
        <br />I build custom apps for communities. Clean, fast, and tailored to you.
      </p>
    </div>
  );
}
