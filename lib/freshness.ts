const ROAST_DAY = 4; // четверг

export function lastRoast(now = new Date()) {
  const minsk = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/Minsk' }),
  );
  const daysAgo = (minsk.getDay() - ROAST_DAY + 7) % 7;
  const date = new Date(minsk);
  date.setDate(minsk.getDate() - daysAgo);
  return { date, daysAgo };
}
