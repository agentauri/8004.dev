/**
 * MSW E2E Test Setup
 *
 * Entry point for MSW configuration in E2E tests.
 * This module exports all necessary functions and data for mocking
 * the backend API in E2E tests.
 */

export { handlers, errorHandlers, allHandlers } from './handlers';
export { server, startMswServer, stopMswServer, resetMswHandlers, useMswHandlers } from './server';
export {
  mockBackendAgents,
  mockBackendStats,
  mockBackendTaxonomy,
  getBackendAgent,
  getMockBackendReputation,
  getMockBackendSimilarAgents,
  getMockBackendValidations,
  filterBackendAgents,
} from './backend-mock-data';
