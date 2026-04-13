import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    user: 'Alex_Dev',
    avatar: 'https://i.pravatar.cc/100?u=alex',
    time: '20m ago',
    type: 'SHIPPING',
    tag: 'Rust',
    title: 'Integrated Vector Search @Collabsphere',
    content: 'Finally moved to Qdrant for the matchmaking engine. Latency dropped from 450ms to 42ms. Absolute game changer for the discovery orbit! 🚀',
    repo: 'collabsphere/core-engine',
    boosts: '124',
    comments: '18',
    color: '#10B981',
    icon: 'Rocket'
  },
  {
    id: '2',
    user: 'Sarah_Codes',
    avatar: 'https://i.pravatar.cc/100?u=sarah',
    time: '2h ago',
    type: 'HELP_NEEDED',
    tag: 'Next.js',
    title: 'Hydration Error in Production 💀',
    content: 'Getting a weird hydration mismatch only on the pricing page. It works fine locally. Anyone seen this with Framer Motion + Next 14?',
    repo: 'nexus-app/frontend',
    boosts: '42',
    comments: '56',
    color: '#F43F5E',
    icon: 'HelpCircle'
  },
  {
    id: '3',
    user: 'Marcus_AI',
    avatar: 'https://i.pravatar.cc/100?u=marcus',
    time: '5h ago',
    type: 'SOLVED',
    tag: 'Python',
    title: 'Optimized LLM Inference',
    content: 'Reduced memory footprint by 60% using 4-bit quantization with BitsAndBytes. Check the PR for benchmarks.',
    repo: 'quantum-ml/v3',
    boosts: '890',
    comments: '12',
    color: '#8B5CF6',
    icon: 'CheckCircle'
  }
];

export const SocialFeedScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Builder Header */}
        <View style={styles.header}>
           <TouchableOpacity style={styles.typeSelector}>
              <Typography variant="bodyBold" color="#FFFFFF" style={{ fontSize: 18 }}>The Feed</Typography>
              <Icon name="ChevronDown" color="#FFFFFF" size={16} style={{ marginLeft: 4 }} />
           </TouchableOpacity>
           <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={styles.headerIcon}>
                 <Icon name="Github" color="#FFFFFF" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                 <Icon name="Bell" color="#FFFFFF" size={20} />
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
           {/* Technical Creation Chips */}
           <View style={styles.creationBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList}>
                 <TechChip iconName="Code2" label="Snippet" color="#3B82F6" />
                 <TechChip iconName="Rocket" label="Shipping" color="#10B981" />
                 <TechChip iconName="HelpCircle" label="Help" color="#F43F5E" />
                 <TechChip iconName="Terminal" label="Tool" color="#F59E0B" />
              </ScrollView>
           </View>

           {/* Technical Feed */}
           <View style={styles.feedWrapper}>
              {FEED_DATA.map((post, index) => (
                <Animated.View key={post.id} entering={FadeInDown.delay(index * 150)} style={styles.postCard}>
                   
                   {/* Card Top: User & Context */}
                   <View style={styles.postHeader}>
                      <View style={styles.userInfo}>
                         <Image source={{ uri: post.avatar }} style={styles.avatar} />
                         <View style={{ marginLeft: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                               <Typography variant="bodyBold" color="#FFFFFF">{post.user}</Typography>
                               <View style={[styles.typeBadge, { borderColor: post.color }]}>
                                  <Typography variant="caption" color={post.color} style={styles.typeLabel}>{post.type}</Typography>
                                </View>
                            </View>
                            <Typography variant="caption" color="rgba(255,255,255,0.4)">{post.time} • {post.tag}</Typography>
                         </View>
                      </View>
                      <TouchableOpacity>
                         <Icon name="MoreHorizontal" color="rgba(255,255,255,0.4)" size={20} />
                      </TouchableOpacity>
                   </View>

                   {/* Card Body: Technical Update */}
                   <TouchableOpacity style={styles.contentBox} activeOpacity={0.95}>
                      <View style={styles.contentHead}>
                         <Typography variant="h3" color="#FFFFFF" style={styles.postTitle}>{post.title}</Typography>
                         {post.type === 'SOLVED' && <Icon name="CheckCircle" size={18} color="#10B981" />}
                      </View>
                      
                      <Typography variant="body" color="rgba(255,255,255,0.7)" style={styles.contentText}>
                         {post.content}
                      </Typography>

                      {/* GitHub Link Injection */}
                      <View style={styles.repoLink}>
                         <Icon name="Github" size={12} color="rgba(255,255,255,0.4)" />
                         <Typography variant="caption" color="rgba(255,255,255,0.4)" style={{ marginLeft: 6, flex: 1 }}>{post.repo}</Typography>
                         <Icon name="ExternalLink" size={12} color="rgba(255,255,255,0.4)" />
                      </View>
                   </TouchableOpacity>

                   {/* Card Footer: Engagement */}
                   <View style={styles.postFooter}>
                      <View style={styles.engagement}>
                         <TouchableOpacity style={styles.boostBtn}>
                            <Icon name="Zap" color="#EAB308" size={18} fill="#EAB308" />
                            <Typography variant="caption" color="#FFFFFF" style={{ marginLeft: 6, fontWeight: '800' }}>{post.boosts}</Typography>
                         </TouchableOpacity>
                         
                         <TouchableOpacity style={styles.simpleBtn}>
                            <Icon name="MessageSquare" color="rgba(255,255,255,0.6)" size={18} />
                            <Typography variant="caption" color="rgba(255,255,255,0.6)" style={{ marginLeft: 6 }}>{post.comments}</Typography>
                         </TouchableOpacity>
                      </View>
                      
                      <TouchableOpacity style={styles.simpleBtn}>
                         <Icon name="Share2" color="rgba(255,255,255,0.6)" size={18} />
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
  <TouchableOpacity style={styles.chip}>
     <Icon name={iconName} color={color} size={18} />
     <Typography variant="caption" color="#FFFFFF" style={{ marginLeft: 8, fontWeight: '700' }}>{label}</Typography>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scrollContent: {
    paddingBottom: 150,
  },
  creationBar: {
    marginTop: 10,
    paddingLeft: 20,
  },
  chipList: {
    gap: 12,
    paddingRight: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  feedWrapper: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingTop: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
  },
  typeBadge: {
    marginLeft: 8,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  typeLabel: {
    fontSize: 9,
    fontWeight: '900',
  },
  contentBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginHorizontal: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  contentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  repoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  engagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  boostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  simpleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  }
});
