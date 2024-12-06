export const buttonBaseStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  backgroundColor: "#6C63FF",
  color: "#FFFFFF",
  padding: "1rem",
  width: "150px", // 버튼 크기를 줄임
  height: "100px", // 정사각형에 가까운 크기
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "0.875rem",
  textAlign: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 좀 더 부드러운 그림자
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export const buttonHoverStyle = {
  transform: "translateY(-2px)", // 살짝 떠오르게
  boxShadow: "0 6px 12px rgba(108, 99, 255, 0.4)", // hover 시 더 강한 그림자
};

export const buttonDefaultStyle = {
  transform: "translateY(0)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};
