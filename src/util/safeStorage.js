export const getAggregatorId = () => {
  const selectedTab = localStorage.getItem("selectedTab");
  if (!selectedTab) return '';

  let value = selectedTab;
  try {
    // Try to parse if it's a JSON string
    value = JSON.parse(selectedTab);
  } catch (e) {
    // Not a JSON string, use as is
  }

  if (typeof value === 'string' && value.includes('|')) {
    return value.split('|')[1];
  }
  return value;
};
