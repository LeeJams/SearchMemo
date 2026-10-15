import React from "react";
import { Image } from "react-native";
import {
  Svg,
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from "react-native-svg";

// Google
export const GoogleIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

// YouTube
export const YouTubeIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      fill="#FF0000"
    />
  </Svg>
);

// Bing
export const BingIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Defs>
      <LinearGradient
        id="bing-grad-1"
        x1="11.905"
        x2="17.941"
        y1="1.952"
        y2="40.401"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopColor="#3dbffc" />
        <Stop offset="1" stopColor="#183efb" />
      </LinearGradient>
      <LinearGradient
        id="bing-grad-2"
        x1="14.342"
        x2="34.121"
        y1="41.478"
        y2="25.575"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopColor="#33bef0" />
        <Stop offset="0.159" stopColor="#32b9f0" />
        <Stop offset="0.341" stopColor="#2facf2" />
        <Stop offset="0.533" stopColor="#2a95f4" />
        <Stop offset="0.733" stopColor="#2475f6" />
        <Stop offset="0.936" stopColor="#1b4cfa" />
        <Stop offset="1" stopColor="#183efb" />
      </LinearGradient>
      <LinearGradient
        id="bing-grad-3"
        x1="24.223"
        x2="45.699"
        y1="17.113"
        y2="38.588"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopColor="#3dbffd" />
        <Stop offset="1" stopColor="#1de9b6" />
      </LinearGradient>
    </Defs>
    <Path
      fill="url(#bing-grad-1)"
      d="M17.572,37.076L20,35.619V10.603c0-1.632-0.796-3.161-2.133-4.096L12.36,2.652 C11.366,1.956,10,2.667,10,3.881V32.5c0,0.22,0.02,0.555,0.033,0.772C10.369,36.867,14.382,38.99,17.572,37.076z"
    />
    <Path
      fill="url(#bing-grad-2)"
      d="M32.682,27.904L20,35.5v0l-2.428,1.457c-3.191,1.915-7.203-0.209-7.54-3.804 C10.372,38.922,15.145,43.5,21,43.5c1.963,0,3.888-0.536,5.568-1.551l6.834-4.126c0.817-0.493,1.522-1.075,2.15-1.707 C37.906,33.415,36.739,28.669,32.682,27.904z"
    />
    <Path
      fill="url(#bing-grad-3)"
      d="M33.636,19.568l-7.607-3.803c-1.234-0.617-2.576,0.618-2.064,1.899l1.755,5.886 c0.499,1.248,1.479,2.242,2.719,2.758L32.5,28c4.057,0.766,5.352,5.251,3.052,8.117C40.399,31.24,40.088,22.794,33.636,19.568z"
    />
  </Svg>
);

// Pinterest
export const PinterestIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
      fill="#E60023"
    />
  </Svg>
);

