import { Router } from "express";

const paymentMethodRoutes = Router();
import { verifyToken } from "../middlewares/verifyToken";
import * as paymentMethodController from "../controllers/paymentAccountController";
paymentMethodRoutes.get(
  "/",
  verifyToken,
  paymentMethodController.getPaymentAccounts
);
paymentMethodRoutes.post(
  "/",
  verifyToken,
  paymentMethodController.addPaymentAccount
);
paymentMethodRoutes.put(
  '/:id',
  verifyToken,
  paymentMethodController.updatePaymentAccount
);

paymentMethodRoutes.delete(
  "/:id",
  verifyToken,
  paymentMethodController.deletePaymentAccount
);

paymentMethodRoutes.get(
  "/:id",
  verifyToken,
  paymentMethodController.getSinglePaymentAccount
);

export default paymentMethodRoutes;