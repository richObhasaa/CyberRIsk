/**
 * NIST CSF Seed Script
 * Run: npx ts-node src/seed.ts
 *
 * Seeds nist_categories and nist_questions tables.
 * Subcategory IDs must match existing rows in nist_subcategories.
 */
import { supabase } from "./db/supabase";

/* ──────────────────────────────────────────
   NIST CATEGORIES
   These match the parent of each subcategory_id
───────────────────────────────────────── */
const categories = [
  { id: "DE.AE", name: "Anomalies and Events" },
  { id: "DE.CM", name: "Security Continuous Monitoring" },
  { id: "DE.DP", name: "Detection Processes" },
  { id: "GV.OC", name: "Organizational Context" },
  { id: "GV.OV", name: "Oversight" },
  { id: "GV.PO", name: "Policy" },
  { id: "GV.RM", name: "Risk Management Strategy" },
  { id: "GV.RR", name: "Roles, Responsibilities, and Authorities" },
  { id: "ID.AM", name: "Asset Management" },
  { id: "ID.RA", name: "Risk Assessment" },
  { id: "ID.SC", name: "Supply Chain Risk Management" },
  { id: "PR.AC", name: "Identity Management, Authentication and Access Control" },
  { id: "PR.AT", name: "Awareness and Training" },
  { id: "PR.DS", name: "Data Security" },
  { id: "PR.IP", name: "Information Protection Processes and Procedures" },
  { id: "PR.MA", name: "Maintenance" },
  { id: "PR.PT", name: "Protective Technology" },
  { id: "RC.CO", name: "Communications" },
  { id: "RC.IM", name: "Improvements" },
  { id: "RC.RP", name: "Recovery Planning" },
  { id: "RS.AN", name: "Analysis" },
  { id: "RS.CO", name: "Communications" },
  { id: "RS.IM", name: "Improvements" },
  { id: "RS.MI", name: "Mitigation" },
  { id: "RS.RP", name: "Response Planning" },
];

/* ──────────────────────────────────────────
   QUESTIONS
   Valid subcategory IDs in database:
   DE.AE-01, DE.CM-01, DE.DP-01,
   GV.OC-01, GV.OV-01, GV.PO-01, GV.RM-01, GV.RR-01,
   ID.AM-01, ID.AM-02, ID.RA-01, ID.SC-01,
   PR.AC-01, PR.AC-02, PR.AT-01, PR.DS-01, PR.IP-01, PR.MA-01, PR.PT-01,
   RC.CO-01, RC.IM-01, RC.RP-01,
   RS.AN-01, RS.CO-01, RS.IM-01, RS.MI-01, RS.RP-01
───────────────────────────────────────── */
type QRow = {
  mode: string;
  subcategory_id: string;
  question_text: string;
  weight: number;
};

function q(mode: string, sub: string, text: string, weight = 1): QRow {
  return { mode, subcategory_id: sub, question_text: text, weight };
}

