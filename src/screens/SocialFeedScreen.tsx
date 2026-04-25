import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import { Typography } from '../components/Typography';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Safe Icon Component
const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

const FEED_DATA = [
  {
    id: '1',
    user: 'ALEX_DEV',
    avatar: 'https://i.pravatar.cc/100?u=alex',
    time: '20M AGO',
    type: 'SHIPPING',
    tag: 'RUST',
    title: 'VECTOR SEARCH INTEGRATED',
    content: 'Finally moved to Qdrant for the matchmaking engine. Latency dropped from 450ms to 42ms. Absolute game changer for the discovery orbit! 🚀',
    repo: 'collabsphere/core-engine',
    boosts: '124',
    comments: '18',
    color: '#00E676',
    icon: 'Rocket'
  },
  {
    id: '2',
    user: 'SARAH_CODES',
    avatar: 'https://i.pravatar.cc/100?u=sarah',
    time: '2H AGO',
    type: 'HELP_NEEDED',
    tag: 'NEXT.JS',
    title: 'HYDRATION ERROR IN PROD',
    content: 'Getting a weird hydration mismatch only on the pricing page. It works fine locally. Anyone seen this with Framer Motion + Next 14?',
    repo: 'nexus-app/frontend',
    boosts: '42',
    comments: '56',
    color: '#FF1744',
    icon: 'HelpCircle'
  },
  {
    id: '3',
    user: 'MARCUS_AI',
    avatar: 'https://i.pravatar.cc/100?u=marcus',
    time: '5H AGO',
    type: 'SOLVED',
    tag: 'PYTHON',
    title: 'OPTIMIZED LLM INFERENCE',
    content: 'Reduced memory footprint by 60% using 4-bit quantization with BitsAndBytes. Check the PR for benchmarks.',
    repo: 'quantum-ml/v3',
    boosts: '890',
    comments: '12',
    color: '#2979FF',
    icon: 'CheckCircle'
  }
];

export const SocialFeedScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#FFEB3B' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Builder Header */}
        <View style={styles.header}>
           <TouchableOpacity style={styles.typeSelector}>
              <Typography style={styles.headerTitle}>THE FEED</Typography>
              <Icon name="ChevronDown" color="#000" size={24} style={{ marginLeft: 8 }} />
           </TouchableOpacity>
           <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={styles.headerIcon}>
                 <Icon name="Github" color="#000" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                 <Icon name="Bell" color="#000" size={24} />
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
           {/* Technical Creation Chips */}
           <View style={styles.creationBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList}>
                 <TechChip iconName="Code2" label="SNIPPET" color="#2979FF" />
                 <TechChip iconName="Rocket" label="SHIPPING" color="#00E676" />
                 <TechChip iconName="HelpCircle" label="HELP" color="#FF1744" />
                 <TechChip iconName="Terminal" label="TOOL" color="#FFD600" />
              </ScrollView>
           </View>

           {/* Technical Feed */}
           <View style={styles.feedWrapper}>
              {FEED_DATA.map((post, index) => (
                <Animated.View key={post.id} entering={FadeInDown.delay(index * 150)} style={styles.postCard}>
                   
                   {/* Card Top: User & Context */}
                   <View style={styles.postHeader}>
                      <View style={styles.userInfo}>
                         <View style={styles.avatarBorder}>
                            <Image source={{ uri: post.avatar }} style={styles.avatar} />
                         </View>
                         <View style={{ marginLeft: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                               <Typography style={styles.userNameText}>{post.user}</Typography>
                               <View style={[styles.typeBadge, { backgroundColor: post.color }]}>
                                  <Typography style={styles.typeLabel}>{post.type}</Typography>
                                </View>
                            </View>
                            <Typography style={styles.metaText}>{post.time} • {post.tag}</Typography>
                         </View>
                      </View>
                      <TouchableOpacity>
                         <Icon name="MoreHorizontal" color="#000" size={24} />
                      </TouchableOpacity>
                   </View>

                   {/* Card Body: Technical Update */}
                   <TouchableOpacity style={styles.contentBox} activeOpacity={0.9}>
                      <View style={styles.contentHead}>
                         <Typography style={styles.postTitle}>{post.title}</Typography>
                         {post.type === 'SOLVED' && <Icon name="CheckCircle" size={22} color="#00E676" />}
                      </View>
                      
                      <Typography style={styles.contentText}>
                         {post.content}
                      </Typography>

                      {/* GitHub Link Injection */}
                      <View style={styles.repoLink}>
                         <Icon name="Github" size={16} color="#000" />
                         <Typography style={styles.repoText}>{post.repo}</Typography>
                         <Icon name="ArrowRight" size={16} color="#000" />
                      </View>
                   </TouchableOpacity>

                   {/* Card Footer: Engagement */}
                   <View style={styles.postFooter}>
                      <View style={styles.engagement}>
                         <TouchableOpacity style={styles.boostBtn}>
                            <Icon name="Zap" color="#000" size={20} />
                            <Typography style={styles.engagementCount}>{post.boosts}</Typography>
                         </TouchableOpacity>
                         
                         <TouchableOpacity style={styles.commentBtn}>
                            <Icon name="MessageSquare" color="#000" size={20} />
                            <Typography style={styles.engagementCount}>{post.comments}</Typography>
                         </TouchableOpacity>
                      </View>
                      
                      <TouchableOpacity style={styles.shareBtn}>
                         <Icon name="Share2" color="#000" size={20} />
                      </TouchableOpacity>
                   </View>
                </Animated.View>
              ))}
           </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const TechChip = ({ iconName, label, color }: { iconName: string, label: string, color: string }) => (
  <TouchableOpacity style={[styles.chip, { backgroundColor: color }]}>
     <Icon name={iconName} color="#000" size={20} />
     <Typography style={styles.chipLabel}>{label}</Typography>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -2 },
  typeSelector: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 }
  },
  scrollContent: { paddingBottom: 150 },
  creationBar: { marginTop: 10, paddingLeft: 25 },
  chipList: { gap: 15, paddingRight: 50 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 }
  },
  chipLabel: { marginLeft: 10, fontWeight: '900', color: '#000', fontSize: 13 },
  feedWrapper: { marginTop: 30, paddingHorizontal: 25 },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 40,
    marginBottom: 30,
    borderWidth: 4,
    borderColor: '#000',
    paddingTop: 25,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 }
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarBorder: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
    overflow: 'hidden'
  },
  avatar: { width: '100%', height: '100%' },
  userNameText: { fontSize: 18, fontWeight: '900', color: '#000' },
  typeBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000'
  },
  typeLabel: { fontSize: 9, fontWeight: '900', color: '#000' },
  metaText: { fontSize: 11, color: 'rgba(0,0,0,0.4)', fontWeight: '900', marginTop: 2 },
  contentBox: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 15,
    padding: 25,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
  },
  contentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  postTitle: { fontSize: 22, fontWeight: '900', color: '#000', flex: 1, marginRight: 15, letterSpacing: -1 },
  contentText: { fontSize: 16, lineHeight: 24, color: '#333', fontWeight: '700', marginBottom: 20 },
  repoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000'
  },
  repoText: { fontSize: 13, color: '#000', fontWeight: '900', marginLeft: 10, flex: 1 },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
  },
  engagement: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  boostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000'
  },
  commentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  engagementCount: { marginLeft: 8, fontWeight: '900', color: '#000', fontSize: 14 },
  shareBtn: { padding: 10 }
});
