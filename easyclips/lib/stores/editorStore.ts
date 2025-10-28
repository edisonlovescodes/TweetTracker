import { create } from "zustand";

export interface VideoClip {
	id: string;
	file: File;
	url: string;
	duration: number;
	startTime: number;
	endTime: number;
	track: number;
	position: number; // Position in timeline (seconds)
}

export interface AudioTrack {
	id: string;
	file: File;
	url: string;
	duration: number;
	volume: number;
	position: number;
	track: number;
}

export interface Caption {
	id: string;
	text: string;
	startTime: number;
	endTime: number;
	style: "default" | "bold" | "minimal";
	position: "top" | "center" | "bottom";
	color: string;
	fontSize: number;
}

export interface EditorState {
	// Video clips
	videoClips: VideoClip[];
	addVideoClip: (clip: VideoClip) => void;
	removeVideoClip: (id: string) => void;
	updateVideoClip: (id: string, updates: Partial<VideoClip>) => void;

	// Audio tracks
	audioTracks: AudioTrack[];
	addAudioTrack: (track: AudioTrack) => void;
	removeAudioTrack: (id: string) => void;
	updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void;

	// Captions
	captions: Caption[];
	addCaption: (caption: Caption) => void;
	removeCaption: (id: string) => void;
	updateCaption: (id: string, updates: Partial<Caption>) => void;

	// Playback
	currentTime: number;
	isPlaying: boolean;
	setCurrentTime: (time: number) => void;
	setIsPlaying: (playing: boolean) => void;

	// Canvas
	canvasWidth: number;
	canvasHeight: number;
	aspectRatio: "16:9" | "9:16" | "1:1" | "4:3" | "custom";
	setAspectRatio: (ratio: "16:9" | "9:16" | "1:1" | "4:3" | "custom") => void;
	setCanvasDimensions: (width: number, height: number) => void;

	// Export
	isExporting: boolean;
	exportProgress: number;
	setIsExporting: (exporting: boolean) => void;
	setExportProgress: (progress: number) => void;

	// Reset
	reset: () => void;
}

const initialState = {
	videoClips: [],
	audioTracks: [],
	captions: [],
	currentTime: 0,
	isPlaying: false,
	canvasWidth: 1920,
	canvasHeight: 1080,
	aspectRatio: "16:9" as const,
	isExporting: false,
	exportProgress: 0,
};

export const useEditorStore = create<EditorState>((set) => ({
	...initialState,

	// Video clips
	addVideoClip: (clip) =>
		set((state) => ({ videoClips: [...state.videoClips, clip] })),
	removeVideoClip: (id) =>
		set((state) => ({
			videoClips: state.videoClips.filter((c) => c.id !== id),
		})),
	updateVideoClip: (id, updates) =>
		set((state) => ({
			videoClips: state.videoClips.map((c) =>
				c.id === id ? { ...c, ...updates } : c
			),
		})),

	// Audio tracks
	addAudioTrack: (track) =>
		set((state) => ({ audioTracks: [...state.audioTracks, track] })),
	removeAudioTrack: (id) =>
		set((state) => ({
			audioTracks: state.audioTracks.filter((t) => t.id !== id),
		})),
	updateAudioTrack: (id, updates) =>
		set((state) => ({
			audioTracks: state.audioTracks.map((t) =>
				t.id === id ? { ...t, ...updates } : t
			),
		})),

	// Captions
	addCaption: (caption) =>
		set((state) => ({ captions: [...state.captions, caption] })),
	removeCaption: (id) =>
		set((state) => ({
			captions: state.captions.filter((c) => c.id !== id),
		})),
	updateCaption: (id, updates) =>
		set((state) => ({
			captions: state.captions.map((c) =>
				c.id === id ? { ...c, ...updates } : c
			),
		})),

	// Playback
	setCurrentTime: (time) => set({ currentTime: time }),
	setIsPlaying: (playing) => set({ isPlaying: playing }),

	// Canvas
	setAspectRatio: (ratio) => {
		const dimensions: Record<string, { width: number; height: number }> = {
			"16:9": { width: 1920, height: 1080 },
			"9:16": { width: 1080, height: 1920 },
			"1:1": { width: 1080, height: 1080 },
			"4:3": { width: 1440, height: 1080 },
			custom: { width: 1920, height: 1080 },
		};
		set({
			aspectRatio: ratio,
			...dimensions[ratio],
		});
	},
	setCanvasDimensions: (width, height) =>
		set({ canvasWidth: width, canvasHeight: height }),

	// Export
	setIsExporting: (exporting) => set({ isExporting: exporting }),
	setExportProgress: (progress) => set({ exportProgress: progress }),

	// Reset
	reset: () => set(initialState),
}));
