const { z } = require('zod');

const idParam = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const role = z.enum(['admin', 'store_manager', 'field_supervisor', 'standard_user']);
const assetStatus = z.enum(['available', 'checked_out', 'under_maintenance', 'decommissioned']);
const assetCondition = z.enum(['excellent', 'good', 'fair', 'poor']);

module.exports = {
  z,
  idParam,
  role,
  assetStatus,
  assetCondition,
};