// Reddit
export const RedditIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/reddit.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// ChatGPT
export const ChatGPTIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 50 50" fill="none">
    <Path
      d="M45.403,25.562c-0.506-1.89-1.518-3.553-2.906-4.862c1.134-2.665,0.963-5.724-0.487-8.237 c-1.391-2.408-3.636-4.131-6.322-4.851c-1.891-0.506-3.839-0.462-5.669,0.088C28.276,5.382,25.562,4,22.647,4 c-4.906,0-9.021,3.416-10.116,7.991c-0.01,0.001-0.019-0.003-0.029-0.002c-2.902,0.36-5.404,2.019-6.865,4.549 c-1.391,2.408-1.76,5.214-1.04,7.9c0.507,1.891,1.519,3.556,2.909,4.865c-1.134,2.666-0.97,5.714,0.484,8.234 c1.391,2.408,3.636,4.131,6.322,4.851c0.896,0.24,1.807,0.359,2.711,0.359c1.003,0,1.995-0.161,2.957-0.45 C21.722,44.619,24.425,46,27.353,46c4.911,0,9.028-3.422,10.12-8.003c2.88-0.35,5.431-2.006,6.891-4.535 C45.754,31.054,46.123,28.248,45.403,25.562z M35.17,9.543c2.171,0.581,3.984,1.974,5.107,3.919c1.049,1.817,1.243,4,0.569,5.967 c-0.099-0.062-0.193-0.131-0.294-0.19l-9.169-5.294c-0.312-0.179-0.698-0.177-1.01,0.006l-10.198,6.041l-0.052-4.607l8.663-5.001 C30.733,9.26,33,8.963,35.17,9.543z M29.737,22.195l0.062,5.504l-4.736,2.805l-4.799-2.699l-0.062-5.504l4.736-2.805L29.737,22.195z M14.235,14.412C14.235,9.773,18.009,6,22.647,6c2.109,0,4.092,0.916,5.458,2.488C28,8.544,27.891,8.591,27.787,8.651l-9.17,5.294 c-0.312,0.181-0.504,0.517-0.5,0.877l0.133,11.851l-4.015-2.258V14.412z M6.528,23.921c-0.581-2.17-0.282-4.438,0.841-6.383 c1.06-1.836,2.823-3.074,4.884-3.474c-0.004,0.116-0.018,0.23-0.018,0.348V25c0,0.361,0.195,0.694,0.51,0.872l10.329,5.81 L19.11,34.03l-8.662-5.002C8.502,27.905,7.11,26.092,6.528,23.921z M14.83,40.457c-2.171-0.581-3.984-1.974-5.107-3.919 c-1.053-1.824-1.249-4.001-0.573-5.97c0.101,0.063,0.196,0.133,0.299,0.193l9.169,5.294c0.154,0.089,0.327,0.134,0.5,0.134 c0.177,0,0.353-0.047,0.51-0.14l10.198-6.041l0.052,4.607l-8.663,5.001C19.269,40.741,17.001,41.04,14.83,40.457z M35.765,35.588 c0,4.639-3.773,8.412-8.412,8.412c-2.119,0-4.094-0.919-5.459-2.494c0.105-0.056,0.216-0.098,0.32-0.158l9.17-5.294 c0.312-0.181,0.504-0.517,0.5-0.877L31.75,23.327l4.015,2.258V35.588z M42.631,32.462c-1.056,1.83-2.84,3.086-4.884,3.483 c0.004-0.12,0.018-0.237,0.018-0.357V25c0-0.361-0.195-0.694-0.51-0.872l-10.329-5.81l3.964-2.348l8.662,5.002 c1.946,1.123,3.338,2.937,3.92,5.107C44.053,28.249,43.754,30.517,42.631,32.462z"
      fill={color || "#111827"}
    />
  </Svg>
);

