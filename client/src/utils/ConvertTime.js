// Function to convert ISO date to local DD/MM/YYYY format
export const formatDateToDDMMYYYY = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Function to convert ISO date to local HH:MM:SS format
  export const formatTimeToHHMMSS = (isoDateString) => {
    const date = new Date(isoDateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  