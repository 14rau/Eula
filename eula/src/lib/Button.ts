import { ButtonInteraction, MessageButton } from "discord.js";

export class ButtonManager {
    private map = new Map<string, {
        fn: (btn: MessageButton, interaction: ButtonInteraction) => void,
        userId: string;
    }>();

    public decorate(button: MessageButton, handler: (btn: MessageButton, interaction: ButtonInteraction) => void, userId?: string): MessageButton {
       this.map.set(button.customId, {fn: handler, userId });
       setTimeout(() => this.map.delete(button.customId), 10000*6*30);
       return button;
    }

    public handle(button: MessageButton, interaction: ButtonInteraction) {
        const obj = this.map.get(button.customId);
        if(obj && (interaction.user.id === obj.userId || !obj.userId)) {
            obj.fn(button, interaction);
        }
    }
}

export const buttonManager = new ButtonManager();