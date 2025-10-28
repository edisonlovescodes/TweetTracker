"use client";

import { useRef, useState } from "react";
import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { FiVideo, FiMusic, FiMessageSquare, FiMaximize2, FiPlus, FiMinus, FiBookmark } from "react-icons/fi";
import { useEditorStore } from "@/lib/stores/editorStore";
import { ClipItem } from "./ClipItem";
import { AspectRatioModal } from "../features/AspectRatioModal";

export function Timeline() {
	const timelineRef = useRef<HTMLDivElement>(null);
	const [showAspectRatioModal, setShowAspectRatioModal] = useState(false);
	const [activeTab, setActiveTab] = useState<"video" | "audio" | "captions">("video");
	const [zoom, setZoom] = useState(50); // pixels per second
	const [markers, setMarkers] = useState<{ id: string; time: number; label: string }[]>([]);

	const {
		videoClips,
		audioTracks,
		captions,
		currentTime,
		setCurrentTime,
		removeVideoClip,
		updateVideoClip,
		removeAudioTrack,
	} = useEditorStore();

	const totalDuration = Math.max(
		10,
		videoClips.reduce(
			(max, clip) => Math.max(max, clip.position + (clip.endTime - clip.startTime)),
			0
		),
		audioTracks.reduce(
			(max, track) => Math.max(max, track.position + track.duration),
			0
		)
	);

	const pixelsPerSecond = zoom;
	const timelineWidth = totalDuration * pixelsPerSecond;
	const primaryInterval =
		zoom < 40 ? 10 : zoom < 80 ? 5 : zoom < 120 ? 1 : zoom < 160 ? 0.5 : 0.25;
	const subInterval = primaryInterval >= 1 ? primaryInterval / 5 : primaryInterval / 2;

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, delta } = event;
		const clipId = active.id as string;
		const clip = videoClips.find((c) => c.id === clipId);

		if (!clip) return;

		const deltaTime = delta.x / pixelsPerSecond;
		const newPosition = Math.max(0, clip.position + deltaTime);

		updateVideoClip(clipId, { position: newPosition });
	};

	const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains('timeline-clickable')) {
			return;
		}

		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left + (e.currentTarget.scrollLeft || 0);
		setCurrentTime(clampTime(x));
	};

	const clampTime = (pixels: number) => Math.max(0, Math.min(pixels / pixelsPerSecond, totalDuration));

	const handlePlayheadDrag = (e: React.MouseEvent<HTMLDivElement>) => {
		const timeline = timelineRef.current;
		if (!timeline) return;

		const rect = timeline.getBoundingClientRect();
		const initialX = e.clientX - rect.left + timeline.scrollLeft;
		setCurrentTime(clampTime(initialX));

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const x = moveEvent.clientX - rect.left + timeline.scrollLeft;
			setCurrentTime(clampTime(x));
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const addMarker = () => {
		const newMarker = {
			id: crypto.randomUUID(),
			time: currentTime,
			label: `Marker ${markers.length + 1}`,
		};
		setMarkers([...markers, newMarker]);
	};

	const zoomIn = () => setZoom(Math.min(200, zoom + 10));
	const zoomOut = () => setZoom(Math.max(20, zoom - 10));

	// Generate timeline grid
	const generateTimeMarkers = () => {
		const ticks: number[] = [];
		const total = Math.ceil(totalDuration / primaryInterval);

		for (let i = 0; i <= total; i += 1) {
			const time = Number((i * primaryInterval).toFixed(4));
			ticks.push(time);
		}
		return ticks;
	};

	const generateSubTicks = () => {
		if (!subInterval) return [];
		const ticks: number[] = [];
		const total = Math.ceil(totalDuration / subInterval);

		for (let i = 0; i <= total; i += 1) {
			const time = Number((i * subInterval).toFixed(4));
			if (Number.isInteger(time / primaryInterval)) continue;
			ticks.push(time);
		}

		return ticks;
	};

	const formatTimestamp = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		const frames = Math.floor((seconds % 1) * 30); // 30 fps
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
	};

	return (
		<div className="h-full bg-cream flex flex-col">
			{/* Timeline Header */}
			<div className="px-4 py-2 border-b border-dark/10 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<button
						onClick={() => setActiveTab("video")}
						className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
							activeTab === "video"
								? "bg-accent text-white"
								: "text-dark/60 hover:bg-dark/5"
						}`}
					>
						<FiVideo size={14} />
						<span>Video</span>
					</button>
					<button
						onClick={() => setActiveTab("audio")}
						className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
							activeTab === "audio"
								? "bg-accent text-white"
								: "text-dark/60 hover:bg-dark/5"
						}`}
					>
						<FiMusic size={14} />
						<span>Audio</span>
					</button>
					<button
						onClick={() => setActiveTab("captions")}
						className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
							activeTab === "captions"
								? "bg-accent text-white"
								: "text-dark/60 hover:bg-dark/5"
						}`}
					>
						<FiMessageSquare size={14} />
						<span>Captions</span>
					</button>

					<div className="h-6 w-px bg-dark/10 mx-2" />

					<button
						onClick={addMarker}
						className="px-3 py-1.5 text-sm text-dark/60 hover:bg-dark/5 rounded-md transition-colors flex items-center gap-2"
						title="Add Marker"
					>
						<FiBookmark size={14} />
						<span>Markers ({markers.length})</span>
					</button>
				</div>

				<div className="flex items-center gap-3">
					{/* Zoom Controls */}
					<div className="flex items-center gap-2 px-3 py-1.5 bg-dark/5 rounded-md">
						<button
							onClick={zoomOut}
							className="p-1 hover:bg-dark/10 rounded transition-colors"
							title="Zoom Out"
						>
							<FiMinus size={14} />
						</button>
						<div className="text-xs text-dark/60 font-mono w-12 text-center">
							{Math.round((zoom / 50) * 100)}%
						</div>
						<button
							onClick={zoomIn}
							className="p-1 hover:bg-dark/10 rounded transition-colors"
							title="Zoom In"
						>
							<FiPlus size={14} />
						</button>
					</div>

					<button
						onClick={() => setShowAspectRatioModal(true)}
						className="p-2 hover:bg-dark/5 rounded transition-colors"
						title="Aspect Ratio"
					>
						<FiMaximize2 size={16} />
					</button>
				</div>
			</div>

			{showAspectRatioModal && (
				<AspectRatioModal
					isOpen={showAspectRatioModal}
					onClose={() => setShowAspectRatioModal(false)}
				/>
			)}

			{/* Timeline Ruler and Tracks */}
			<div ref={timelineRef} className="flex-1 overflow-x-auto overflow-y-auto">
				<div
					className="relative min-w-full"
					style={{ width: `${timelineWidth}px` }}
				>
					{/* Time Ruler with improved timestamps */}
					<div className="h-10 bg-dark/5 border-b border-dark/10 relative timeline-clickable" onClick={handleTimelineClick}>
						{generateTimeMarkers().map((time) => (
							<div
								key={time}
								className="absolute top-0 h-full flex flex-col justify-between pointer-events-none"
								style={{ left: `${time * pixelsPerSecond}px` }}
							>
								<div className="text-[10px] text-dark/70 font-mono px-1 bg-cream">
									{formatTimestamp(time)}
								</div>
								<div className="h-2 border-l border-dark/20" />
							</div>
						))}

						{/* Sub-divisions */}
						{zoom > 40 && generateSubTicks().map((time) => (
							<div
								key={`sub-${time}`}
								className="absolute top-0 bottom-0 border-l border-dark/10 pointer-events-none"
								style={{ left: `${time * pixelsPerSecond}px` }}
							/>
						))}
					</div>

					{/* Markers */}
					{markers.map((marker) => (
						<div
							key={marker.id}
							className="absolute top-10 bottom-0 border-l-2 border-blue-500 z-20 pointer-events-none"
							style={{ left: `${marker.time * pixelsPerSecond}px` }}
						>
							<div className="absolute -top-10 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
								{marker.label}
							</div>
						</div>
					))}

					{/* Playhead - draggable */}
					<div
						className="absolute top-0 bottom-0 w-0.5 bg-accent z-30 cursor-ew-resize"
						style={{
							left: `${currentTime * pixelsPerSecond}px`,
						}}
						onMouseDown={handlePlayheadDrag}
					>
						<div className="absolute -top-1 -left-2 w-4 h-4 bg-accent rounded-full cursor-ew-resize" />
						<div className="absolute top-10 left-0 text-xs bg-accent text-white px-2 py-0.5 rounded font-mono whitespace-nowrap">
							{formatTimestamp(currentTime)}
						</div>
					</div>

					{/* Video Track */}
					{(activeTab === "video" || activeTab === "captions") && (
						<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
							<div
								className="h-20 bg-dark/5 border-b border-dark/10 relative timeline-clickable"
								onClick={handleTimelineClick}
							>
								<div className="absolute left-2 top-2 text-xs text-dark/60 font-medium flex items-center gap-1 z-20 bg-cream px-2 py-1 rounded">
									<FiVideo size={12} />
									<span>Video Track</span>
								</div>

								<SortableContext items={videoClips.map((c) => c.id)}>
									{videoClips.map((clip) => (
										<ClipItem
											key={clip.id}
											clip={clip}
											pixelsPerSecond={pixelsPerSecond}
											onDelete={() => removeVideoClip(clip.id)}
										/>
									))}
								</SortableContext>
							</div>
						</DndContext>
					)}

					{/* Audio Track */}
					{(activeTab === "audio" || activeTab === "video") && (
						<div
							className="h-20 bg-dark/5 border-b border-dark/10 relative timeline-clickable"
							onClick={handleTimelineClick}
						>
							<div className="absolute left-2 top-2 text-xs text-dark/60 font-medium flex items-center gap-1 z-20 bg-cream px-2 py-1 rounded">
								<FiMusic size={12} />
								<span>Audio Track</span>
							</div>

							{audioTracks.map((track) => (
								<div
									key={track.id}
									className="absolute top-8 h-10 bg-blue-500 rounded-md border border-blue-600 overflow-hidden cursor-move z-10 group"
									style={{
										left: `${track.position * pixelsPerSecond}px`,
										width: `${track.duration * pixelsPerSecond}px`,
									}}
								>
									<div className="px-2 py-1 text-white text-xs truncate flex items-center justify-between h-full">
										<span className="truncate flex-1">{track.file.name}</span>
										<button
											onClick={(e) => {
												e.stopPropagation();
												removeAudioTrack(track.id);
											}}
											className="ml-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-shrink-0"
										>
											×
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Captions Track */}
					{activeTab === "captions" && (
						<div
							className="h-16 bg-dark/5 border-b border-dark/10 relative timeline-clickable"
							onClick={handleTimelineClick}
						>
							<div className="absolute left-2 top-2 text-xs text-dark/60 font-medium flex items-center gap-1 z-20 bg-cream px-2 py-1 rounded">
								<FiMessageSquare size={12} />
								<span>Captions Track</span>
							</div>

							{captions.map((caption) => (
								<div
									key={caption.id}
									className="absolute top-8 h-6 bg-purple-500 rounded border border-purple-600 overflow-hidden cursor-pointer z-10"
									style={{
										left: `${caption.startTime * pixelsPerSecond}px`,
										width: `${(caption.endTime - caption.startTime) * pixelsPerSecond}px`,
									}}
								>
									<div className="px-2 text-white text-[10px] truncate">
										{caption.text}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
