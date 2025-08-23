import { promises } from "dns";
import logger from "../config/loggingConfig";
import { TradeModeEnum, TradeTypeEnum, TransactionStatus } from "../models/enum/transaction";
import Transaction from "../models/Transaction";
import User from "../models/User";
import { ITransaction } from "../types";

export const getTransaction = async (paymentId: string): Promise<ITransaction | null> => {
  try {
    const transaction = await Transaction.findOne({ payment_id: paymentId }).lean().exec();
    if (!transaction) {
      logger.warn("Transaction not found for payment ID: ", paymentId);
      return null;
    }
    return transaction;
  } catch (error: any) {
    logger.error("Error fetching transaction for payment ID: ", paymentId, error);
    throw new Error(`Error fetching transaction: ${error.message}`);
  }
}

type CreateTransactionParams = {
  sender_uid: string, 
  memo: string, 
  amount: string,   
  trade_type: TradeTypeEnum | TradeTypeEnum.Express,
  trade_mode: TradeModeEnum | TradeModeEnum.Sell,
  payment_id?: string,
  payment_method?: string,
  wallet_address?: string 
}
export const createTransaction = async (transactionData: CreateTransactionParams): Promise<ITransaction | null> => {
  try {
    const sender = await User.findOne({ uid: transactionData.sender_uid }).lean().exec();

    if (!sender){
      logger.warn("Failed to find sender with uid: ", transactionData.sender_uid)
      throw new Error(`Error finding sender with uid: ${transactionData.sender_uid}`);
    }

    const newTransaction = new Transaction({
      ...transactionData,
      sender_id: sender._id
    }) 
    
    const transaction = await newTransaction.save()

    return transaction || null

  } catch (error:any) {
    throw new Error(`Error creating transaction for uid: ${error}`);
  }
}

export const updateTransaction = async (paymentId: string, updateData: Partial<ITransaction>): Promise<ITransaction | null> => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { payment_id: paymentId },
      updateData,
      { new: true, runValidators: true }
    ).lean().exec();

    if (!updatedTransaction) {
      logger.warn("Transaction not found for payment ID: ", paymentId);
      return null;
    }

    logger.info("Transaction updated successfully for payment ID: ", paymentId);
    return updatedTransaction;
  } catch (error: any) {
    logger.error("Error updating transaction for payment ID: ", paymentId, error);
    throw new Error(`Error updating transaction: ${error.message}`);
  }
}