export const analyzeWeakness = (answers) => {
  const count = {};
  answers.forEach((t) => {
    count[t] = (count[t] || 0) + 1;
  });

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trait]) => weaknessByTrait[trait])
    .filter(Boolean);
};
