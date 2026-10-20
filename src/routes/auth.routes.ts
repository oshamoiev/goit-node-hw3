import { Router } from "express";
import * as authController from "../controllers/auth.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
import { validateBody } from "../middleware/validate.ts";
import { LoginSchema, RefreshSchema, RegisterSchema } from "../validators/auth.validator.ts";

const router = Router();

router.post("/register", validateBody(RegisterSchema), authController.register);
router.post("/login", validateBody(LoginSchema), authController.login);
router.post("/refresh", validateBody(RefreshSchema), authController.refresh);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.me);

export default router;
