export default function Footer() {
  return (
    <div className="mt-12">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent/5 via-accent/10 to-transparent border-2 border-accent/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="mb-3">
            <a
              href="https://twitter.com/edisonisgrowing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-dark/80 hover:text-accent transition group"
            >
              Built by
              <span className="inline-flex items-center gap-1.5 text-accent group-hover:underline">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @edisonisgrowing
              </span>
            </a>
          </div>
          <h3 className="font-bold text-base text-dark mb-2">
            Want an app like this for your community?
          </h3>
          <p className="text-sm text-dark/70 leading-relaxed">
            I build custom apps for communities. Clean, fast, and tailored to you.
          </p>
        </div>
      </div>
    </div>
  );
}
