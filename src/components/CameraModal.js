import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Text, IconButton, Button, ActivityIndicator } from 'react-native-paper';
import { colors, spacing, borderRadius, typography } from '../theme';

export default function CameraModal({ visible, onClose, onCapture }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);

  if (!visible) return null;

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to analyze your food photos.
          </Text>
          <Button
            mode="contained"
            onPress={requestPermission}
            buttonColor={colors.primary}
            style={styles.permissionButton}
          >
            Grant Permission
          </Button>
          <Button mode="text" onPress={onClose} textColor={colors.textSecondary}>
            Cancel
          </Button>
        </View>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        onCapture(photo);
      } catch (error) {
        console.error('Error capturing photo:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Close button */}
        <View style={styles.topControls}>
          <IconButton
            icon="close"
            iconColor={colors.text}
            size={28}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>

        {/* Guide overlay */}
        <View style={styles.guideContainer}>
          <View style={styles.guideFrame}>
            <Text style={styles.guideText}>
              Position your food in the frame
            </Text>
          </View>
        </View>

        {/* Capture button */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isCapturing}
            testID="capture-button"
          >
            <View style={styles.captureButtonInner}>
              {isCapturing && (
                <ActivityIndicator size="small" color={colors.background} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.captureHint}>Tap to capture</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: borderRadius.round,
  },
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  guideFrame: {
    width: '85%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: spacing.md,
  },
  guideText: {
    ...typography.body2,
    color: colors.text,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.text,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureHint: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.sm,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  permissionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionButton: {
    marginBottom: spacing.sm,
    width: '100%',
  },
});