// Claude
export const ClaudeIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <LinearGradient
      id="claude-grad"
      x1="24"
      x2="24"
      y1="2.987"
      y2="45.013"
      gradientUnits="userSpaceOnUse"
    >
      <Stop offset="0" stopColor="#d97757" />
      <Stop offset="1" stopColor="#db5b32" />
    </LinearGradient>
    <Path
      fill="url(#claude-grad)"
      d="M11.239,30.934l8.264-4.637l0.139-0.403l-0.139-0.224h-0.403l-1.381-0.085l-4.722-0.128l-4.095-0.17l-3.968-0.213l-0.998-0.213 L3,23.628l0.096-0.615l0.839-0.564l1.203,0.105l2.657,0.182l3.988,0.275l2.893,0.17l4.285,0.445h0.681l0.096-0.275l-0.233-0.17 l-0.182-0.17l-4.127-2.796l-4.467-2.955l-2.34-1.702l-1.265-0.862l-0.638-0.808l-0.275-1.764l1.149-1.265l1.543,0.105l0.394,0.105 l1.563,1.203l3.338,2.584l4.359,3.21l0.638,0.53l0.255-0.182l0.031-0.128l-0.286-0.479l-2.371-4.285l-2.53-4.359L13.17,7.355 l-0.298-1.083c-0.105-0.445-0.182-0.82-0.182-1.276l1.307-1.775l0.723-0.233l1.744,0.233L17.2,3.858l1.083,2.479l1.756,3.902 l2.723,5.306l0.797,1.574l0.425,1.458l0.159,0.445h0.275v-0.255l0.224-2.989l0.414-3.67l0.403-4.722l0.139-1.33l0.658-1.594 L27.564,3.6l1.021,0.488l0.839,1.203l-0.116,0.777l-0.499,3.245l-0.978,5.082l-0.638,3.403h0.372l0.425-0.425l1.722-2.286 l2.893-3.616l1.276-1.435l1.489-1.585l0.956-0.754h1.807l1.33,1.977l-0.596,2.042l-1.86,2.36l-1.543,1.999l-2.212,2.978 l-1.381,2.382l0.128,0.19l0.329-0.031l4.997-1.064l2.7-0.488l3.222-0.553l1.458,0.681l0.159,0.692l-0.573,1.415l-3.446,0.851 l-4.041,0.808l-6.018,1.424l-0.074,0.054l0.085,0.105l2.711,0.255l1.16,0.062h2.839l5.287,0.394l1.381,0.913L45,28.26l-0.139,0.851 l-2.127,1.083l-2.87-0.681l-6.699-1.594l-2.297-0.573H30.55v0.19l1.914,1.872l3.508,3.168l4.393,4.084l0.224,1.01l-0.564,0.797 l-0.596-0.085l-3.86-2.904l-1.489-1.307l-3.372-2.839h-0.224v0.298l0.777,1.137l4.104,6.169l0.213,1.892l-0.298,0.615l-1.064,0.372 l-1.168-0.213l-2.402-3.372l-2.479-3.798l-1.999-3.403l-0.244,0.139l-1.18,12.709l-0.553,0.649l-1.276,0.488l-1.064-0.808 l-0.564-1.307l0.564-2.584l0.681-3.372l0.553-2.68l0.499-3.33l0.298-1.106l-0.02-0.074l-0.244,0.031l-2.51,3.446l-3.817,5.159 l-3.02,3.233l-0.723,0.286l-1.254-0.649l0.116-1.16l0.701-1.032l4.18-5.318l2.521-3.296l1.628-1.903l-0.011-0.275h-0.096 l-11.103,7.209l-1.977,0.255l-0.851-0.797l0.105-1.307l0.403-0.425l3.338-2.297l-0.011,0.011L11.239,30.934z"
    />
  </Svg>
);

// Naver
export const NaverIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M20.36 16.56L13.17 4H4v24h7.73V16.21L19.83 28H28V4h-7.73v12.56z"
      fill="#03C75A"
    />
  </Svg>
);

