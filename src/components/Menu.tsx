import { chainnectStyle } from "@/theme/style";
import { Box, Typography } from "@mui/material";
import React, { ReactElement } from "react";

export default function Menu({
  menuName,
  icon,
  currentSelectedMenu,
  onClickLogic,
}: {
  menuName: string;
  icon: ReactElement;
  currentSelectedMenu: string;
  onClickLogic: () => void;
}): ReactElement {
  return (
    <Box
      marginBottom={"20px"}
      display={"flex"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      bgcolor={currentSelectedMenu === menuName ? chainnectStyle.menuSelectedBgColor : chainnectStyle.sideBarBgColor}
      paddingY={"10px"}
      paddingLeft={"10px"}
      marginX={"15px"}
      borderRadius={chainnectStyle.menuRadius}
      onClick={onClickLogic}
      sx={{
        ":hover": {
          cursor: "pointer",
          bgcolor: currentSelectedMenu === menuName ? chainnectStyle.menuSelectedBgColor : chainnectStyle.menuHoverBgColor,
        },
      }}
    >
      {icon}
      <Typography variant='body1' color={"white"} marginLeft={"10px"} fontWeight='500'>
        {menuName}
      </Typography>
    </Box>
  );
}
