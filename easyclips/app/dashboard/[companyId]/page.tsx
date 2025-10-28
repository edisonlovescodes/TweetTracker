import { VideoEditor } from "@/components/editor/VideoEditor";

export default function DashboardPage({
	params,
}: {
	params: { companyId: string };
}) {
	return (
		<div className="h-screen w-full bg-cream overflow-hidden flex flex-col">
			<VideoEditor />
		</div>
	);
}
