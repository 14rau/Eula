import { Warning } from "../../entity/Warning";
import { EulaDb } from "../EulaDb";
import { EventEmitter } from "events";
import { Brackets, IsNull, Raw } from "typeorm";

interface WarningOptions {
    isGenerated?: boolean;
    validTill?: string;
    reason: string;
}

export class WarningClient {
    constructor(private eulaDb: EulaDb) {

    }

    public async createWarning(userId: string, guildId: string, options: WarningOptions) {
        let warning = new Warning();
        const encrypted = this.eulaDb.encryptUserId(guildId, userId);
        warning.warnedUserId = encrypted;
        warning.guildId = guildId;
        warning.isGenerated = options.isGenerated;
        warning.reason = options.reason;
        warning.validTill = options.validTill;
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        await warningRepo.save(warning);
        const query = warningRepo.createQueryBuilder("warning")
            .where("warnedUserId = :user AND dateDeleted IS NULL", { user: encrypted })
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
        const encrypted = this.eulaDb.encryptUserId(guildId, userId);
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        const query = warningRepo.createQueryBuilder("warning")
            .where("warnedUserId = :user AND dateDeleted IS NULL", { user: encrypted })
            .andWhere(new Brackets((e) =>
                e.where("validTill IS NULL")
                .orWhere("validTill > NOW()"))
            );
        return await query.getMany();
    }

    public async invalidateWarning(userId: string, guildId: string, warningId: number) {
        // ensure validity of this deletion
        const encrypted = this.eulaDb.encryptUserId(guildId, userId);
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        await warningRepo.update({ id: warningId, guildId, warnedUserId: encrypted }, { dateDeleted: new Date().toISOString() })
    }

    public async clearWarnings(userId: string, guildId: string) {
        // ensure validity of this deletion
        const encrypted = this.eulaDb.encryptUserId(guildId, userId);
        const warningRepo = this.eulaDb.connection.getRepository(Warning);
        await warningRepo.update({ guildId, warnedUserId: encrypted }, { dateDeleted: new Date().toISOString() })
    }
}