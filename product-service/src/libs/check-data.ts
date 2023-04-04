export const checkData = (data, errorMessage) => {
  if (!data) {
    throw new Error(errorMessage);
  }
}
