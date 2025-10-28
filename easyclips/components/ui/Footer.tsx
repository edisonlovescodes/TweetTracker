export function Footer() {
	return (
		<div className="bg-dark text-cream px-4 py-3 border-t border-dark/20">
			<div className="text-center text-sm">
				<p className="mb-1">
					<span className="text-cream/80">Built by </span>
					<a
						href="https://x.com/edisonisgrowing"
						target="_blank"
						rel="noopener noreferrer"
						className="text-accent hover:text-accent/80 font-medium transition-colors"
					>
						X @edisonisgrowing
					</a>
				</p>
				<p className="text-cream/60 text-xs">
					Want an app like this for your community?
					<br />
					I build custom apps for communities. Clean, fast, and tailored to you.
				</p>
			</div>
		</div>
	);
}
