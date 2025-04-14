"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CashProvider, useCash } from "../context/CashContext";


export default function Cash() {

    const {cash} = useCash()
      return <div className="text-md text-white ">
        {cash.toFixed(2)}
      </div>
}