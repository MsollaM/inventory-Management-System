const { z, idParam, assetStatus, assetCondition } = require('./commonSchemas');

const assetBody = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  serialNumber: z.string().trim().max(120).optional().nullable(),
  qrCode: z.string().trim().max(255).optional().nullable(),
  status: assetStatus.optional(),
  condition: assetCondition.optional(),
  location: z.string().trim().max(120).optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  purchaseCost: z.coerce.number().nonnegative().optional().nullable(),
  supplier: z.string().trim().max(120).optional().nullable(),
  warrantyExpiry: z.coerce.date().optional().nullable(),
}).strict();

const createAssetSchema = z.object({ body: assetBody });
const updateAssetSchema = idParam.extend({ body: assetBody.partial().refine((v) => Object.keys(v).length > 0, 'At least one field is required.') });

module.exports = {
  createAssetSchema,
  updateAssetSchema,
  idParam,
};
