import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { USER_ROLES, VERIFICATION_STATUS, JOB_STATUS, TRADE_STATUS, OFFER_STATUS, PRIORITY, PULSE_CATEGORY, NOTIFICATION_CATEGORY } from "../constants/enums.js";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { JobApplication } from "../models/JobApplication.js";
import { JobStatusLog } from "../models/JobStatusLog.js";
import { TradeListing } from "../models/TradeListing.js";
import { TradeOffer } from "../models/TradeOffer.js";
import { TradeTransactionLog } from "../models/TradeTransactionLog.js";
import { Dispute } from "../models/Dispute.js";
import { PulsePost } from "../models/PulsePost.js";
import { Notification } from "../models/Notification.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { ReputationRecord } from "../models/ReputationRecord.js";

async function seed() {
  await connectDb(process.env.MONGODB_URI);

  if (process.env.SEED_RESET === "true") {
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      JobApplication.deleteMany({}),
      JobStatusLog.deleteMany({}),
      TradeListing.deleteMany({}),
      TradeOffer.deleteMany({}),
      TradeTransactionLog.deleteMany({}),
      Dispute.deleteMany({}),
      PulsePost.deleteMany({}),
      Notification.deleteMany({}),
      ActivityLog.deleteMany({}),
      ReputationRecord.deleteMany({})
    ]);
  }

  const users = await User.create([
    {
      fullName: "Aarav Sen",
      username: "aaravgrid",
      email: "aarav@neojam.dev",
      password: "password123",
      role: USER_ROLES.ADMIN,
      sector: "Central Spine",
      bio: "Civic systems administrator for Neo-Jamshedpur.",
      avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=Aarav",
      reputationScore: 430,
      verificationStatus: VERIFICATION_STATUS.VERIFIED
    },
    {
      fullName: "Mira Dutta",
      username: "miraflux",
      email: "mira@neojam.dev",
      password: "password123",
      role: USER_ROLES.PROVIDER,
      sector: "Arc-Light District",
      bio: "Verified infrastructure fabricator and drone coordinator.",
      avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=Mira",
      reputationScore: 318,
      completedJobsCount: 11,
      successfulTradesCount: 15,
      verificationStatus: VERIFICATION_STATUS.VERIFIED
    },
    {
      fullName: "Kabir Bose",
      username: "kabirforge",
      email: "kabir@neojam.dev",
      password: "password123",
      role: USER_ROLES.CITIZEN,
      sector: "Dock-9",
      bio: "Independent repair runner specializing in microgrid retrofits.",
      avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=Kabir",
      reputationScore: 196,
      completedJobsCount: 7,
      successfulTradesCount: 3
    },
    {
      fullName: "Riya Paul",
      username: "riyasync",
      email: "riya@neojam.dev",
      password: "password123",
      role: USER_ROLES.CITIZEN,
      sector: "East Canal",
      bio: "Community scout sharing local intel and short-form work bursts.",
      avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=Riya",
      reputationScore: 92,
      disputesCount: 1
    }
  ]);

  const [admin, provider, citizenOne, citizenTwo] = users;

  const jobs = await Job.create([
    {
      title: "Neon Transit Beacon Calibration",
      description: "Recalibrate the beacon relay across Arc-Light walkway 4 before commuter surge.",
      category: "service",
      requiredSkills: ["signal tuning", "microelectronics"],
      constraints: ["Night shift", "Verified gear only"],
      budget: 950,
      locationMode: "onsite",
      sector: "Arc-Light District",
      urgency: "high",
      postedBy: admin._id,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 36),
      status: JOB_STATUS.ASSIGNED,
      selectedWorker: provider._id,
      verificationState: VERIFICATION_STATUS.PENDING
    },
    {
      title: "Biofilter Cartridge Swap",
      description: "Residential tower needs 6 cartridge swaps and a cleanup report.",
      category: "service",
      requiredSkills: ["safety", "routine maintenance"],
      budget: 320,
      locationMode: "hybrid",
      sector: "East Canal",
      urgency: "medium",
      postedBy: citizenTwo._id,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 72),
      status: JOB_STATUS.APPLIED
    },
    {
      title: "Mesh Uplink Diagnostics",
      description: "Run packet health diagnostics across sector relays and submit signal map.",
      category: "freelance",
      requiredSkills: ["diagnostics", "reporting"],
      budget: 540,
      locationMode: "remote",
      sector: "Dock-9",
      urgency: "critical",
      postedBy: citizenOne._id,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 20),
      status: JOB_STATUS.POSTED
    }
  ]);

  const applications = await JobApplication.create([
    {
      job: jobs[0]._id,
      applicant: provider._id,
      pitch: "I can deploy a calibration swarm tonight and deliver logs before dawn.",
      proposedBudget: 980,
      availability: "Tonight",
      status: "ACCEPTED"
    },
    {
      job: jobs[1]._id,
      applicant: citizenOne._id,
      pitch: "Handled the same tower stack last month. Can finish in one cycle.",
      proposedBudget: 300,
      availability: "Tomorrow morning"
    },
    {
      job: jobs[1]._id,
      applicant: provider._id,
      pitch: "Verified provider package includes contamination scan and disposal log.",
      proposedBudget: 360,
      availability: "Within 12 hours"
    }
  ]);

  jobs[0].applicants = [applications[0]._id];
  jobs[1].applicants = [applications[1]._id, applications[2]._id];
  await Promise.all(jobs.map((job) => job.save()));

  await JobStatusLog.create([
    {
      job: jobs[0]._id,
      fromStatus: JOB_STATUS.POSTED,
      toStatus: JOB_STATUS.APPLIED,
      actor: provider._id,
      note: "Application submitted"
    },
    {
      job: jobs[0]._id,
      fromStatus: JOB_STATUS.APPLIED,
      toStatus: JOB_STATUS.ASSIGNED,
      actor: admin._id,
      note: "Urgent assignment approved"
    }
  ]);

  const trades = await TradeListing.create([
    {
      title: "Portable Fusion Cell Pack",
      description: "Two lightly used fusion cells for drone bays or emergency microgrids.",
      category: "energy",
      itemType: "physical",
      condition: "Refurbished",
      quantity: 2,
      owner: provider._id,
      expectedExchange: "Rare diagnostic modules or 1400 civic credits",
      negotiable: true,
      status: TRADE_STATUS.NEGOTIATION,
      sector: "Arc-Light District"
    },
    {
      title: "Encrypted Mapping Dataset",
      description: "Digital terrain overlays of lower dock maintenance conduits.",
      category: "data",
      itemType: "digital",
      condition: "Verified packet",
      quantity: 1,
      owner: citizenOne._id,
      expectedExchange: "Sensor array or field support",
      negotiable: true,
      status: TRADE_STATUS.ACCEPTED,
      sector: "Dock-9"
    }
  ]);

  const offers = await TradeOffer.create([
    {
      trade: trades[0]._id,
      proposer: citizenOne._id,
      offeredValue: "2 diagnostic relays + 900 credits",
      note: "Can deliver relays tonight.",
      status: OFFER_STATUS.COUNTERED,
      thread: [
        { author: citizenOne._id, message: "Opening offer", offeredValue: "2 diagnostic relays + 900 credits" },
        { author: provider._id, message: "Need 1100 credits or a third relay", offeredValue: "3 relays + 1100 credits" }
      ]
    },
    {
      trade: trades[1]._id,
      proposer: citizenTwo._id,
      offeredValue: "Portable sensor mast",
      note: "Sensor mast is tuned for dock humidity.",
      status: OFFER_STATUS.ACCEPTED,
      thread: [
        { author: citizenTwo._id, message: "Initial offer", offeredValue: "Portable sensor mast" },
        { author: citizenOne._id, message: "Accepted. Meet at exchange locker 7.", offeredValue: "Portable sensor mast" }
      ]
    }
  ]);

  trades[0].offers = [offers[0]._id];
  trades[1].offers = [offers[1]._id];
  trades[1].acceptedOffer = offers[1]._id;
  await Promise.all(trades.map((trade) => trade.save()));

  await TradeTransactionLog.create([
    {
      trade: trades[0]._id,
      offer: offers[0]._id,
      action: "offer_made",
      actor: citizenOne._id,
      note: "Negotiation opened"
    },
    {
      trade: trades[0]._id,
      offer: offers[0]._id,
      action: "counter_offer",
      actor: provider._id,
      note: "Owner countered"
    },
    {
      trade: trades[1]._id,
      offer: offers[1]._id,
      action: "offer_accepted",
      actor: citizenOne._id,
      note: "Awaiting completion confirmation"
    }
  ]);

  const dispute = await Dispute.create({
    entityType: "trade",
    entityId: trades[1]._id,
    openedBy: citizenTwo._id,
    againstUser: citizenOne._id,
    reason: "Sensor mast shipment delayed and arrival logs missing.",
    status: "reviewing"
  });
  trades[1].dispute = dispute._id;
  await trades[1].save();

  await PulsePost.create([
    {
      title: "Critical Floodgate Oscillation Warning",
      summary: "Dock-9 lower channel floodgates are oscillating beyond safe variance.",
      content: "Emergency teams are rerouting transport. Citizens in Dock-9 should avoid sub-level access tunnels until further notice.",
      category: PULSE_CATEGORY.ALERT,
      priority: PRIORITY.CRITICAL,
      author: admin._id,
      isOfficial: true,
      pinned: true,
      sector: "Dock-9",
      reactionsCount: 18,
      bookmarksCount: 11,
      views: 322
    },
    {
      title: "Arc-Light Night Market Trend Spike",
      summary: "Resource bartering volume jumped 38% during the last civic cycle.",
      content: "Independent providers are reporting higher demand for clean energy cells and relay chips.",
      category: PULSE_CATEGORY.TREND,
      priority: PRIORITY.NORMAL,
      author: provider._id,
      sector: "Arc-Light District",
      reactionsCount: 21,
      bookmarksCount: 6,
      views: 198
    },
    {
      title: "Community Cleanup Swarm This Evening",
      summary: "Volunteers are assembling to clear canal debris and inspect walkway lighting.",
      content: "Meet at East Canal plaza at 19:30. Tool grants available for first-time volunteers.",
      category: PULSE_CATEGORY.COMMUNITY,
      priority: PRIORITY.NORMAL,
      author: citizenTwo._id,
      sector: "East Canal",
      reactionsCount: 12,
      bookmarksCount: 7,
      views: 104
    }
  ]);

  await Notification.create([
    {
      user: admin._id,
      title: "Verification queue ready",
      message: "2 provider verification requests are waiting for review.",
      category: NOTIFICATION_CATEGORY.ADMIN,
      priority: PRIORITY.HIGH,
      link: "/admin/verify-providers"
    },
    {
      user: provider._id,
      title: "Job assignment confirmed",
      message: "You were assigned to Neon Transit Beacon Calibration.",
      category: NOTIFICATION_CATEGORY.JOB,
      priority: PRIORITY.HIGH,
      link: `/jobs/${jobs[0]._id}`
    },
    {
      user: citizenOne._id,
      title: "Counter-offer received",
      message: "Mira Flux countered your fusion cell offer.",
      category: NOTIFICATION_CATEGORY.TRADE,
      link: `/trades/${trades[0]._id}`
    },
    {
      user: citizenTwo._id,
      title: "Critical city alert",
      message: "Dock-9 lower channel floodgates are unstable.",
      category: NOTIFICATION_CATEGORY.PULSE,
      priority: PRIORITY.CRITICAL,
      link: "/pulse"
    }
  ]);

  await ActivityLog.create([
    {
      user: provider._id,
      entityType: "job",
      entityId: jobs[0]._id,
      action: "job:assigned",
      summary: "Assigned to Neon Transit Beacon Calibration"
    },
    {
      user: citizenOne._id,
      entityType: "trade",
      entityId: trades[0]._id,
      action: "trade:countered",
      summary: "Received a counter-offer on Portable Fusion Cell Pack"
    },
    {
      user: admin._id,
      entityType: "pulse",
      entityId: new mongoose.Types.ObjectId(),
      action: "pulse:broadcast",
      summary: "Published critical floodgate alert"
    }
  ]);

  await ReputationRecord.create([
    {
      user: provider._id,
      delta: 40,
      reason: "Provider verification granted",
      sourceType: "user",
      sourceId: provider._id
    },
    {
      user: citizenOne._id,
      delta: 18,
      reason: "Completed trade",
      sourceType: "trade",
      sourceId: trades[1]._id
    },
    {
      user: citizenTwo._id,
      delta: -20,
      reason: "Dispute under review",
      sourceType: "dispute",
      sourceId: dispute._id
    }
  ]);

  console.log("Seed complete.");
  console.log("Demo credentials:");
  console.log("admin@neojam.dev / password123");
  console.log("mira@neojam.dev / password123");
  console.log("kabir@neojam.dev / password123");
  console.log("riya@neojam.dev / password123");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
