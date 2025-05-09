import { FileAttachment } from './types';

export const fileAttachments: FileAttachment[] = [
  {
    id: "file-01",
    fileName: "dashboard-design-mockup-v2.fig",
    originalFileName: "dashboard-design-mockup-v2.fig",
    description: "Latest version of the user dashboard design",
    fileUrl: "https://example.com/files/dashboard-design-mockup-v2.fig",
    fileType: "application/figma",
    fileSize: 4582912,
    userId: "user-05",
    taskId: "task-01",
    createdAt: "2023-03-07T11:30:00Z",
  },
  {
    id: "file-02",
    fileName: "dashboard-components-specs.pdf",
    originalFileName: "Dashboard Components - Technical Specifications.pdf",
    description: "Technical specifications for the dashboard UI components",
    fileUrl: "https://example.com/files/dashboard-components-specs.pdf",
    fileType: "application/pdf",
    fileSize: 2457600,
    userId: "user-05",
    taskId: "task-01",
    createdAt: "2023-03-09T14:45:00Z",
  },
  {
    id: "file-03",
    fileName: "api-architecture-diagram.png",
    originalFileName: "API Architecture Diagram.png",
    description: "High-level architecture diagram for the new API",
    fileUrl: "https://example.com/files/api-architecture-diagram.png",
    fileType: "image/png",
    fileSize: 1843200,
    userId: "user-12",
    taskId: "task-08",
    createdAt: "2023-03-20T13:45:00Z",
  },
  {
    id: "file-04",
    fileName: "api-endpoints-documentation.pdf",
    originalFileName: "API Endpoints Documentation.pdf",
    description: "Detailed documentation of all new API endpoints",
    fileUrl: "https://example.com/files/api-endpoints-documentation.pdf",
    fileType: "application/pdf",
    fileSize: 3932160,
    userId: "user-12",
    taskId: "task-08",
    createdAt: "2023-03-25T10:15:00Z",
  },
  {
    id: "file-05",
    fileName: "test-automation-frameworks-comparison.xlsx",
    originalFileName: "Test Automation Frameworks Comparison.xlsx",
    description: "Comparison of different test automation frameworks",
    fileUrl:
      "https://example.com/files/test-automation-frameworks-comparison.xlsx",
    fileType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileSize: 1228800,
    userId: "user-04",
    taskId: "task-11",
    createdAt: "2023-04-12T16:25:00Z",
  },
  {
    id: "file-06",
    fileName: "component-library-storybook.zip",
    originalFileName: "UI Component Library - Storybook.zip",
    description: "Storybook package with all UI components",
    fileUrl: "https://example.com/files/component-library-storybook.zip",
    fileType: "application/zip",
    fileSize: 7340032,
    userId: "user-05",
    taskId: "task-12",
    createdAt: "2023-03-10T15:40:00Z",
  },
  {
    id: "file-07",
    fileName: "solar-dashboard-mockup.sketch",
    originalFileName: "Solar Panel Dashboard Design.sketch",
    description: "Design mockup for the solar panel monitoring dashboard",
    fileUrl: "https://example.com/files/solar-dashboard-mockup.sketch",
    fileType: "application/octet-stream",
    fileSize: 5242880,
    userId: "user-05",
    taskId: "task-13",
    createdAt: "2023-03-20T14:30:00Z",
  },
  {
    id: "file-08",
    fileName: "security-vulnerability-report.pdf",
    originalFileName: "Security Vulnerability Assessment Report.pdf",
    description:
      "Detailed report of security vulnerabilities and remediation plans",
    fileUrl: "https://example.com/files/security-vulnerability-report.pdf",
    fileType: "application/pdf",
    fileSize: 4718592,
    userId: "user-14",
    taskId: "task-30",
    createdAt: "2023-04-20T15:30:00Z",
  },
  {
    id: "file-09",
    fileName: "zero-trust-architecture-proposal.pptx",
    originalFileName: "Zero-Trust Architecture Implementation Proposal.pptx",
    description: "Proposal for implementing zero-trust security architecture",
    fileUrl:
      "https://example.com/files/zero-trust-architecture-proposal.pptx",
    fileType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    fileSize: 3670016,
    userId: "user-14",
    taskId: "task-31",
    createdAt: "2023-05-08T14:30:00Z",
  },
  {
    id: "file-10",
    fileName: "ml-model-exploratory-analysis.ipynb",
    originalFileName: "Exploratory Analysis for Predictive Models.ipynb",
    description:
      "Jupyter notebook with exploratory data analysis for ML models",
    fileUrl: "https://example.com/files/ml-model-exploratory-analysis.ipynb",
    fileType: "application/json",
    fileSize: 2097152,
    userId: "user-07",
    taskId: "task-34",
    createdAt: "2023-05-16T16:30:00Z",
  },
  {
    id: "file-11",
    fileName: "mobile-app-wireframes.pdf",
    originalFileName: "Mobile App Redesign - Wireframes.pdf",
    description: "Wireframes for the mobile app redesign",
    fileUrl: "https://example.com/files/mobile-app-wireframes.pdf",
    fileType: "application/pdf",
    fileSize: 3145728,
    userId: "user-05",
    taskId: "task-39",
    createdAt: "2023-05-08T15:30:00Z",
  },
  {
    id: "file-12",
    fileName: "executive-dashboard-demo.mp4",
    originalFileName: "CTO Executive Dashboard Demo.mp4",
    description: "Video demo of the executive dashboard for the CTO",
    fileUrl: "https://example.com/files/executive-dashboard-demo.mp4",
    fileType: "video/mp4",
    fileSize: 15728640,
    userId: "user-02",
    taskId: "task-42",
    createdAt: "2023-05-18T11:15:00Z",
  },
  {
    id: "file-13",
    fileName: "cloud-migration-network-diagrams.pdf",
    originalFileName: "Cloud Migration - Network Architecture Diagrams.pdf",
    description: "Network diagrams for the cloud migration",
    fileUrl: "https://example.com/files/cloud-migration-network-diagrams.pdf",
    fileType: "application/pdf",
    fileSize: 2809856,
    userId: "user-16",
    taskId: "task-27",
    createdAt: "2023-03-22T10:30:00Z",
  },
  {
    id: "file-14",
    fileName: "accessibility-audit-report.pdf",
    originalFileName: "WCAG 2.1 AA Compliance Audit Report.pdf",
    description: "Detailed accessibility audit findings and recommendations",
    fileUrl: "https://example.com/files/accessibility-audit-report.pdf",
    fileType: "application/pdf",
    fileSize: 3407872,
    userId: "user-11",
    taskId: "task-41",
    createdAt: "2023-05-19T14:30:00Z",
  },
  {
    id: "file-15",
    fileName: "onboarding-tutorial-prototype.fig",
    originalFileName: "User Onboarding Tutorial - Interactive Prototype.fig",
    description: "Interactive prototype for the user onboarding tutorial",
    fileUrl: "https://example.com/files/onboarding-tutorial-prototype.fig",
    fileType: "application/figma",
    fileSize: 4194304,
    userId: "user-05",
    taskId: "task-23",
    createdAt: "2023-04-15T13:20:00Z",
  },
];