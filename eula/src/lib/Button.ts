import { MessageButton } from "discord.js";

export class ButtonManager {
    private map = new Map<string, () => void>();

    public decorate(button: MessageButton, handler: () => void): MessageButton {
       this.map.set(button.customId, handler);
       setTimeout(() => this.map.delete(button.customId), 10000*6*30);
       return button;
    }

    public handle(button: MessageButton) {
        this.map.get(button.customId)();
    }
}

export const buttonManager = new ButtonManager();