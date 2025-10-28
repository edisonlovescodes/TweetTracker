"use client";

import { useEffect, useRef } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import { useEditorStore } from "@/lib/stores/editorStore";

export function Canvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const {
		videoClips,
		currentTime,
		isPlaying,
		setIsPlaying,
		setCurrentTime,
		canvasWidth,
		canvasHeight,
	} = useEditorStore();

	const currentClip = videoClips.find(
		(clip) =>
			currentTime >= clip.position &&
			currentTime < clip.position + clip.duration
	);

	useEffect(() => {
		if (!videoRef.current || !currentClip) return;

		videoRef.current.src = currentClip.url;
		const relativeTime = currentTime - currentClip.position;
		videoRef.current.currentTime = relativeTime;

		if (isPlaying) {
			videoRef.current.play();
		} else {
			videoRef.current.pause();
		}
	}, [currentClip, currentTime, isPlaying]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleTimeUpdate = () => {
			if (!currentClip) return;
			const newTime = currentClip.position + video.currentTime;
			setCurrentTime(newTime);

			// Auto-advance to next clip
			if (video.currentTime >= currentClip.duration) {
				const nextClip = videoClips.find(
					(c) => c.position > currentClip.position
				);
				if (nextClip) {
					setCurrentTime(nextClip.position);
				} else {
					setIsPlaying(false);
					setCurrentTime(0);
				}
			}
		};

		video.addEventListener("timeupdate", handleTimeUpdate);
		return () => video.removeEventListener("timeupdate", handleTimeUpdate);
	}, [currentClip, videoClips, setCurrentTime, setIsPlaying]);

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const totalDuration = videoClips.reduce(
		(sum, clip) => Math.max(sum, clip.position + clip.duration),
		0
	);

	return (
		<div className="flex-1 flex flex-col items-center justify-center bg-dark/5 p-4">
			{/* Canvas/Video Preview */}
			<div className="relative bg-black rounded-lg overflow-hidden shadow-2xl max-w-4xl max-h-full">
				{videoClips.length === 0 ? (
					<div className="w-[640px] h-[360px] flex items-center justify-center text-dark/40">
						<div className="text-center">
							<p className="text-lg mb-2">No video loaded</p>
							<p className="text-sm">Click "Import" to add a video</p>
						</div>
					</div>
				) : (
					<>
						<video
							ref={videoRef}
							className="w-full h-full"
							style={{
								maxWidth: "100%",
								maxHeight: "calc(100vh - 400px)",
							}}
						/>
						<canvas
							ref={canvasRef}
							width={canvasWidth}
							height={canvasHeight}
							className="hidden"
						/>
					</>
				)}
			</div>

			{/* Playback Controls */}
			{videoClips.length > 0 && (
				<div className="mt-6 flex items-center gap-4">
					<button
						onClick={togglePlayPause}
						className="p-3 bg-accent hover:bg-accent/90 text-white rounded-full transition-colors"
					>
						{isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
					</button>

					<div className="text-dark text-sm font-mono">
						{formatTime(currentTime)} / {formatTime(totalDuration)}
					</div>
				</div>
			)}
		</div>
	);
}
