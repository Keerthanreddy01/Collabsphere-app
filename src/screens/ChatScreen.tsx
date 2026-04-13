import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUp, Plus, Heart, ChevronLeft, MoreVertical } from 'lucide-react-native';
import { Typography } from '../components/Typography';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme/theme';

const { width } = Dimensions.get('window');

export const ChatScreen = ({ navigation, route }: any) => {
  const [message, setMessage] = useState('');
  const userName = route?.params?.name || 'Athé the blood';

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#f3f8ff', '#f8f4ff']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Grid Pattern Overlay */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 30 }]} />
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 30 }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Transparent Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Typography variant="bodyBold">{userName}</Typography>
            <Typography variant="caption" color={COLORS.textMuted}>Online now</Typography>
          </View>
          <TouchableOpacity>
            <MoreVertical color="#000" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Incoming Message (White Sticker Style) */}
          <View style={styles.messageInWrapper}>
            <View style={styles.avatarInContainer}>
               <View style={styles.avatarCircle} />
            </View>
            <View style={styles.bubbleIn}>
               <View style={styles.bubbleHeader}>
                  <Typography style={styles.bubbleName}>Athé the blood</Typography>
                  <View style={styles.reactionBadge}>
                     <Heart size={10} color="#ff4d4d" fill="#ff4d4d" />
                     <Typography style={styles.reactionText}>6</Typography>
                  </View>
               </View>
               <Typography style={styles.bubbleText}>
                 Hey who's up for Sherlock Pub tonight??? 🍻
               </Typography>
            </View>
          </View>

          {/* Outgoing Message (Blue Sticker Style) */}
          <View style={styles.messageOutWrapper}>
            <View style={styles.avatarOutContainer}>
                <Typography style={styles.bubbleNameOut}>Enricooo</Typography>
                <View style={[styles.avatarCircle, { borderColor: '#4F46E5' }]} />
            </View>
            <View style={styles.bubbleOut}>
               <View style={styles.pixelHeartRow}>
                  {[1, 2, 3, 4].map(i => (
                    <View key={i} style={styles.pixelHeart}>
                       {/* Simplified pixel heart using dots */}
                       <View style={styles.heartRow}><View style={styles.dot}/><View style={styles.dot}/></View>
                       <View style={styles.heartRow}><View style={styles.dot}/><View style={styles.dot}/><View style={styles.dot}/></View>
                       <View style={styles.heartRow}><View style={styles.dot}/></View>
                    </View>
                  ))}
               </View>
            </View>
          </View>
        </ScrollView>

        {/* Input Footer */}
        <View style={styles.footer}>
           <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Start writing..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.plusBtn}>
                 <Plus color="#999" size={20} />
              </TouchableOpacity>
           </View>
           <TouchableOpacity style={styles.sendBtn}>
              <ArrowUp color="#FFF" size={24} strokeWidth={3} />
           </TouchableOpacity>
        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  gridLineV: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#000',
  },
  gridLineH: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageInWrapper: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  avatarInContainer: {
    marginBottom: -10,
    marginLeft: 5,
    zIndex: 1,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  bubbleIn: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    width: width * 0.75,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bubbleName: {
    fontStyle: 'italic',
    fontWeight: '900',
    fontSize: 14,
    color: '#000',
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    top: -20,
    right: -10,
  },
  reactionText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 3,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
  },
  messageOutWrapper: {
    marginBottom: 40,
    alignItems: 'flex-end',
  },
  avatarOutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -10,
    marginRight: 10,
    zIndex: 1,
  },
  bubbleNameOut: {
    fontStyle: 'italic',
    fontWeight: '900',
    fontSize: 14,
    color: '#FFF',
    marginRight: 8,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bubbleOut: {
    backgroundColor: '#4F46E5',
    padding: 20,
    borderRadius: 24,
    borderTopRightRadius: 4,
    width: width * 0.7,
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  pixelHeartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pixelHeart: {
    width: 20,
    height: 20,
  },
  heartRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: '#FFF',
    margin: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    height: 54,
    backgroundColor: '#FFF',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  plusBtn: {
    marginLeft: 10,
  },
  sendBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  }
});
