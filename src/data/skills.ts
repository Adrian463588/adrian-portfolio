import { SkillCategory } from "@/types";

export const skills: SkillCategory[] = [
  {
    title: "BACKEND",
    icon: "Server",
    colorKey: "blue",
    skills: ["Golang", "Python", "Gin", "PHP", "Laravel", "PostgreSQL", "AWS"],
  },
  {
    title: "DEVOPS",
    icon: "Container",
    colorKey: "orange",
    skills: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "Terraform",
      "Ansible",
      "GCP",
    ],
  },
  {
    title: "MOBILE",
    icon: "Smartphone",
    colorKey: "indigo",
    skills: [
      "Android",
      "Kotlin",
      "Flutter",
      "Dart",
      "GetX",
      "Jetpack Compose",
      "Firebase",
    ],
  },
  {
    title: "QA & TEST",
    icon: "ShieldCheck",
    colorKey: "purple",
    skills: ["Selenium", "Appium", "Postman", "JMeter", "Cucumber"],
  },
  {
    title: "SECURITY",
    icon: "Lock",
    colorKey: "red",
    skills: [
      "CompTIA Sec+",
      "Network+",
      "Vuln Scan",
      "Nuclei",
      "Ethical Hacking",
    ],
  },
  {
    title: "WEB DEV",
    icon: "Globe",
    colorKey: "teal",
    skills: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "MySQL", "Laravel"],
  },
  {
    title: "DATA SCIENCE",
    icon: "BarChart2",
    colorKey: "emerald",
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Statistics",
    ],
  },
];
