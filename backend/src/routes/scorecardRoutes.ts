import express, { Router } from 'express';
import {
  calculateScore,
  getVariables,
  getInputData,
  updateInputData,
  deleteInputData,
  getScenarios,
  calculateByModule
} from '../controllers/scorecardController';

const router: Router = express.Router();

// Calculate credit score
router.post('/calculate', calculateScore);

// Calculate by specific module
router.post('/calculate-by-module', calculateByModule);

// Get all variables grouped by module
router.get('/variables', getVariables);

// Get all scenarios
router.get('/scenarios', getScenarios);

// Input flat file management
router.get('/input-flat-file/:appId', getInputData);
router.post('/input-flat-file', updateInputData);
router.delete('/input-flat-file/:appId', deleteInputData);

export default router;
