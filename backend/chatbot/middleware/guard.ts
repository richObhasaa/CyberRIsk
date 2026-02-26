import { Request, Response, NextFunction } from "express"

const allowedKeywords: string[] = [
  "nist csf",
  "cybersecurity framework",
  "identify",
  "protect",
  "detect",
  "respond",
  "recover",
  "cyber",
  "security",
  "risk management"
]

const allowedQuestions: string[] = [
  "is communication handled properly during recovery from incidents",
  "can your company restore operations after disruption",
  "does your company have a clear cybersecurity direction supported by top management",
  "does your company formally manage cybersecurity risks as part of business decisions",
  "do employees clearly understand their cybersecurity responsibilities",
  "does your company have written security policies that are followed",
  "does leadership actively review and monitor cybersecurity risks",
  "do you know and track all devices used in your company",
  "do you track all software applications used in your organization",
  "has your company formally evaluated cybersecurity risks before",
  "do you assess security risks from vendors and external partners",
  "does each employee have a unique login and no password sharing",
  "is system access removed when employees change roles or leave the company",
  "do employees receive cybersecurity awareness training",
  "is important company data protected from unauthorized access",
  "does your company have clear written security policies",
  "are systems maintained in a secure and controlled manner",
  "does your company use security tools like antivirus, firewall, or endpoint protection",
  "would you know if unusual or suspicious activity happens in your systems",
  "do you have systems that continuously monitor and alert you about security issues",
  "are your monitoring processes reviewed and improved regularly",
  "does your company have a clear plan for handling cyber incidents",
  "are employees and stakeholders clearly informed during security incidents",
  "are incidents investigated to understand what caused them",
  "can your company quickly contain and limit damage during a cyber incident",
  "does your company improve security measures after incidents occur",
  "does your company improve processes after experiencing disruptions"
]

export const guardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { message } = req.body as { message?: string }

  if (!message) {
    res.status(400).json({ error: "Message is required" })
    return
  }

  const lower = message.toLowerCase()

  const isAllowed =
    allowedKeywords.some(k => lower.includes(k)) ||
    allowedQuestions.some(q => lower.includes(q))

  if (!isAllowed) {
    res.status(400).json({
      error: "Out of context. Only NIST CSF / cybersecurity topics allowed."
    })
    return
  }

  next()
}