import { VideoEditor } from "@/components/editor/VideoEditor";

export default function ExperiencePage({
	params,
}: {
	params: { experienceId: string };
}) {
	return (
		<div className="h-screen w-full bg-cream overflow-hidden flex flex-col">
			<VideoEditor />
		</div>
	);
}