const questions: QRow[] = [
  /* ──────── DETECT ──────── */
  q("IT", "DE.AE-01", "A baseline of network operations and expected data flows for users and systems is established and managed."),
  q("IT", "DE.CM-01", "Networks and network services are monitored to find potentially adverse events."),
  q("IT", "DE.DP-01", "Roles and responsibilities for detection are well defined to ensure accountability."),

  q("NON_IT", "DE.AE-01", "Is normal system and network behaviour defined so that unusual activity can be detected?"),
  q("NON_IT", "DE.AE-01", "Are suspicious events investigated to understand their cause and potential impact?"),
  q("NON_IT", "DE.CM-01", "Is network traffic monitored for signs of suspicious or unauthorized activity?"),
  q("NON_IT", "DE.CM-01", "Are security alerts from monitoring tools reviewed in a timely manner?"),
  q("NON_IT", "DE.DP-01", "Are detection responsibilities clearly assigned to specific staff or teams?"),
  q("NON_IT", "DE.DP-01", "Are detection processes tested and reviewed to ensure they work effectively?"),

  /* ──────── GOVERN ──────── */
  q("IT", "GV.OC-01", "The organizational mission is understood and informs cybersecurity risk management."),
  q("IT", "GV.OV-01", "Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy."),
  q("IT", "GV.PO-01", "Policy for managing cybersecurity risks is established, reviewed, and enforced."),
  q("IT", "GV.RM-01", "Risk management objectives are established and agreed to by organization stakeholders."),
  q("IT", "GV.RR-01", "Roles, responsibilities, and authorities for cybersecurity are established and communicated."),

  q("NON_IT", "GV.OC-01", "Does your organization have a documented mission that guides cybersecurity decisions?"),
  q("NON_IT", "GV.OC-01", "Are internal and external stakeholder cybersecurity needs identified and considered?"),
  q("NON_IT", "GV.OV-01", "Does leadership periodically review cybersecurity outcomes and adjust strategy accordingly?"),
  q("NON_IT", "GV.OV-01", "Are cybersecurity performance results reported to senior management?"),
  q("NON_IT", "GV.PO-01", "Does your organization have a formal, documented cybersecurity policy?"),
  q("NON_IT", "GV.PO-01", "Is the cybersecurity policy communicated to all relevant staff and reviewed regularly?"),
  q("NON_IT", "GV.RM-01", "Has leadership established and communicated cybersecurity risk management objectives?"),
  q("NON_IT", "GV.RM-01", "Is the organization's risk appetite defined and used to guide security decisions?"),
  q("NON_IT", "GV.RR-01", "Are cybersecurity roles and responsibilities clearly assigned across the organization?"),
  q("NON_IT", "GV.RR-01", "Is adequate budget allocated to cybersecurity based on identified risks?"),

  /* ──────── IDENTIFY ──────── */
  q("IT", "ID.AM-01", "Inventories of hardware managed by the organization are maintained."),
  q("IT", "ID.AM-02", "Inventories of software, services, and systems managed by the organization are maintained."),
  q("IT", "ID.RA-01", "Vulnerabilities in assets are identified, validated, and recorded."),
  q("IT", "ID.SC-01", "A cybersecurity supply chain risk management program, strategy, and process are established."),

  q("NON_IT", "ID.AM-01", "Does your organization maintain an up-to-date inventory of all hardware devices?"),
  q("NON_IT", "ID.AM-01", "Are hardware assets tracked and decommissioned through a formal process?"),
  q("NON_IT", "ID.AM-02", "Is there a complete, current inventory of all software and applications in use?"),
  q("NON_IT", "ID.AM-02", "Are unauthorized software installations detected and addressed?"),
  q("NON_IT", "ID.RA-01", "Are vulnerability scans conducted regularly across your organization's systems?"),
  q("NON_IT", "ID.RA-01", "Are identified vulnerabilities prioritized and remediated in a timely manner?"),
  q("NON_IT", "ID.SC-01", "Does your organization assess cybersecurity risks posed by suppliers and third parties?"),
  q("NON_IT", "ID.SC-01", "Are cybersecurity requirements included in contracts with vendors and service providers?"),

  /* ──────── PROTECT ──────── */
  q("IT", "PR.AC-01", "Identities and credentials for authorized users, services, and hardware are managed."),
  q("IT", "PR.AC-02", "Physical access to assets is managed, monitored, and enforced commensurate with risk."),
  q("IT", "PR.AT-01", "Personnel are provided with cybersecurity awareness and training."),
  q("IT", "PR.DS-01", "Data-at-rest is protected with appropriate controls."),
  q("IT", "PR.IP-01", "A baseline configuration of IT/OT systems is created and maintained."),
  q("IT", "PR.MA-01", "Maintenance and repair of organizational assets is performed and logged."),
  q("IT", "PR.PT-01", "Audit/log records are determined, documented, implemented, and reviewed."),

  q("NON_IT", "PR.AC-01", "Are user accounts and credentials managed, reviewed, and revoked when no longer needed?"),
  q("NON_IT", "PR.AC-01", "Is multi-factor authentication used for access to sensitive systems?"),
  q("NON_IT", "PR.AC-02", "Is physical access to server rooms and sensitive areas controlled and logged?"),
  q("NON_IT", "PR.AC-02", "Are physical access rights reviewed and updated when staff change roles?"),
  q("NON_IT", "PR.AT-01", "Are all employees provided with regular cybersecurity awareness training?"),
  q("NON_IT", "PR.AT-01", "Are phishing simulations or security drills conducted to test staff awareness?"),
  q("NON_IT", "PR.DS-01", "Is sensitive data encrypted when stored on systems or removable media?"),
  q("NON_IT", "PR.DS-01", "Are data backups created regularly, protected, and tested for restoration?"),
  q("NON_IT", "PR.IP-01", "Are system configurations documented and managed against a secure baseline?"),
  q("NON_IT", "PR.IP-01", "Are software patches and security updates applied in a timely manner?"),
  q("NON_IT", "PR.MA-01", "Is maintenance of systems performed by authorized personnel and logged?"),
  q("NON_IT", "PR.MA-01", "Are remote maintenance sessions secured and monitored?"),
  q("NON_IT", "PR.PT-01", "Are system and security event logs enabled, retained, and reviewed regularly?"),
  q("NON_IT", "PR.PT-01", "Are log records protected from unauthorized access or tampering?"),

  /* ──────── RECOVER ──────── */
  q("IT", "RC.CO-01", "Public relations are managed following a cybersecurity incident."),
  q("IT", "RC.IM-01", "Recovery plans incorporate lessons learned."),
  q("IT", "RC.RP-01", "A recovery plan is executed during or after a cybersecurity incident."),

  q("NON_IT", "RC.CO-01", "Does your organization have a communications plan for notifying stakeholders after an incident?"),
  q("NON_IT", "RC.CO-01", "Are public statements about cybersecurity incidents reviewed and approved before release?"),
  q("NON_IT", "RC.IM-01", "Are lessons learned from incidents used to improve recovery plans?"),
  q("NON_IT", "RC.IM-01", "Are recovery plan exercises conducted to validate effectiveness?"),
  q("NON_IT", "RC.RP-01", "Does the organization have a documented recovery plan that is actioned after an incident?"),
  q("NON_IT", "RC.RP-01", "Are backups verified before being used for system restoration?"),

  /* ──────── RESPOND ──────── */
  q("IT", "RS.AN-01", "Notifications from detection systems are investigated."),
  q("IT", "RS.CO-01", "Personnel know their roles and order of operations when a response is needed."),
  q("IT", "RS.IM-01", "Response plans incorporate lessons learned."),
  q("IT", "RS.MI-01", "Incidents are contained."),
  q("IT", "RS.RP-01", "A response plan is executed during or after a cybersecurity incident."),

  q("NON_IT", "RS.AN-01", "Are security alerts and incidents investigated to determine their root cause and scope?"),
  q("NON_IT", "RS.AN-01", "Is forensic evidence from incidents collected and preserved for analysis?"),
  q("NON_IT", "RS.CO-01", "Do staff know their roles and responsibilities when responding to a cybersecurity incident?"),
  q("NON_IT", "RS.CO-01", "Are internal and external stakeholders notified promptly when an incident occurs?"),
  q("NON_IT", "RS.IM-01", "Are lessons learned from past incidents used to improve response processes?"),
  q("NON_IT", "RS.IM-01", "Are response improvements tracked and verified after implementation?"),
  q("NON_IT", "RS.MI-01", "Are procedures in place to contain an incident and prevent it from spreading?"),
  q("NON_IT", "RS.MI-01", "Are eradication steps performed after containment to remove threats from systems?"),
  q("NON_IT", "RS.RP-01", "Does the organization follow a documented incident response plan when an incident is declared?"),
  q("NON_IT", "RS.RP-01", "Are incident response plan exercises conducted at least annually?"),
];

/* ──────────────────────────────────────────
   SEED FUNCTION
───────────────────────────────────────── */
async function seed() {
  console.log("🌱 Seeding nist_categories...");
  const { error: catError } = await supabase
    .from("nist_categories")
    .upsert(categories, { onConflict: "id" });

  if (catError) {
    console.error("❌ Error seeding categories:", catError.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  console.log("🌱 Seeding nist_questions...");

  // Clear existing questions
  const { error: delError } = await supabase
    .from("nist_questions")
    .delete()
    .in("mode", ["IT", "NON_IT"]);

  if (delError) {
    console.error("⚠️  Could not clear existing questions:", delError.message);
  }

  // Insert in batches of 50
  const batchSize = 50;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const { error } = await supabase.from("nist_questions").insert(batch);
    if (error) {
      console.error(`❌ Error seeding batch ${i}:`, error.message);
      process.exit(1);
    }
    console.log(`   Inserted questions ${i + 1}–${Math.min(i + batchSize, questions.length)}`);
  }

  console.log(`✅ Seeded ${questions.length} questions`);
  console.log("🎉 Seed complete!");
  process.exit(0);
}

seed();
