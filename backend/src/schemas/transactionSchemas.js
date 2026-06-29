const { z } = require('./commonSchemas');

const createTransactionSchema = z.object({
  body: z.object({
    assetId: z.coerce.number().int().positive(),
    type: z.enum(['checkout', 'checkin']),
    expectedReturnDate: z.coerce.date().optional().nullable(),
    actualReturnDate: z.coerce.date().optional().nullable(),
    conditionAtReturn: z.enum(['excellent', 'good', 'fair', 'poor']).optional().nullable(),
    notes: z.string().trim().max(5000).optional().nullable(),
  }).strict(),
});

module.exports = {
  createTransactionSchema,
};