// Daum
export const DaumIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/daum.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Baidu
export const BaiduIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/baidu.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Yahoo JP
export const YahooJPIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/yahoojp.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Yandex
export const YandexIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/yandex.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// DuckDuckGo
export const DuckDuckGoIcon = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path
      fill="#ff3d00"
      d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"
    />
    <Path
      fill="#fff"
      d="M26,16.2c-0.6-0.6-1.5-0.9-2.5-1.1c-0.4-0.5-1-1-1.9-1.5c-1.6-0.8-3.5-1.2-5.3-0.9h-0.4 c-0.1,0-0.2,0.1-0.4,0.1c0.2,0,1,0.4,1.6,0.6c-0.3,0.2-0.8,0.2-1.1,0.4c0,0,0,0-0.1,0L15.7,14c-0.1,0.2-0.2,0.4-0.2,0.5 c1.3-0.1,3.2,0,4.6,0.4C19,15,18,15.3,17.3,15.7c-0.5,0.3-1,0.6-1.3,1.1c-1.2,1.3-1.7,3.5-1.3,5.9c0.5,2.7,2.4,11.4,3.4,16.3 l0.3,1.6c0,0,3.5,0.4,5.6,0.4c1.2,0,3.2,0.3,3.7-0.2c-0.1,0-0.6-0.6-0.8-1.1c-0.5-1-1-1.9-1.4-2.6c-1.2-2.5-2.5-5.9-1.9-8.1 c0.1-0.4,0.1-2.1,0.4-2.3c2.6-1.7,2.4-0.1,3.5-0.8c0.5-0.4,1-0.9,1.2-1.5C29.4,22.1,27.8,18,26,16.2z"
    />
    <Path
      fill="#fff"
      d="M24,42c-9.9,0-18-8.1-18-18c0-9.9,8.1-18,18-18c9.9,0,18,8.1,18,18C42,33.9,33.9,42,24,42z M24,8 C15.2,8,8,15.2,8,24s7.2,16,16,16s16-7.2,16-16S32.8,8,24,8z"
    />
    <Path
      fill="#0277bd"
      d="M19,21.1c-0.6,0-1.2,0.5-1.2,1.2c0,0.6,0.5,1.2,1.2,1.2c0.6,0,1.2-0.5,1.2-1.2 C20.1,21.7,19.6,21.1,19,21.1z M19.5,22.2c-0.2,0-0.3-0.1-0.3-0.3c0-0.2,0.1-0.3,0.3-0.3s0.3,0.1,0.3,0.3 C19.8,22.1,19.6,22.2,19.5,22.2z M26.8,20.6c-0.6,0-1,0.5-1,1c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1S27.3,20.6,26.8,20.6z M27.2,21.5 c-0.1,0-0.3-0.1-0.3-0.3c0-0.1,0.1-0.3,0.3-0.3c0.1,0,0.3,0.1,0.3,0.3S27.4,21.5,27.2,21.5z M19.3,18.9c0,0-0.9-0.4-1.7,0.1 c-0.9,0.5-0.8,1.1-0.8,1.1s-0.5-1,0.8-1.5C18.7,18.1,19.3,18.9,19.3,18.9 M27.4,18.8c0,0-0.6-0.4-1.1-0.4c-1,0-1.3,0.5-1.3,0.5 s0.2-1.1,1.5-0.9C27.1,18.2,27.4,18.8,27.4,18.8"
    />
    <Path
      fill="#8bc34a"
      d="M23.3,35.7c0,0-4.3-2.3-4.4-1.4c-0.1,0.9,0,4.7,0.5,5s4.1-1.9,4.1-1.9L23.3,35.7z M25,35.6 c0,0,2.9-2.2,3.6-2.1c0.6,0.1,0.8,4.7,0.2,4.9c-0.6,0.2-3.9-1.2-3.9-1.2L25,35.6z"
    />
    <Path
      fill="#689f38"
      d="M22.5,35.7c0,1.5-0.2,2.1,0.4,2.3c0.6,0.1,1.9,0,2.3-0.3c0.4-0.3,0.1-2.2-0.1-2.6 C25,34.8,22.5,35.1,22.5,35.7"
    />
    <Path
      fill="#ffca28"
      d="M22.3,26.8c0.1-0.7,2-2.1,3.3-2.2c1.3-0.1,1.7-0.1,2.8-0.3c1.1-0.3,3.9-1,4.7-1.3 c0.8-0.4,4.1,0.2,1.8,1.5c-1,0.6-3.7,1.6-5.7,2.2c-1.9,0.6-3.1-0.6-3.8,0.4c-0.5,0.8-0.1,1.8,2.2,2c3.1,0.3,6.2-1.4,6.5-0.5 c0.3,0.9-2.7,2-4.6,2.1c-1.8,0-5.6-1.2-6.1-1.6C22.9,28.7,22.2,27.8,22.3,26.8"
    />
  </Svg>
);

// Yahoo
export const YahooIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/yahoo.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Google India
export const GoogleIndiaIcon = GoogleIcon;

