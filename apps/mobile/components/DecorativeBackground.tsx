import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

type Variant =
  | "home_guest"
  | "home_auth"
  | "scanner"
  | "quiz"
  | "leaderboard"
  | "profile"
  | "map"
  | "result"
  | "default";

interface Props {
  variant: Variant;
}

const G = "#22C55E";
const P = "#7C3AED";
const Y = "#F59E0B";

function LeafSVG({
  top,
  bottom,
  left,
  right,
  size = 32,
  color = G,
  opacity = 0.15,
  rotation = 0,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
}) {
  return (
    <View
      style={[
        styles.abs,
        {
          top,
          bottom,
          left,
          right,
          width: size,
          height: size,
          opacity,
          transform: [{ rotate: `${rotation}deg` }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M50 5 Q80 8, 92 50 Q80 92, 50 95 Q20 92, 8 50 Q20 8, 50 5 Z"
          fill={color}
        />
        <Path
          d="M50 5 Q53 50, 50 95"
          stroke={color}
          strokeWidth="3"
          fill="none"
          opacity="0.35"
        />
      </Svg>
    </View>
  );
}

function Sparkle({
  top,
  bottom,
  left,
  right,
  size = 18,
  color = P,
  opacity = 0.22,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <Text
      style={[
        styles.abs,
        { top, bottom, left, right, fontSize: size, color, opacity },
      ]}
    >
      ✦
    </Text>
  );
}

function Dot({
  top,
  bottom,
  left,
  right,
  size = 8,
  color = G,
  opacity = 0.15,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <View
      style={[
        styles.abs,
        {
          top,
          bottom,
          left,
          right,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
        },
      ]}
    />
  );
}

export default function DecorativeBackground({ variant }: Props) {
  return (
    <View style={styles.root} pointerEvents="none">
      {variant === "home_guest" && (
        <>
          <Sparkle top={52} right={20} size={22} color={P} opacity={0.25} />
          <Sparkle top={88} right={56} size={13} color={P} opacity={0.20} />
          <Sparkle top={44} left={60} size={16} color={P} opacity={0.22} />
          <LeafSVG top={52} left={10} size={30} rotation={-40} opacity={0.15} />
          <LeafSVG top={96} right={12} size={20} rotation={30} opacity={0.13} />
          <Sparkle top={280} left={18} size={14} color={P} opacity={0.18} />
          <LeafSVG top={290} right={8} size={26} rotation={-20} opacity={0.14} />
          <Dot top={260} right={36} size={7} color={P} opacity={0.14} />
          <LeafSVG bottom={230} left={10} size={28} rotation={20} opacity={0.13} />
          <LeafSVG bottom={180} left={38} size={18} rotation={-55} opacity={0.12} />
          <LeafSVG bottom={150} right={12} size={32} rotation={-30} opacity={0.14} />
          <Dot bottom={200} right={18} size={8} color={P} opacity={0.14} />
          <Sparkle bottom={260} right={22} size={18} color={P} opacity={0.20} />
          <Dot bottom={140} left={28} size={6} color={G} opacity={0.15} />
        </>
      )}

      {variant === "home_auth" && (
        <>
          <Sparkle top={60} right={18} size={20} color={G} opacity={0.22} />
          <Sparkle top={72} left={20} size={16} color={P} opacity={0.22} />
          <Sparkle top={40} right={60} size={12} color={P} opacity={0.18} />
          <LeafSVG top={46} left={8} size={24} rotation={-45} opacity={0.14} />
          <LeafSVG top={84} right={8} size={18} rotation={25} opacity={0.12} />
          <LeafSVG top={300} right={8} size={26} rotation={-20} opacity={0.13} />
          <LeafSVG top={345} right={30} size={16} rotation={10} opacity={0.11} />
          <Sparkle top={330} left={16} size={14} color={P} opacity={0.18} />
          <Dot top={290} left={30} size={7} color={G} opacity={0.14} />
          <LeafSVG bottom={210} left={8} size={30} rotation={-55} opacity={0.13} />
          <LeafSVG bottom={158} right={10} size={22} rotation={35} opacity={0.12} />
          <Sparkle bottom={240} right={20} size={16} color={P} opacity={0.20} />
          <Dot bottom={180} left={24} size={8} color={P} opacity={0.13} />
        </>
      )}

      {variant === "scanner" && (
        <>
          <Sparkle top={60} right={20} size={18} color={P} opacity={0.22} />
          <Sparkle top={44} left={22} size={14} color={P} opacity={0.20} />
          <Sparkle top={80} right={56} size={12} color={P} opacity={0.18} />
          <LeafSVG top={44} left={8} size={22} rotation={-45} opacity={0.14} />
          <LeafSVG top={86} right={10} size={18} rotation={15} opacity={0.13} />
          <Dot top={260} left={16} size={8} color={G} opacity={0.15} />
          <LeafSVG top={292} left={14} size={20} rotation={-20} opacity={0.12} />
          <Sparkle top={340} right={18} size={16} color={P} opacity={0.18} />
          <LeafSVG bottom={328} left={14} size={18} rotation={30} opacity={0.14} />
          <LeafSVG bottom={272} right={10} size={28} rotation={-55} opacity={0.13} />
          <LeafSVG bottom={200} left={8} size={22} rotation={-30} opacity={0.12} />
          <Sparkle bottom={260} left={18} size={20} color={P} opacity={0.20} />
          <Dot bottom={300} right={22} size={7} color={P} opacity={0.14} />
        </>
      )}

      {variant === "quiz" && (
        <>
          <Sparkle top={76} left={26} size={18} color={P} opacity={0.22} />
          <Sparkle top={52} right={18} size={14} color={P} opacity={0.20} />
          <Sparkle top={100} right={50} size={12} color={P} opacity={0.18} />
          <LeafSVG top={50} right={12} size={30} rotation={-45} opacity={0.14} />
          <LeafSVG top={84} left={8} size={18} rotation={25} opacity={0.13} />
          <Sparkle top={220} right={18} size={20} color={P} opacity={0.18} />
          <LeafSVG top={232} left={10} size={24} rotation={-20} opacity={0.13} />
          <Dot top={200} right={32} size={8} color={G} opacity={0.15} />
          <LeafSVG bottom={318} left={16} size={22} rotation={10} opacity={0.14} />
          <LeafSVG bottom={262} right={12} size={30} rotation={-55} opacity={0.13} />
          <LeafSVG bottom={178} left={6} size={18} rotation={-30} opacity={0.12} />
          <Sparkle bottom={300} right={14} size={16} color={P} opacity={0.20} />
          <Dot bottom={240} left={22} size={7} color={P} opacity={0.14} />
        </>
      )}

      {variant === "leaderboard" && (
        <>
          <Dot top={76} left={16} size={10} color={G} opacity={0.20} />
          <Dot top={94} right={26} size={8} color={P} opacity={0.16} />
          <Dot top={60} right={98} size={9} color={Y} opacity={0.22} />
          <Sparkle top={136} left={36} size={20} color={P} opacity={0.22} />
          <Sparkle top={116} right={16} size={18} color={G} opacity={0.20} />
          <Sparkle top={54} left={64} size={14} color={P} opacity={0.18} />
          <LeafSVG top={54} left={8} size={24} rotation={-45} opacity={0.14} />
          <LeafSVG top={96} right={8} size={18} rotation={30} opacity={0.13} />
          <Sparkle top={300} right={18} size={14} color={P} opacity={0.18} />
          <LeafSVG top={312} left={10} size={20} rotation={-20} opacity={0.12} />
          <Dot top={280} left={28} size={7} color={Y} opacity={0.18} />
          <LeafSVG bottom={228} right={8} size={28} rotation={-55} opacity={0.13} />
          <LeafSVG bottom={178} left={12} size={16} rotation={10} opacity={0.14} />
          <LeafSVG bottom={138} right={26} size={24} rotation={-30} opacity={0.12} />
          <Sparkle bottom={260} left={20} size={16} color={P} opacity={0.20} />
          <Dot bottom={200} right={20} size={8} color={G} opacity={0.15} />
        </>
      )}

      {variant === "profile" && (
        <>
          <LeafSVG top={74} right={10} size={32} rotation={-45} opacity={0.13} />
          <LeafSVG top={56} left={8} size={22} rotation={30} opacity={0.14} />
          <Sparkle top={52} right={50} size={18} color={P} opacity={0.22} />
          <Sparkle top={78} left={28} size={14} color={P} opacity={0.20} />
          <Sparkle top={42} left={62} size={12} color={P} opacity={0.18} />
          <LeafSVG top={332} left={8} size={24} rotation={-20} opacity={0.13} />
          <LeafSVG top={374} right={8} size={18} rotation={10} opacity={0.12} />
          <Sparkle top={360} right={24} size={16} color={P} opacity={0.18} />
          <Dot top={320} left={26} size={8} color={G} opacity={0.14} />
          <LeafSVG bottom={228} left={12} size={28} rotation={-55} opacity={0.13} />
          <LeafSVG bottom={176} right={10} size={22} rotation={-30} opacity={0.14} />
          <Sparkle bottom={250} right={18} size={18} color={P} opacity={0.20} />
          <Dot bottom={200} left={20} size={9} color={P} opacity={0.15} />
        </>
      )}

      {variant === "map" && (
        <>
          <Sparkle top={56} right={16} size={20} color={G} opacity={0.22} />
          <Sparkle top={44} left={20} size={14} color={P} opacity={0.20} />
          <Sparkle top={80} right={52} size={12} color={P} opacity={0.18} />
          <LeafSVG top={56} left={8} size={24} rotation={-45} opacity={0.14} />
          <LeafSVG top={90} right={8} size={18} rotation={30} opacity={0.13} />
          <Sparkle top={280} left={14} size={16} color={P} opacity={0.18} />
          <LeafSVG top={292} right={10} size={22} rotation={-20} opacity={0.12} />
          <Dot top={260} right={28} size={7} color={G} opacity={0.15} />
          <LeafSVG bottom={228} right={8} size={28} rotation={-55} opacity={0.13} />
          <LeafSVG bottom={176} left={10} size={18} rotation={10} opacity={0.14} />
          <LeafSVG bottom={138} right={26} size={24} rotation={-30} opacity={0.12} />
          <Sparkle bottom={260} left={18} size={18} color={P} opacity={0.20} />
          <Dot bottom={200} right={18} size={8} color={P} opacity={0.14} />
        </>
      )}

      {variant === "result" && (
        <>
          <Sparkle top={44} left={18} size={22} color={P} opacity={0.28} />
          <Sparkle top={60} right={16} size={26} color={Y} opacity={0.30} />
          <Sparkle top={88} left={54} size={18} color={G} opacity={0.24} />
          <Sparkle top={50} right={52} size={14} color={P} opacity={0.22} />
          <Sparkle top={100} right={20} size={16} color={Y} opacity={0.26} />
          <LeafSVG top={48} left={6} size={36} rotation={-45} opacity={0.16} />
          <LeafSVG top={72} right={6} size={28} rotation={35} opacity={0.15} />
          <Dot top={78} left={44} size={10} color={Y} opacity={0.24} />
          <Dot top={68} right={40} size={8} color={P} opacity={0.18} />
          <Sparkle top={280} left={14} size={20} color={Y} opacity={0.26} />
          <Sparkle top={320} right={12} size={18} color={P} opacity={0.22} />
          <LeafSVG top={292} left={8} size={26} rotation={-20} opacity={0.15} />
          <LeafSVG top={354} right={8} size={18} rotation={10} opacity={0.14} />
          <Dot top={340} right={34} size={9} color={Y} opacity={0.22} />
          <Sparkle bottom={280} left={16} size={22} color={P} opacity={0.26} />
          <Sparkle bottom={220} right={14} size={20} color={Y} opacity={0.28} />
          <Sparkle bottom={160} left={44} size={16} color={G} opacity={0.22} />
          <LeafSVG bottom={268} right={10} size={32} rotation={-55} opacity={0.16} />
          <LeafSVG bottom={218} left={8} size={26} rotation={-30} opacity={0.15} />
          <LeafSVG bottom={158} right={24} size={20} rotation={30} opacity={0.14} />
          <Dot bottom={240} left={22} size={10} color={Y} opacity={0.22} />
          <Dot bottom={180} right={22} size={8} color={P} opacity={0.18} />
        </>
      )}

      {variant === "default" && (
        <>
          <Sparkle top={56} right={18} size={18} color={P} opacity={0.22} />
          <Sparkle top={44} left={22} size={14} color={P} opacity={0.20} />
          <Sparkle top={80} right={50} size={12} color={P} opacity={0.18} />
          <LeafSVG top={52} left={8} size={24} rotation={-45} opacity={0.14} />
          <LeafSVG top={86} right={10} size={18} rotation={30} opacity={0.13} />
          <LeafSVG bottom={228} left={10} size={28} rotation={-20} opacity={0.13} />
          <LeafSVG bottom={176} right={10} size={22} rotation={-55} opacity={0.12} />
          <LeafSVG bottom={138} left={32} size={16} rotation={10} opacity={0.12} />
          <Sparkle bottom={260} right={18} size={16} color={P} opacity={0.20} />
          <Dot bottom={200} left={20} size={8} color={P} opacity={0.14} />
          <Dot top={260} right={24} size={7} color={G} opacity={0.15} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  abs: {
    position: "absolute",
  },
});
