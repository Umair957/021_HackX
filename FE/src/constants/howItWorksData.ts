import { 
  LogIn, User, UploadCloud, Search, 
  Database, Settings, FileJson, BarChart3,
  type LucideIcon
} from "lucide-react";

export interface Feature {
  title: string;
  desc: string;
}

export interface StepData {
  id: number;
  title: string;
  description: string;
  contentTitle: string;
  contentDesc: string;
  features: Feature[];
  iconType: LucideIcon;
}

export const builderStepsData: StepData[] = [
  {
    id: 1,
    title: "Login or Register",
    description: "Follow the whole step and you're just ready to get started.",
    contentTitle: "Create your Account",
    contentDesc: "Sign up quickly using your email or social media accounts to get started immediately.",
    features: [
      { title: "Quick Access", desc: "Login with Google or LinkedIn." },
      { title: "Secure Platform", desc: "Your data is encrypted and safe." },
    ],
    iconType: LogIn,
  },
  {
    id: 2,
    title: "Fill your Personal Data",
    description: "Finish your register and complete your personal data.",
    contentTitle: "Fill your Personal Data",
    contentDesc: "Finish your register and complete your personal data and prepare your resume.",
    features: [
      { title: "One workflow", desc: "Easily collaborate with teams." },
      { title: "Easier Applying", desc: "Create account that engages profiles." },
    ],
    iconType: User,
  },
  {
    id: 3,
    title: "Upload your Resume",
    description: "Upload your latest resume that matches your background.",
    contentTitle: "Upload your CV/Resume",
    contentDesc: "Our system parses your resume automatically to fill in details and match jobs.",
    features: [
      { title: "Smart Parsing", desc: "Extract skills automatically." },
      { title: "Multiple Formats", desc: "Support for PDF, DOCX, and TXT." },
    ],
    iconType: UploadCloud,
  },
  {
    id: 4,
    title: "Find the Match Job",
    description: "Look for job vacancies and immediately get your dream job.",
    contentTitle: "Get Hired Fast",
    contentDesc: "Browse through thousands of job listings tailored specifically to your skill set.",
    features: [
      { title: "Smart Filters", desc: "Filter by location and salary." },
      { title: "Instant Alerts", desc: "Get notified on new matches." },
    ],
    iconType: Search,
  },
];

export const analyzerStepsData: StepData[] = [
  {
    id: 1,
    title: "Connect Data Source",
    description: "Link your HRIS or database to import candidate pools.",
    contentTitle: "Integrate Your Data",
    contentDesc: "Seamlessly connect with your existing ATS or database to pull candidate information.",
    features: [
      { title: "One-Click Sync", desc: "Works with Greenhouse, Lever, etc." },
      { title: "Real-time Update", desc: "Data stays fresh automatically." },
    ],
    iconType: Database,
  },
  {
    id: 2,
    title: "Configure Metrics",
    description: "Define what success looks like for this specific role.",
    contentTitle: "Set Scoring Parameters",
    contentDesc: "Customize the weighing logic for skills, experience, and education to match your needs.",
    features: [
      { title: "Custom Weights", desc: "Prioritize skills over degrees." },
      { title: "Bias Prevention", desc: "Toggle blind screening options." },
    ],
    iconType: Settings,
  },
  {
    id: 3,
    title: "Run Analysis",
    description: "Let the AI process thousands of profiles in seconds.",
    contentTitle: "AI-Powered Screening",
    contentDesc: "Our engine analyzes every resume against your metrics to surface the top 1% talent.",
    features: [
      { title: "Deep Learning", desc: "Understands context, not just keywords." },
      { title: "Fast Processing", desc: "Analyze 10k+ resumes in minutes." },
    ],
    iconType: FileJson,
  },
  {
    id: 4,
    title: "View Insights",
    description: "Get detailed reports and ranking of best candidates.",
    contentTitle: "Actionable Analytics",
    contentDesc: "Visualize candidate scores and get detailed explanations for every recommendation.",
    features: [
      { title: "Visual Dashboards", desc: "See talent distribution charts." },
      { title: "Export Reports", desc: "Share PDF summaries with stakeholders." },
    ],
    iconType: BarChart3,
  },
];
