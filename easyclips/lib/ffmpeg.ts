import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;

// Helper to convert FFmpeg output to Blob
function toBlob(data: any): Blob {
	return new Blob([new Uint8Array(data)], { type: "video/mp4" });
}

export async function loadFFmpeg(
	onProgress?: (progress: number) => void
): Promise<FFmpeg> {
	if (ffmpegInstance) {
		return ffmpegInstance;
	}

	const ffmpeg = new FFmpeg();

	// Set up progress logging
	ffmpeg.on("log", ({ message }) => {
		console.log("[FFmpeg]", message);
	});

	ffmpeg.on("progress", ({ progress }) => {
		if (onProgress) {
			onProgress(Math.round(progress * 100));
		}
	});

	// Load FFmpeg from CDN
	const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

	await ffmpeg.load({
		coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
		wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
	});

	ffmpegInstance = ffmpeg;
	return ffmpeg;
}

export async function exportVideo(
	videoFiles: { file: File; startTime: number; endTime: number; position: number }[],
	audioFiles: { file: File; position: number }[],
	width: number,
	height: number,
	quality: "1080p" | "720p" | "480p" = "1080p",
	onProgress?: (progress: number) => void
): Promise<Blob> {
	const ffmpeg = await loadFFmpeg(onProgress);

	// Determine output dimensions based on quality
	const qualityMap = {
		"1080p": { width: 1920, height: 1080, bitrate: "5000k" },
		"720p": { width: 1280, height: 720, bitrate: "2500k" },
		"480p": { width: 854, height: 480, bitrate: "1000k" },
	};

	const { bitrate } = qualityMap[quality];

	// Write video files
	for (let i = 0; i < videoFiles.length; i++) {
		const { file } = videoFiles[i];
		const data = await file.arrayBuffer();
		await ffmpeg.writeFile(`video${i}.mp4`, new Uint8Array(data));
	}

	// For simple case (single video), just encode
	if (videoFiles.length === 1 && audioFiles.length === 0) {
		const { startTime, endTime } = videoFiles[0];
		const duration = endTime - startTime;

		await ffmpeg.exec([
			"-i",
			"video0.mp4",
			"-ss",
			startTime.toString(),
			"-t",
			duration.toString(),
			"-vf",
			`scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
			"-b:v",
			bitrate,
			"-c:a",
			"aac",
			"-b:a",
			"128k",
			"output.mp4",
		]);
	} else {
		// Complex case: merge multiple videos/audio
		const concatContent = videoFiles
			.map((_, i) => `file 'video${i}.mp4'`)
			.join("\n");
		await ffmpeg.writeFile(
			"concat.txt",
			new TextEncoder().encode(concatContent)
		);

		await ffmpeg.exec([
			"-f",
			"concat",
			"-safe",
			"0",
			"-i",
			"concat.txt",
			"-vf",
			`scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
			"-b:v",
			bitrate,
			"-c:a",
			"aac",
			"-b:a",
			"128k",
			"output.mp4",
		]);

		await ffmpeg.deleteFile("concat.txt");
	}

	// Read output
	const outputData = await ffmpeg.readFile("output.mp4");
	const blob = toBlob(outputData);

	// Cleanup
	for (let i = 0; i < videoFiles.length; i++) {
		await ffmpeg.deleteFile(`video${i}.mp4`);
	}
	await ffmpeg.deleteFile("output.mp4");

	return blob;
}
