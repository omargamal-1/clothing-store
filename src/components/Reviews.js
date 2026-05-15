import React, { useState } from 'react';
import './Reviews.css';

export default function Reviews({ productId }) {
  const storageKey = `reviews_${productId}`;

  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch { return []; }
  });

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = () => {
    if (!name.trim() || !comment.trim() || rating === 0) return;
    const newReview = {
      id: Date.now(),
      name: name.trim(),
      comment: comment.trim(),
      rating,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setName(''); setComment(''); setRating(0);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">Customer Reviews</h2>
        {avgRating && (
          <div className="reviews-avg">
            <span className="avg-number">{avgRating}</span>
            <div className="avg-stars">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= Math.round(avgRating) ? 'star filled' : 'star'}>★</span>
              ))}
            </div>
            <span className="avg-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        )}
      </div>

      <div className="review-form">
        <h3 className="form-title">Write a Review</h3>
        <div className="star-picker">
          {[1,2,3,4,5].map(s => (
            <span key={s}
              className={s <= (hovered || rating) ? 'star filled' : 'star'}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
            >★</span>
          ))}
          {rating > 0 && <span className="rating-label">{['','Poor','Fair','Good','Very Good','Excellent'][rating]}</span>}
        </div>
        <input className="review-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="review-textarea" placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} rows={4} />
        <button className="review-submit" onClick={handleSubmit} disabled={!name.trim() || !comment.trim() || rating === 0}>
          {submitted ? '✓ Review Submitted!' : 'Submit Review'}
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet — be the first!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-top">
                <div className="review-stars">
                  {[1,2,3,4,5].map(s => <span key={s} className={s <= r.rating ? 'star filled' : 'star'}>★</span>)}
                </div>
                <span className="review-date">{r.date}</span>
              </div>
              <p className="review-name">{r.name}</p>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}