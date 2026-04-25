import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeOutUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Typography } from './Typography';
import { CheckCircle2, AlertCircle, Info, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info' | 'boost';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_BG: Record<ToastType, string> = {
  success: '#00E676',
  error: '#FF1744',
  info: '#2979FF',
  boost: '#FFEB3B',
};

const ToastItem = ({ message, type }: { message: string; type: ToastType }) => {
  const insets = useSafeAreaInsets();

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 color="#000" size={20} strokeWidth={2.5} />;
      case 'error': return <AlertCircle color="#FFF" size={20} strokeWidth={2.5} />;
      case 'boost': return <Zap color="#000" size={20} strokeWidth={2.5} fill="#000" />;
      default: return <Info color="#FFF" size={20} strokeWidth={2.5} />;
    }
  };

  const isDark = type === 'error' || type === 'info';

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(20).stiffness(300)}
      exiting={FadeOutUp.springify().damping(22)}
      style={[
        styles.toast,
        {
          backgroundColor: TOAST_BG[type],
          top: (insets.top || 44) + 12,
        },
      ]}
    >
      {getIcon()}
      <Typography
        style={[
          styles.toastText,
          { color: isDark ? '#FFF' : '#000' },
        ]}
      >
        {message}
      </Typography>
    </Animated.View>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType; key: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type, key: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ToastItem key={toast.key} message={toast.message} type={toast.type} />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 99999,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
