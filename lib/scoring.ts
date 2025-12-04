/**
 * Calculate points for race winner predictions (Sprint & Main Race)
 * @param predictedPosition Position of the predicted rider
 * @param actualPosition Position of the actual winner (should be 1)
 * @param type Type of prediction ('winner' or 'glorious7')
 * @returns Points earned for the prediction
 */
export function calculatePositionPoints(
  predictedPosition: number,
  actualPosition: number,
  type: 'winner' | 'glorious7'
): number {
  const diff = Math.abs(predictedPosition - actualPosition);

  if (type === 'winner') {
    // For Sprint/Race winner predictions
    const pointsMap: Record<number, number> = {
      0: 12, // Exact match
      1: 9,  // Off by 1
      2: 7,  // Off by 2
      3: 5,  // Off by 3
      4: 4,  // Off by 4
      5: 2,  // Off by 5
    };
    return pointsMap[diff] ?? 0; // 6+ positions = 0 points
  }

  if (type === 'glorious7') {
    // For 7th place prediction
    const pointsMap: Record<number, number> = {
      0: 12, // Exact 7th place
      1: 9,  // Off by 1
      2: 7,  // Off by 2
      3: 5,  // Off by 3
      4: 4,  // Off by 4
    };
    return pointsMap[diff] ?? 0; // 5+ positions = 0 points
  }

  return 0;
}

/**
 * Calculate penalty points for late submissions
 * @param offenseNumber Number of late submissions (1st, 2nd, 3rd, etc.)
 * @returns Penalty points to deduct
 */
export function calculatePenalty(offenseNumber: number): number {
  if (offenseNumber === 1) return 10;
  if (offenseNumber === 2) return 25;
  return 50; // 3rd and beyond
}

/**
 * Calculate championship prediction points at end of season
 * @param predictions Player's championship predictions
 * @param results Actual championship results
 * @returns Total points earned for championship predictions
 */
export function calculateChampionshipPoints(
  predictions: { first: string; second: string; third: string },
  results: { first: string; second: string; third: string }
): number {
  let points = 0;
  if (predictions.first === results.first) points += 37;
  if (predictions.second === results.second) points += 25;
  if (predictions.third === results.third) points += 25;
  return points;
}

/**
 * Check if a prediction was submitted after the deadline
 * @param submittedAt Submission timestamp
 * @param deadlineAt FP1 start timestamp (deadline)
 * @returns true if submission was late
 */
export function isLateSubmission(submittedAt: Date, deadlineAt: Date): boolean {
  return submittedAt > deadlineAt;
}

/**
 * Get time remaining until deadline in milliseconds
 * @param deadlineAt FP1 start timestamp (deadline)
 * @returns Milliseconds until deadline (negative if past)
 */
export function getTimeUntilDeadline(deadlineAt: Date): number {
  return deadlineAt.getTime() - Date.now();
}

/**
 * Format time remaining in a human-readable format
 * @param milliseconds Time in milliseconds
 * @returns Formatted string (e.g., "2d 5h 30m")
 */
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return 'Deadline passed';

  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || 'Less than 1m';
}
