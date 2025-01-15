exports.filterAllowedFields = (input, allowedKeys) => {
  // Create a new object to store filtered data
  const filteredData = {};
  // Iterate through the allowed keys
  allowedKeys.forEach((key) => {
    // If the key exists in the input, add it to the filteredData
    if (input.hasOwnProperty(key)) {
      filteredData[key] = input[key];
    }
  });
  return filteredData;
}
