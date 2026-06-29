const { z, idParam } = require('./commonSchemas');

const stockBody = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().max(80).optional().nullable(),
  quantity: z.coerce.number().int().min(0).optional(),
  minimumQuantity: z.coerce.number().int().min(0).optional(),
  unitCost: z.coerce.number().nonnegative().optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  unit: z.string().trim().max(40).optional().nullable(),
}).strict();

const createStockSchema = z.object({ body: stockBody });
const updateStockSchema = idParam.extend({ body: stockBody.partial().refine((v) => Object.keys(v).length > 0, 'At least one field is required.') });

module.exports = {
  createStockSchema,
  updateStockSchema,
};
