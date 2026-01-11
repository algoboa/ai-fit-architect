import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Skeleton connections for drawing lines between keypoints
const SKELETON_CONNECTIONS = [
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'],
  ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
];

export default function PoseOverlay({ keypoints, width = SCREEN_WIDTH, height = SCREEN_HEIGHT }) {
  if (!keypoints || keypoints.length === 0) {
    return null;
  }

  // Create a map of keypoints by part name
  const keypointMap = {};
  keypoints.forEach((kp) => {
    keypointMap[kp.part] = kp;
  });

  // Convert normalized coordinates to screen coordinates
  const getScreenCoords = (kp) => ({
    x: kp.x * width,
    y: kp.y * height,
  });

  // Determine color based on confidence score
  const getColor = (score) => {
    if (score >= 0.8) return colors.success;
    if (score >= 0.5) return colors.warning;
    return colors.error;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Draw skeleton lines */}
        {SKELETON_CONNECTIONS.map(([partA, partB], index) => {
          const pointA = keypointMap[partA];
          const pointB = keypointMap[partB];

          if (!pointA || !pointB) return null;
          if (pointA.score < 0.3 || pointB.score < 0.3) return null;

          const coordsA = getScreenCoords(pointA);
          const coordsB = getScreenCoords(pointB);
          const avgScore = (pointA.score + pointB.score) / 2;

          return (
            <Line
              key={`line-${index}`}
              x1={coordsA.x}
              y1={coordsA.y}
              x2={coordsB.x}
              y2={coordsB.y}
              stroke={getColor(avgScore)}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}

        {/* Draw keypoint circles */}
        {keypoints.map((kp, index) => {
          if (kp.score < 0.3) return null;

          const coords = getScreenCoords(kp);
          const isJoint = ['leftElbow', 'rightElbow', 'leftKnee', 'rightKnee', 'leftShoulder', 'rightShoulder', 'leftHip', 'rightHip'].includes(kp.part);

          return (
            <Circle
              key={`point-${index}`}
              cx={coords.x}
              cy={coords.y}
              r={isJoint ? 8 : 6}
              fill={getColor(kp.score)}
              stroke={colors.text}
              strokeWidth={2}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
