﻿# cryptochainProject

To run settlement, you must run "npm run dev-settlement", and on a new console window, run "npm run dev".  This is for linux. Sahil knows the procedure for Windows.

## What's New: 
This branch separates "Conduct Transaction" into write a cheque, and deposit a cheque, and adds a view bank wallets page.  
Many files are changed including package.json and index.js. The wallet calculations are untouched but transaction now has a new input: deposInstNum which is the institution number of the bank a customer is depositing a cheque. This was necessary for settlement.  
The settlement server initially writes a transaction to each institution number detailing its current balance by looking at the institution number of who WROTE the cheque and who DEPOSITED the cheque. It will repeatedly calculate and make transactions every specified number of time. This is in index.js.

## Issues:
Writing and depositing a cheque uses POST and GET cheques/ respectively but for some reason the API lets you deposit any cheque. This should be investigated in the client/src/component/depositCheque file.  It just checks accountNumber I believe?
