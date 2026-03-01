export interface ExperienceEntry {
  category: "professional" | "bootcamp" | "training";
  title: string;
  organization: string;
  location?: string;
  dateRange: string;
  color: string;
  bullets: string[];
  repoUrl?: string;
}

export interface ProjectEntry {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  stack: string[];
  role: string;
  repoUrl?: string;
  liveUrl?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  colorKey: string;
  skills: string[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  location?: string;
}

export interface LeadershipEntry {
  organization: string;
  role: string;
  period: string;
  bullets: string[];
}
