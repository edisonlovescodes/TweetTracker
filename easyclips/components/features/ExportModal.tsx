"use client";

import { useState } from "react";
import { FiX, FiDownload } from "react-icons/fi";
import { useEditorStore } from "@/lib/stores/editorStore";
import { exportVideo } from "@/lib/ffmpeg";

interface ExportModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type Platform = "tiktok" | "youtube-shorts" | "instagram-reels" | "twitter" | "custom";
type Quality = "1080p" | "720p" | "480p";

const platformPresets = {
	tiktok: { name: "TikTok", width: 1080, height: 1920, aspectRatio: "9:16" },
	"youtube-shorts": { name: "YouTube Shorts", width: 1080, height: 1920, aspectRatio: "9:16" },
	"instagram-reels": { name: "Instagram Reels", width: 1080, height: 1920, aspectRatio: "9:16" },
	twitter: { name: "Twitter/X", width: 1280, height: 720, aspectRatio: "16:9" },
	custom: { name: "Custom", width: 1920, height: 1080, aspectRatio: "16:9" },
};

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
	const { videoClips, audioTracks, exportProgress, setExportProgress, setIsExporting } = useEditorStore();
	const [platform, setPlatform] = useState<Platform>("youtube-shorts");
	const [quality, setQuality] = useState<Quality>("1080p");
	const [isExportingLocal, setIsExportingLocal] = useState(false);
	const [exportError, setExportError] = useState<string | null>(null);

	if (!isOpen) return null;

	const preset = platformPresets[platform];

	const handleExport = async () => {
		setIsExportingLocal(true);
		setIsExporting(true);
		setExportProgress(0);
		setExportError(null);
		let exportFailed = false;

		try {
			const videoFiles = videoClips.map((clip) => ({
				file: clip.file,
				startTime: clip.startTime,
				endTime: clip.endTime,
				position: clip.position,
			}));

			const audioFiles = audioTracks.map((track) => ({
				file: track.file,
				position: track.position,
			}));

			const blob = await exportVideo(
				videoFiles,
				audioFiles,
				preset.width,
				preset.height,
				quality,
				(progress) => {
					setExportProgress(progress);
				}
			);

			// Download the file
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `easy-clips-${platform}-${Date.now()}.mp4`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			// Close modal after successful export
			setTimeout(() => {
				onClose();
			}, 1000);
		} catch (error) {
			console.error("Export failed:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
			setExportError(`Export failed: ${errorMessage}. Please try again or use a smaller video file.`);
			setExportProgress(0);
			exportFailed = true;
		} finally {
			setIsExportingLocal(false);
			setIsExporting(false);
			if (!exportFailed) {
				setExportProgress(0);
			}
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-cream rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-dark/10">
					<h2 className="text-2xl font-bold text-dark">Export Video</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-dark/5 rounded-lg transition-colors"
						disabled={isExportingLocal}
					>
						<FiX size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Platform Presets */}
					<div>
						<label className="block text-sm font-medium text-dark mb-3">
							Platform Preset
						</label>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{(Object.keys(platformPresets) as Platform[]).map((key) => (
								<button
									key={key}
									onClick={() => setPlatform(key)}
									disabled={isExportingLocal}
									className={`p-4 rounded-lg border-2 transition-all ${
										platform === key
											? "border-accent bg-accent/10 text-accent"
											: "border-dark/20 hover:border-dark/40 text-dark"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									<div className="font-medium">{platformPresets[key].name}</div>
									<div className="text-xs opacity-70 mt-1">
										{platformPresets[key].aspectRatio}
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Quality */}
					<div>
						<label className="block text-sm font-medium text-dark mb-3">
							Quality
						</label>
						<div className="grid grid-cols-3 gap-3">
							{(["1080p", "720p", "480p"] as Quality[]).map((q) => (
								<button
									key={q}
									onClick={() => setQuality(q)}
									disabled={isExportingLocal}
									className={`p-3 rounded-lg border-2 transition-all ${
										quality === q
											? "border-accent bg-accent/10 text-accent"
											: "border-dark/20 hover:border-dark/40 text-dark"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									<div className="font-medium">{q}</div>
								</button>
							))}
						</div>
					</div>

					{/* Export Info */}
					<div className="bg-dark/5 rounded-lg p-4">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<div className="text-dark/60">Resolution</div>
								<div className="font-medium text-dark">
									{preset.width} × {preset.height}
								</div>
							</div>
							<div>
								<div className="text-dark/60">Aspect Ratio</div>
								<div className="font-medium text-dark">{preset.aspectRatio}</div>
							</div>
							<div>
								<div className="text-dark/60">Clips</div>
								<div className="font-medium text-dark">{videoClips.length}</div>
							</div>
							<div>
								<div className="text-dark/60">Audio Tracks</div>
								<div className="font-medium text-dark">{audioTracks.length}</div>
							</div>
						</div>
					</div>

					{/* Progress Bar */}
					{isExportingLocal && (
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-dark/60">Exporting...</span>
								<span className="text-sm font-medium text-dark">
									{exportProgress}%
								</span>
							</div>
							<div className="h-2 bg-dark/10 rounded-full overflow-hidden">
								<div
									className="h-full bg-accent transition-all duration-300"
									style={{ width: `${exportProgress}%` }}
								/>
							</div>
						</div>
					)}

					{/* Error Message */}
					{exportError && (
						<div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<div className="text-red-500 text-xl">⚠️</div>
								<div>
									<h4 className="font-bold text-red-800 mb-1">Export Failed</h4>
									<p className="text-sm text-red-700">{exportError}</p>
									<button
										onClick={() => setExportError(null)}
										className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
									>
										Dismiss
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 p-6 border-t border-dark/10">
					<button
						onClick={onClose}
						disabled={isExportingLocal}
						className="px-6 py-2 text-dark hover:bg-dark/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						onClick={handleExport}
						disabled={isExportingLocal || videoClips.length === 0}
						className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<FiDownload size={18} />
						<span>{isExportingLocal ? "Exporting..." : "Export"}</span>
					</button>
				</div>
			</div>
		</div>
	);
}
