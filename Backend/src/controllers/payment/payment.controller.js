import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../services/payment/payment.service.js";

export const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;

    if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

    const order = await createRazorpayOrder({
      userId: req.user.userId,
      planId,
      amount,
      credits,
    });

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: `Failed to create order: ${error.message}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const result = await verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (result.alreadyProcessed) {
      return res.json({ message: "Already processed" });
    }

    return res.json({
      success: true,
      message: "Payment verified and credits added",
      user: result.updatedUser,
    });
  } catch (error) {
    if (error.message === "Invalid payment signature") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Payment not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: `Failed to verify payment: ${error.message}` });
  }
};