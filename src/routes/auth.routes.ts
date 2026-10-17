import { Router } from "express";
import { login, logout, me, refresh, register } from "../controllers/auth.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
import { validateBody } from "../middleware/validate.ts";
import { LoginSchema, RegisterSchema } from "../validators/auth.validator.ts";

const router = Router();

router.post("/register", validateBody(RegisterSchema), register);
router.post("/login", validateBody(LoginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

export default router;
