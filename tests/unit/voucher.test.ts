import { Voucher } from "@prisma/client"
import { assert } from "console"
import prisma from "../../src/config/database"
import voucherRepository from "../../src/repositories/voucherRepository"
import voucherService from "../../src/services/voucherService"
import { conflictError } from "../../src/utils/errorUtils"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE vouchers`
})

describe("BEHOLD the voucher tests", () => {
    it("voucher creation test", async () => {
        const code = "LeleDen4";
        const discount = 20;

        await voucherService.createVoucher(code, discount);
        const voucherByCode = await voucherRepository.getVoucherByCode(code);

        expect(voucherByCode).not.toBeUndefined()
    })

    it("repeated voucher creation test", async () => {
        const discount = 20;
        const code = "Codigooooooooooooo";

        jest.spyOn(voucherRepository, "getVoucherByCode")
            .mockResolvedValueOnce({
                id: 1,
                discount: discount,
                code: code,
                used: false
            })

        try {
            const result = await voucherService.createVoucher(code, discount);
        } catch (error) {
            expect(error).toEqual(conflictError('Voucher already exist.'))
        }
    })

})

afterAll(async () => {
    await prisma.$disconnect();
})