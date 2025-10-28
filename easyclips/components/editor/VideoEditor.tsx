"use client";

import { useState } from "react";
import { Toolbar } from "./Toolbar";
import { Canvas } from "./Canvas";
import { Timeline } from "./Timeline";
import { Footer } from "../ui/Footer";

export function VideoEditor() {
	return (
		<div className="h-full w-full flex flex-col">
			{/* Header/Toolbar */}
			<Toolbar />

			{/* Main content area with canvas */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<Canvas />
			</div>

			{/* Timeline */}
			<div className="h-48 border-t border-dark/10">
				<Timeline />
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
