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
exports.default = placeBet;
const balanceStore_1 = require("../utils/balanceStore");
function profitCalculater(betValue, multiplier) {
    if (multiplier == "low") {
        return betValue * 1.2;
    }
    else if (multiplier == "medium") {
        return betValue * 1.7;
    }
    else {
        return betValue * 2.3;
    }
}
function placeBet(socket, email, prisma, multiplier, selected, betValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const balance = (0, balanceStore_1.getBalance)(email);
        if (balance < betValue) {
            socket.emit("insufficient_balance", "low balance please add money ");
            return;
        }
        yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                balance: { decrement: betValue }
            }
        });
        (0, balanceStore_1.setBalance)(email, balance - betValue);
        const dice = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let weights = [];
        if (selected == "low") {
            switch (multiplier) {
                case "low":
                    weights = [25, 25, 20, 20, 15, 15, 10, 10, 5, 5, 3, 2];
                    break;
                case "medium":
                    weights = [18, 18, 14, 14, 10, 10, 8, 8, 12, 12, 8, 8];
                    break;
                case "high":
                    weights = [10, 10, 8, 8, 5, 5, 15, 15, 20, 20, 25, 25];
                    break;
                default:
                    break;
            }
        }
        else {
            switch (multiplier) {
                case "low":
                    weights = [2, 3, 5, 5, 10, 10, 15, 15, 20, 20, 25, 25];
                    break;
                case "medium":
                    weights = [8, 8, 12, 12, 8, 8, 10, 10, 14, 14, 18, 18];
                    break;
                case "high":
                    weights = [25, 25, 20, 20, 15, 15, 5, 5, 8, 8, 10, 10];
                    break;
                default:
                    break;
            }
        }
        let totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let totalSum = 0;
        let win = -1;
        for (let i = 0; i < weights.length; i++) {
            totalSum += weights[i];
            if (totalSum >= random) {
                win = i + 1;
                break;
            }
        }
        // console.log("win = " + win + "totalsum "+  totalSum + "random = " + random) ;
        console.log(selected + " ");
        if (win < 6 && selected == "low") {
            const profit = profitCalculater(betValue, multiplier);
            try {
                const updatedData = yield prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        balance: { increment: profit }
                    }
                });
                (0, balanceStore_1.setBalance)(email, updatedData.balance);
                socket.emit("result", {
                    result: "user wins ",
                    win: win,
                    code: "200"
                });
                socket.emit("updateCash", {
                    cash: (0, balanceStore_1.getBalance)(email)
                });
                return;
            }
            catch (error) {
                socket.emit("error", error);
                return;
            }
        }
        else if (win > 6 && selected == "high") {
            const profit = profitCalculater(betValue, multiplier);
            try {
                const updatedData = yield prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        balance: { increment: profit }
                    }
                });
                (0, balanceStore_1.setBalance)(email, updatedData.balance);
                socket.emit("result", {
                    result: "user wins ",
                    win: win,
                    code: "200"
                });
                socket.emit("updateCash", {
                    cash: (0, balanceStore_1.getBalance)(email)
                });
                return;
            }
            catch (error) {
                socket.emit("error", error);
                return;
            }
        }
        else {
            socket.emit("result", {
                result: "user lost  ",
                win: win,
                code: "400"
            });
            socket.emit("updateCash", {
                cash: (0, balanceStore_1.getBalance)(email)
            });
            return;
        }
    });
}
