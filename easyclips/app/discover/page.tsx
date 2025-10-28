import Link from "next/link";

export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-dark mb-4">
						Easy Clips
					</h1>
					<p className="text-xl text-dark/70 mb-2">
						Free Video Editor for Your Community
					</p>
					<p className="text-lg text-dark/60">
						Simple. Fast. No watermarks. No BS.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 gap-6 mb-12">
					<div className="bg-white rounded-xl p-6 border-2 border-dark/10 hover:border-accent/50 transition-colors">
						<div className="text-accent text-3xl mb-3">🎬</div>
						<h3 className="text-xl font-bold text-dark mb-2">
							Multi-Track Editing
						</h3>
						<p className="text-dark/70">
							Import videos and audio, arrange them on a timeline, and create professional edits.
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 border-2 border-dark/10 hover:border-accent/50 transition-colors">
						<div className="text-accent text-3xl mb-3">📱</div>
						<h3 className="text-xl font-bold text-dark mb-2">
							Platform Presets
						</h3>
						<p className="text-dark/70">
							One-click exports optimized for TikTok, YouTube Shorts, Instagram Reels, and more.
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 border-2 border-dark/10 hover:border-accent/50 transition-colors">
						<div className="text-accent text-3xl mb-3">🎨</div>
						<h3 className="text-xl font-bold text-dark mb-2">
							Aspect Ratio Converter
						</h3>
						<p className="text-dark/70">
							Convert between 16:9, 9:16, 1:1, and 4:3 with smart crop or blurred backgrounds.
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 border-2 border-dark/10 hover:border-accent/50 transition-colors">
						<div className="text-accent text-3xl mb-3">🔒</div>
						<h3 className="text-xl font-bold text-dark mb-2">
							100% Private
						</h3>
						<p className="text-dark/70">
							All processing happens in your browser. Your files never leave your device.
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 border-2 border-dark/10 hover:border-accent/50 transition-colors">
						<div className="text-accent text-3xl mb-3">⚡</div>
						<h3 className="text-xl font-bold text-dark mb-2">
							Browser-Based
						</h3>
						<p className="text-dark/70">
							No downloads, no installations. Works directly in your browser using FFmpeg.wasm.
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 border-2 border-dark/10 hover:border-accent/50 transition-colors">
						<div className="text-accent text-3xl mb-3">💯</div>
						<h3 className="text-xl font-bold text-dark mb-2">
							100% Free
						</h3>
						<p className="text-dark/70">
							No watermarks, no subscriptions, no hidden costs. Completely free forever.
						</p>
					</div>
				</div>

				{/* CTA Section */}
				<div className="bg-dark rounded-xl p-8 text-center">
					<h2 className="text-3xl font-bold text-cream mb-4">
						Ready to Start Editing?
					</h2>
					<p className="text-cream/80 mb-6">
						Create professional video content for your social media in minutes.
					</p>
					<Link
						href="/"
						className="inline-block px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
					>
						Open Editor
					</Link>
				</div>

				{/* How It Works */}
				<div className="mt-12 bg-white rounded-xl p-8 border-2 border-dark/10">
					<h2 className="text-2xl font-bold text-dark mb-6 text-center">
						How It Works
					</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">
								1
							</div>
							<div>
								<h4 className="font-bold text-dark mb-1">Import Videos & Audio</h4>
								<p className="text-dark/70">
									Click the import button and select your video or audio files from your device.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">
								2
							</div>
							<div>
								<h4 className="font-bold text-dark mb-1">Edit on Timeline</h4>
								<p className="text-dark/70">
									Drag clips to arrange them, trim to the perfect length, and layer multiple tracks.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">
								3
							</div>
							<div>
								<h4 className="font-bold text-dark mb-1">Choose Platform & Quality</h4>
								<p className="text-dark/70">
									Select your target platform (TikTok, YouTube, etc.) and choose quality settings.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">
								4
							</div>
							<div>
								<h4 className="font-bold text-dark mb-1">Export & Download</h4>
								<p className="text-dark/70">
									Click export, wait for processing, and download your finished video!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
