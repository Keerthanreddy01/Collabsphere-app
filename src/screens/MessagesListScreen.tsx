import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Typography } from '../components/Typography';

const { width } = Dimensions.get('window');

const FRIENDS = [
  { id: 1, name: 'Sarah Drasner', role: 'DevEx at Google', online: true, lastMsg: 'The architecture looks solid. I\’ll review the PR tonight.', time: '2m', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 2, name: 'Josh Comeau', role: 'Design Engineer', online: true, lastMsg: 'Did you see the new Inter weight? It\’s beautiful.', time: '15m', avatar: 'https://i.pravatar.cc/150?u=josh' },
  { id: 3, name: 'Tobi Lütke', role: 'CEO, Shopify', online: false, lastMsg: 'Let\’s scale the Sphere infrastructure.', time: '1h', avatar: 'https://i.pravatar.cc/150?u=tobi' },
  { id: 4, name: 'Naval Ravikant', role: 'Angel Philosopher', online: false, lastMsg: 'Specific knowledge is found by following your curiosity.', time: '3h', avatar: 'https://i.pravatar.cc/150?u=naval' },
  { id: 5, name: 'Amjad Masad', role: 'CEO, Replit', online: true, lastMsg: 'The AI integration is blowing my mind.', time: '5h', avatar: 'https://i.pravatar.cc/150?u=amjad' },
];

export const MessagesListScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Lucid.ChevronLeft size={28} color="#000" />
           </TouchableOpacity>
           <Typography style={styles.headerTitle}>Network</Typography>
           <TouchableOpacity style={styles.actionBtn}>
              <Lucid.UserPlus size={22} color="#000" />
           </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
           <View style={styles.searchBar}>
              <Lucid.Search size={20} color="rgba(0,0,0,0.2)" />
              <TextInput 
                placeholder="Search connections..." 
                placeholderTextColor="rgba(0,0,0,0.2)"
                style={styles.input}
              />
           </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
           <Typography style={styles.sectionLabel}>ACTIVE BUILDERS</Typography>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.onlineRow}>
              {FRIENDS.filter(f => f.online).map((f, idx) => (
                <Animated.View key={f.id} entering={FadeInRight.delay(idx * 100)} style={styles.onlineItem}>
                   <View style={styles.avatarContainer}>
                      <Image source={{ uri: f.avatar }} style={styles.onlineAvatar} />
                      <View style={styles.greenStatus} />
                   </View>
                   <Typography style={styles.onlineName}>{f.name.split(' ')[0]}</Typography>
                </Animated.View>
              ))}
           </ScrollView>

           <Typography style={styles.sectionLabel}>CONVERSATIONS</Typography>
           {FRIENDS.map((f, idx) => (
             <Animated.View key={f.id} entering={FadeInDown.delay(200 + (idx * 100))}>
                <TouchableOpacity 
                  style={styles.chatRow}
                  onPress={() => navigation.navigate('Chat')}
                >
                   <Image source={{ uri: f.avatar }} style={styles.msgAvatar} />
                   <View style={styles.msgContent}>
                      <View style={styles.nameRow}>
                         <Typography style={styles.chatName}>{f.name}</Typography>
                         <Typography style={styles.chatTime}>{f.time}</Typography>
                      </View>
                      <Typography style={styles.chatRole}>{f.role}</Typography>
                      <Typography style={styles.lastMsg} numberOfLines={1}>{f.lastMsg}</Typography>
                   </View>
                </TouchableOpacity>
             </Animated.View>
           ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6F2' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 15 
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#000', letterSpacing: -0.5 },
  actionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  searchSection: { paddingHorizontal: 24, marginTop: 10 },
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    height: 54, 
    alignItems: 'center', 
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#000' },
  scroll: { paddingBottom: 150 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(0,0,0,0.2)', letterSpacing: 1, marginLeft: 24, marginTop: 30, marginBottom: 15 },
  onlineRow: { paddingLeft: 24 },
  onlineItem: { marginRight: 20, alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  onlineAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: '#FFF' },
  greenStatus: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2.5, borderColor: '#FFF' },
  onlineName: { fontSize: 12, fontWeight: '800', color: '#000', marginTop: 8 },
  chatRow: { 
    flexDirection: 'row', 
    paddingHorizontal: 24, 
    paddingVertical: 18, 
    alignItems: 'center' 
  },
  msgAvatar: { width: 56, height: 56, borderRadius: 28 },
  msgContent: { flex: 1, marginLeft: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 16, fontWeight: '800', color: '#000' },
  chatTime: { fontSize: 11, fontWeight: '700', color: 'rgba(0,0,0,0.2)' },
  chatRole: { fontSize: 12, fontWeight: '700', color: '#6193F5', marginTop: 1 },
  lastMsg: { fontSize: 14, color: 'rgba(0,0,0,0.4)', marginTop: 4, fontWeight: '600' }
});
