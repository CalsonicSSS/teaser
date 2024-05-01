"use client";

import { chainnectStyle } from "@/theme/style";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ReactElement, useState, useRef, useEffect } from "react";
import Menu from "@/components/Menu";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import { DataFrameJson, MessagePair } from "@/types/interfaces";
import { sendUserQueryApi } from "@/apis/home";
import * as XLSX from "xlsx";
import { LineChart } from "@mui/x-charts/LineChart";
import GetAppIcon from "@mui/icons-material/GetApp";
import LinkIcon from "@mui/icons-material/Link";
import { calculateStats } from "@/utils/statsCalculation";

// this is the home page component (created not under any route folder)
// Which means it is the first initial default page to be rendered
export default function HomePage(): ReactElement {
  const [currentSelectedMenu, setCurrentSelectedMenu] = useState<string>("Financials");
  const [userQuery, setUserQuery] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<MessagePair[]>([]);
  const [activeChartIndex, setActiveChartIndex] = useState<number | null>(null);
  const [activeStatsIndex, setActiveStatsIndex] = useState<number | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [test, setTest] = useState("test");

  // ----------------------------------------------------------------------------------------------------

  function setCurrentSelectedMenuHandler(newSelectedMenuName: string): void {
    setCurrentSelectedMenu(newSelectedMenuName);
  }

  function setUserQueryHandler(event: React.ChangeEvent<HTMLInputElement>): void {
    setUserQuery(event.target.value);
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  async function sendUserQueryHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    console.log("sendUserQueryHandler runs");
    event.preventDefault();

    try {
      // trim removes leading and trailing white spaces | in js if its empty string it will be false (this means we will only send user query if its not empty string)
      if (userQuery.trim()) {
        // Add user message to history
        const updatedHistory = [...chatHistory, { userMessage: userQuery.trim(), isLoading: true }];
        setChatHistory(updatedHistory);

        // Clear input field uopn submission
        setUserQuery("");

        // start loading spinner

        // send and get response from backend and handle error
        const response = await sendUserQueryApi(userQuery);
        if (!response.ok) {
          alert(`request error (Status: ${response.status})`);
          return;
        }

        // get the response from the backend and parse into js object
        const responsePayload = await response.json();

        // Check if the response contains data frame JSON or just text
        if (typeof responsePayload.botResponse === "object") {
          // Handle JSON data frame response
          const stats = calculateStats(responsePayload.botResponse);
          setChatHistory((currentHistory) => [
            ...currentHistory.slice(0, -1),
            { userMessage: userQuery.trim(), botDataFrameResponse: responsePayload.botResponse, isLoading: false, stats },
          ]);
        } else {
          // Handle text response
          setChatHistory((currentHistory) => [...currentHistory.slice(0, -1), { userMessage: userQuery.trim(), botResponse: responsePayload.botResponse, isLoading: false }]);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`request error (Status: ${error.message})`);
      } else {
        // Handle the case where the error is not an instance of Error
        alert("An unknown error occurred");
      }
    }
  }

  function downloadExcel(dataFrame: DataFrameJson) {
    // Reconstruct the table data
    const tableData = dataFrame.data.map((row, rowIndex) => {
      // Define the accumulator with an index signature to allow string keys
      const rowData: { [key: string]: string | number } = { "Year-Month": dataFrame.index[rowIndex] };

      row.forEach((cell, cellIndex) => {
        const columnName = dataFrame.columns[cellIndex];
        rowData[columnName] = cell;
      });

      return rowData;
    });
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data.xlsx");
  }

  function lineChartHandler(dataFrameJson: DataFrameJson) {
    const chartData = dataFrameJson.data;
    const sortedData = [...chartData].reverse();

    const timeSeries: string[] = sortedData.map((row) => `${row[1]} ${row[0]}`); // month and year

    const categoryValuesStartIndex = 3; // Assuming the first three columns are 'year', 'month', and 'month_n'
    const categoryNames = dataFrameJson.columns.slice(categoryValuesStartIndex);

    const series = categoryNames.map((name, index) => {
      const dataSeries = sortedData.map((row) => row[categoryValuesStartIndex + index] as number);
      return {
        label: name, // Name of the series used in the legend
        data: dataSeries, // Data for the series
      };
    });

    return (
      <LineChart
        xAxis={[{ data: timeSeries, scaleType: "point", valueFormatter: (value) => `${value.slice(0, 3)}\n${value.slice(4)}` }]}
        series={series}
        width={1000}
        height={400}
      />
    );
  }

  // ------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]); // Depend on chatHistory to scroll on new messages or chart generation

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Box display={"flex"} height={"100vh"}>
      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* side bar  */}

      <Box width={"15%"} padding={"20px"}>
        <Box bgcolor={"#3E3E45"} height={"100%"} borderRadius={chainnectStyle.boarderRadius} paddingY={"30px"}>
          <Typography variant='h3' color={"white"} display={"flex"} justifyContent={"center"} marginBottom={"50px"}>
            Chainnect
          </Typography>
          <Menu
            menuName={"Retrieval"}
            icon={<GetAppIcon sx={{ color: "white" }} />}
            currentSelectedMenu={currentSelectedMenu}
            onClickLogic={() => {
              setCurrentSelectedMenuHandler("Retrieval");
            }}
          />
          <Menu
            menuName={"Integration"}
            icon={<LinkIcon sx={{ color: "white" }} />}
            currentSelectedMenu={currentSelectedMenu}
            onClickLogic={() => {
              setCurrentSelectedMenuHandler("Integration");
              handleOpenModal();
            }}
          />
        </Box>
      </Box>

      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* modal pop up windows for integration selection (modal pop up does not matter where you put) */}

      <Dialog open={openModal}>
        <DialogTitle>Choose an Integration Source</DialogTitle>
        <DialogContent>
          <List>
            {["QuickBooks", "TeamUp", "Rockwell", "Dynamics 365"].map((source) => (
              <ListItem
                button
                onClick={() => {
                  handleCloseModal();
                }}
                key={source}
              >
                <ListItemText primary={source} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------------------------------------------------------------------ */}
      {/* main content (fill the remaining horizontal space with flex: 1 */}

      <Box flex={1} marginY='30px' marginX='10%' display='flex' flexDirection='column'>
        {/* conversation dialog (Chat history content box) */}
        <Box flexGrow={1} overflow='auto' marginBottom='30px' border={2} borderRadius={chainnectStyle.boarderRadius} borderColor={"#808080"} padding='20px'>
          {chatHistory.map((messagePair, index) => (
            <Box key={index} marginBottom={"60px"}>
              {/* User query section */}
              <Box marginBottom={"20px"}>
                <Typography variant='body1' fontWeight={"bold"} color='Black'>
                  You
                </Typography>
                <Typography variant='body1' color='textSecondary' sx={{ whiteSpace: "pre-line" }}>
                  {messagePair.userMessage}
                </Typography>
              </Box>

              {/* AI bot text response section */}
              {messagePair.botResponse && (
                <Box>
                  <Typography variant='body1' fontWeight={"bold"} color='Black'>
                    Chainnect
                  </Typography>
                  <Typography variant='body1' color='textSecondary' sx={{ whiteSpace: "pre-line" }}>
                    {messagePair.botResponse}
                  </Typography>
                </Box>
              )}

              {/* AI bot dataframe response section */}
              {messagePair.botDataFrameResponse && (
                <Box>
                  <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant='body1' fontWeight={"bold"} color='Black' marginBottom={"10px"}>
                      Chainnect
                    </Typography>
                    <Button onClick={() => downloadExcel(messagePair.botDataFrameResponse!)}>Download as Excel</Button>
                  </Box>

                  <Box padding={"10px"} border={1.5} borderRadius={"15px"}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {messagePair.botDataFrameResponse.columns.map((column, index) => (
                            <TableCell key={index}>{column}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {messagePair.botDataFrameResponse.data.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                  <Box display={"flex"} justifyContent={"start"} alignItems={"center"}>
                    <Button variant='contained' onClick={() => setActiveChartIndex(activeChartIndex === index ? null : index)} sx={{ mt: 2, mr: 2 }}>
                      {activeChartIndex === index ? "Hide Chart" : "Generate Chart"}
                    </Button>
                    <Button variant='contained' onClick={() => setActiveStatsIndex(activeStatsIndex === index ? null : index)} sx={{ mt: 2 }}>
                      {activeStatsIndex === index ? "Hide Stats" : "Generate Stats"}
                    </Button>
                  </Box>
                  {activeStatsIndex === index && messagePair.stats && (
                    <Box padding={"10px"} border={1.5} borderRadius={"15px"} marginBottom={"20px"} marginTop={"20px"}>
                      <Typography variant='h6' fontWeight={"bold"}>
                        Statistics
                      </Typography>
                      <Table size='small'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Sum</TableCell>
                            <TableCell>Average</TableCell>
                            <TableCell>Std. Deviation</TableCell>
                            <TableCell>Variance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(messagePair.stats).map(([category, stats], index) => (
                            <TableRow key={index}>
                              <TableCell>{category}</TableCell>
                              <TableCell>{stats.sum.toFixed(2)}</TableCell>
                              <TableCell>{stats.avg.toFixed(2)}</TableCell>
                              <TableCell>{stats.std.toFixed(2)}</TableCell>
                              <TableCell>{stats.var.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
                  {activeChartIndex === index && lineChartHandler(messagePair.botDataFrameResponse)}
                </Box>
              )}

              {/* Loading indicator section */}
              {messagePair.isLoading && (
                <Box display={"flex"} justifyContent={"center"}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          ))}
          <div ref={endOfMessagesRef} />
        </Box>

        {/* ------------------------------------------------------------------------------------------------------------------------ */}
        {/* customize textfield on the bottom */}
        {/* the onSubmit event of the form is triggered when the "Enter" key is pressed while inside the TextField */}

        <Box component='form' onSubmit={sendUserQueryHandler}>
          <TextField
            id='userQuery'
            value={userQuery}
            name='userQuery'
            placeholder='Ask your question here...'
            fullWidth
            variant='outlined'
            size='small'
            onChange={setUserQueryHandler}
            sx={{
              // Add styles for the TextField itself here
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#808080", // Customize border color
                  borderRadius: chainnectStyle.boarderRadius, // Customize border radius
                  borderWidth: "2px", // Customize border width
                },
                // Styles for the input text and padding
                "& input": {
                  padding: "15px 20px", // Adjust padding
                  fontSize: "1rem", // Adjust font size
                  color: "black", // Adjust text color
                },
                // Styles for the input field on hover
                "&:hover fieldset": {
                  borderColor: "#808080", // Customize border color on hover
                },
                // Styles for the input field when focused
                "&.Mui-focused fieldset": {
                  borderColor: "#808080", // Customize border color when focused
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {/* this icon button is also submit type, which means when we click, it will trigger forum to run "sendUserQueryHandler" */}
                  <IconButton type='submit' color='primary' aria-label='send message'>
                    <ArrowOutwardOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
