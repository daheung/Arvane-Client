import { useState, type FC, type MouseEventHandler } from "react";
import { RArvaneLogo } from "@/components/logo";
import TextField from "@mui/material/TextField";

import "@/styles/global.scss"
import "@/arvane/navigations/private/register_furniture.scss"
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

type TRegisterFurniturePropType = {};
export const RRegisterFurniture: FC<TRegisterFurniturePropType> = (_: TRegisterFurniturePropType) => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);

  const [name   , setName   ] = useState<string | null>(null);
  const [width  , setWidth  ] = useState<number | null>(null);
  const [height , setHeight ] = useState<number | null>(null);
  const [length , setLength ] = useState<number | null>(null);
  const [price  , setPrice  ] = useState<number | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const checkVerify: () => boolean = () => {
    const nameVerify  : boolean = name   === null;
    const widthVerity : boolean = width  === null || width <= 0;
    const heightVerify: boolean = height === null || height <= 0;
    const lengthVerify: boolean = length === null || length <= 0;
    const priceVerify : boolean = price  === null || price <= 0;
    
    if (nameVerify  ) return false;
    if (widthVerity ) return false;
    if (heightVerify) return false;
    if (lengthVerify) return false;
    if (priceVerify ) return false;

    return true;
  }

  const handleLogoClick: MouseEventHandler<HTMLDivElement> = (_) => {
    navigate("/main");
  }

  const styles = {
    "& .MuiTextField-root": {
      mb: "25px",
    },

    "& .MuiOutlinedInput-root": {
      height: "75px",
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
      "& fieldset": {
        borderColor: "#000000",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#000000",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#000000",
        borderWidth: "1px",
      },
    },

    "& .MuiInputLabel-root": {
      fontFamily: "ABeeZee",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "18px",
      letterSpacing: "0.05em",
      color: "rgba(0, 0, 0, 0.6)",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgba(0, 0, 0, 0.75)",
    },

    // 마지막 TextField (desc-content)만 높이 212px
    "& .MuiTextField-root:last-of-type .MuiOutlinedInput-root": {
      height: "212px",
    },

    // 마지막 TextField가 multiline이라면 안쪽 padding/정렬도 살짝 수정 (선택)
    "& .MuiTextField-root:last-of-type .MuiOutlinedInput-inputMultiline": {
      padding: "16px",
    },
  };

  return (
    <div className="arvane-nav">
      <div className="arvane-header">
        <RArvaneLogo handleClick={handleLogoClick} />
      </div>
      <div className="arvane-body">
        <div className="title">가구등록</div>
        <div className="navigation">
          <span className="chair">의자</span>
          <span className="sofa">소파</span>
          <span className="desk">책상</span>
          <span className="cabinet">수납장</span>
          <span className="etc">기타</span>
        </div>
        <div className="navigation-line">
          <div className="horizontal-line"></div>
        </div>
        <div className="furniture-desc-container">
          <div className="image-container"></div>
          <div className="desc-container">
            <Box sx={styles}>
              <TextField className="desc-name"   type="text"   fullWidth autoComplete="off" label="가구명" value={name  } onChange={(e) => { setName(e.target.value)}}></TextField>
              <TextField className="desc-width"  type="number" fullWidth autoComplete="off" label="너비"   value={width } onChange={(e) => { setWidth (parseFloat(e.target.value))}}></TextField>
              <TextField className="desc-height" type="number" fullWidth autoComplete="off" label="높이"   value={height} onChange={(e) => { setHeight(parseFloat(e.target.value))}}></TextField>
              <TextField className="desc-length" type="number" fullWidth autoComplete="off" label="길이"   value={length} onChange={(e) => { setLength(parseFloat(e.target.value))}}></TextField>
              <TextField className="desc-price"  type="number" fullWidth autoComplete="off" label="가격"   value={price } onChange={(e) => { setPrice (parseInt(e.target.value))}}></TextField>
              <TextField className="desc-content" 
                label={focused ? "특징" : "특징 (150자 이내로 쓰시오)"}
                type="text"
                autoComplete="off"
                slotProps={{htmlInput: {
                  maxLength: 150,
                }}} 
                value={content}
                onChange={(e) => { setContent(e.target.value) }}
                multiline 
                fullWidth
                minRows={3}
                onFocus={() => setFocused(true)}
                onBlur={(e) => { if (!e.target.value) setFocused(false); }}
              ></TextField>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}