"use client";

import { VideoEditor } from "@/components/editor/VideoEditor";

export default function Page() {
	return (
		<div className="h-screen w-full bg-cream overflow-hidden flex flex-col">
			<VideoEditor />
		</div>
	);
}
