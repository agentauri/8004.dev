/**
 * OASF Domains Taxonomy
 * Based on https://schema.oasf.outshift.com/domain_categories
 * Version: 0.8.0
 */

import type { TaxonomyCategory, TaxonomyTree } from './types';

export const DOMAINS_TAXONOMY: TaxonomyTree = {
  version: '0.8.0',
  categories: [
    {
      id: 1,
      slug: 'technology',
      name: 'Technology',
      children: [
        { id: 101, slug: 'iot', name: 'Internet of Things (IoT)', parentId: 1 },
        { id: 102, slug: 'software_engineering', name: 'Software Engineering', parentId: 1 },
        { id: 103, slug: 'networking', name: 'Networking', parentId: 1 },
        { id: 104, slug: 'data_science', name: 'Data Science', parentId: 1 },
        { id: 105, slug: 'cloud_computing', name: 'Cloud Computing', parentId: 1 },
        { id: 106, slug: 'information_technology', name: 'Information Technology', parentId: 1 },
        { id: 107, slug: 'security', name: 'Security', parentId: 1 },
        { id: 108, slug: 'communication_systems', name: 'Communication Systems', parentId: 1 },
        { id: 109, slug: 'blockchain', name: 'Blockchain', parentId: 1 },
        { id: 110, slug: 'automation', name: 'Automation', parentId: 1 },
      ],
    },
    {
      id: 2,
      slug: 'finance_and_business',
      name: 'Finance and Business',
      children: [
        { id: 201, slug: 'banking', name: 'Banking', parentId: 2 },
        { id: 202, slug: 'finance', name: 'Finance', parentId: 2 },
        { id: 203, slug: 'investment_services', name: 'Investment Services', parentId: 2 },
        { id: 204, slug: 'consumer_goods', name: 'Consumer Goods', parentId: 2 },
        { id: 205, slug: 'retail', name: 'Retail', parentId: 2 },
      ],
    },
    {
      id: 3,
      slug: 'life_science',
      name: 'Life Science',
      children: [
        { id: 301, slug: 'biotechnology', name: 'Biotechnology', parentId: 3 },
        { id: 302, slug: 'pharmaceutical_research', name: 'Pharmaceutical Research', parentId: 3 },
        { id: 303, slug: 'genomics', name: 'Genomics', parentId: 3 },
        { id: 304, slug: 'bioinformatics', name: 'Bioinformatics', parentId: 3 },
        { id: 305, slug: 'molecular_biology', name: 'Molecular Biology', parentId: 3 },
      ],
    },
    {
      id: 4,
      slug: 'trust_and_safety',
      name: 'Trust and Safety',
      children: [
        { id: 401, slug: 'online_safety', name: 'Online Safety', parentId: 4 },
        { id: 402, slug: 'content_moderation', name: 'Content Moderation', parentId: 4 },
        { id: 403, slug: 'fraud_prevention', name: 'Fraud Prevention', parentId: 4 },
        { id: 404, slug: 'data_privacy', name: 'Data Privacy', parentId: 4 },
        { id: 405, slug: 'risk_management', name: 'Risk Management', parentId: 4 },
      ],
    },
    {
      id: 5,
      slug: 'human_resources',
      name: 'Human Resources',
      children: [
        { id: 501, slug: 'recruitment', name: 'Recruitment', parentId: 5 },
        { id: 502, slug: 'employee_relations', name: 'Employee Relations', parentId: 5 },
        {
          id: 503,
          slug: 'training_and_development',
          name: 'Training and Development',
          parentId: 5,
        },
        {
          id: 504,
          slug: 'compensation_and_benefits',
          name: 'Compensation and Benefits',
          parentId: 5,
        },
        { id: 505, slug: 'hr_analytics', name: 'HR Analytics', parentId: 5 },
      ],
    },
    {
      id: 6,
      slug: 'education',
      name: 'Education',
      children: [
        { id: 601, slug: 'e_learning', name: 'E-Learning', parentId: 6 },
        { id: 602, slug: 'curriculum_design', name: 'Curriculum Design', parentId: 6 },
        {
          id: 603,
          slug: 'learning_management_systems',
          name: 'Learning Management Systems',
          parentId: 6,
        },
        { id: 604, slug: 'educational_technology', name: 'Educational Technology', parentId: 6 },
        { id: 605, slug: 'pedagogy', name: 'Pedagogy', parentId: 6 },
      ],
    },
    {
      id: 7,
      slug: 'industrial_manufacturing',
      name: 'Industrial Manufacturing',
      children: [
        { id: 701, slug: 'manufacturing_automation', name: 'Automation', parentId: 7 },
        { id: 702, slug: 'robotics', name: 'Robotics', parentId: 7 },
        { id: 703, slug: 'supply_chain_management', name: 'Supply Chain Management', parentId: 7 },
        { id: 704, slug: 'lean_manufacturing', name: 'Lean Manufacturing', parentId: 7 },
        { id: 705, slug: 'process_engineering', name: 'Process Engineering', parentId: 7 },
      ],
    },
    {
      id: 8,
      slug: 'transportation',
      name: 'Transportation',
      children: [
        { id: 801, slug: 'logistics', name: 'Logistics', parentId: 8 },
        { id: 802, slug: 'automotive', name: 'Automotive', parentId: 8 },
        { id: 803, slug: 'public_transit', name: 'Public Transit', parentId: 8 },
        { id: 804, slug: 'supply_chain', name: 'Supply Chain', parentId: 8 },
        { id: 805, slug: 'freight', name: 'Freight', parentId: 8 },
        { id: 806, slug: 'autonomous_vehicles', name: 'Autonomous Vehicles', parentId: 8 },
      ],
    },
    {
      id: 9,
      slug: 'healthcare',
      name: 'Healthcare',
      children: [
        { id: 901, slug: 'medical_technology', name: 'Medical Technology', parentId: 9 },
        { id: 902, slug: 'telemedicine', name: 'Telemedicine', parentId: 9 },
        { id: 903, slug: 'healthcare_informatics', name: 'Healthcare Informatics', parentId: 9 },
        {
          id: 904,
          slug: 'patient_management_systems',
          name: 'Patient Management Systems',
          parentId: 9,
        },
        {
          id: 905,
          slug: 'health_information_systems',
          name: 'Health Information Systems',
          parentId: 9,
        },
      ],
    },
    {
      id: 10,
      slug: 'legal',
      name: 'Legal',
      children: [
        { id: 1001, slug: 'contract_law', name: 'Contract Law', parentId: 10 },
        { id: 1002, slug: 'intellectual_property', name: 'Intellectual Property', parentId: 10 },
        { id: 1003, slug: 'regulatory_compliance', name: 'Regulatory Compliance', parentId: 10 },
        { id: 1004, slug: 'litigation', name: 'Litigation', parentId: 10 },
        { id: 1005, slug: 'legal_research', name: 'Legal Research', parentId: 10 },
        { id: 1006, slug: 'corporate_governance', name: 'Corporate Governance', parentId: 10 },
      ],
    },
    {
      id: 11,
      slug: 'agriculture',
      name: 'Agriculture',
      children: [
        {
          id: 1101,
          slug: 'agricultural_technology',
          name: 'Agricultural Technology',
          parentId: 11,
        },
        { id: 1102, slug: 'crop_management', name: 'Crop Management', parentId: 11 },
        { id: 1103, slug: 'livestock_management', name: 'Livestock Management', parentId: 11 },
        { id: 1104, slug: 'precision_agriculture', name: 'Precision Agriculture', parentId: 11 },
        { id: 1105, slug: 'sustainable_farming', name: 'Sustainable Farming', parentId: 11 },
      ],
    },
    {
      id: 12,
      slug: 'energy',
      name: 'Energy',
      children: [
        { id: 1201, slug: 'energy_management', name: 'Energy Management', parentId: 12 },
        { id: 1202, slug: 'energy_storage', name: 'Energy Storage', parentId: 12 },
        { id: 1203, slug: 'oil_and_gas', name: 'Oil and Gas', parentId: 12 },
        { id: 1204, slug: 'power_generation', name: 'Power Generation', parentId: 12 },
        { id: 1205, slug: 'renewable_energy', name: 'Renewable Energy', parentId: 12 },
        { id: 1206, slug: 'smart_grids', name: 'Smart Grids', parentId: 12 },
      ],
    },
    {
      id: 13,
      slug: 'media_and_entertainment',
      name: 'Media and Entertainment',
      children: [
        { id: 1301, slug: 'broadcasting', name: 'Broadcasting', parentId: 13 },
        { id: 1302, slug: 'content_creation', name: 'Content Creation', parentId: 13 },
        { id: 1303, slug: 'digital_media', name: 'Digital Media', parentId: 13 },
        { id: 1304, slug: 'gaming', name: 'Gaming', parentId: 13 },
        { id: 1305, slug: 'publishing', name: 'Publishing', parentId: 13 },
        { id: 1306, slug: 'streaming_services', name: 'Streaming Services', parentId: 13 },
      ],
    },
    {
      id: 14,
      slug: 'real_estate',
      name: 'Real Estate',
      children: [
        { id: 1401, slug: 'construction', name: 'Construction', parentId: 14 },
        { id: 1402, slug: 'facilities_management', name: 'Facilities Management', parentId: 14 },
        { id: 1403, slug: 'property_management', name: 'Property Management', parentId: 14 },
        { id: 1404, slug: 'proptech', name: 'PropTech', parentId: 14 },
        { id: 1405, slug: 'real_estate_investment', name: 'Real Estate Investment', parentId: 14 },
        { id: 1406, slug: 'urban_planning', name: 'Urban Planning', parentId: 14 },
      ],
    },
    {
      id: 15,
      slug: 'hospitality_and_tourism',
      name: 'Hospitality and Tourism',
      children: [
        { id: 1501, slug: 'event_planning', name: 'Event Planning', parentId: 15 },
        { id: 1502, slug: 'food_and_beverage', name: 'Food and Beverage', parentId: 15 },
        { id: 1503, slug: 'hospitality_technology', name: 'Hospitality Technology', parentId: 15 },
        { id: 1504, slug: 'hotel_management', name: 'Hotel Management', parentId: 15 },
        { id: 1505, slug: 'tourism_management', name: 'Tourism Management', parentId: 15 },
        { id: 1506, slug: 'travel_services', name: 'Travel Services', parentId: 15 },
      ],
    },
    {
      id: 16,
      slug: 'telecommunications',
      name: 'Telecommunications',
      children: [
        { id: 1601, slug: 'internet_services', name: 'Internet Services', parentId: 16 },
        { id: 1602, slug: 'iot_connectivity', name: 'IoT Connectivity', parentId: 16 },
        { id: 1603, slug: 'network_infrastructure', name: 'Network Infrastructure', parentId: 16 },
        { id: 1604, slug: 'telecom_operations', name: 'Telecom Operations', parentId: 16 },
        {
          id: 1605,
          slug: 'voip_unified_communications',
          name: 'VoIP and Unified Communications',
          parentId: 16,
        },
        {
          id: 1606,
          slug: 'wireless_communications',
          name: 'Wireless Communications',
          parentId: 16,
        },
      ],
    },
    {
      id: 17,
      slug: 'environmental_science',
      name: 'Environmental Science',
      children: [
        { id: 1701, slug: 'climate_science', name: 'Climate Science', parentId: 17 },
        { id: 1702, slug: 'conservation_biology', name: 'Conservation Biology', parentId: 17 },
        { id: 1703, slug: 'ecology', name: 'Ecology', parentId: 17 },
        {
          id: 1704,
          slug: 'environmental_monitoring',
          name: 'Environmental Monitoring',
          parentId: 17,
        },
        { id: 1705, slug: 'environmental_policy', name: 'Environmental Policy', parentId: 17 },
        { id: 1706, slug: 'sustainability', name: 'Sustainability', parentId: 17 },
      ],
    },
    {
      id: 18,
      slug: 'government_and_public_sector',
      name: 'Government and Public Sector',
      children: [
        { id: 1801, slug: 'civic_engagement', name: 'Civic Engagement', parentId: 18 },
        { id: 1802, slug: 'e_government', name: 'E-Government', parentId: 18 },
        { id: 1803, slug: 'emergency_management', name: 'Emergency Management', parentId: 18 },
        { id: 1804, slug: 'public_administration', name: 'Public Administration', parentId: 18 },
        { id: 1805, slug: 'public_infrastructure', name: 'Public Infrastructure', parentId: 18 },
        { id: 1806, slug: 'public_policy', name: 'Public Policy', parentId: 18 },
      ],
    },
    {
      id: 19,
      slug: 'research_and_development',
      name: 'Research and Development',
      children: [
        { id: 1901, slug: 'grant_management', name: 'Grant Management', parentId: 19 },
        { id: 1902, slug: 'innovation_management', name: 'Innovation Management', parentId: 19 },
        { id: 1903, slug: 'laboratory_management', name: 'Laboratory Management', parentId: 19 },
        { id: 1904, slug: 'product_development', name: 'Product Development', parentId: 19 },
        {
          id: 1905,
          slug: 'research_data_management',
          name: 'Research Data Management',
          parentId: 19,
        },
        { id: 1906, slug: 'scientific_research', name: 'Scientific Research', parentId: 19 },
      ],
    },
    {
      id: 20,
      slug: 'retail_and_ecommerce',
      name: 'Retail and E-commerce',
      children: [
        { id: 2001, slug: 'customer_experience', name: 'Customer Experience', parentId: 20 },
        { id: 2002, slug: 'inventory_management', name: 'Inventory Management', parentId: 20 },
        { id: 2003, slug: 'online_retail', name: 'Online Retail', parentId: 20 },
        { id: 2004, slug: 'order_fulfillment', name: 'Order Fulfillment', parentId: 20 },
        { id: 2005, slug: 'point_of_sale', name: 'Point of Sale', parentId: 20 },
        { id: 2006, slug: 'retail_analytics', name: 'Retail Analytics', parentId: 20 },
      ],
    },
    {
      id: 21,
      slug: 'social_services',
      name: 'Social Services',
      children: [
        { id: 2101, slug: 'case_management', name: 'Case Management', parentId: 21 },
        {
          id: 2102,
          slug: 'child_and_family_services',
          name: 'Child and Family Services',
          parentId: 21,
        },
        { id: 2103, slug: 'community_outreach', name: 'Community Outreach', parentId: 21 },
        { id: 2104, slug: 'disability_services', name: 'Disability Services', parentId: 21 },
        { id: 2105, slug: 'housing_assistance', name: 'Housing Assistance', parentId: 21 },
        { id: 2106, slug: 'mental_health_services', name: 'Mental Health Services', parentId: 21 },
      ],
    },
    {
      id: 22,
      slug: 'sports_and_fitness',
      name: 'Sports and Fitness',
      children: [
        { id: 2201, slug: 'athletic_training', name: 'Athletic Training', parentId: 22 },
        { id: 2202, slug: 'fitness_and_wellness', name: 'Fitness and Wellness', parentId: 22 },
        { id: 2203, slug: 'sports_analytics', name: 'Sports Analytics', parentId: 22 },
        { id: 2204, slug: 'sports_management', name: 'Sports Management', parentId: 22 },
        { id: 2205, slug: 'sports_medicine', name: 'Sports Medicine', parentId: 22 },
        { id: 2206, slug: 'sports_technology', name: 'Sports Technology', parentId: 22 },
      ],
    },
    {
      id: 23,
      slug: 'insurance',
      name: 'Insurance',
      children: [
        { id: 2301, slug: 'actuarial_science', name: 'Actuarial Science', parentId: 23 },
        { id: 2302, slug: 'claims_processing', name: 'Claims Processing', parentId: 23 },
        { id: 2303, slug: 'insurance_sales', name: 'Insurance Sales', parentId: 23 },
        { id: 2304, slug: 'insurtech', name: 'InsurTech', parentId: 23 },
        { id: 2305, slug: 'policy_management', name: 'Policy Management', parentId: 23 },
        { id: 2306, slug: 'underwriting', name: 'Underwriting', parentId: 23 },
      ],
    },
    {
      id: 24,
      slug: 'marketing_and_advertising',
      name: 'Marketing and Advertising',
      children: [
        { id: 2401, slug: 'advertising', name: 'Advertising', parentId: 24 },
        { id: 2402, slug: 'brand_management', name: 'Brand Management', parentId: 24 },
        { id: 2403, slug: 'digital_marketing', name: 'Digital Marketing', parentId: 24 },
        { id: 2404, slug: 'market_research', name: 'Market Research', parentId: 24 },
        { id: 2405, slug: 'marketing_analytics', name: 'Marketing Analytics', parentId: 24 },
        { id: 2406, slug: 'marketing_automation', name: 'Marketing Automation', parentId: 24 },
      ],
    },
  ],
};

/**
 * Flat map of all domains by slug for quick lookup
 */
export const DOMAINS_BY_SLUG: Map<string, TaxonomyCategory> = new Map();

/**
 * Flat map of all domains by ID for quick lookup
 */
export const DOMAINS_BY_ID: Map<number, TaxonomyCategory> = new Map();

// Build lookup maps
function buildDomainMaps(categories: TaxonomyCategory[], parent?: TaxonomyCategory) {
  for (const category of categories) {
    // For child categories, create composite slug: parent_slug/child_slug
    const fullSlug = parent ? `${parent.slug}/${category.slug}` : category.slug;
    DOMAINS_BY_SLUG.set(fullSlug, category);
    DOMAINS_BY_ID.set(category.id, category);

    if (category.children) {
      buildDomainMaps(category.children, category);
    }
  }
}

buildDomainMaps(DOMAINS_TAXONOMY.categories);
