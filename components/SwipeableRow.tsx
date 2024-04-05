import React, { useRef } from 'react';
import { Animated, I18nManager, StyleSheet, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const SwipeableRow = ({ children, onDelete }) => {
  const swipeableRow = useRef(null);

  const renderRightActions = (progress, dragX) => {
    return (
      <RectButton style={styles.rightAction} onPress={close}>
        <Ionicons name="trash-outline" size={24} color="white" style={{ marginRight: 10 }} />
      </RectButton>
    );
  };

  const close = () => {
    swipeableRow.current.close();
    onDelete();
  };

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      leftThreshold={80}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default SwipeableRow;
