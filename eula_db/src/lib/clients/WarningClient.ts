import { Warning } from "../../entity/Warning";
import { EulaDb } from "../EulaDb";
import { Brackets } from "typeorm";

interface WarningOptions {
    isGenerated?: boolean;
    validTill?: string;
    reason: string;
}

export class WarningClient {
    constructor(private eulaDb: EulaDb) {

    }

    public async createWarning(userId: string, warnerUserId: string, guildId: string, options: WarningOptions) {
        let warning = new Warning();
        warning.warnedUserId = userId;
        warning.guildId = guildId;
        warning.isGenerated = options.isGenerated;
        warning.reason = options.reason;
        warning.validTill = options.validTill;
        warning.warnerUserId = warnerUserId;
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        await warningRepo.save(warning);
        const query = warningRepo.createQueryBuilder("warning")
            .where("warnedUserId = :user AND dateDeleted IS NULL", { user: userId })
            .andWhere(new Brackets((e) =>
                e.where("validTill IS NULL")
                .orWhere("validTill > NOW()"))
            );
        return {
            warning,
            warnings: await query.getMany()

        }
    }

    public async getWarning(userId: string, guildId: string): Promise<Warning[]> {
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        const query = warningRepo.createQueryBuilder("warning")
            .where("warnedUserId = :user AND dateDeleted IS NULL AND guildId = :guild", { user: userId, guild: guildId })
            .andWhere(new Brackets((e) =>
                e.where("validTill IS NULL")
                .orWhere("validTill > NOW()"))
            );
        return await query.getMany();
    }

    public async invalidateWarning(userId: string, guildId: string, warningId: number) {
        // ensure validity of this deletion
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        await warningRepo.update({ id: warningId, guildId, warnedUserId: userId }, { dateDeleted: new Date().toISOString() })
    }

    public async clearWarnings(userId: string, guildId: string) {
        // ensure validity of this deletion
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        await warningRepo.update({ guildId, warnedUserId: userId }, { dateDeleted: new Date().toISOString() })
    }
}