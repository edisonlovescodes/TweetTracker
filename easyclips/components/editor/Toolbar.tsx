"use client";

import { useRef, useState } from "react";
import { FiUpload, FiDownload, FiRotateCcw, FiRotateCw, FiMusic } from "react-icons/fi";
import { useEditorStore } from "@/lib/stores/editorStore";
import { ExportModal } from "../features/ExportModal";

export function Toolbar() {
	const videoInputRef = useRef<HTMLInputElement>(null);
	const audioInputRef = useRef<HTMLInputElement>(null);
	const [showExportModal, setShowExportModal] = useState(false);
	const { addVideoClip, addAudioTrack, videoClips } = useEditorStore();

	const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		const url = URL.createObjectURL(file);

		// Get video duration
		const video = document.createElement("video");
		video.src = url;

		await new Promise((resolve) => {
			video.onloadedmetadata = resolve;
		});

		const clip = {
			id: crypto.randomUUID(),
			file,
			url,
			duration: video.duration,
			startTime: 0,
			endTime: video.duration,
			track: 0,
			position: videoClips.reduce(
				(max, clip) => Math.max(max, clip.position + (clip.endTime - clip.startTime)),
				0
			),
		};

		addVideoClip(clip);
		e.target.value = ""; // Reset input
	};

	const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		const url = URL.createObjectURL(file);

		// Get audio duration
		const audio = document.createElement("audio");
		audio.src = url;

		await new Promise((resolve) => {
			audio.onloadedmetadata = resolve;
		});

		const track = {
			id: crypto.randomUUID(),
			file,
			url,
			duration: audio.duration,
			volume: 1,
			position: 0,
			track: 0,
		};

		addAudioTrack(track);
		e.target.value = ""; // Reset input
	};

	return (
		<div className="bg-dark text-cream px-4 py-3 flex items-center justify-between border-b border-dark/20">
			{/* Left: Logo */}
			<div className="flex items-center gap-4">
				<h1 className="text-xl font-bold">Easy Clips</h1>
			</div>

			{/* Center: Actions */}
			<div className="flex items-center gap-2">
				<button
					onClick={() => videoInputRef.current?.click()}
					className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg flex items-center gap-2 transition-colors"
				>
					<FiUpload size={18} />
					<span>Video</span>
				</button>

				<button
					onClick={() => audioInputRef.current?.click()}
					className="px-3 py-2 bg-cream/10 hover:bg-cream/20 text-cream rounded-lg flex items-center gap-2 transition-colors"
				>
					<FiMusic size={16} />
					<span>Audio</span>
				</button>

				<input
					ref={videoInputRef}
					type="file"
					accept="video/*"
					onChange={handleVideoUpload}
					className="hidden"
				/>

				<input
					ref={audioInputRef}
					type="file"
					accept="audio/*"
					onChange={handleAudioUpload}
					className="hidden"
				/>

				<div className="flex items-center gap-1 ml-2">
					<button
						className="p-2 hover:bg-cream/10 rounded transition-colors"
						title="Undo"
					>
						<FiRotateCcw size={18} />
					</button>
					<button
						className="p-2 hover:bg-cream/10 rounded transition-colors"
						title="Redo"
					>
						<FiRotateCw size={18} />
					</button>
				</div>
			</div>

			{/* Right: Export */}
			<div>
				<button
					onClick={() => setShowExportModal(true)}
					disabled={videoClips.length === 0}
					className="px-4 py-2 bg-cream text-dark hover:bg-cream/90 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<FiDownload size={18} />
					<span>Export</span>
				</button>
			</div>

			<ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
		</div>
	);
}
