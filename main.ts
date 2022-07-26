import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import { ReviewDailyNotesView, ReviewDailyNotesViewType } from "./src/Review";

export interface CustomSettings {
	// relative path to daily notes folder
	dailyNotesFolder: string;

	// format of the daily notes file, e.g. 'YYYY-MM-DD'
	dailyNotesFormat: string;

	// how many files to load at once?
	dailyNotesOffset: number;
}

const DEFAULT_SETTINGS: CustomSettings = {
	dailyNotesFolder: "Journals",
	dailyNotesFormat: "YYYY-MM-DD",
	dailyNotesOffset: 10,
};

export default class CustomPlugin extends Plugin {
	settings: CustomSettings;

	private reviewDailyNotesView: ReviewDailyNotesView;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.createRibbon();
		this.createCommand();
		this.registerView(
			ReviewDailyNotesViewType,
			(leaf) =>
				(this.reviewDailyNotesView = new ReviewDailyNotesView(
					leaf,
					this.settings
				))
		);
	}

	private readonly toggleReviewPageView = async (): Promise<void> => {
		const existing = this.app.workspace.getLeavesOfType(
			ReviewDailyNotesViewType
		);
		if (existing.length) {
			this.app.workspace.revealLeaf(existing[0]);
			return;
		}

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: ReviewDailyNotesViewType,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(ReviewDailyNotesViewType)[0]
		);
	};

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
	createRibbon(): HTMLElement {
		const ribbon = this.addRibbonIcon(
			"calendar-with-checkmark",
			"Review Daily Notes",
			(evt: MouseEvent) => {
				new Notice("HELLO!");
			}
		);
		ribbon.addClass("review-daily-notes-ribbon");
		return ribbon;
	}
	createCommand(): void {
		this.addCommand({
			id: "Review Daily Notes",
			name: "Review Daily Notes",
			callback: () => {
				// open the daily notes view
				this.toggleReviewPageView();
			},
		});
	}
}
