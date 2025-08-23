import axios from 'axios';
import platformAPIClient from '../config/platformAPIclient';
import User from '../models/User';
import { createTransaction, getTransaction, updateTransaction } from '../services/transactionService';
import { ITransaction, IUser, PaymentDTO } from '../types';
import logger from '../config/loggingConfig';
import { TradeModeEnum, TradeTypeEnum, TransactionStatus } from '../models/enum/transaction';


export const processIncompletePayment = async (payment: PaymentDTO) => {
  try {
    const paymentId = payment.identifier;
    const txid = payment.transaction?.txid;
    const txURL = payment.transaction?._link;

    // Retrieve the original (incomplete) payment record by its identifier
    const incompletePayment = await getTransaction(paymentId);
    if (!incompletePayment) {
      logger.warn("No incomplete payment record found");
      throw new Error("Finding incomplete payment failed");
    }

    // Fetch the payment memo from the Pi Blockchain via Horizon API
    const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL!);
    const blockchainMemo = horizonResponse.data.memo;
    logger.info("paymentIdOnBlock: ", blockchainMemo);

    // Validate that the memo from the blockchain matches the expected payment ID
    if (blockchainMemo !== incompletePayment.payment_id) {
      throw new Error("Unable to find payment on the Pi Blockchain");
    }

    // Mark the payment as completed
    // const updatedPayment = await completePayment(paymentId, txid as string);
    const transactionData: Partial<ITransaction> = {
      txid: txid as string,
      status: TransactionStatus.Pending,
    }
    const updatedTransaction = await updateTransaction(paymentId, transactionData);

    if (!updatedTransaction) {
      throw new Error("unable to update transaction ")
    }
    logger.warn("Old transaction found and updated");

    // Fetch payment details from the Pi platform using the payment ID
    // const res = await platformAPIClient.get(`/v2/payments/${ paymentId }`);

    // Notify the Pi Platform that the payment is complete
    await platformAPIClient.post(`/v2/payments/${ paymentId }/complete`, { txid });

    return {
      success: true,
      message: `Payment completed from incomplete payment with id ${ paymentId }`,
    };
  } catch (error: any) {
    if (error.response) {
      logger.error("platformAPIClient error", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      logger.error("Unhandled error during incomplete payment processing", { message: error.message, stack: error.stack });
    }
    throw(error);
  }
};

export const processPaymentApproval = async (
  paymentId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Fetch payment details from the Pi platform using the payment ID
    const res = await platformAPIClient.get(`/v2/payments/${ paymentId }`);
    const currentPayment: PaymentDTO = res.data;

    // Check if a payment record with this ID already exists in the database
    const oldTransaction = await getTransaction(currentPayment.identifier);
    if (oldTransaction) {
      logger.info("Payment record already exists");
      await processPaymentError(currentPayment);
      return {
        success: false,
        message: `Payment already exists with ID ${ paymentId }`,
      };
    }
    const transactionData = {
      sender_uid: currentPayment.user_uid, 
      memo: currentPayment.memo, 
      amount: currentPayment.amount.toString(),   
      trade_type: currentPayment.metadata.trade_type as TradeTypeEnum,
      trade_mode:currentPayment.metadata.trade_mode as TradeModeEnum,
      payment_id: currentPayment.identifier,
      payment_account: currentPayment.metadata.payment_account,
      wallet_address: currentPayment.from_address
    }
    const newtransaction = await createTransaction( transactionData);
    if (!newtransaction) {
      logger.error("Failed to create transaction for payment ID: ", paymentId);
      throw new Error(`Failed to create transaction for payment ID ${ paymentId }`);
    }

    // Approve the payment on the Pi platform
    await platformAPIClient.post(`/v2/payments/${ paymentId }/approve`);

    return {
      success: true,
      message: `Payment approved with id ${ paymentId }`,
    };
  } catch (error: any) {
    if (error.response) {
      logger.error("platformAPIClient error", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      logger.error("Unhandled error during payment approval", { message: error.message, stack: error.stack });
    }
    throw(error);
  }
};

export const processPaymentCompletion = async (paymentId: string, txid: string) => {
  try {
    // Confirm the payment exists via Pi platform API
    const res = await platformAPIClient.get(`/v2/payments/${ paymentId }`);
    const currentPayment: PaymentDTO = res.data;

    // Mark the payment as completed
     const transactionData: Partial<ITransaction> = {
      txid: txid as string,
      status: TransactionStatus.Pending,
    }
    const updatedTransaction = await updateTransaction(paymentId, transactionData);

    if (!updatedTransaction) {
      throw new Error("unable to update transaction ")
    }

    // Notify the Pi Platform that the payment is complete
    await platformAPIClient.post(`/v2/payments/${ paymentId }/complete`, { txid });

    return {
      success: true,
      message: `transaction completed with id ${ paymentId }`,
    };
  } catch (error: any) {
    if (error.response) {
      logger.error("platformAPIClient error", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      logger.error("Unhandled error during payment completion", { message: error.message, stack: error.stack });
    }
    throw(error);
  }
}; 

export const processPaymentCancellation = async (paymentId: string) => {
  try {
    // Mark the payment as cancelled
     const transactionData: Partial<ITransaction> = {
      status: TransactionStatus.Cancelled,
    }
    const updatedTransaction = await updateTransaction(paymentId, transactionData);

    if (!updatedTransaction) {
      throw new Error("unable to update transaction ")
    }

    // Notify the Pi platform that the payment has been cancelled
    await platformAPIClient.post(`/v2/payments/${ paymentId }/cancel`);
    logger.info('Successfully posted cancellation to Pi platform');

    return {
      success: true,
      message: `transaction cancelled with id ${ paymentId }`,
    };
  } catch (error: any) {
    if (error.response) {
      logger.error("platformAPIClient error", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      logger.error("Unhandled error during payment cancellation", { message: error.message, stack: error.stack });
    }
    throw(error);
  }
};

export const processPaymentError = async (paymentDTO: PaymentDTO) => {
  try {
    // handle existing payment
    const transaction = paymentDTO.transaction;
    const paymentId = paymentDTO.identifier;

    if (transaction) {        
      await processIncompletePayment(paymentDTO);
      return {
        success: true,
        message: `Payment Error with ID ${paymentId} handled and completed successfully`,
      };
    } else {
      logger.warn("No transaction data found for existing payment");
      await processPaymentCancellation(paymentId);
      return {
        success: true,
        message: `Payment Error with ID ${paymentId} cancelled successfully`,
      };
    }
  } catch (error: any) {
    if (error.response) {
      logger.error("platformAPIClient error", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      logger.error("Unhandled error during handling payment error", { message: error.message, stack: error.stack });
    }
    throw(error);
  }
};