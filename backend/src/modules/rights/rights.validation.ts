import { z } from "zod";

export const rightsStatusSchema = z.enum(["pending", "in_progress", "completed"]);

const isComplaintType = (requestType: string) => requestType === "Right to file a complaint (Sec 6(2)/DPDPA)";
const isAccessType = (requestType: string) => requestType === "Right to Access (Sec 11/DPDPA)";
const isGrievanceType = (requestType: string) => requestType === "Right to Grievance Redressal (Sec 13/DPDPA)";
const isCorrectionType = (requestType: string) => requestType === "Right to Correction (Sec 12(1)/DPDPA)";
const isNominationType = (requestType: string) => requestType === "RIght to Nominate (Sec 14/DPDPA)";

export const rightsPayloadSchema = z
  .object({
    requestType: z.string().trim().min(1),
    fullName: z.string().trim().min(1),
    email: z.string().email().trim().toLowerCase(),
    phone: z.string().trim().default(""),
    country: z.string().trim().min(1),
    relationship: z.string().trim().default(""),
    complaintReason: z.string().trim().default(""),
    complaintReasonOther: z.string().trim().default(""),
    complaintTarget: z.string().trim().default(""),
    complaintTargetOther: z.string().trim().default(""),
    accessExplanation: z.string().trim().default(""),
    grievanceExplanation: z.string().trim().default(""),
    correctionType: z.string().trim().default(""),
    nomineeRelationship: z.string().trim().default(""),
    nomineeName: z.string().trim().default(""),
    nomineeEstablishment: z.string().trim().default(""),
    consents: z.object({
      accuracy: z.boolean(),
      verification: z.boolean(),
    }),
  })
  .superRefine((data, ctx) => {
    if (isComplaintType(data.requestType)) {
      if (!data.complaintReason) {
        ctx.addIssue({
          code: "custom",
          path: ["complaintReason"],
          message: "Complaint reason is required for complaint requests",
        });
      }
      if (!data.complaintTarget) {
        ctx.addIssue({
          code: "custom",
          path: ["complaintTarget"],
          message: "Complaint target is required for complaint requests",
        });
      }
      if (data.complaintReason === "Other (please specify)" && !data.complaintReasonOther) {
        ctx.addIssue({
          code: "custom",
          path: ["complaintReasonOther"],
          message: "Please specify complaint reason",
        });
      }
      if (data.complaintTarget === "Other (please specify)" && !data.complaintTargetOther) {
        ctx.addIssue({
          code: "custom",
          path: ["complaintTargetOther"],
          message: "Please specify complaint target",
        });
      }
    }

    if (isAccessType(data.requestType) && !data.accessExplanation) {
      ctx.addIssue({
        code: "custom",
        path: ["accessExplanation"],
        message: "Access explanation is required for access requests",
      });
    }

    if (isGrievanceType(data.requestType) && !data.grievanceExplanation) {
      ctx.addIssue({
        code: "custom",
        path: ["grievanceExplanation"],
        message: "Grievance explanation is required for grievance requests",
      });
    }

    if (isCorrectionType(data.requestType) && !data.correctionType) {
      ctx.addIssue({
        code: "custom",
        path: ["correctionType"],
        message: "Correction type is required for correction requests",
      });
    }

    if (isNominationType(data.requestType)) {
      if (!data.nomineeRelationship) {
        ctx.addIssue({
          code: "custom",
          path: ["nomineeRelationship"],
          message: "Nominee relationship is required for nomination requests",
        });
      }
      if (!data.nomineeName) {
        ctx.addIssue({
          code: "custom",
          path: ["nomineeName"],
          message: "Nominee name is required for nomination requests",
        });
      }
      if (!data.nomineeEstablishment) {
        ctx.addIssue({
          code: "custom",
          path: ["nomineeEstablishment"],
          message: "Nominee relationship proof is required for nomination requests",
        });
      }
    }
  });

export const updateRightsStatusSchema = z.object({
  status: rightsStatusSchema,
});
