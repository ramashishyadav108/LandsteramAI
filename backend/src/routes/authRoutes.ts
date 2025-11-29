import express, { Router, RequestHandler } from 'express';
import {
  signup,
  login,
  refresh,
  logout,
  logoutOtherDevices,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
  uploadProfilePicture,
} from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate, signupSchema, loginSchema, emailSchema, resetPasswordSchema } from '../utils/validate.js';
import uploadProfile from '../config/multer.profile.config.js';

const router: Router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/logout-other-devices', authenticateToken, logoutOtherDevices as RequestHandler);
router.get('/verify-email', verifyEmail);
router.post('/request-password-reset', validate(emailSchema), requestPasswordReset);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/profile', authenticateToken, getProfile as RequestHandler);
router.put('/profile', authenticateToken, updateProfile as RequestHandler);
router.post('/profile/upload-picture', authenticateToken, uploadProfile.single('picture'), uploadProfilePicture as RequestHandler);
router.get('/users', authenticateToken, getAllUsers as RequestHandler);
router.delete('/delete-account', authenticateToken, deleteAccount as RequestHandler);

export default router;
