"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = getBalance;
exports.setBalance = setBalance;
exports.updateBalance = updateBalance;
const balanceStore = {};
function getBalance(email) {
    var _a;
    return (_a = balanceStore[email]) !== null && _a !== void 0 ? _a : 0;
}
function setBalance(email, balance) {
    balanceStore[email] = balance;
}
function updateBalance(email, newBalance) {
    if (balanceStore[email] !== undefined) {
        balanceStore[email] += newBalance;
    }
    else {
        balanceStore[email] = newBalance;
    }
}
exports.default = balanceStore;
