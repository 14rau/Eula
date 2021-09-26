import { WarningClient } from "../clients/WarningClient";
import { EulaDb } from "../EulaDb";
import { sortBy } from "lodash";
import ExcelJS = require('exceljs');

interface RunOptions {
    includeExpired?: boolean;
}


export class WarningExport {

    constructor(private db: EulaDb) {

    }

    public async run(guildId: string, options?: RunOptions) {
        const client = new WarningClient(this.db);
        const allWarnings = await client.getWarnings(guildId, options);
        sortBy(allWarnings, (e) => e.warnedUserId);

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "System";
        workbook.lastModifiedBy = "System";

        const sheet = workbook.addWorksheet("Warnings");
        sheet.columns = [
            { header: "UserID", key: "warnedUserId" },
            { header: "Reason", key: "reason", width: 400 },
            { header: "Valid Until", key: "validTill" },
        ];
        sheet.addRows(allWarnings.map(warning => ([ warning.warnedUserId, warning.reason, warning.validTill ])));

        const buffer = await workbook.xlsx.writeBuffer({ filename: `Warnings-Export-${guildId}.xlsx` });

        return buffer;
    }
}