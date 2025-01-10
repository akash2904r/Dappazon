import { ethers } from "ethers";

export const parseETH = (cost) => ethers.utils.formatUnits(cost.toString(), "ether");

export const deliveryDate = (date) => new Date(date + 345600000)
    .toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });

export const orderDate = (date) => new Date(Number(date + '000'))
    .toLocaleDateString(undefined, { 
        weekday: 'long', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric' 
    });