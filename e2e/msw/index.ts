/**
 * MSW E2E Test Setup
 *
 * Entry point for MSW configuration in E2E tests.
 * This module exports all necessary functions and data for mocking
 * the backend API in E2E tests.
 */

export {
  filterBackendAgents,
  getBackendAgent,
  getMockBackendReputation,
  getMockBackendSimilarAgents,
  getMockBackendValidations,
  mockBackendAgents,
  mockBackendStats,
  mockBackendTaxonomy,
} from './backend-mock-data';
export { allHandlers, errorHandlers, handlers } from './handlers';
export { resetMswHandlers, server, startMswServer, stopMswServer, useMswHandlers } from './server';
