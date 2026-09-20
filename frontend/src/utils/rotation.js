const ROTATION_PATTERN = ["S1", "S3", "S2", "S3", "S2", "S2"];

const START_DATE = new Date("2026-10-05T00:00:00");

export function getShiftForMember(position, date) {
  const targetDate = new Date(date);

  const differenceInTime =
    targetDate.getTime() - START_DATE.getTime();

  const differenceInDays =
    Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  const weekIndex = Math.floor(differenceInDays / 7);

  const patternIndex =
    (position - 1 + weekIndex) % ROTATION_PATTERN.length;

  return ROTATION_PATTERN[patternIndex];
}

console.log(
  getShiftForMember(1, "2026-10-05")
);

console.log(
  getShiftForMember(1, "2026-10-12")
);

console.log(
  getShiftForMember(1, "2026-10-19")
);