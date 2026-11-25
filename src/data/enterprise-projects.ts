import type { Project } from "@/types";
import { getApprovedEnterpriseProjects } from "@/lib/projects";

export const enterpriseProjectsCatalog: Project[] = [
  {
    id: "archer-upgrade",
    slug: "archer-upgrade",
    title: "Archer Upgrade — Enterprise Collection System Modernization",
    subtitle: "Automated Web Testing & CI Quality Verification",
    summary:
      "End-to-end Cypress test automation and Jenkins CI regression validation supporting legacy AOL UniPaaS collection system modernization to a React-based web platform.",
    description:
      "Contributed automated web quality verification during modernization of an enterprise automotive financing collection platform from legacy AOL UniPaaS workflows into a React-based web interface inside the Astra Credit Companies (ACC) Group ecosystem.",
    category: "Enterprise Application Modernization",
    secondaryCategories: ["QA & Test Automation", "DevOps & CI/CD", "Financial Systems"],
    technologies: [
      "Cypress",
      "Jenkins",
      "AOL UniPaaS",
      "React-based Web Application",
      "Automated Web Testing",
      "Regression Testing",
    ],
    screenshots: [],
    personalContribution:
      "Authored and maintained Cypress end-to-end automated web test suites targeting migrated collection application flows, integrated automated test execution into Jenkins CI pipelines, and validated functional parity against legacy AOL UniPaaS behaviors.",
    projectStatus: "completed",
    projectOrigin: "professional",
    visibility: "public-sanitized",
    publicDisclosureApproved: true,
    companyId: "berijalan-acc",
    associatedRoleIds: ["berijalan-freelance", "berijalan-trainee"],
    organization: "Berijalan Techno Center",
    legalEntity: "PT Cipta Sedaya Digital Indonesia",
    corporateGroup: "Astra Credit Companies (ACC) Group",
    businessDomain: "Enterprise Automotive Financing — Collection Workflows",
    testingType: "Automated Web & Regression Testing",
    testingTools: ["Cypress", "Automated E2E Scenarios"],
    ciTools: ["Jenkins CI Pipelines"],
    applicationTechnologies: ["React-based Web Application (Target)", "AOL UniPaaS (Legacy)"],
    conceptualFlow: [
      {
        label: "Legacy Collection Baseline",
        detail: "AOL UniPaaS operational flows documented as functional parity reference.",
      },
      {
        label: "React Web Interface (AUT)",
        detail: "Modernized collection screens tested end-to-end for regression stability.",
      },
      {
        label: "Cypress Automated Suite",
        detail: "Automated UI & business-flow verification scripts executed on target builds.",
      },
      {
        label: "Jenkins CI Pipeline Gate",
        detail: "Continuous test execution feedback and build verification reporting.",
      },
    ],
    tier: "catalog",
    featured: false,
    editorialOrder: 1,
    updatedAt: "2026-10-15",
    hasCiWorkflow: true,
    sourceReferences: ["https://berijalan.co.id/"],
    problemStatement:
      "Modernizing core collection workflows from legacy desktop/metadata-driven AOL UniPaaS screens into a React-based web platform introduced regression risk across multi-step operational states and validations.",
    proposedSolution:
      "Designed repeatable Cypress web automation suites integrated with Jenkins CI pipelines so modernized collection user journeys could be verified continuously alongside functional validation of the legacy baseline.",
    architectureSummary:
      "Browser automation suite structured around independent end-to-end collection flows wired into Jenkins CI execution stages. (Conceptual workflow shown at an abstracted disclosure level; React serves strictly as the application under test.)",
    implementedFeatures: [
      "Automated Cypress web scenarios validating modernized collection screen workflows.",
      "Jenkins CI test execution integration for recurring regression feedback.",
      "Cross-check validation comparing modernized web behaviors against AOL UniPaaS legacy baselines.",
    ],
    engineeringChallenges: [
      "Maintaining deterministic test execution across multi-stage collection business states during incremental UI migration.",
      "Isolating test data setup and asynchronous web transitions without relying on brittle UI sleeps.",
    ],
    testingStrategy:
      "Combined Cypress headless E2E regression runs in Jenkins CI with targeted manual verification around legacy-to-modern workflow parity.",
    securityConsiderations:
      "Published documentation excludes internal repository paths, Jenkins host details, UAT credentials, customer contracts, and proprietary test datasets in compliance with employer confidentiality boundaries.",
    resultsAndLimitations:
      "Delivered consistent automated regression coverage for modernized web flows; no internal timing telemetry, defect counts, or proprietary screenshots are disclosed externally.",
  },
  {
    id: "stnk-alignment",
    slug: "stnk-alignment",
    title: "STNK Alignment — Vehicle Registration Process Alignment",
    subtitle: "Enterprise Functional & Business Workflow Validation",
    summary:
      "Manual functional quality engineering validating vehicle registration (STNK) business process updates and multi-module alignment across AOL UniPaaS and Magic xpa.",
    description:
      "Validated functional behavior, status consistency, and edge-case business flows for automotive financing vehicle registration (STNK) process alignment initiatives across legacy AOL UniPaaS and Magic xpa modules.",
    category: "Financial Systems",
    secondaryCategories: ["QA & Test Automation"],
    technologies: [
      "AOL UniPaaS",
      "Magic xpa",
      "Manual Functional Testing",
      "Business Process Validation",
      "Vehicle Registration Workflows",
    ],
    screenshots: [],
    personalContribution:
      "Executed scenario-driven manual functional testing across STNK operational workflows, verified cross-module data and status alignment between AOL UniPaaS and Magic xpa screens, and documented reproducible functional defects for engineering resolution.",
    projectStatus: "completed",
    projectOrigin: "professional",
    visibility: "public-sanitized",
    publicDisclosureApproved: true,
    companyId: "berijalan-acc",
    associatedRoleIds: ["berijalan-freelance", "berijalan-trainee"],
    organization: "Berijalan Techno Center",
    legalEntity: "PT Cipta Sedaya Digital Indonesia",
    corporateGroup: "Astra Credit Companies (ACC) Group",
    businessDomain: "Enterprise Automotive Financing — Vehicle Registration (STNK) Operations",
    testingType: "Manual Functional & Business Process Testing",
    testingTools: ["Manual Functional Test Scenarios", "Workflow Verification Matrix"],
    ciTools: [],
    applicationTechnologies: ["AOL UniPaaS", "Magic xpa"],
    conceptualFlow: [
      {
        label: "STNK Business Requirement",
        detail: "Updated registration lifecycle rules mapped to testable acceptance scenarios.",
      },
      {
        label: "AOL UniPaaS Operations",
        detail: "Legacy workflow screens verified for state transitions and input boundaries.",
      },
      {
        label: "Magic xpa Module Alignment",
        detail: "Enterprise platform screens checked for cross-system workflow consistency.",
      },
      {
        label: "Verification Sign-Off Notes",
        detail: "Reproducible pass/fail scenario evidence logged in internal QA tracking.",
      },
    ],
    tier: "catalog",
    featured: false,
    editorialOrder: 2,
    updatedAt: "2026-09-20",
    sourceReferences: ["https://berijalan.co.id/"],
    problemStatement:
      "Aligned operational changes in vehicle registration (STNK) handling required downstream consistency across interacting legacy AOL UniPaaS and Magic xpa enterprise applications.",
    proposedSolution:
      "Structured positive, negative, and boundary test scenarios tracing STNK workflow states across both runtime platforms to catch synchronization mismatches early.",
    architectureSummary:
      "Multi-platform enterprise workflow verification spanning AOL UniPaaS and Magic xpa transactional UIs within automotive financing operations.",
    implementedFeatures: [
      "End-to-end validation of STNK status progression and business rule triggers.",
      "Cross-platform behavioral consistency checks between AOL UniPaaS and Magic xpa.",
      "Negative-path and boundary verification for missing or mismatched registration states.",
    ],
    engineeringChallenges: [
      "Tracing implicit business state transitions across metadata-driven AOL UniPaaS and Magic xpa screens.",
      "Designing concise manual test permutations covering interrelated registration preconditions.",
    ],
    testingStrategy:
      "Requirements-based functional test design paired with exploratory boundary checks across staging environments.",
    securityConsiderations:
      "Omitted internal table schemas, operational scripts, customer license/chassis records, and UAT endpoint details per public-disclosure policy.",
    resultsAndLimitations:
      "Verified workflow readiness across aligned STNK updates; exact production metrics and internal project codes remain confidential.",
  },
  {
    id: "advanced-joint-finance-parameter",
    slug: "advanced-joint-finance-parameter",
    title: "Advanced Joint Finance Parameter — Financial System Enhancement",
    subtitle: "Joint Financing Rule & Parameter Configuration QA",
    summary:
      "Manual functional testing and configuration validation of enhanced Joint Financing parameter modules within enterprise AOL UniPaaS financing systems.",
    description:
      "Tested enhanced Joint Financing parameter configuration capabilities and downstream financing workflow behaviors inside enterprise AOL UniPaaS systems serving automotive credit operations.",
    category: "Financial Systems",
    secondaryCategories: ["QA & Test Automation"],
    technologies: [
      "AOL UniPaaS",
      "Manual Functional Testing",
      "Business Rule Validation",
      "Joint Financing",
      "Financial Parameter Configuration",
    ],
    screenshots: [],
    personalContribution:
      "Verified updated Joint Financing parameter screens and downstream business workflows in AOL UniPaaS, designing boundary test cases to ensure parameter configurations behaved predictably without breaking existing financing flows.",
    projectStatus: "completed",
    projectOrigin: "professional",
    visibility: "public-sanitized",
    publicDisclosureApproved: true,
    companyId: "berijalan-acc",
    associatedRoleIds: ["berijalan-freelance", "berijalan-trainee"],
    organization: "Berijalan Techno Center",
    legalEntity: "PT Cipta Sedaya Digital Indonesia",
    corporateGroup: "Astra Credit Companies (ACC) Group",
    businessDomain: "Enterprise Automotive Financing — Joint Financing Parameters",
    testingType: "Manual Functional & Business Rule Testing",
    testingTools: ["Parameter Boundary Matrix", "Manual Functional Test Cases"],
    ciTools: [],
    applicationTechnologies: ["AOL UniPaaS"],
    conceptualFlow: [
      {
        label: "Parameter Setup UI",
        detail: "Extended Joint Financing configuration fields verified for validation guards.",
      },
      {
        label: "Business Rule Evaluation",
        detail: "Boundary and conditional combinations exercised inside AOL UniPaaS.",
      },
      {
        label: "Financing Flow Propagation",
        detail: "Downstream financing workflows checked for regression-free execution.",
      },
    ],
    tier: "catalog",
    featured: false,
    editorialOrder: 3,
    updatedAt: "2026-08-30",
    sourceReferences: ["https://berijalan.co.id/"],
    problemStatement:
      "Extending Joint Financing parameter flexibility introduced complex configuration combinations requiring strict validation against financial workflow regressions.",
    proposedSolution:
      "Applied equivalence partitioning and boundary-value test scenarios in AOL UniPaaS to verify parameter input constraints and downstream flow behavior.",
    architectureSummary:
      "Configuration-driven enterprise module verification inside AOL UniPaaS connecting parameter setup screens to financing transaction workflows.",
    implementedFeatures: [
      "Functional testing of enhanced Joint Financing parameter entry and validation states.",
      "Regression verification ensuring existing standard financing parameters remained intact.",
      "Negative-case testing for invalid parameter combinations and conditional rules.",
    ],
    engineeringChallenges: [
      "Mapping combinatorial parameter options into clean, non-redundant QA scenarios without exposing proprietary financial calculation formulas.",
    ],
    testingStrategy:
      "Manual boundary-value analysis, equivalence partitioning, and regression verification within AOL UniPaaS test environments.",
    securityConsiderations:
      "Excludes specific Joint Financing pricing ratios, partner contracts, SQL formulas, DB columns, and internal defect logs.",
    resultsAndLimitations:
      "Confirmed parameter configuration behavior across functional test scenarios; quantitative transaction figures and internal rule tables are intentionally withheld.",
  },
];

export const enterpriseProjects: Project[] = getApprovedEnterpriseProjects(
  enterpriseProjectsCatalog
);
