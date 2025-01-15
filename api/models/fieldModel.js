const db = require('../database/dbConfig');

// Find all fields
exports.find = async () => db.select().from('fields');

exports.findById = async (fieldId) => {
  const field = await db('fields').where({ id: fieldId }).first();

  if (!field) return null;

  const media = await db('field_media').where({ field_id: fieldId });
  const amenities = await db('field_amenities').where({ field_id: fieldId });
  const reviews = await db('field_reviews').where({ field_id: fieldId });

  return {
    ...field,
    media: media.map((m) => m.url),
    amenities: amenities.map((a) => a.name),
    reviews: reviews.map((r) => ({
      user: r.user,
      rating: r.rating,
      comment: r.comment,
    })),
  };
};

// Find fields by a specific condition
exports.findByCondition = async (condition) => {
  return db.select().from('fields').where(condition);
};

// Create a new field
exports.create = async (field) => {
  let fieldId;

  await db.transaction(async (trx) => {
    // Insert core field data
    const [createdFieldId] = await trx('fields').insert({
      name: field.name,
      latitude: field.latitude,
      longitude: field.longitude,
      location: field.location,
      rating: field.rating,
      pricePerHour: field.pricePerHour,
      distance: field.distance,
      availability: field.availability,
    });

    fieldId = createdFieldId;

    // Insert media
    if (field.media && Array.isArray(field.media)) {
      const mediaRecords = field.media.map((url) => ({
        field_id: fieldId,
        url,
      }));
      await trx('field_media').insert(mediaRecords);
    }

    // Insert amenities
    if (field.amenities && Array.isArray(field.amenities)) {
      const amenityRecords = field.amenities.map((name) => ({
        field_id: fieldId,
        name,
      }));
      await trx('field_amenities').insert(amenityRecords);
    }

    // Insert reviews
    if (field.reviews && Array.isArray(field.reviews)) {
      const reviewRecords = field.reviews.map((review) => ({
        field_id: fieldId,
        user: review.user,
        rating: review.rating,
        comment: review.comment,
      }));
      await trx('field_reviews').insert(reviewRecords);
    }
  });

  return this.findById(fieldId);
};

// Update a field by ID
exports.findByIdAndUpdate = async (fieldId, updates) => {
  return await db.transaction(async (trx) => {
    // Update core field record
    await trx('fields').where({ id: fieldId }).update(updates);

    if (updates.media) {
      await trx('field_media').where({ field_id: fieldId }).del();
      const mediaRecords = updates.media.map((url) => ({
        field_id: fieldId,
        url,
      }));
      await trx('field_media').insert(mediaRecords);
    }

    if (updates.amenities) {
      await trx('field_amenities').where({ field_id: fieldId }).del();
      const amenityRecords = updates.amenities.map((name) => ({
        field_id: fieldId,
        name,
      }));
      await trx('field_amenities').insert(amenityRecords);
    }

    if (updates.reviews) {
      await trx('field_reviews').where({ field_id: fieldId }).del();
      const reviewRecords = updates.reviews.map((review) => ({
        field_id: fieldId,
        user: review.user,
        rating: review.rating,
        comment: review.comment,
      }));
      await trx('field_reviews').insert(reviewRecords);
    }

    return this.findById(fieldId);
  });
};

// Delete a field by ID
exports.findByIdAndDelete = async (fieldId) => {
  return await db.transaction(async (trx) => {
    await trx('field_media').where({ field_id: fieldId }).del();
    await trx('field_amenities').where({ field_id: fieldId }).del();
    await trx('field_reviews').where({ field_id: fieldId }).del();
    await trx('fields').where({ id: fieldId }).del();
  });
};

// Add a review to a field
exports.addReview = async (fieldId, review) => {
  const { user, rating, comment } = review;

  const [createdReview] = await db('field_reviews')
    .insert({
      field_id: fieldId,
      user,
      rating,
      comment,
    })
    .returning('*');

  return createdReview;
};
module.exports = FieldModel;
