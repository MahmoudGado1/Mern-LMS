import express from 'express'
import { createOrder, capturePaymentAndFinalizeOrder } from '../../controllers/student-controller/order-controller.js'
const studentViewOrderRoutes = express.Router();

studentViewOrderRoutes.post("/create", createOrder);
studentViewOrderRoutes.post("/capture", capturePaymentAndFinalizeOrder);

export default studentViewOrderRoutes;