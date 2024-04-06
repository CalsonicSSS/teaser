// Update this interface to handle both text and data frame responses from the ai bot server
export interface MessagePair {
  userMessage: string;
  botResponse?: string;
  botDataFrameResponse?: DataFrameJson; // Assuming you have a definition for DataFrameJson
  isLoading: boolean; // Add this line to include the loading state
  stats?: { [key: string]: { sum: number; avg: number; std: number; var: number } };
}

// for data frame json structure (send from server)
export interface DataFrameJson {
  columns: string[];
  // double square brackets indicate an array of arrays (where each inner array can contain elements of types string or number)
  data: (string | number)[][];
  index: number[];
}
