"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useEditorStore } from "@/lib/stores/editorStore";

interface AspectRatioModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3";
type CropMode = "crop" | "blur";

const aspectRatios: Record<AspectRatio, { width: number; height: number; label: string }> = {
	"16:9": { width: 1920, height: 1080, label: "Landscape (YouTube, TV)" },
	"9:16": { width: 1080, height: 1920, label: "Vertical (TikTok, Shorts)" },
	"1:1": { width: 1080, height: 1080, label: "Square (Instagram)" },
	"4:3": { width: 1440, height: 1080, label: "Classic (Old TV)" },
};

const isPresetRatio = (ratio: string): ratio is AspectRatio =>
	Object.prototype.hasOwnProperty.call(aspectRatios, ratio);

export function AspectRatioModal({ isOpen, onClose }: AspectRatioModalProps) {
	const { aspectRatio, setAspectRatio } = useEditorStore();
	const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("16:9");
	const [cropMode, setCropMode] = useState<CropMode>("crop");

	if (!isOpen) return null;

	useEffect(() => {
		if (!isOpen) return;

		const currentRatio = isPresetRatio(aspectRatio) ? aspectRatio : "16:9";
		setSelectedRatio(currentRatio);
	}, [aspectRatio, isOpen]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const handleApply = () => {
		setAspectRatio(selectedRatio);
		onClose();
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<div className="bg-cream rounded-xl max-w-2xl w-full shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-dark/10">
					<h2 className="text-2xl font-bold text-dark">Aspect Ratio</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-dark/5 rounded-lg transition-colors"
					>
						<FiX size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Aspect Ratio Selection */}
					<div>
						<label className="block text-sm font-medium text-dark mb-3">
							Select Aspect Ratio
						</label>
						<div className="grid grid-cols-2 gap-3">
							{(Object.keys(aspectRatios) as AspectRatio[]).map((ratio) => (
								<button
									key={ratio}
									onClick={() => setSelectedRatio(ratio)}
									className={`p-4 rounded-lg border-2 transition-all text-left ${
										selectedRatio === ratio
											? "border-accent bg-accent/10"
											: "border-dark/20 hover:border-dark/40"
									}`}
								>
									<div className="font-bold text-lg text-dark">{ratio}</div>
									<div className="text-sm text-dark/60 mt-1">
										{aspectRatios[ratio].label}
									</div>
									<div className="text-xs text-dark/40 mt-1">
										{aspectRatios[ratio].width} × {aspectRatios[ratio].height}
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Crop Mode */}
					<div>
						<label className="block text-sm font-medium text-dark mb-3">
							Conversion Mode
						</label>
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={() => setCropMode("crop")}
								className={`p-4 rounded-lg border-2 transition-all ${
									cropMode === "crop"
										? "border-accent bg-accent/10"
										: "border-dark/20 hover:border-dark/40"
								}`}
							>
								<div className="font-medium text-dark">Smart Crop</div>
								<div className="text-xs text-dark/60 mt-1">
									Zoom to fill frame (may crop edges)
								</div>
							</button>
							<button
								onClick={() => setCropMode("blur")}
								className={`p-4 rounded-lg border-2 transition-all ${
									cropMode === "blur"
										? "border-accent bg-accent/10"
										: "border-dark/20 hover:border-dark/40"
								}`}
							>
								<div className="font-medium text-dark">Blurred Background</div>
								<div className="text-xs text-dark/60 mt-1">
									Video centered with blurred fill
								</div>
							</button>
						</div>
					</div>

					{/* Preview Visual */}
					<div className="bg-dark/5 rounded-lg p-8 flex items-center justify-center">
						<div className="text-center">
							<div
								className="mx-auto bg-accent/20 border-2 border-accent rounded-lg flex items-center justify-center"
								style={{
									width: selectedRatio === "9:16" ? "90px" : "160px",
									height: selectedRatio === "9:16" ? "160px" : "90px",
								}}
							>
								<div className="text-accent font-bold">{selectedRatio}</div>
							</div>
							<div className="mt-4 text-sm text-dark/60">
								{cropMode === "crop" ? "Smart Crop Mode" : "Blurred Background Mode"}
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 p-6 border-t border-dark/10">
					<button
						onClick={onClose}
						className="px-6 py-2 text-dark hover:bg-dark/5 rounded-lg transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleApply}
						className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
}
