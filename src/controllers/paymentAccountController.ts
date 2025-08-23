import { Request, Response } from "express";
import logger from "../config/loggingConfig";
import * as paymentAccountService from "../services/paymentAccountService";
import { IUser } from "../types";

export const getPaymentAccounts = async (req: Request, res: Response) => {
  const currentUser = req.currentUser as IUser;

  try {
    const paymentAccount = await paymentAccountService.getAllPaymentAccounts(currentUser.uid);
    if (!paymentAccount) {
      logger.warn(`Payment Account not found for uid: ${currentUser.uid}`);
      return res.status(404).json({ message: "Payment Account not found" });
    }
    return res.status(200).json(paymentAccount);
  } catch (error) {
    logger.error(`Failed to fetch payment Account for uid ${currentUser.uid}:`, error);
    return res.status(500).json({ message: 'An error occurred while fetching payment Account; please try again later' });
  }
};

export const addPaymentAccount = async (req: Request, res: Response) => {
  const currentUser = req.currentUser as IUser;
  const { bank_name, account_number, account_name } = req.body;

  try {
    const newPaymentAccount = await paymentAccountService.addPaymentAccount(bank_name, account_number, account_name, currentUser);
    return res.status(201).json(newPaymentAccount);
  } catch (error) {
    logger.error(`Failed to add payment Account for uid ${currentUser.uid}:`, error);
    return res.status(500).json({ message: 'An error occurred while adding payment Account; please try again later' });
  }
};

export const updatePaymentAccount = async (req: Request, res: Response) => {
  const currentUser = req.currentUser as IUser;
  const account_id = req.params.id;
  const { bank_name, account_number, account_name } = req.body;

  try {
    const updatedPaymentAccount = await paymentAccountService.updatePaymentAccount(account_id, {
      bank_name,
      account_number,
      account_name
    });

    if (!updatedPaymentAccount) {
      logger.warn(`Payment Account not found for uid: ${currentUser.uid}`);
      return res.status(404).json({ message: "Payment Account not found" });
    }

    return res.status(200).json(updatedPaymentAccount);
  } catch (error) {
    logger.error(`Failed to update payment Account for uid ${currentUser.uid}:`, error);
    return res.status(500).json({ message: 'An error occurred while updating payment Account; please try again later' });
  }
};

export const deletePaymentAccount = async (req: Request, res: Response) => {
  const currentUser = req.currentUser as IUser;
  const account_id = req.params.id;

  try {
    const deletedPaymentAccount = await paymentAccountService.deletePaymentAccount(account_id);
    if (!deletedPaymentAccount) {
      logger.warn(`Payment Account not found for uid: ${currentUser.uid}`);
      return res.status(404).json({ message: "Payment Account not found" });
    }
    return res.status(200).json({ message: "Payment Account deleted successfully" });
  } catch (error) {
    logger.error(`Failed to delete payment Account for uid ${currentUser.uid}:`, error);
    return res.status(500).json({ message: 'An error occurred while deleting payment Account; please try again later' });
  }
};

export const getSinglePaymentAccount = async (req: Request, res: Response) => {
  const Account_id = req.params.id;
  // const currentUser = req.currentUser as IUser;

  try {
    const paymentAccount = await paymentAccountService.getSinglePaymentAccount(Account_id);
    if (!paymentAccount) {
      logger.warn(`Payment Account not found for uid: ${Account_id}`);
      return res.status(404).json({ message: "Payment Account not found" });
    }
    return res.status(200).json(paymentAccount);
  } catch (error) {
    logger.error(`Failed to fetch payment Account for uid ${Account_id}:`, error);
    return res.status(500).json({ message: 'An error occurred while fetching payment Account; please try again later' });
  }
};