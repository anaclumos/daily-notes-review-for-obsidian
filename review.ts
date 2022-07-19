import { CustomSettings } from "main";
import {
	Editor,
	ItemView,
	MarkdownView,
	Notice,
	TFile,
	WorkspaceLeaf,
} from "obsidian";

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

	public load(): void {
		super.load();
		this.draw();
	}

	public loadDailyNotes(): TFile[] {
		const { dailyNotesFolder } = this.settings;
		const files = this.app.vault.getFiles();
		const dailyNotes = files.filter(
			(file) =>
				file.path.startsWith(dailyNotesFolder) &&
				file.path.endsWith(".md")
		);
		dailyNotes.sort((a, b) => {
			const aDate = new Date(
				a.path.substring(dailyNotesFolder.length + 1)
			);
			const bDate = new Date(
				b.path.substring(dailyNotesFolder.length + 1)
			);
			return aDate.getTime() - bDate.getTime();
		});
		return dailyNotes;
	}

	private readonly draw = (): void => {
		const container = this.containerEl.children[1];
		const rootEl = document.createElement("div");
		const navHeader = rootEl.createDiv({ cls: "nav-header" });
		navHeader.createDiv({ cls: "nav-header-title" }).textContent =
			"Review Daily Notes";
		const dailyNotes = this.loadDailyNotes();
		const dailyNotesEl = rootEl.createDiv({ cls: "daily-notes" });
		dailyNotes.forEach((file) => {
			// create text element for each daily note
			const textEl = dailyNotesEl.createDiv({ cls: "daily-note" });
			textEl.createDiv({ cls: "daily-note-title" }).textContent =
				file.path.substring(this.settings.dailyNotesFolder.length + 1);
		});
		container.appendChild(rootEl);
	};
}