// Ecosia
export const EcosiaIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/ecosia.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Brave Search
export const BraveIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/brave.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Google Scholar
export const ScholarIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/scholar.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Semantic Scholar
export const SemanticScholarIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/semanticScholar.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Microsoft Copilot
export const CopilotIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <Path fill="url(#copilot-a)" d="M85.855 18.313A11.574 11.574 0 0 0 74.75 10h-3.379a11.574 11.574 0 0 0-11.384 9.485L54.2 51.018l1.436-4.913a11.574 11.574 0 0 1 11.11-8.327H86.38l8.235 3.207 7.937-3.207h-2.316a11.574 11.574 0 0 1-11.105-8.313z" />
    <Path fill="url(#copilot-b)" d="M36.326 101.64A11.574 11.574 0 0 0 47.445 110h7.176c6.276 0 11.409-5.002 11.57-11.277l.781-30.405-1.634 5.583a11.574 11.574 0 0 1-11.108 8.321H34.432l-7.058-3.829-7.641 3.83h2.278c5.154 0 9.687 3.408 11.119 8.36z" />
    <Path fill="url(#copilot-c)" d="M74.248 10H34.15c-11.457 0-18.33 15.142-22.913 30.283-5.43 17.939-12.534 41.93 8.02 41.93H36.57c5.174 0 9.716-3.421 11.138-8.396 3.01-10.531 8.286-28.903 12.43-42.889 2.105-7.107 3.86-13.211 6.551-17.012C68.2 11.785 70.715 10 74.248 10" />
    <Path fill="url(#copilot-d)" d="M74.248 10H34.15c-11.457 0-18.33 15.142-22.913 30.283-5.43 17.939-12.534 41.93 8.02 41.93H36.57c5.174 0 9.716-3.421 11.138-8.396 3.01-10.531 8.286-28.903 12.43-42.889 2.105-7.107 3.86-13.211 6.551-17.012C68.2 11.785 70.715 10 74.248 10" />
    <Path fill="url(#copilot-e)" d="M46.744 110h40.099c11.456 0 18.33-15.144 22.913-30.288 5.429-17.942 12.533-41.937-8.02-41.937H84.422a11.576 11.576 0 0 0-11.138 8.396c-3.01 10.533-8.286 28.909-12.43 42.897-2.106 7.109-3.86 13.214-6.552 17.016-1.51 2.131-4.025 3.916-7.558 3.916" />
    <Path fill="url(#copilot-f)" d="M46.744 110h40.099c11.456 0 18.33-15.144 22.913-30.288 5.429-17.942 12.533-41.937-8.02-41.937H84.422a11.576 11.576 0 0 0-11.138 8.396c-3.01 10.533-8.286 28.909-12.43 42.897-2.106 7.109-3.86 13.214-6.552 17.016-1.51 2.131-4.025 3.916-7.558 3.916" />
    <Defs>
      <RadialGradient id="copilot-a" cx="0" cy="0" r="1" gradientTransform="matrix(-27.40125 -33.47302 31.47539 -25.76598 95.512 51.286)" gradientUnits="userSpaceOnUse">
        <Stop offset=".096" stopColor="#00AEFF" />
        <Stop offset=".773" stopColor="#2253CE" />
        <Stop offset="1" stopColor="#0736C4" />
      </RadialGradient>
      <RadialGradient id="copilot-b" cx="0" cy="0" r="1" gradientTransform="rotate(51.84 -70.254 70.14)scale(39.9779 38.7796)" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FFB657" />
        <Stop offset=".634" stopColor="#FF5F3D" />
        <Stop offset=".923" stopColor="#C02B3C" />
      </RadialGradient>
      <RadialGradient id="copilot-e" cx="0" cy="0" r="1" gradientTransform="matrix(-31.67773 90.58917 -108.5232 -37.949 103.796 30.703)" gradientUnits="userSpaceOnUse">
        <Stop offset=".066" stopColor="#8C48FF" />
        <Stop offset=".5" stopColor="#F2598A" />
        <Stop offset=".896" stopColor="#FFB152" />
      </RadialGradient>
      <LinearGradient id="copilot-c" x1="31.75" x2="37.471" y1="18.75" y2="84.938" gradientUnits="userSpaceOnUse">
        <Stop offset=".156" stopColor="#0D91E1" />
        <Stop offset=".487" stopColor="#52B471" />
        <Stop offset=".652" stopColor="#98BD42" />
        <Stop offset=".937" stopColor="#FFC800" />
      </LinearGradient>
      <LinearGradient id="copilot-d" x1="36.75" x2="39.874" y1="10" y2="82.213" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#3DCBFF" />
        <Stop offset=".247" stopColor="#0588F7" stopOpacity="0" />
      </LinearGradient>
      <LinearGradient id="copilot-f" x1="106.964" x2="106.923" y1="33.365" y2="53.037" gradientUnits="userSpaceOnUse">
        <Stop offset=".058" stopColor="#F8ADFA" />
        <Stop offset=".708" stopColor="#A86EDD" stopOpacity="0" />
      </LinearGradient>
    </Defs>
  </Svg>
);

