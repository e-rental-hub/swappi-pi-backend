import logger from "../config/loggingConfig";
import PaymentAccount from "../models/PaymentAccount";
import { IPaymentAccount, IUser } from "../types";

 export const getAllPaymentAccounts = async (uid: string): Promise<IPaymentAccount[]> => {
  try {
    const paymentAccounts = await PaymentAccount.find({ uid }).lean().exec();
    if (!paymentAccounts || paymentAccounts.length === 0) { 
      logger.warn("Payment account not found for uid: ", uid);
      return [];
    }
    return paymentAccounts;
  } catch (error: any) {
    logger.error("Error fetching payment account for uid: ", uid, error);
    throw new Error(`Error fetching payment account: ${error.message}`);
  }
}

export const addPaymentAccount = async (
  bankName: string,
  accountNumber: number,
  accountName: string,
  currentUser: IUser
): Promise<IPaymentAccount> => {
  try {
    const newPaymentAccount = new PaymentAccount({
       uid: currentUser.uid,
      user_id: currentUser._id,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
    });
    const savedPaymentAccount = await newPaymentAccount.save();
    logger.info("Payment account added successfully for uid: ", currentUser.uid);
    return savedPaymentAccount;
  } catch (error: any) {
    logger.error("Error adding payment account for uid: ", currentUser.uid, error);
    throw new Error(`Error adding payment account: ${error.message}`);
  }
}

export const updatePaymentAccount = async (_id: string, paymentAccountData: Partial<IPaymentAccount>): Promise<IPaymentAccount | null> => {
  try {
    const updatedPaymentAccount = await PaymentAccount.findByIdAndUpdate(
      _id,
      paymentAccountData,
      { new: true, runValidators: true }
    ).lean().exec();

    if (!updatedPaymentAccount) {
      logger.warn("Payment account not found for uid: ", {_id});
      return null;
    }

    logger.info("Payment account updated successfully for id: ", {_id});
    return updatedPaymentAccount;
  } catch (error: any) {
    logger.error("Error updating payment account for uid: ", {_id}, error);
    throw new Error(`Error updating payment account: ${error.message}`);
  }
};

export const deletePaymentAccount = async (account_id: string): Promise<boolean> => {
  try {
    const result = await PaymentAccount.deleteOne({ _id: account_id }).exec(); 
    if (result.deletedCount === 0) {
      logger.warn("Payment account not found for uid: ", account_id);
      return false;
    }
    logger.info("Payment account deleted successfully for uid: ", account_id);
    return true;
  } catch (error: any) {
    logger.error("Error deleting payment account for uid: ", account_id, error);
    throw new Error(`Error deleting payment account: ${error.message}`);
  }
}

 export const getSinglePaymentAccount = async (account_id: string): Promise<IPaymentAccount | null> => {
  try {
    const paymentaccount = await PaymentAccount.findById( account_id ).lean().exec();
    if (!paymentaccount) { 
      logger.warn("Payment account not found for uid: ", account_id);
      return null;
    }
    return paymentaccount;
  } catch (error: any) {
    logger.error("Error fetching payment account for uid: ", account_id, error);
    throw new Error(`Error fetching payment account: ${error.message}`);
  }
}