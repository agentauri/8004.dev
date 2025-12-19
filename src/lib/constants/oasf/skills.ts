/**
 * OASF Skills Taxonomy
 * Based on https://schema.oasf.outshift.com/skill_categories
 * Version: 0.8.0
 */

import type { TaxonomyCategory, TaxonomyTree } from './types';

export const SKILLS_TAXONOMY: TaxonomyTree = {
  version: '0.8.0',
  categories: [
    {
      id: 1,
      slug: 'natural_language_processing',
      name: 'Natural Language Processing',
      children: [
        {
          id: 101,
          slug: 'natural_language_understanding',
          name: 'Natural Language Understanding',
          parentId: 1,
        },
        {
          id: 102,
          slug: 'natural_language_generation',
          name: 'Natural Language Generation',
          parentId: 1,
        },
        {
          id: 103,
          slug: 'information_retrieval_and_synthesis',
          name: 'Information Retrieval and Synthesis',
          parentId: 1,
        },
        {
          id: 104,
          slug: 'creative_content_generation',
          name: 'Creative Content Generation',
          parentId: 1,
        },
        {
          id: 105,
          slug: 'language_translation',
          name: 'Language Translation and Multilingual Support',
          parentId: 1,
        },
        {
          id: 106,
          slug: 'personalisation_and_adaptation',
          name: 'Personalisation and Adaptation',
          parentId: 1,
        },
        {
          id: 107,
          slug: 'analytical_and_logical_reasoning',
          name: 'Analytical and Logical Reasoning',
          parentId: 1,
        },
        {
          id: 108,
          slug: 'ethical_and_safe_interaction',
          name: 'Ethical and Safe Interaction',
          parentId: 1,
        },
        { id: 109, slug: 'text_classification', name: 'Text Classification', parentId: 1 },
        { id: 110, slug: 'module_extraction', name: 'Module Extraction', parentId: 1 },
        { id: 111, slug: 'token_classification', name: 'Token Classification', parentId: 1 },
      ],
    },
    {
      id: 2,
      slug: 'images_computer_vision',
      name: 'Images / Computer Vision',
      children: [
        { id: 201, slug: 'image_segmentation', name: 'Image Segmentation', parentId: 2 },
        { id: 202, slug: 'video_classification', name: 'Video Classification', parentId: 2 },
        { id: 203, slug: 'image_classification', name: 'Image Classification', parentId: 2 },
        { id: 204, slug: 'object_detection', name: 'Object Detection', parentId: 2 },
        { id: 205, slug: 'keypoint_detection', name: 'Keypoint Detection', parentId: 2 },
        { id: 206, slug: 'image_generation', name: 'Image Generation', parentId: 2 },
        { id: 207, slug: 'depth_estimation', name: 'Depth Estimation', parentId: 2 },
        { id: 208, slug: 'image_module_extraction', name: 'Image Module Extraction', parentId: 2 },
        { id: 209, slug: 'mask_generation', name: 'Mask Generation', parentId: 2 },
        { id: 210, slug: 'image_to_image', name: 'Image-to-Image', parentId: 2 },
        { id: 211, slug: 'image_to_3d', name: 'Image-to-3D', parentId: 2 },
      ],
    },
    {
      id: 3,
      slug: 'audio',
      name: 'Audio',
      children: [
        { id: 301, slug: 'audio_classification', name: 'Audio Classification', parentId: 3 },
        { id: 302, slug: 'audio_to_audio', name: 'Audio to Audio', parentId: 3 },
        { id: 303, slug: 'speech_recognition', name: 'Speech Recognition', parentId: 3 },
        { id: 304, slug: 'text_to_speech', name: 'Text to Speech', parentId: 3 },
        { id: 305, slug: 'audio_generation', name: 'Audio Generation', parentId: 3 },
      ],
    },
    {
      id: 4,
      slug: 'tabular_text',
      name: 'Tabular / Text',
      children: [
        { id: 401, slug: 'tabular_classification', name: 'Tabular Classification', parentId: 4 },
        { id: 402, slug: 'tabular_regression', name: 'Tabular Regression', parentId: 4 },
      ],
    },
    {
      id: 5,
      slug: 'analytical_skills',
      name: 'Analytical Skills',
      children: [
        { id: 501, slug: 'mathematical_reasoning', name: 'Mathematical Reasoning', parentId: 5 },
        { id: 502, slug: 'coding_skills', name: 'Coding Skills', parentId: 5 },
        { id: 503, slug: 'data_analysis', name: 'Data Analysis', parentId: 5 },
        { id: 504, slug: 'statistical_analysis', name: 'Statistical Analysis', parentId: 5 },
      ],
    },
    {
      id: 6,
      slug: 'retrieval_augmented_generation',
      name: 'Retrieval Augmented Generation',
      children: [
        {
          id: 601,
          slug: 'retrieval_of_information',
          name: 'Retrieval of Information',
          parentId: 6,
        },
        {
          id: 602,
          slug: 'document_qa',
          name: 'Document or Database Question Answering',
          parentId: 6,
        },
        { id: 603, slug: 'generation_of_any', name: 'Generation of Any', parentId: 6 },
      ],
    },
    {
      id: 7,
      slug: 'multi_modal',
      name: 'Multi-modal',
      children: [
        { id: 701, slug: 'image_processing', name: 'Image Processing', parentId: 7 },
        { id: 702, slug: 'audio_processing', name: 'Audio Processing', parentId: 7 },
        { id: 703, slug: 'any_to_any', name: 'Any to Any Transformation', parentId: 7 },
        { id: 704, slug: 'video_processing', name: 'Video Processing', parentId: 7 },
      ],
    },
    {
      id: 8,
      slug: 'security_privacy',
      name: 'Security & Privacy',
      children: [
        { id: 801, slug: 'threat_detection', name: 'Threat Detection', parentId: 8 },
        { id: 802, slug: 'vulnerability_analysis', name: 'Vulnerability Analysis', parentId: 8 },
        { id: 803, slug: 'secret_leak_detection', name: 'Secret Leak Detection', parentId: 8 },
        { id: 804, slug: 'privacy_risk_assessment', name: 'Privacy Risk Assessment', parentId: 8 },
        { id: 805, slug: 'encryption', name: 'Encryption', parentId: 8 },
      ],
    },
    {
      id: 9,
      slug: 'data_engineering',
      name: 'Data Engineering',
      children: [
        { id: 901, slug: 'data_cleaning', name: 'Data Cleaning', parentId: 9 },
        { id: 902, slug: 'schema_inference', name: 'Schema Inference', parentId: 9 },
        { id: 903, slug: 'feature_engineering', name: 'Feature Engineering', parentId: 9 },
        {
          id: 904,
          slug: 'data_transformation_pipeline',
          name: 'Data Transformation Pipeline',
          parentId: 9,
        },
        { id: 905, slug: 'data_quality_assessment', name: 'Data Quality Assessment', parentId: 9 },
      ],
    },
    {
      id: 10,
      slug: 'agent_orchestration',
      name: 'Agent Orchestration',
      children: [
        { id: 1001, slug: 'task_decomposition', name: 'Task Decomposition', parentId: 10 },
        { id: 1002, slug: 'role_assignment', name: 'Role Assignment', parentId: 10 },
        { id: 1003, slug: 'multi_agent_planning', name: 'Multi-Agent Planning', parentId: 10 },
        { id: 1004, slug: 'agent_coordination', name: 'Agent Coordination', parentId: 10 },
        {
          id: 1005,
          slug: 'negotiation_resolution',
          name: 'Negotiation & Resolution',
          parentId: 10,
        },
      ],
    },
    {
      id: 11,
      slug: 'evaluation_monitoring',
      name: 'Evaluation & Monitoring',
      children: [
        { id: 1101, slug: 'benchmark_execution', name: 'Benchmark Execution', parentId: 11 },
        { id: 1102, slug: 'test_case_generation', name: 'Test Case Generation', parentId: 11 },
        { id: 1103, slug: 'quality_evaluation', name: 'Quality Evaluation', parentId: 11 },
        { id: 1104, slug: 'anomaly_detection', name: 'Anomaly Detection', parentId: 11 },
        { id: 1105, slug: 'performance_monitoring', name: 'Performance Monitoring', parentId: 11 },
      ],
    },
    {
      id: 12,
      slug: 'devops_mlops',
      name: 'DevOps / MLOps',
      children: [
        {
          id: 1201,
          slug: 'infrastructure_provisioning',
          name: 'Infrastructure Provisioning',
          parentId: 12,
        },
        {
          id: 1202,
          slug: 'deployment_orchestration',
          name: 'Deployment Orchestration',
          parentId: 12,
        },
        { id: 1203, slug: 'cicd_configuration', name: 'CI/CD Configuration', parentId: 12 },
        { id: 1204, slug: 'model_versioning', name: 'Model Versioning', parentId: 12 },
        { id: 1205, slug: 'monitoring_alerting', name: 'Monitoring & Alerting', parentId: 12 },
      ],
    },
    {
      id: 13,
      slug: 'governance_compliance',
      name: 'Governance & Compliance',
      children: [
        { id: 1301, slug: 'policy_mapping', name: 'Policy Mapping', parentId: 13 },
        { id: 1302, slug: 'compliance_assessment', name: 'Compliance Assessment', parentId: 13 },
        {
          id: 1303,
          slug: 'audit_trail_summarization',
          name: 'Audit Trail Summarization',
          parentId: 13,
        },
        { id: 1304, slug: 'risk_classification', name: 'Risk Classification', parentId: 13 },
      ],
    },
    {
      id: 14,
      slug: 'tool_interaction',
      name: 'Tool Interaction',
      children: [
        {
          id: 1401,
          slug: 'api_schema_understanding',
          name: 'API Schema Understanding',
          parentId: 14,
        },
        { id: 1402, slug: 'workflow_automation', name: 'Workflow Automation', parentId: 14 },
        { id: 1403, slug: 'tool_use_planning', name: 'Tool Use Planning', parentId: 14 },
        { id: 1404, slug: 'script_integration', name: 'Script Integration', parentId: 14 },
      ],
    },
    {
      id: 15,
      slug: 'advanced_reasoning_planning',
      name: 'Advanced Reasoning & Planning',
      children: [
        { id: 1501, slug: 'strategic_planning', name: 'Strategic Planning', parentId: 15 },
        { id: 1502, slug: 'long_horizon_reasoning', name: 'Long-Horizon Reasoning', parentId: 15 },
        { id: 1503, slug: 'chain_of_thought', name: 'Chain-of-Thought Structuring', parentId: 15 },
        { id: 1504, slug: 'hypothesis_generation', name: 'Hypothesis Generation', parentId: 15 },
      ],
    },
  ],
};

/**
 * Flat map of all skills by slug for quick lookup
 */
export const SKILLS_BY_SLUG: Map<string, TaxonomyCategory> = new Map();

/**
 * Flat map of all skills by ID for quick lookup
 */
export const SKILLS_BY_ID: Map<number, TaxonomyCategory> = new Map();

// Build lookup maps
function buildSkillMaps(categories: TaxonomyCategory[], parent?: TaxonomyCategory) {
  for (const category of categories) {
    // For child categories, create composite slug: parent_slug/child_slug
    const fullSlug = parent ? `${parent.slug}/${category.slug}` : category.slug;
    SKILLS_BY_SLUG.set(fullSlug, category);
    SKILLS_BY_ID.set(category.id, category);

    if (category.children) {
      buildSkillMaps(category.children, category);
    }
  }
}

buildSkillMaps(SKILLS_TAXONOMY.categories);
