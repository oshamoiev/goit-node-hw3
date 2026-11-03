import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as authController from "../controllers/auth.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
import { validateBody } from "../middleware/validate.ts";
import { LoginSchema, RefreshSchema, RegisterSchema } from "../validators/auth.validator.ts";

const router = Router();

router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" },
  }),
);

router.post("/register", validateBody(RegisterSchema), authController.register);
router.post("/login", validateBody(LoginSchema), authController.login);
router.post("/refresh", validateBody(RefreshSchema), authController.refresh);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.me);

export default router;
