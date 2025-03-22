import { Bot, Gauge, Mail, Shield, UserPlus } from "lucide-react";

const demoIcons = {
    bot: <Bot className="w-6 h-6" />,
    gauge: <Gauge className="w-6 h-6" />,
    shield: <Shield className="w-6 h-6" />,
    email: <Mail className="w-6 h-6" />,
    signup: <UserPlus className="w-6 h-6" />,
};

export const demos = [
  {
    title: "Bot Detection",
    description: "Identify and block unwanted bot traffic while allowing legitimate bots.",
    href: "/demo/bot-detection",
    icon: demoIcons.bot,
  },
  {
    title: "Rate Limiting",
    description: "Implement flexible rate limiting with token bucket algorithm.",
    href: "/demo/rate-limit",
    icon: demoIcons.gauge,
  },
  {
    title: "Shield WAF Protection",
    description: "Protect against SQL injection, XSS, and other common web attacks.",
    href: "/demo/shield-waf-protection",
    icon: demoIcons.shield,
  },
  {
    title: "Email Validation",
    description: "Validate & verify an email address and prevent fake signups and reduce spam or fraudulent accounts efficiently.",
    href: "/demo/email-validation",
    icon: demoIcons.email,
  },
  {
    title: "Signup Form Protection",
    description: "Protect signup forms from abuse, bots, and disposable emails.",
    href: "/demo/signup-form-protection",
    icon: demoIcons.signup,
  },
];