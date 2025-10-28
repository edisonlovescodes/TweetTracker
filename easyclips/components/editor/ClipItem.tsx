"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiX } from "react-icons/fi";
import type { VideoClip } from "@/lib/stores/editorStore";

interface ClipItemProps {
	clip: VideoClip;
	pixelsPerSecond: number;
	onDelete: () => void;
}

export function ClipItem({ clip, pixelsPerSecond, onDelete }: ClipItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: clip.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		left: `${clip.position * pixelsPerSecond}px`,
		width: `${(clip.endTime - clip.startTime) * pixelsPerSecond}px`,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`absolute top-6 h-8 bg-accent rounded-md border border-accent/50 overflow-hidden group cursor-move select-none ${
				isDragging ? "opacity-50 z-50" : "z-10"
			}`}
			{...attributes}
			{...listeners}
		>
			<div className="px-2 py-1 text-white text-xs truncate flex items-center justify-between h-full">
				<span className="truncate flex-1">{clip.file.name}</span>

				{/* Delete button */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					className="ml-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-shrink-0"
				>
					<FiX size={14} />
				</button>
			</div>

			{/* Trim handles */}
			<div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />
			<div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />
		</div>
	);
}
