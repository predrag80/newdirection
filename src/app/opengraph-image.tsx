import { ImageResponse } from "next/og";

export const alt = "NWD Agency logo";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#F3F0E8",
          display: "flex",
          flexDirection: "column",
          gap: "42px",
          height: "100%",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <svg
          fill="none"
          height="190"
          style={{
            display: "flex"
          }}
          viewBox="0 0 47 47"
          width="190"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.0214 12.8521L20.979 22.8097L11.0214 32.7667L8.7585 30.5038L14.7781 24.4841L0 24.5069V21.1125L14.7327 21.0892L8.7585 15.115L11.0214 12.8521Z" fill="#231F20" />
          <path d="M24.5069 14.7554L30.5038 8.7585L32.7672 11.0214L22.8097 20.979L12.8521 11.0214L15.1156 8.7585L21.1125 14.7554L21.1119 0.00055409L24.5069 0V14.7554Z" fill="#231F20" />
          <path d="M22.8097 24.6398L32.7667 34.5974L30.5038 36.8603L24.5069 30.8634V45.6182H21.1125V30.8634L15.115 36.8603L12.8521 34.5974L22.8097 24.6398Z" fill="#231F20" />
          <path d="M45.6182 24.5069L30.8406 24.4841L36.8603 30.5043L34.5974 32.7672L24.6398 22.8097L34.5968 12.8521L36.8603 15.1156L30.8861 21.0898L45.6182 21.1125V24.5069Z" fill="#231F20" />
        </svg>
        <div
          style={{
            color: "#231F20",
            display: "flex",
            fontSize: "92px",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1
          }}
        >
          NWD Agency
        </div>
        <div
          style={{
            color: "#231F20",
            display: "flex",
            fontSize: "34px",
            fontWeight: 500,
            letterSpacing: "0.04em"
          }}
        >
          Strategic clarity for growing brands
        </div>
      </div>
    ),
    size
  );
}
