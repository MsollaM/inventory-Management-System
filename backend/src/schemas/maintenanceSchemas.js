const { z, idParam } = require('./commonSchemas');

const maintenanceStatus = z.enum(['scheduled', 'in_progress', 'completed']);

const maintenanceBody = z.object({
  assetId: z.coerce.number().int().positive(),
  maintenanceType: z.string().trim().min(1).max(120),
  description: z.string().trim().max(5000).optional().nullable(),
  cost: z.coerce.number().nonnegative().optional().nullable(),
  technician: z.string().trim().max(120).optional().nullable(),
  scheduledDate: z.coerce.date().optional().nullable(),
  completedDate: z.coerce.date().optional().nullable(),
  nextMaintenanceDate: z.coerce.date().optional().nullable(),
  status: maintenanceStatus.optional(),
}).strict();

const createMaintenanceSchema = z.object({ body: maintenanceBody });
const updateMaintenanceSchema = idParam.extend({ body: maintenanceBody.partial().refine((v) => Object.keys(v).length > 0, 'At least one field is required.') });

module.exports = {
  createMaintenanceSchema,
  updateMaintenanceSchema,
};
