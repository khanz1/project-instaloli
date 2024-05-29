// create a function takes 1 arguments return string like `2 hours ago
export function timeAgo(time) {
  const currentTime = new Date();
  const postTime = new Date(Number(time));
  const diffTime = Math.abs(currentTime - postTime);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffSeconds = Math.floor(diffTime / 1000);

  if (diffDays > 0) {
    return `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minutes ago`;
  } else {
    return `${diffSeconds} seconds ago`;
  }
}
