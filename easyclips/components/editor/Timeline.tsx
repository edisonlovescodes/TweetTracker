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
import { FiVideo, FiMusic, FiMessageSquare, FiMaximize2 } from "react-icons/fi";
import { useEditorStore } from "@/lib/stores/editorStore";
import { ClipItem } from "./ClipItem";
import { AspectRatioModal } from "../features/AspectRatioModal";

export function Timeline() {
	const timelineRef = useRef<HTMLDivElement>(null);
	const [showAspectRatioModal, setShowAspectRatioModal] = useState(false);
	const {
		videoClips,
		audioTracks,
		currentTime,
		setCurrentTime,
		removeVideoClip,
		updateVideoClip,
	} = useEditorStore();

	const totalDuration = Math.max(
		10,
		videoClips.reduce(
			(max, clip) => Math.max(max, clip.position + (clip.endTime - clip.startTime)),
			0
		)
	);

	const pixelsPerSecond = 50;
	const timelineWidth = totalDuration * pixelsPerSecond;

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
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const time = (x / timelineWidth) * totalDuration;
		setCurrentTime(Math.max(0, Math.min(time, totalDuration)));
	};

	return (
		<div className="h-full bg-cream flex flex-col">
			{/* Timeline Header */}
			<div className="px-4 py-2 border-b border-dark/10 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button className="px-3 py-1 text-sm bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors flex items-center gap-2">
						<FiVideo size={14} />
						<span>Video</span>
					</button>
					<button className="px-3 py-1 text-sm text-dark/60 rounded-md hover:bg-dark/5 transition-colors flex items-center gap-2">
						<FiMusic size={14} />
						<span>Audio</span>
					</button>
					<button className="px-3 py-1 text-sm text-dark/60 rounded-md hover:bg-dark/5 transition-colors flex items-center gap-2">
						<FiMessageSquare size={14} />
						<span>Captions</span>
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

			<AspectRatioModal
				isOpen={showAspectRatioModal}
				onClose={() => setShowAspectRatioModal(false)}
			/>

			{/* Timeline Ruler and Tracks */}
			<div className="flex-1 overflow-x-auto overflow-y-auto">
				<div
					className="relative min-w-full"
					style={{ width: `${timelineWidth}px` }}
				>
					{/* Time Ruler */}
					<div className="h-8 bg-dark/5 border-b border-dark/10 relative">
						{Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => (
							<div
								key={i}
								className="absolute top-0 h-full border-l border-dark/20"
								style={{ left: `${i * pixelsPerSecond}px` }}
							>
								<span className="text-xs text-dark/60 ml-1">{i}s</span>
							</div>
						))}
					</div>

					{/* Playhead */}
					<div
						className="absolute top-0 bottom-0 w-0.5 bg-accent z-30 pointer-events-none"
						style={{
							left: `${(currentTime / totalDuration) * timelineWidth}px`,
						}}
					>
						<div className="absolute -top-1 -left-2 w-4 h-4 bg-accent rounded-full" />
					</div>

					{/* Video Track */}
					<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
						<div
							className="h-16 bg-dark/5 border-b border-dark/10 relative cursor-pointer"
							onClick={handleTimelineClick}
						>
							<div className="absolute left-2 top-2 text-xs text-dark/60 font-medium flex items-center gap-1 z-20">
								<FiVideo size={12} />
								<span>Video 1</span>
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

					{/* Audio Track */}
					<div
						className="h-16 bg-dark/5 border-b border-dark/10 relative"
						onClick={handleTimelineClick}
					>
						<div className="absolute left-2 top-2 text-xs text-dark/60 font-medium flex items-center gap-1 z-20">
							<FiMusic size={12} />
							<span>Audio 1</span>
						</div>

						{audioTracks.map((track) => (
							<div
								key={track.id}
								className="absolute top-6 h-8 bg-blue-500 rounded-md border border-blue-600 overflow-hidden cursor-move z-10"
								style={{
									left: `${track.position * pixelsPerSecond}px`,
									width: `${track.duration * pixelsPerSecond}px`,
								}}
							>
								<div className="px-2 py-1 text-white text-xs truncate">
									{track.file.name}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
