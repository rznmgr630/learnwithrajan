export interface PromptItem {
  id: number;
  category: string;
  title: string;
  driveImageId?: string;
  imageAlt?: string;
  prompt: string;
}

export interface SlashCommand {
  cmd: string;
  desc: string;
}

export interface SlashCategory {
  title: string;
  commands: SlashCommand[];
}