// DeepSeek
export const DeepSeekIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/deepseek.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Action Icons
export const CopyIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
      fill={color}
    />
  </Svg>
);

export const EditIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      fill={color}
    />
  </Svg>
);

export const DeleteIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      fill={color}
    />
  </Svg>
);

// Gemini
export const GeminiIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/gemini.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Grok
export const GrokIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
    <Path d="M0 256C0 166.392 0 121.587 17.439 87.3615C32.7787 57.2556 57.2556 32.7787 87.3615 17.439C121.587 0 166.392 0 256 0C345.608 0 390.413 0 424.638 17.439C454.744 32.7787 479.221 57.2556 494.561 87.3615C512 121.587 512 166.392 512 256C512 345.608 512 390.413 494.561 424.638C479.221 454.744 454.744 479.221 424.638 494.561C390.413 512 345.608 512 256 512C166.392 512 121.587 512 87.3615 494.561C57.2556 479.221 32.7787 454.744 17.439 424.638C0 390.413 0 345.608 0 256Z" fill="#050505" />
    <Path d="M210.484 312.759L343.465 210.383C349.984 205.364 359.302 207.322 362.408 215.117C378.758 256.231 371.454 305.64 338.925 339.563C306.397 373.487 261.137 380.927 219.768 363.983L174.577 385.803C239.394 432.008 318.104 420.581 367.289 369.251C406.303 328.564 418.386 273.104 407.088 223.091L407.19 223.198C390.807 149.726 411.218 120.359 453.03 60.3072C454.02 58.8833 455.01 57.4595 456 56L400.978 113.382V113.204L210.45 312.794" fill="#FCFCFC" />
    <Path d="M183.042 337.641C136.519 291.294 144.54 219.567 184.236 178.203C213.59 147.59 261.683 135.096 303.666 153.464L348.755 131.75C340.632 125.627 330.221 119.042 318.275 114.414C264.277 91.2407 199.63 102.774 155.735 148.516C113.513 192.549 100.236 260.254 123.036 318.027C140.069 361.206 112.148 391.748 84.0229 422.575C74.0561 433.503 64.0553 444.431 56 456L183.007 337.677" fill="#FCFCFC" />
  </Svg>
);

// Perplexity
export const PerplexityIcon = ({ size = 24 }) => (
  <Image
    source={require("../../assets/icons/perplexity.png")}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Map icon keys to components
export const searchIconMap = {
  google: GoogleIcon,
  youtube: YouTubeIcon,
  bing: BingIcon,
  pinterest: PinterestIcon,
  reddit: RedditIcon,
  brave: BraveIcon,
  chatgpt: ChatGPTIcon,
  claude: ClaudeIcon,
  gemini: GeminiIcon,
  grok: GrokIcon,
  perplexity: PerplexityIcon,
  copilot: CopilotIcon,
  deepseek: DeepSeekIcon,
  scholar: ScholarIcon,
  semanticScholar: SemanticScholarIcon,
  naver: NaverIcon,
  daum: DaumIcon,
  baidu: BaiduIcon,
  yahoojp: YahooJPIcon,
  yandex: YandexIcon,
  duckduckgo: DuckDuckGoIcon,
  yahoo: YahooIcon,
  googlein: GoogleIndiaIcon,
  ecosia: EcosiaIcon,
  copy: CopyIcon,
  edit: EditIcon,
  delete: DeleteIcon,
};
