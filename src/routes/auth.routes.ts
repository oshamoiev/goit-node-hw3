import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller.ts";
import { validateBody } from "../middleware/validate.ts";
import { LoginSchema, RegisterSchema } from "../validators/auth.validator.ts";

const router = Router();

router.post("/register", validateBody(RegisterSchema), register);
router.post("/login", validateBody(LoginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
