import { CustomSettings } from "main";
import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import * as ReactDOM from "react-dom";
import React from "react";
import { ListView } from "./ListView";
import { createRoot } from "react-dom/client";

export const ReviewDailyNotesViewType = "Review Daily Notes";

export class ReviewDailyNotesView extends ItemView {
	settings: CustomSettings;

	constructor(leaf: WorkspaceLeaf, settings: CustomSettings) {
		super(leaf);
		this.settings = settings;
	}

	public getViewType(): string {
		return "Review Daily Notes";
	}

	public getDisplayText(): string {
		return ReviewDailyNotesViewType;
	}

	public getIcon(): string {
		return "calendar-with-checkmark";
	}

	public loadDailyNotes(): TFile[] {
		const { dailyNotesFolder } = this.settings;
		const files = this.app.vault.getFiles();
		return files
			.filter(
				(file) =>
					file.path.startsWith(dailyNotesFolder) &&
					file.path.endsWith(".md")
			)
			.sort((a, b) => {
				const aDate = new Date(
					a.path.substring(dailyNotesFolder.length + 1)
				);
				const bDate = new Date(
					b.path.substring(dailyNotesFolder.length + 1)
				);
				return aDate.getTime() - bDate.getTime();
			});
	}

	async onOpen() {
		const root = createRoot(this.containerEl.children[1]);
		root.render(
			<React.StrictMode>
				<ListView files={this.loadDailyNotes()} />
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
