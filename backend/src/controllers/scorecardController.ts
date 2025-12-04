import { Request, Response } from 'express';
import {
  calculateCreditScore,
  getVariablesByModule,
  getInputFlatFile,
  bulkUpdateInputFlatFile,
  clearInputFlatFile,
  getAllScenarios
} from '../lib/engine';

/**
 * Calculate scorecard for an application
 * POST /api/scorecard/calculate
 * Body: { appId, scenario?, inputs? }
 */
export const calculateScore = async (req: Request, res: Response) => {
  try {
    const { appId, scenario, inputs } = req.body;

    if (!appId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await calculateCreditScore(
      appId,
      scenario || "Scenario 0",
      inputs
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Scorecard calculation error:', error);
    return res.status(500).json({
      error: 'Calculation failed',
      message: error.message
    });
  }
};

/**
 * Get all variables grouped by module with their configurations
 * GET /api/scorecard/variables
 */
export const getVariables = async (_req: Request, res: Response) => {
  try {
    const variables = await getVariablesByModule();
    return res.status(200).json(variables);
  } catch (error: any) {
    console.error('Get variables error:', error);
    return res.status(500).json({
      error: 'Failed to fetch variables',
      message: error.message
    });
  }
};

/**
 * Get input flat file data for an application
 * GET /api/scorecard/input-flat-file/:appId
 */
export const getInputData = async (req: Request, res: Response) => {
  try {
    const { appId } = req.params;

    if (!appId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const inputData = await getInputFlatFile(appId);
    return res.status(200).json(inputData);
  } catch (error: any) {
    console.error('Get input data error:', error);
    return res.status(500).json({
      error: 'Failed to fetch input data',
      message: error.message
    });
  }
};

/**
 * Update or create input flat file entries
 * POST /api/scorecard/input-flat-file
 * Body: { appId, inputs: [{ var_name, value }] }
 */
export const updateInputData = async (req: Request, res: Response) => {
  try {
    const { appId, inputs } = req.body;

    if (!appId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    if (!inputs || !Array.isArray(inputs)) {
      return res.status(400).json({ error: 'Inputs array is required' });
    }

    const results = await bulkUpdateInputFlatFile(appId, inputs);
    return res.status(200).json({
      message: 'Input data updated successfully',
      count: results.length,
      data: results
    });
  } catch (error: any) {
    console.error('Update input data error:', error);
    return res.status(500).json({
      error: 'Failed to update input data',
      message: error.message
    });
  }
};

/**
 * Delete all input flat file data for an application
 * DELETE /api/scorecard/input-flat-file/:appId
 */
export const deleteInputData = async (req: Request, res: Response) => {
  try {
    const { appId } = req.params;

    if (!appId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await clearInputFlatFile(appId);
    return res.status(200).json({
      message: 'Input data cleared successfully',
      count: result.count
    });
  } catch (error: any) {
    console.error('Delete input data error:', error);
    return res.status(500).json({
      error: 'Failed to delete input data',
      message: error.message
    });
  }
};

/**
 * Get all available scenarios
 * GET /api/scorecard/scenarios
 */
export const getScenarios = async (_req: Request, res: Response) => {
  try {
    const scenarios = await getAllScenarios();
    return res.status(200).json(scenarios);
  } catch (error: any) {
    console.error('Get scenarios error:', error);
    return res.status(500).json({
      error: 'Failed to fetch scenarios',
      message: error.message
    });
  }
};

/**
 * Get calculation results by module
 * POST /api/scorecard/calculate-by-module
 * Body: { appId, scenario?, module? }
 */
export const calculateByModule = async (req: Request, res: Response) => {
  try {
    const { appId, scenario, module } = req.body;

    if (!appId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await calculateCreditScore(
      appId,
      scenario || "Scenario 0"
    );

    // Filter by module if specified
    if (module) {
      const moduleDetails = result.details.filter(d => d.Module === module);
      const moduleScore = result.module_breakdown[module] || 0;

      return res.status(200).json({
        scenario: result.scenario,
        module: module,
        module_score: moduleScore,
        details: moduleDetails
      });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Calculate by module error:', error);
    return res.status(500).json({
      error: 'Calculation failed',
      message: error.message
    });
  }
};
