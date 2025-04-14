"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getCash;
const balanceStore_1 = require("../utils/balanceStore");
function getCash(socket, email, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield prisma.user.findFirst({
                where: {
                    email: email
                }
            });
            const balance = (user === null || user === void 0 ? void 0 : user.balance) || 0;
            const name = user === null || user === void 0 ? void 0 : user.name;
            (0, balanceStore_1.setBalance)(email, balance);
            socket.emit("cash", {
                name: name,
                balance: balance
            });
        }
        catch (error) {
            console.log(error);
            socket.emit("error", error);
        }
    });
}
