import { createTheme, Theme } from "@mui/material/styles";

const theme: Theme = createTheme({
  typography: {
    // define font family with primary and secondary for rest of variants below in typography
    // monserrat and roboto are google fonts we imported in global css file, if not imported it will not work
    fontFamily: '"Montserrat", "Roboto"',
    body1: {
      fontSize: "0.95rem", // 24px
    },
    body2: {
      fontSize: "0.9rem", // 20px
    },
    // --------------------------------------------------------------
    h1: {
      fontWeight: "bold",
      fontSize: "2.75rem", // 44px
    },
    h2: {
      fontWeight: "bold",
      fontSize: "2.5rem", // 40px
    },
    h3: {
      fontWeight: "bold",
      fontSize: "2.25rem", // 36px
    },
    h4: {
      fontWeight: "bold",
      fontSize: "2rem", // 32px
    },
    h5: {
      fontWeight: "bold",
      fontSize: "1.75rem", // 28px
    },
    h6: {
      fontWeight: "bold",
      fontSize: "1.5rem", // 24px
    },
  },
});

export default theme;
